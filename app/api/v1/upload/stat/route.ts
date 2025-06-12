// app/api/sync-media/route.ts

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { db } from "@/lib/db/db"; // Adjust import path based on your setup
import { media } from "@/lib/db/schema"; // Adjust import path to your schema
import { eq, sql } from "drizzle-orm";

// // Types
// interface MediaFile {
//   slug: string;
//   filePath: string;
// }

// interface MediaInsert {
//   title: string;
//   slug: string;
//   caption?: string;
//   filePath: string;
//   type: "image" | "video" | "audio" | "document";
// }

// // Function to determine media type from file extension
// function getMediaType(
//   filePath: string
// ): "image" | "video" | "audio" | "document" {
//   const extension = path.extname(filePath).toLowerCase();

//   const imageExtensions = [
//     ".jpg",
//     ".jpeg",
//     ".png",
//     ".gif",
//     ".webp",
//     ".svg",
//     ".bmp",
//     ".ico",
//   ];
//   const videoExtensions = [
//     ".mp4",
//     ".avi",
//     ".mov",
//     ".wmv",
//     ".flv",
//     ".webm",
//     ".mkv",
//     ".m4v",
//   ];
//   const audioExtensions = [
//     ".mp3",
//     ".wav",
//     ".flac",
//     ".aac",
//     ".ogg",
//     ".wma",
//     ".m4a",
//   ];

//   if (imageExtensions.includes(extension)) return "image";
//   if (videoExtensions.includes(extension)) return "video";
//   if (audioExtensions.includes(extension)) return "audio";
//   return "document";
// }

// // Function to generate title from filename
// function generateTitle(slug: string): string {
//   return slug
//     .replace(/[-_]/g, " ")
//     .replace(/\b\w/g, (char) => char.toUpperCase())
//     .trim();
// }

// // Function to check if slug exists and generate unique slug
async function generateUniqueSlugForGet(baseSlug: string): Promise<string> {
  let uniqueSlug = baseSlug;
  let counter = 1;

  while (true) {
    try {
      const existing = await db
        .select({ id: media.id })
        .from(media)
        .where(eq(media.slug, uniqueSlug))
        .limit(1);

      if (existing.length === 0) {
        return uniqueSlug;
      }

      // Generate new slug with counter
      uniqueSlug = `${baseSlug}-${counter}`;
      counter++;

      // Safety check to prevent infinite loop
      if (counter > 1000) {
        uniqueSlug = `${baseSlug}-${Date.now()}`;
        break;
      }
    } catch (error) {
      console.error("Error checking slug uniqueness:", error);
      return `${baseSlug}-${Date.now()}`;
    }
  }

  return uniqueSlug;
}

// Replace with your actual types
type MediaFile = { slug: string; filePath: string };
type MediaInsert = {
  title: string;
  slug: string;
  filePath: string;
  type: any;
  caption: string;
};

// Helpers
function readAllFiles(dirPath: string, relativePath: string = ""): MediaFile[] {
  const dataset: MediaFile[] = [];
  try {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      const currentRelativePath = relativePath
        ? path.join(relativePath, entry.name)
        : entry.name;

      if (entry.isDirectory()) {
        const subdirectoryData = readAllFiles(fullPath, currentRelativePath);
        dataset.push(...subdirectoryData);
      } else {
        const fileName = entry.name;
        const fileNameWithoutExtension = path.parse(fileName).name;
        const fileEntry: MediaFile = {
          slug: fileNameWithoutExtension,
          filePath: "/" + currentRelativePath.replace(/\\/g, "/"),
        };
        dataset.push(fileEntry);
      }
    }
  } catch (error) {
    console.error(`❌ Error reading directory ${dirPath}:`, error);
  }
  return dataset;
}

function generateTitle(slug: string): string {
  return slug.replace(/[-_]/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}

function getMediaType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  if ([".jpg", ".jpeg", ".png", ".gif", ".webp"].includes(ext)) return "image";
  if ([".mp4", ".avi", ".mov", ".mkv"].includes(ext)) return "video";
  return "file";
}

