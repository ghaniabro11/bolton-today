import { db } from "@/lib/db/db";
import { media } from "@/lib/db/schema";
import fs from "fs/promises";
import { NextResponse } from "next/server";
import path from "path";
export const dynamic = "force-dynamic";
const UPLOAD_DIR = process.env.UPLOAD_DIR || "/var/bolton_uploads";
const BASE_URL = process.env.NEXT_PUBLIC_URL || "https://boltontoday.co.uk";

export async function POST(request: Request) {
  console.log("[Upload] Starting file upload process");
  console.log("[Upload] Upload directory:", UPLOAD_DIR);

  try {
    // Check if upload directory exists and is writable
    try {
      await fs.access(UPLOAD_DIR);
      console.log("[Upload] Upload directory exists and is accessible");
    } catch (error) {
      console.log("[Upload] Creating upload directory:", UPLOAD_DIR);
      await fs.mkdir(UPLOAD_DIR, { recursive: true });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const folderPath = (formData.get("path") as string) || "";
    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string;
    const caption = formData.get("caption") as string;
    const type = formData.get("type") as
      | "image"
      | "video"
      | "document"
      | "audio";

    console.log("[Upload] Received file details:", {
      fileName: file?.name,
      fileSize: file?.size,
      folderPath,
      title,
      slug,
      hasCaption: !!caption,
      type,
    });

    if (!file) {
      console.log("[Upload] Error: No file provided");
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!title || !slug) {
      console.log("[Upload] Error: Missing required fields", { title, slug });
      return NextResponse.json(
        { error: "Title and slug are required" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileExtension = path.extname(file.name);

    // Create safe file path
    const sanitizedFolderPath = folderPath.replace(/[^a-zA-Z0-9\/\-_]/g, "");
    const uploadPath = path.join(
      sanitizedFolderPath,
      `${slug}${fileExtension}`
    );
    const fullPath = path.join(UPLOAD_DIR, uploadPath);

    console.log("[Upload] Preparing to save file:", {
      uploadPath,
      fullPath,
      uploadDir: UPLOAD_DIR,
    });

    // Ensure directory exists
    const dirPath = path.dirname(fullPath);
    console.log("[Upload] Creating directory:", dirPath);
    await fs.mkdir(dirPath, { recursive: true });

    // Check directory permissions
    try {
      await fs.access(dirPath, fs.constants.W_OK);
      console.log("[Upload] Directory is writable");
    } catch (error) {
      console.error("[Upload] Directory is not writable:", error);
      return NextResponse.json(
        { error: "Upload directory is not writable" },
        { status: 500 }
      );
    }

    // Write file
    console.log("[Upload] Writing file to:", fullPath);
    await fs.writeFile(fullPath, buffer);
    console.log("[Upload] File written successfully");

    // Verify file was written
    try {
      const stats = await fs.stat(fullPath);
      console.log("[Upload] File verification:", {
        size: stats.size,
        created: stats.birthtime,
      });
    } catch (error) {
      console.error("[Upload] File verification failed:", error);
      return NextResponse.json(
        { error: "File was not saved properly" },
        { status: 500 }
      );
    }

    // Create complete URL for the file
    const fileUrl = `${BASE_URL}/files/${uploadPath}`;

    console.log("[Upload] Final file URL:", fileUrl);

    // Insert into database with complete URL
    try {
      await db.insert(media).values({
        title,
        slug,
        caption: caption || null,
        filePath: fileUrl,
        type,
      });
      console.log("[Upload] Database record created");
    } catch (dbError) {
      console.error("[Upload] Database error:", dbError);
      // Clean up the file if database insert fails
      try {
        await fs.unlink(fullPath);
        console.log("[Upload] Cleaned up file after database error");
      } catch (cleanupError) {
        console.error("[Upload] Failed to cleanup file:", cleanupError);
      }
      return NextResponse.json(
        { error: "Database error occurred" },
        { status: 500 }
      );
    }

    console.log("[Upload] Upload completed successfully");
    return NextResponse.json({
      success: true,
      path: fileUrl,
      localPath: fullPath, // For debugging
    });
  } catch (error) {
    console.error("[Upload] Error during upload:", error);
    if (error instanceof Error) {
      return NextResponse.json(
        {
          error: error.message,
          details: error.stack,
        },
        { status: 500 }
      );
    }
    return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  }
}

// Optional: Add a GET endpoint to test directory access
export async function GET() {
  try {
    const stats = await fs.stat(UPLOAD_DIR);
    const isWritable = await fs
      .access(UPLOAD_DIR, fs.constants.W_OK)
      .then(() => true)
      .catch(() => false);

    return NextResponse.json({
      uploadDir: UPLOAD_DIR,
      exists: stats.isDirectory(),
      writable: isWritable,
      created: stats.birthtime,
    });
  } catch (error) {
    return NextResponse.json({
      uploadDir: UPLOAD_DIR,
      exists: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

// import { NextResponse } from 'next/server';
// import fs from 'fs/promises';
// import path from 'path';

// const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

// export async function POST(request: Request) {
//   try {
//     const formData = await request.formData();
//     const file = formData.get('file') as File;
//     const folderPath = formData.get('path') as string || '';

//     if (!file) {
//       return NextResponse.json({ error: 'No file provided' }, { status: 400 });
//     }

//     const buffer = Buffer.from(await file.arrayBuffer());
//     const uploadPath = path.join(UPLOAD_DIR, folderPath, file.name);

//     // Ensure directory exists
//     await fs.mkdir(path.dirname(uploadPath), { recursive: true });

//     // Write file
//     await fs.writeFile(uploadPath, buffer);

//     return NextResponse.json({
//       success: true,
//       path: path.join(folderPath, file.name)
//     });
//   } catch (error) {
//     if (error instanceof Error) {
//       return NextResponse.json({ error: error.message }, { status: 500 });
//     }
//     return NextResponse.json({ error: 'Unknown error' }, { status: 500 });
//   }
// }
