// app/api/db/export/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db/db";
import {
  users,
  media,
  categories,
  authors,
  news,
  newsCategories,
  magzines,
  homepageSections,
  sectionCategories,
} from "@/lib/db/schema";
import archiver from "archiver";
import { PassThrough } from "stream";

const BATCH_SIZE = 1000;
export const dynamic = "force-dynamic";
export const maxDuration = 300;

async function* fetchInBatches(table: any) {
  let offset = 0;
  while (true) {
    const batch = await db.select().from(table).limit(BATCH_SIZE).offset(offset);
    if (batch.length === 0) break;
    yield batch;
    offset += BATCH_SIZE;
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const includeImagesParam = searchParams.get("includeImages");
  // Only include images if explicitly set to "true"
  const includeImages = includeImagesParam === "true";

  try {
    console.log("[Export] Starting database export...");
    console.log(`[Export] Include images: ${includeImages}`);

    // Build export data
    const exportData: any = {
      metadata: {
        exportDate: new Date().toISOString(),
        version: "1.1",
        includesImages: includeImages,
      },
      data: {
        users: [],
        media: [],
        categories: [],
        authors: [],
        news: [],
        newsCategories: [],
        magzines: [],
        homepageSections: [],
        sectionCategories: [],
      },
    };

    // ✅ Step 1: Export DB tables in batches
    console.log("[Export] Fetching users...");
    for await (const batch of fetchInBatches(users))
      exportData.data.users.push(...batch);

    console.log("[Export] Fetching media...");
    for await (const batch of fetchInBatches(media))
      exportData.data.media.push(...batch);

    console.log("[Export] Fetching categories...");
    for await (const batch of fetchInBatches(categories))
      exportData.data.categories.push(...batch);

    console.log("[Export] Fetching authors...");
    for await (const batch of fetchInBatches(authors))
      exportData.data.authors.push(...batch);

    console.log("[Export] Fetching news...");
    for await (const batch of fetchInBatches(news))
      exportData.data.news.push(...batch);

    console.log("[Export] Fetching news categories...");
    for await (const batch of fetchInBatches(newsCategories))
      exportData.data.newsCategories.push(...batch);

    console.log("[Export] Fetching magazines...");
    for await (const batch of fetchInBatches(magzines))
      exportData.data.magzines.push(...batch);

    console.log("[Export] Fetching homepage sections...");
    for await (const batch of fetchInBatches(homepageSections))
      exportData.data.homepageSections.push(...batch);

    console.log("[Export] Fetching section categories...");
    for await (const batch of fetchInBatches(sectionCategories))
      exportData.data.sectionCategories.push(...batch);

    // ✅ Step 2: Return JSON directly if images not included
    if (!includeImages) {
      console.log("[Export] Returning JSON format (no images)");
      const jsonString = JSON.stringify(exportData, null, 2);
      return new NextResponse(jsonString, {
        headers: {
          "Content-Type": "application/json",
          "Content-Disposition": `attachment; filename="db-backup-${Date.now()}.json"`,
        },
      });
    }

    // ✅ Step 3: Create ZIP archive with images
    console.log("[Export] Creating ZIP archive with images...");
    const stream = new PassThrough();
    const archive = archiver("zip", { zlib: { level: 6 } });
    archive.pipe(stream);

    // Handle archive errors
    archive.on("error", (err) => {
      console.error("[Export] Archive error:", err);
      stream.destroy(err);
    });

    // Process archive in async IIFE to handle errors properly
    (async () => {
      try {
        // Add JSON to zip
        archive.append(JSON.stringify(exportData, null, 2), {
          name: "database.json",
        });

        // Download and add images
        if (exportData.data.media.length > 0) {
          const imageFiles = new Set<string>();
          for (const item of exportData.data.media) {
            if (item.filePath) imageFiles.add(item.filePath);
          }

          const urls = Array.from(imageFiles);
          console.log(`[Export] Downloading ${urls.length} images...`);

          for (let i = 0; i < urls.length; i += 10) {
            const batch = urls.slice(i, i + 10);
            await Promise.allSettled(
              batch.map(async (url) => {
                try {
                  const res = await fetch(url);
                  if (!res.ok) {
                    console.warn(`[Export] ⚠️ Skipping ${url} (${res.status})`);
                    return;
                  }

                  const buffer = Buffer.from(await res.arrayBuffer());

                  // Preserve relative path after /files/
                  const relative = url.replace(/^https?:\/\/[^/]+\/files\//, "");
                  archive.append(buffer, { name: `images/${relative}` });

                  console.log(`[Export] ✅ Added: ${relative}`);
                } catch (err) {
                  console.error(`[Export] ❌ Failed to fetch: ${url}`, err);
                }
              })
            );

            console.log(
              `[Export] Progress: ${Math.min(i + 10, urls.length)}/${urls.length} images`
            );
          }
        }

        await archive.finalize();
        console.log("[Export] ✅ Export completed successfully");
      } catch (err) {
        console.error("[Export] Error during archive creation:", err);
        archive.abort();
        stream.destroy(err as Error);
      }
    })();

    return new Response(stream as any, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="db-backup-${Date.now()}.zip"`,
      },
    });
  } catch (error) {
    console.error("[Export] Export error:", error);
    return NextResponse.json(
      {
        error: "Failed to export database",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