async function generateUniqueSlug(
  baseSlug: string,
  usedSlugs: Set<string>
): Promise<string> {
  let slug = baseSlug;
  let counter = 1;

  while (
    usedSlugs.has(slug) ||
    (await db.select().from(media).where(eq(media.slug, slug)).limit(1))
      .length > 0
  ) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  usedSlugs.add(slug);
  return slug;
}

// ✅ Main API
export async function POST(request: NextRequest) {
  try {
    const uploadPath = path.join(process.cwd(), "public", "uploads");
    console.log("📁 Checking upload directory at:", uploadPath);

    if (!fs.existsSync(uploadPath)) {
      return NextResponse.json(
        {
          success: false,
          error: "Upload directory not found",
          path: "public/uploads",
        },
        { status: 404 }
      );
    }

    console.log("📦 Reading files from uploads...");
    const filesData = readAllFiles(uploadPath);
    console.log(`🔍 Found ${filesData.length} files.`);

    if (filesData.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No files found to sync",
        processed: 0,
        skipped: 0,
        errors: 0,
      });
    }

    const usedSlugs = new Set<string>();
    const mediaToInsert: MediaInsert[] = [];
    const errorDetails: string[] = [];

    for (const file of filesData) {
      try {
        const uniqueSlug = await generateUniqueSlug(file.slug, usedSlugs);

        mediaToInsert.push({
          title: generateTitle(file.slug) as any,
          slug: uniqueSlug,
          filePath: `https://boltontoday.co.uk/uploads${file.filePath}`,
          type: getMediaType(file.filePath),
          caption: "",
        });

        if (uniqueSlug !== file.slug) {
          console.log(`📝 Slug modified: ${file.slug} -> ${uniqueSlug}`);
        } else {
          console.log(`✅ Slug OK: ${file.slug}`);
        }
      } catch (error) {
        const errorMessage = `❌ Failed to process ${file.slug}: ${
          error instanceof Error ? error.message : "Unknown error"
        }`;
        console.error(errorMessage);
        errorDetails.push(errorMessage);
      }
    }

    if (mediaToInsert.length > 0) {
      console.log(
        `🚀 Inserting ${mediaToInsert.length} media items into the database...`
      );
      await db.insert(media).values(mediaToInsert);
      console.log(`✅ Media insert successful.`);
    }

    return NextResponse.json({
      success: true,
      message: "Media sync completed",
      totalFiles: filesData.length,
      processed: mediaToInsert.length,
      skipped: 0,
      errors: errorDetails.length,
      errorDetails: errorDetails.length > 0 ? errorDetails : undefined,
    });
  } catch (error) {
    console.error("🔥 Error syncing media to database:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// GET endpoint to preview dataset without inserting
export async function GET(request: NextRequest) {
  try {
    const uploadPath = path.join(process.cwd(), "public", "uploads");

    if (!fs.existsSync(uploadPath)) {
      return NextResponse.json(
        {
          success: false,
          error: "Upload directory not found",
          path: "public/upload",
        },
        { status: 404 }
      );
    }

    const filesData = readAllFiles(uploadPath);

    // Preview first 10 items with processed data
    const preview = await Promise.all(
      filesData.slice(0, 10).map(async (file) => {
        const uniqueSlug = await generateUniqueSlugForGet(file.slug);
        return {
          originalSlug: file.slug,
          uniqueSlug,
          title: generateTitle(file.slug),
          filePath: file.filePath,
          type: getMediaType(file.filePath),
          slugModified: uniqueSlug !== file.slug,
        };
      })
    );

    return NextResponse.json({
      success: true,
      message: "Dataset preview generated",
      totalFiles: filesData.length,
      preview,
    });
  } catch (error) {
    console.error("Error generating preview:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
