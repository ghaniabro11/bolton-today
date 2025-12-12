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
} from "@/lib/db/schema";
import { sql } from "drizzle-orm";
import fs from "fs/promises";
import path from "path";
import JSZip from "jszip";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

// Maximum file size: 500MB
const MAX_FILE_SIZE = 500 * 1024 * 1024;

export async function POST(request: Request) {
  try {
    console.log("[Import] Starting database import process");

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error: `File size exceeds maximum allowed size of ${
            MAX_FILE_SIZE / 1024 / 1024
          }MB`,
        },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = file.name.toLowerCase();
    console.log(
      `[Import] Processing file: ${fileName} (${(
        file.size /
        1024 /
        1024
      ).toFixed(2)}MB)`
    );

    let importData: any;
    let imagesToRestore: { path: string; buffer: Buffer }[] = [];

    // Handle ZIP file with images
    if (fileName.endsWith(".zip")) {
      console.log("[Import] Detected ZIP file, extracting...");
      try {
        const zip = await JSZip.loadAsync(buffer);
        const dbFile = zip.file("database.json");

        if (!dbFile) {
          return NextResponse.json(
            { error: "database.json not found in ZIP file" },
            { status: 400 }
          );
        }

        importData = JSON.parse(await dbFile.async("string"));
        console.log("[Import] Extracted database.json from ZIP");

        // Extract images from images/ folder
        const imageFolder = zip.folder("images");
        if (imageFolder) {
          console.log("[Import] Extracting images from ZIP...");
          const imagePromises: Promise<void>[] = [];

          imageFolder.forEach((relativePath, zipEntry) => {
            if (!zipEntry.dir) {
              imagePromises.push(
                (async () => {
                  try {
                    const fileBuffer = await zipEntry.async("nodebuffer");
                    imagesToRestore.push({
                      path: relativePath,
                      buffer: fileBuffer,
                    });
                  } catch (err) {
                    console.error(
                      `[Import] Failed to extract image ${relativePath}:`,
                      err
                    );
                  }
                })()
              );
            }
          });

          await Promise.allSettled(imagePromises);
          console.log(
            `[Import] Extracted ${imagesToRestore.length} images from ZIP`
          );
        }
      } catch (err) {
        console.error("[Import] Error processing ZIP file:", err);
        return NextResponse.json(
          {
            error: "Failed to process ZIP file",
            details:
              err instanceof Error ? err.message : "Unknown error occurred",
          },
          { status: 400 }
        );
      }
    }
    // Handle JSON-only file
    else if (fileName.endsWith(".json")) {
      console.log("[Import] Detected JSON file");
      try {
        importData = JSON.parse(buffer.toString("utf-8"));
      } catch (err) {
        console.error("[Import] Error parsing JSON file:", err);
        return NextResponse.json(
          {
            error: "Invalid JSON file format",
            details:
              err instanceof Error ? err.message : "Unknown error occurred",
          },
          { status: 400 }
        );
      }
    } else {
      return NextResponse.json(
        {
          error: "Unsupported file format. Please upload a .zip or .json file",
        },
        { status: 400 }
      );
    }

    // Validate import data structure
    if (!importData?.data) {
      return NextResponse.json(
        {
          error: "Invalid import file format. Missing 'data' field.",
        },
        { status: 400 }
      );
    }

    if (!importData.metadata) {
      console.warn("[Import] Warning: Import file missing metadata field");
    }

    console.log("[Import] Starting database import...");

    // Start transaction-like operation: Clear existing data (in reverse order of dependencies)
    try {
      console.log("[Import] Clearing existing data...");
      await db.delete(magzines);
      console.log("[Import] ✓ Cleared magazines");

      await db.delete(newsCategories);
      console.log("[Import] ✓ Cleared news categories");

      await db.delete(news);
      console.log("[Import] ✓ Cleared news");

      await db.delete(media);
      console.log("[Import] ✓ Cleared media");

      await db.delete(authors);
      console.log("[Import] ✓ Cleared authors");

      await db.delete(categories);
      console.log("[Import] ✓ Cleared categories");

      await db.delete(users);
      console.log("[Import] ✓ Cleared users");
    } catch (err) {
      console.error("[Import] Error clearing existing data:", err);
      return NextResponse.json(
        {
          error: "Failed to clear existing database",
          details:
            err instanceof Error ? err.message : "Unknown error occurred",
        },
        { status: 500 }
      );
    }

    // Helper function to convert timestamp strings to Date objects and preserve IDs
    const convertTimestamps = (record: any, timestampFields: string[]): any => {
      const converted = { ...record };
      // Keep ID - we want to preserve original IDs

      // Convert timestamp fields from strings to Date objects
      for (const field of timestampFields) {
        if (converted[field] && typeof converted[field] === "string") {
          converted[field] = new Date(converted[field]);
        }
      }
      return converted;
    };

    // Import new data - correct order based on foreign key dependencies
    const stats = {
      users: 0,
      media: 0,
      categories: 0,
      authors: 0,
      news: 0,
      newsCategories: 0,
      magzines: 0,
    };

    try {
      // Step 1: Import users (no dependencies) - preserve original IDs
      if (importData.data.users?.length > 0) {
        console.log(
          `[Import] Importing ${importData.data.users.length} users...`
        );
        const convertedUsers = importData.data.users.map((user: any) =>
          convertTimestamps(user, ["createdAt"])
        );

        // Insert with explicit IDs
        await db.insert(users).values(convertedUsers);

        stats.users = importData.data.users.length;
        console.log("[Import] ✓ Users imported with original IDs");
      }

      // Step 2: Import media (no dependencies, but needed by categories, authors, news, magzines) - preserve original IDs
      if (importData.data.media?.length > 0) {
        console.log(
          `[Import] Importing ${importData.data.media.length} media...`
        );
        const convertedMedia = importData.data.media.map((item: any) =>
          convertTimestamps(item, ["createdAt"])
        );

        // Insert with explicit IDs
        await db.insert(media).values(convertedMedia);

        stats.media = importData.data.media.length;
        console.log("[Import] ✓ Media imported with original IDs");
      }

      // Step 3: Import categories (depends on media for image, and self-reference for parentCategoryId) - preserve original IDs
      if (importData.data.categories?.length > 0) {
        console.log(
          `[Import] Importing ${importData.data.categories.length} categories...`
        );

        // Convert categories - IDs are already preserved, no need to map
        const convertedCategories = importData.data.categories.map(
          (cat: any) => {
            const converted = convertTimestamps(cat, ["createdAt"]);
            // IDs and foreign keys are already correct since we're preserving IDs
            return converted;
          }
        );

        // Insert with explicit IDs - foreign keys should match since IDs are preserved
        await db.insert(categories).values(convertedCategories);

        stats.categories = importData.data.categories.length;
        console.log("[Import] ✓ Categories imported with original IDs");
      }

      // Step 4: Import authors (depends on media for image) - preserve original IDs
      if (importData.data.authors?.length > 0) {
        console.log(
          `[Import] Importing ${importData.data.authors.length} authors...`
        );
        const convertedAuthors = importData.data.authors.map((author: any) =>
          convertTimestamps(author, ["createdAt"])
        );

        // Insert with explicit IDs - foreign keys should match since IDs are preserved
        await db.insert(authors).values(convertedAuthors);

        stats.authors = importData.data.authors.length;
        console.log("[Import] ✓ Authors imported with original IDs");
      }

      // Step 5: Import news (depends on authors and media) - preserve original IDs
      if (importData.data.news?.length > 0) {
        console.log(
          `[Import] Importing ${importData.data.news.length} news...`
        );
        const convertedNews = importData.data.news.map((item: any) => {
          const converted = convertTimestamps(item, [
            "createdAt",
            "publishDate",
          ]);
          // Remove searchVector (it's a generated column)
          delete converted.searchVector;
          return converted;
        });

        // Insert with explicit IDs - foreign keys should match since IDs are preserved
        await db.insert(news).values(convertedNews);

        stats.news = importData.data.news.length;
        console.log("[Import] ✓ News imported with original IDs");
      }

      // Step 6: Import news categories (depends on news and categories) - preserve original IDs
      if (importData.data.newsCategories?.length > 0) {
        console.log(
          `[Import] Importing ${importData.data.newsCategories.length} news categories...`
        );
        const convertedNewsCategories = importData.data.newsCategories
          .map((item: any) => convertTimestamps(item, ["createdAt"]))
          .filter((item: any) => item.newsId && item.categoryId); // Only import valid references

        if (convertedNewsCategories.length > 0) {
          await db.insert(newsCategories).values(convertedNewsCategories);
        }

        stats.newsCategories = convertedNewsCategories.length;
        console.log("[Import] ✓ News categories imported");
      }

      // Step 7: Import magazines (depends on media) - preserve original IDs
      if (importData.data.magzines?.length > 0) {
        console.log(
          `[Import] Importing ${importData.data.magzines.length} magazines...`
        );
        const convertedMagazines = importData.data.magzines.map((item: any) =>
          convertTimestamps(item, ["createdAt"])
        );

        // Insert with explicit IDs - foreign keys should match since IDs are preserved
        await db.insert(magzines).values(convertedMagazines);

        stats.magzines = importData.data.magzines.length;
        console.log("[Import] ✓ Magazines imported with original IDs");
      }
    } catch (err) {
      console.error("[Import] Error importing data:", err);
      return NextResponse.json(
        {
          error: "Failed to import database records",
          details:
            err instanceof Error ? err.message : "Unknown error occurred",
        },
        { status: 500 }
      );
    }

    // Restore images if provided
    let imagesRestored = 0;
    if (imagesToRestore.length > 0) {
      console.log(`[Import] Restoring ${imagesToRestore.length} images...`);
      const UPLOAD_DIR = process.env.UPLOAD_DIR || "/var/bolton_uploads";

      // Ensure upload directory exists
      try {
        await fs.access(UPLOAD_DIR);
      } catch {
        console.log(`[Import] Creating upload directory: ${UPLOAD_DIR}`);
        await fs.mkdir(UPLOAD_DIR, { recursive: true });
      }

      // Process images in batches to avoid overwhelming the filesystem
      const BATCH_SIZE = 50;
      for (let i = 0; i < imagesToRestore.length; i += BATCH_SIZE) {
        const batch = imagesToRestore.slice(i, i + BATCH_SIZE);
        await Promise.allSettled(
          batch.map(async ({ path: relativePath, buffer }) => {
            try {
              // Remove 'images/' prefix if present
              const cleanPath = relativePath.replace(/^images\//, "");
              const fullPath = path.join(UPLOAD_DIR, cleanPath);
              const dirPath = path.dirname(fullPath);

              // Ensure directory exists
              await fs.mkdir(dirPath, { recursive: true });

              // Write file
              await fs.writeFile(fullPath, buffer);
              imagesRestored++;
            } catch (err) {
              console.error(
                `[Import] Failed to restore image ${relativePath}:`,
                err
              );
            }
          })
        );

        console.log(
          `[Import] Restored ${Math.min(
            i + BATCH_SIZE,
            imagesToRestore.length
          )}/${imagesToRestore.length} images...`
        );
      }

      console.log(`[Import] ✓ Successfully restored ${imagesRestored} images`);
    }

    const totalRecords =
      stats.users +
      stats.media +
      stats.categories +
      stats.authors +
      stats.news +
      stats.newsCategories +
      stats.magzines;

    console.log("[Import] ✅ Database import completed successfully");
    console.log("[Import] Summary:", {
      ...stats,
      imagesRestored,
      totalRecords,
    });

    return NextResponse.json({
      success: true,
      stats,
      imagesRestored: imagesRestored > 0 ? imagesRestored : undefined,
      totalRecords,
    });
  } catch (error) {
    console.error("[Import] Unexpected error during import:", error);
    return NextResponse.json(
      {
        error: "Failed to import database",
        details:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}
