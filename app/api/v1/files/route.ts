import { NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";
import { db } from "@/lib/db/db"; // Adjust import path as needed
import { media } from "@/lib/db/schema"; // Adjust import path as needed
import { eq, or, like } from "drizzle-orm";
export const dynamic = "force-dynamic";

const UPLOAD_DIR = process.env.UPLOAD_DIR || "/var/bolton_uploads";
const BASE_URL = process.env.NEXT_PUBLIC_URL || "https://boltontoday.co.uk";

// Helper function to ensure upload directory exists
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

// GET - List files and folders
export async function GET(request: Request) {
  console.log("[GET] Request received");

  try {
    await ensureUploadDir();
    console.log("[GET] Upload directory ensured");

    const { searchParams } = new URL(request.url);
    const folderPath = searchParams.get("path") || "";
    const searchTerm = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "30", 10);
    
    console.log(`[GET] Query params: path="${folderPath}", search="${searchTerm}", page=${page}, limit=${limit}`);

    const absolutePath = path.join(UPLOAD_DIR, folderPath);
    console.log(`[GET] Resolved absolute path: "${absolutePath}"`);

    // Verify the path exists
    try {
      await fs.access(absolutePath);
    } catch (error) {
      console.error(`[GET] Path does not exist: ${absolutePath}`);
      return NextResponse.json(
        { error: "Directory not found" },
        { status: 404 }
      );
    }

    const items = await fs.readdir(absolutePath, { withFileTypes: true });
    console.log(`[GET] Found ${items.length} item(s) in directory`);

    const result = await Promise.all(
      items.map(async (item) => {
        const itemPath = path.join(folderPath, item?.name);
        const fullItemPath = path.join(absolutePath, item?.name);

        try {
          const stats = await fs.stat(fullItemPath);
          console.log(
            `[GET] Processing item: "${
              item?.name
            }", isDirectory: ${item?.isDirectory()}`
          );

          let metadata = null;

          if (!item?.isDirectory()) {
            const fileUrl = `${BASE_URL}/files/${itemPath}`;
            console.log(`[GET] Looking for file URL in DB: ${fileUrl}`);

            try {
              const dbRecord = await db.query.media.findFirst({
                where: eq(media.filePath, fileUrl),
              });

              if (dbRecord) {
                console.log(`[GET] DB record found for: "${fileUrl}"`);
                metadata = {
                  id: dbRecord.id,
                  title: dbRecord.title,
                  slug: dbRecord.slug,
                  caption: dbRecord.caption,
                  filePath: dbRecord.filePath,
                  type: dbRecord.type,
                };
                console.log(`[GET] DB record found for: "${fileUrl}"`,metadata);

              } else {
                console.log(`[GET] No DB record found for: "${fileUrl}"`);
              }
            } catch (dbError) {
              console.error(`[GET] Database error for ${fileUrl}:`, dbError);
            }
          }

          return {
            name: item?.name,
            path: itemPath,
            isDirectory: item?.isDirectory(),
            size: stats.size,
            modified: stats.mtime,
            ...metadata,
          };
        } catch (itemError) {
          console.error(
            `[GET] Error processing item ${item?.name}:`,
            itemError
          );
          return {
            name: item?.name,
            path: path.join(folderPath, item?.name),
            isDirectory: item?.isDirectory(),
            error: "Could not read file stats",
          };
        }
      })
    );

    // Filter by search term if provided (search in name, title, caption)
    let filteredResult = result;
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filteredResult = result.filter((item) => {
        const nameMatch = item.name?.toLowerCase().includes(searchLower);
        const titleMatch = item.title?.toLowerCase().includes(searchLower);
        const captionMatch = item.caption?.toLowerCase().includes(searchLower);
        return nameMatch || titleMatch || captionMatch;
      });
    }

    // Calculate pagination
    const totalItems = filteredResult.length;
    const totalPages = Math.ceil(totalItems / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedResult = filteredResult.slice(startIndex, endIndex);

    console.log(`[GET] Returning ${paginatedResult.length} item(s) (page ${page} of ${totalPages}, total: ${totalItems})`);
    
    return NextResponse.json({
      path: folderPath,
      items: paginatedResult,
      pagination: {
        totalItems,
        currentPage: page,
        totalPages,
        limit,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    });
  } catch (error) {
    console.error("[GET] Error reading directory or fetching metadata:", error);
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

// POST - Create folder
export async function POST(request: Request) {
  console.log("[POST] Create folder request received");

  try {
    await ensureUploadDir();

    const { name, path: folderPath = "" } = await request.json();
    console.log("[POST] Creating folder:", { name, folderPath });

    if (!name) {
      console.log("[POST] Error: No folder name provided");
      return NextResponse.json(
        { error: "Folder name is required" },
        { status: 400 }
      );
    }

    // Sanitize folder name
    const sanitizedName = name.replace(/[^a-zA-Z0-9\-_]/g, "");
    if (sanitizedName !== name) {
      console.log("[POST] Folder name sanitized:", {
        original: name,
        sanitized: sanitizedName,
      });
    }

    const newFolderPath = path.join(UPLOAD_DIR, folderPath, sanitizedName);
    console.log("[POST] New folder path:", newFolderPath);

    // Check if folder already exists
    try {
      await fs.access(newFolderPath);
      console.log("[POST] Error: Folder already exists");
      return NextResponse.json(
        { error: "Folder already exists" },
        { status: 409 }
      );
    } catch {
      // Folder doesn't exist, which is what we want
    }

    await fs.mkdir(newFolderPath, { recursive: true });
    console.log("[POST] Folder created successfully");

    return NextResponse.json({
      success: true,
      path: path.join(folderPath, sanitizedName),
    });
  } catch (error) {
    console.error("[POST] Error creating folder:", error);
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
        error: "Unknown error creating folder",
        uploadDir: UPLOAD_DIR,
      },
      { status: 500 }
    );
  }
}

// PUT - Rename folder or file
export async function PUT(request: Request) {
  console.log("[PUT] Rename request received");

  try {
    await ensureUploadDir();

    const { oldPath, newName } = await request.json();
    console.log("[PUT] Rename details:", { oldPath, newName });

    if (!oldPath || !newName) {
      console.log("[PUT] Error: Missing required fields");
      return NextResponse.json(
        { error: "Both oldPath and newName are required" },
        { status: 400 }
      );
    }

    // First check if the file exists in the database
    const fileUrl = `${BASE_URL}/files/${oldPath}`;
    console.log("[PUT] Looking for file in DB:", fileUrl);

    const existingFile = await db.query.media.findFirst({
      where: eq(media.filePath, fileUrl),
    });

    if (!existingFile) {
      console.log("[PUT] Error: File not found in database");
      return NextResponse.json(
        { error: "File not found in database" },
        { status: 404 }
      );
    }

    const absoluteOldPath = path.join(UPLOAD_DIR, oldPath);
    const newPath = path.join(path.dirname(absoluteOldPath), newName);

    console.log("[PUT] File paths:", {
      absoluteOldPath,
      newPath,
    });

    // Check if old file exists
    try {
      await fs.access(absoluteOldPath);
    } catch (error) {
      console.error("[PUT] Old file does not exist:", absoluteOldPath);
      return NextResponse.json(
        { error: "Original file not found" },
        { status: 404 }
      );
    }

    // Check if new name already exists
    try {
      await fs.access(newPath);
      console.log("[PUT] Error: New filename already exists");
      return NextResponse.json(
        { error: "File with new name already exists" },
        { status: 409 }
      );
    } catch {
      // New name doesn't exist, which is what we want
    }

    try {
      // Start a transaction
      await db.transaction(async (tx) => {
        try {
          // First rename the file in filesystem
          await fs.rename(absoluteOldPath, newPath);
          console.log("[PUT] File renamed in filesystem");

          // If filesystem operation succeeds, update the database
          const newFileUrl = `${BASE_URL}/files/${path.join(
            path.dirname(oldPath),
            newName
          )}`;
          console.log("[PUT] New file URL:", newFileUrl);

          await tx
            .update(media)
            .set({
              filePath: newFileUrl,
              slug: newName.split(".")[0],
            })
            .where(eq(media.id, existingFile.id));

          console.log("[PUT] Database updated successfully");
        } catch (error) {
          console.error("[PUT] Error in transaction:", error);
          // If anything fails, try to revert the filesystem change
          try {
            await fs.rename(newPath, absoluteOldPath);
            console.log("[PUT] Filesystem change reverted");
          } catch (revertError) {
            console.error(
              "[PUT] Failed to revert filesystem change:",
              revertError
            );
          }
          throw error; // Re-throw to trigger transaction rollback
        }
      });

      return NextResponse.json({
        success: true,
        newPath: path.join(path.dirname(oldPath), newName),
      });
    } catch (error) {
      console.error("[PUT] Transaction failed:", error);
      if (error instanceof Error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      return NextResponse.json(
        { error: "Unknown error during rename" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("[PUT] Error in rename operation:", error);
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

// DELETE - Delete folder or file
export async function DELETE(request: Request) {
  console.log("[DELETE] Delete request received");

  try {
    await ensureUploadDir();

    const { path: itemPath, id } = await request.json();
    console.log("[DELETE] Delete details:", { itemPath, id });

    if (!itemPath) {
      console.log("[DELETE] Error: No path provided");
      return NextResponse.json({ error: "Path is required" }, { status: 400 });
    }

    const absolutePath = path.join(UPLOAD_DIR, itemPath);
    console.log("[DELETE] Absolute path:", absolutePath);

    // Check if item exists
    try {
      await fs.access(absolutePath);
    } catch (error) {
      console.error("[DELETE] Item does not exist:", absolutePath);
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    const stats = await fs.stat(absolutePath);

    if (stats.isDirectory()) {
      console.log("[DELETE] Deleting directory");
      const items = await fs.readdir(absolutePath);
      if (items.length > 0) {
        console.log("[DELETE] Error: Directory not empty");
        return NextResponse.json(
          { error: "Folder is not empty" },
          { status: 400 }
        );
      }
      await fs.rmdir(absolutePath);
      console.log("[DELETE] Directory deleted successfully");
    } else {
      console.log("[DELETE] Deleting file");
      // Delete from filesystem
      await fs.unlink(absolutePath);
      console.log("[DELETE] File deleted from filesystem");

      // Delete from database if ID is provided
      if (id) {
        try {
          await db.delete(media).where(eq(media.id, id));
          console.log("[DELETE] File deleted from database");
        } catch (dbError) {
          console.error("[DELETE] Error deleting from database:", dbError);
          // File is already deleted from filesystem, so we continue
        }
      } else {
        console.log("[DELETE] No ID provided, skipping database deletion");
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE] Error in delete operation:", error);
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

// import { NextResponse } from "next/server";
// import fs from "fs/promises";
// import path from "path";
// import { media } from "@/lib/db/schema";
// import { db } from "@/lib/db/db";
// import { eq } from "drizzle-orm";
// export const dynamic = "force-dynamic";

// const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

// // Helper function to ensure upload directory exists
// async function ensureUploadDir() {
//   try {
//     await fs.access(UPLOAD_DIR);
//   } catch {
//     await fs.mkdir(UPLOAD_DIR, { recursive: true });
//   }
// }

// // GET - List files and folders
// // export async function GET(request: Request) {
// //   await ensureUploadDir();

// //   const { searchParams } = new URL(request.url);
// //   const folderPath = searchParams.get("path") || "";

// //   const absolutePath = path.join(UPLOAD_DIR, folderPath);

// //   try {
// //     const items = await fs.readdir(absolutePath, { withFileTypes: true });

// //     const result = await Promise.all(
// //       items.map(async (item) => {
// //         const itemPath = path.join(folderPath, item?.name);
// //         const stats = await fs.stat(path.join(absolutePath, item?.name));

// //         return {
// //           name: item?.name,
// //           path: itemPath,
// //           isDirectory: item?.isDirectory(),
// //           size: stats.size,
// //           modified: stats.mtime,
// //         };
// //       })
// //     );

// //     return NextResponse.json({ path: folderPath, items: result });
// //   } catch (error) {
// //     if (error instanceof Error) {
// //       return NextResponse.json({ error: error.message }, { status: 500 });
// //     }
// //     return NextResponse.json({ error: "Unknown error" }, { status: 500 });
// //   }
// // }
// export async function GET(request: Request) {
//   await ensureUploadDir();

//   const { searchParams } = new URL(request.url);
//   const folderPath = searchParams.get("path") || "";

//   const absolutePath = path.join(UPLOAD_DIR, folderPath);

//   try {
//     const items = await fs.readdir(absolutePath, { withFileTypes: true });
//     const result = await Promise.all(
//       items.map(async (item) => {
//         const itemPath = path.join(folderPath, item?.name);
//         const stats = await fs.stat(path.join(absolutePath, item?.name));

//         // For files, fetch additional metadata from database
//         let metadata = null;
//         if (!item?.isDirectory()) {
//           // Convert the filesystem path to a URL format for database matching
//           const fileUrl = `${
//             process.env.NEXT_PUBLIC_URL || "https://boltontoday.co.uk:3000"
//           }/uploads/${itemPath}`;

//           const dbRecord = await db.query.media.findFirst({
//             where: eq(media.filePath, fileUrl),
//           });

//           if (dbRecord) {
//             metadata = {
//               id: dbRecord.id,
//               title: dbRecord.title,
//               slug: dbRecord.slug,
//               caption: dbRecord.caption,
//               filePath: dbRecord.filePath,
//               type: dbRecord.type,
//             };
//           }
//         }

//         return {
//           name: item?.name,
//           path: itemPath,
//           isDirectory: item?.isDirectory(),
//           size: stats.size,
//           modified: stats.mtime,
//           ...metadata,
//         };
//       })
//     );

//     return NextResponse.json({ path: folderPath, items: result });
//   } catch (error) {
//     if (error instanceof Error) {
//       return NextResponse.json({ error: error.message }, { status: 500 });
//     }
//     return NextResponse.json({ error: "Unknown error" }, { status: 500 });
//   }
// }
// // POST - Create folder
// export async function POST(request: Request) {
//   await ensureUploadDir();

//   const { name, path: folderPath = "" } = await request.json();

//   if (!name) {
//     return NextResponse.json(
//       { error: "Folder name is required" },
//       { status: 400 }
//     );
//   }

//   const newFolderPath = path.join(UPLOAD_DIR, folderPath, name);

//   try {
//     await fs.mkdir(newFolderPath);
//     return NextResponse.json({
//       success: true,
//       path: path.join(folderPath, name),
//     });
//   } catch (error) {
//     if (error instanceof Error) {
//       return NextResponse.json({ error: error.message }, { status: 500 });
//     }
//     return NextResponse.json({ error: "Unknown error" }, { status: 500 });
//   }
// }

// // PUT - Rename folder or file
// export async function PUT(request: Request) {
//   await ensureUploadDir();

//   const { oldPath, newName } = await request.json();

//   if (!oldPath || !newName) {
//     return NextResponse.json(
//       { error: "Both oldPath and newName are required" },
//       { status: 400 }
//     );
//   }

//   // First check if the file exists in the database
//   const fileUrl = `${
//     process.env.NEXT_PUBLIC_URL || "https://boltontoday.co.uk:3000"
//   }/uploads/${oldPath}`;

//   console.log(fileUrl,"file Url to update")
//   const existingFile = await db.query.media.findFirst({
//     where: eq(media.filePath, fileUrl),
//   });

//   if (!existingFile) {
//     return NextResponse.json(
//       { error: "File not found in database" },
//       { status: 404 }
//     );
//   }

//   const absoluteOldPath = path.join(UPLOAD_DIR, oldPath);
//   const newPath = path.join(path.dirname(absoluteOldPath), newName);

//   try {
//     // Start a transaction
//     await db.transaction(async (tx) => {
//       try {
//         // First rename the file in filesystem
//         await fs.rename(absoluteOldPath, newPath);

//         // If filesystem operation succeeds, update the database
//         const newFileUrl = `${
//           process.env.NEXT_PUBLIC_URL || "https://boltontoday.co.uk:3000"
//         }/uploads/${path.join(path.dirname(oldPath), newName)}`;

//         await tx
//           .update(media)
//           .set({
//             filePath: newFileUrl,
//             slug: newName.split(".")[0],
//           })
//           .where(eq(media.id, existingFile.id));
//       } catch (error) {
//         // If anything fails, try to revert the filesystem change
//         try {
//           await fs.rename(newPath, absoluteOldPath);
//         } catch (revertError) {
//           console.error("Failed to revert filesystem change:", revertError);
//         }
//         throw error; // Re-throw to trigger transaction rollback
//       }
//     });

//     return NextResponse.json({
//       success: true,
//       newPath: path.join(path.dirname(oldPath), newName),
//     });
//   } catch (error) {
//     if (error instanceof Error) {
//       return NextResponse.json({ error: error.message }, { status: 500 });
//     }
//     return NextResponse.json({ error: "Unknown error" }, { status: 500 });
//   }
// }

// // DELETE - Delete folder or file
// export async function DELETE(request: Request) {
//   await ensureUploadDir();

//   const { path: itemPath, id } = await request.json();

//   if (!itemPath) {
//     return NextResponse.json({ error: "Path is required" }, { status: 400 });
//   }

//   const absolutePath = path.join(UPLOAD_DIR, itemPath);

//   try {
//     const stats = await fs.stat(absolutePath);

//     if (stats.isDirectory()) {
//       const items = await fs.readdir(absolutePath);
//       if (items.length > 0) {
//         return NextResponse.json(
//           { error: "Folder is not empty" },
//           { status: 400 }
//         );
//       }
//       await fs.rmdir(absolutePath);
//     } else {
//       // Delete from filesystem
//       await fs.unlink(absolutePath);

//       // Delete from database
//       await db.delete(media).where(eq(media.id, id));
//     }

//     return NextResponse.json({ success: true });
//   } catch (error) {
//     if (error instanceof Error) {
//       return NextResponse.json({ error: error.message }, { status: 500 });
//     }
//     return NextResponse.json({ error: "Unknown error" }, { status: 500 });
//   }
// }

// // // DELETE - Delete folder or file
// // export async function DELETE(request: Request) {
// //   await ensureUploadDir();

// //   const { path: itemPath } = await request.json();

// //   if (!itemPath) {
// //     return NextResponse.json({ error: "Path is required" }, { status: 400 });
// //   }

// //   const absolutePath = path.join(UPLOAD_DIR, itemPath);

// //   try {
// //     const stats = await fs.stat(absolutePath);

// //     if (stats.isDirectory()) {
// //       const items = await fs.readdir(absolutePath);
// //       if (items.length > 0) {
// //         return NextResponse.json(
// //           { error: "Folder is not empty" },
// //           { status: 400 }
// //         );
// //       }
// //       await fs.rmdir(absolutePath);
// //     } else {
// //       await fs.unlink(absolutePath);
// //     }

// //     return NextResponse.json({ success: true });
// //   } catch (error) {
// //     if (error instanceof Error) {
// //       return NextResponse.json({ error: error.message }, { status: 500 });
// //     }
// //     return NextResponse.json({ error: "Unknown error" }, { status: 500 });
// //   }
// // }
