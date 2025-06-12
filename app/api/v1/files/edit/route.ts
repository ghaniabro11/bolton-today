import { db } from "@/lib/db/db"; // Adjust import path as needed
import { media } from "@/lib/db/schema"; // Adjust import path as needed
import { eq } from "drizzle-orm";
import { promises as fs } from "fs";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
const UPLOAD_DIR = process.env.UPLOAD_DIR || "/var/bolton_uploads";
const BASE_URL = process.env.NEXT_PUBLIC_URL || "https://boltontoday.co.uk";
async function ensureUploadDir() {
  console.log("[EnsureDir] Checking upload directory:", UPLOAD_DIR);
  try {
    await fs.access(UPLOAD_DIR);
    console.log("[EnsureDir] Upload directory exists");

    // Check if directory is writable
    await fs.access(UPLOAD_DIR, fs.constants.W_OK);
    console.log("[EnsureDir] Upload directory is writable");
  } catch (error) {
    console.log("[EnsureDir] Creating upload directory:", UPLOAD_DIR);
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
    console.log("[EnsureDir] Upload directory created successfully");
  }
}
export async function PUT(request: Request) {
  console.log("[PUT] Update file metadata and rename request received");

  try {
    await ensureUploadDir();

    const { id, title, caption } = await request.json();
    console.log("[PUT] Update details:", { title, caption });

    if (!id) {
      console.log("[PUT] Error: ID is required");
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    // Fetch the existing file record from the database
    const existingFile = await db.query.media.findFirst({
      where: eq(media.id, Number(id)),
    });

    if (!existingFile) {
      console.log("[PUT] Error: File not found in database");
      return NextResponse.json(
        { error: "File not found in database" },
        { status: 404 }
      );
    }

    try {
      // Start a transaction
      await db.transaction(async (tx) => {
        try {
          await tx
            .update(media)
            .set({
              title: title || existingFile.title,
              caption: caption || existingFile.caption,
            })
            .where(eq(media.id, id));

          console.log("[PUT] Database updated successfully");
        } catch (error) {
          console.error("[PUT] Error in transaction:", error);
         
          throw error; // Re-throw to trigger transaction rollback
        }
      });

      return NextResponse.json({
        success: true,
        message: "File metadata and name updated successfully",
      });
    } catch (error) {
      console.error("[PUT] Transaction failed:", error);
      if (error instanceof Error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      return NextResponse.json(
        { error: "Unknown error during update" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("[PUT] Error in update operation:", error);
    if (error instanceof Error) {
      return NextResponse.json(
        {
          error: error.message,
          uploadDir: UPLOAD_DIR,
        },
        { status: 500 }
      );
    }
    return NextResponse.json(
      {
        error: "Unknown error",
        uploadDir: UPLOAD_DIR,
      },
      { status: 500 }
    );
  }
}
