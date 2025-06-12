import { NextResponse } from "next/server";
import { db } from "@/lib/db/db"; // adjust path to your drizzle db instance
import { news, media, authors } from "@/lib/db/schema";
import { inArray, or, sql } from "drizzle-orm";
import slugify from "slugify";

// const newsItems = await db
//   .select({ featureImage: news.featureImage })
//   .from(news);
// const imageUrls = [
//   ...new Set(
//     newsItems
//       .map((item) => item?.featureImage)
//       .filter((url): url is string => !!url)
//   ),
// ];
export async function POST() {
  try {
    // Step 1: Get all distinct non-null featureImage URLs from authors (or news)
    // const newsItems = await db.select({ image: authors.image }).from(authors);
    // const imageUrls = [
    //   ...new Set(
    //     newsItems
    //       .map((item) => item?.image)
    //       .filter((url): url is string => !!url)
    //   ),
    // ];
    const newsItems = await db
      .select({ featureImage: news.featureImage })
      .from(news);
    const imageUrls = [
      ...new Set(
        newsItems
          .map((item) => item?.featureImage)
          .filter((url): url is any => !!url)
      ),
    ];

    if (imageUrls.length === 0) {
      return NextResponse.json({
        message: "No feature images found in news table.",
      });
    }

    // Step 2: Check which filePaths already exist in media
    const existingMedia = await db
      .select({ filePath: media.filePath })
      .from(media)
      .where(inArray(media.filePath, imageUrls));

    const existingPaths = new Set(existingMedia.map((m: any) => m.filePath));
    const newImages = imageUrls.filter((url) => !existingPaths.has(url));

    // Step 3: Generate slugs and prepare media records, ensuring unique slugs
    const date = new Date();

    // Get all existing slugs from DB for new images' base slug and variants
    // We can do this after we generate base slugs, but to optimize, get all existing slugs here
    // To do this, first generate base slugs from newImages
    const baseSlugs = newImages.map((url) => {
      const fileName = url.split("/").pop()?.split("?")[0] || "image";
      return slugify(fileName, { lower: false, strict: true });
    });

    // Get existing slugs for any of these base slugs and possible variants
    // We'll get all existing slugs starting with these base slugs as prefix to check duplicates
    const existingSlugsResult = await db
      .select({ slug: media.slug })
      .from(media)
      .where(
        // Assuming you have an SQL helper to query slugs starting with any of these base slugs
        or(...baseSlugs.map((slug) => sql`${media.slug} LIKE ${slug + "%"}`))
      );

    const existingSlugsSet = new Set(
      existingSlugsResult.map((s: any) => s.slug)
    );

    // Helper function to generate unique slug if duplicate exists
    function generateUniqueSlug(baseSlug: string): string {
      if (!existingSlugsSet.has(baseSlug)) {
        existingSlugsSet.add(baseSlug);
        return baseSlug;
      }

      // Try appending suffixes until unique slug found
      const suffixChars = [..."abcdefghijklmnopqrstuvwxyz0123456789"];
      for (let i = 0; i < suffixChars.length; i++) {
        const newSlug = `${baseSlug}-${suffixChars[i]}`;
        if (!existingSlugsSet.has(newSlug)) {
          existingSlugsSet.add(newSlug);
          return newSlug;
        }
      }

      // If all single suffixes exhausted, try increasing numeric suffix (optional)
      let counter = 2;
      while (true) {
        const newSlug = `${baseSlug}-${counter}`;
        if (!existingSlugsSet.has(newSlug)) {
          existingSlugsSet.add(newSlug);
          return newSlug;
        }
        counter++;
      }
    }

    const slugToImageMap: Record<string, any> = {};

    newImages.forEach((url: string) => {
      const fileName = url.split("/").pop()?.split("?")[0] || "image";
      const baseSlug = slugify(fileName, { lower: false, strict: true });

      const uniqueSlug = generateUniqueSlug(baseSlug);

      slugToImageMap[uniqueSlug] = {
        title: fileName.slice(0, -5),
        slug: uniqueSlug,
        caption: "",
        filePath: url,
        type: "image" as const,
        createdAt: date,
      };
    });

    // Step 5: Insert new media
    const newMedia = Object.values(slugToImageMap);

    if (newMedia.length > 0) {
      await db.insert(media).values(newMedia);
    }

    return NextResponse.json({
      message: "Sync completed",
      total: imageUrls.length,
      inserted: newMedia.length,
      skippedByPath: existingPaths.size,
      skippedBySlug: existingSlugsSet.size - newMedia.length,
    });
  } catch (error) {
    console.error("Error syncing media:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Step 1: Get all distinct non-null featureImage URLs from news
// const newsItems = await db.select({ image: authors.image }).from(authors);
// const imageUrls = [
//   ...new Set(
//     newsItems
//       .map((item) => item?.image)
//       .filter((url): url is string => !!url)
//   ),
// ];
