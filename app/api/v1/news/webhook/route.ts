// import { db } from "@/lib/db/db";
// import { categories, news, newsCategories } from "@/lib/db/schema";
// import { slugify } from "@/utils";
// import { eq, sql } from "drizzle-orm";
// import { NextResponse } from "next/server";

// export const POST = async (request: Request) => {
//   try {
//     const body = await request.json();
//     const { title, metaDescription, categorySlug, content } = body;
//     const slug = slugify(title);
//     // Validate required fields
//     if (!title || !slug) {
//       return NextResponse.json(
//         { error: "Title and slug are required" },
//         { status: 400 }
//       );
//     }

//     // Check for unique slug
//     const existingArticle = await db
//       .select()
//       .from(news)
//       .where(eq(news.slug, slug));

//     if (existingArticle.length > 0) {
//       return NextResponse.json(
//         { error: "Slug already exists" },
//         { status: 409 }
//       );
//     }

//     // Reset sequence to max ID before insertion to prevent duplicate key errors
//     await db.execute(
//       sql`SELECT setval('news_id_seq', COALESCE((SELECT MAX(id) FROM news), 0), true)`
//     );
//     // Create new article
//     const newArticle = await db
//       .insert(news)
//       .values({
//         title,
//         slug,
//         description: "",
//         details: content,
//         authorId: 1,
//         publishStatus: "inactive",
//         featureImage: null,
//         publishDate: new Date(),
//         activeStatus: "inactive",
//         metaDescription: metaDescription,
//         keywords: "",
//       })
//       .returning();
//     const categoriesData = await db
//       .select()
//       .from(categories)
//       .where(eq(categories.slug, categorySlug));
//     // Handle categories if provided
//     if (categoriesData && categoriesData?.length > 0) {
//       await db.insert(newsCategories).values(
//         categoriesData.map((category: { id: number; slug: string }) => ({
//           newsId: newArticle[0].id,
//           categoryId: category.id,
//           newsSlug: newArticle[0].slug,
//           categorySlug: category.slug,
//         }))
//       );
//     }

//     return NextResponse.json(newArticle[0], { status: 201 });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ error: error }, { status: 500 });
//   }
// };

import { db } from "@/lib/db/db";
import {
  categories,
  news,
  newsCategories,
  media,
  authors,
} from "@/lib/db/schema";
import { slugify } from "@/utils";
import { eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import sharp from "sharp";

// You need these constants
const UPLOAD_DIR = process.env.UPLOAD_DIR || "./public/uploads";
const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    const {
      title,
      metaDescription,
      categorySlug,
      content,
      featureImageBase64,
    } = body;

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const slug = slugify(title);

    // **Check if news already exists first**
    const existingArticle = await db
      .select()
      .from(news)
      .where(eq(news.slug, slug))
      .limit(1);

    if (existingArticle.length > 0) {
      // Skip everything and return existing news
      return NextResponse.json(
        { message: "News already exists", news: existingArticle[0] },
        { status: 200 },
      );
    }

    let featureImageId: number | null = null;
    if (featureImageBase64) {
      console.log("📸 Feature image received");

      const mediaSlug = slug;
      console.log("🔎 Checking media slug:", mediaSlug);

      // Check if media slug already exists
      const existingMedia = await db
        .select({ id: media.id })
        .from(media)
        .where(eq(media.slug, mediaSlug))
        .limit(1);

      if (existingMedia.length > 0) {
        console.log(
          "✅ Media already exists. Using existing ID:",
          existingMedia[0].id,
        );
        featureImageId = existingMedia[0].id;
      } else {
        console.log("⬇️ No existing media found. Processing new image...");

        // Decode base64
        const matches = featureImageBase64.match(/^data:(.+);base64,(.+)$/);

        if (!matches) {
          console.error("❌ Invalid base64 format");
          return NextResponse.json(
            { error: "Invalid base64 string" },
            { status: 400 },
          );
        }

        console.log("📦 Base64 format valid");
        console.log("🧾 Mime type:", matches[1]);

        const fileBuffer = Buffer.from(matches[2], "base64");

        console.log("📏 Original image size:", fileBuffer.length / 1024, "KB");

        if (fileBuffer.length > MAX_FILE_SIZE) {
          console.warn("⚠️ File exceeds max size:", MAX_FILE_SIZE);
          return NextResponse.json(
            { error: `File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB` },
            { status: 400 },
          );
        }

        try {
          console.log("🖼️ Converting image to WebP using sharp...");

          const webpBuffer = await sharp(fileBuffer)
            .webp({ quality: 80 })
            .toBuffer();

          console.log("✅ WebP conversion successful");
          console.log("📏 WebP size:", webpBuffer.length / 1024, "KB");

          const uploadPath = path.join(`${mediaSlug}.webp`);
          const fullPath = path.join(UPLOAD_DIR, uploadPath);

          console.log("📂 Upload path:", fullPath);

          await fs.mkdir(path.dirname(fullPath), { recursive: true });
          console.log("📁 Directory ensured");

          await fs.writeFile(fullPath, webpBuffer);
          console.log("💾 Image saved successfully");

          console.log("🗄️ Updating media sequence...");

          await db.execute(
            sql`SELECT setval('media_id_seq', COALESCE((SELECT MAX(id) FROM media), 0), true)`,
          );

          console.log("📥 Inserting media record into DB...");

          const insertedMedia = await db
            .insert(media)
            .values({
              title,
              slug: mediaSlug,
              caption: null,
              filePath: `${BASE_URL}/uploads/${uploadPath.replace(/\\/g, "/")}`,
              type: "image",
            })
            .returning();

          featureImageId = insertedMedia[0].id;

          console.log("🎉 Media inserted successfully. ID:", featureImageId);
        } catch (err) {
          console.error("🔥 Image processing failed:", err);

          return NextResponse.json(
            { error: "Image processing failed" },
            { status: 500 },
          );
        }
      }
    }
    const author = await db.select({ id: authors.id }).from(authors).limit(1);
    // Create news article
    await db.execute(
      sql`SELECT setval('news_id_seq', COALESCE((SELECT MAX(id) FROM news), 0), true)`,
    );
    const newArticle = await db
      .insert(news)
      .values({
        title,
        slug,
        description: "",
        details: content,
        authorId: author.length > 0 ? author[0].id : null,
        publishStatus: "inactive",
        featureImage: featureImageId,
        publishDate: new Date(),
        activeStatus: "inactive",
        metaDescription,
        keywords: "",
      })
      .returning();

    // Handle categories
    if (categorySlug) {
      const categoriesData = await db
        .select()
        .from(categories)
        .where(eq(categories.slug, categorySlug));
      if (categoriesData.length > 0) {
        await db.insert(newsCategories).values(
          categoriesData.map((category) => ({
            newsId: newArticle[0].id,
            categoryId: category.id,
            newsSlug: newArticle[0].slug,
            categorySlug: category.slug,
          })),
        );
      }
    }

    return NextResponse.json(newArticle[0], { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : error },
      { status: 500 },
    );
  }
};
