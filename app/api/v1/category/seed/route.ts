import { db } from "@/lib/db/db";
import { authors, categories, news, newsCategories } from "@/lib/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { slugify } from "@/utils/index";
import { sql } from "drizzle-orm";
import { apiResponse } from "@/constant/apiRes";

function generateDummyCategory(
  index: number,
  parentId: number | null = null,
  level: number = 0,
  parentName?: string,
  existingSlugs: Set<string> = new Set()
) {
  // Generate a unique identifier for this category
  const uniqueId = Math.random().toString(36).substring(2, 8);

  const name = parentName
    ? `${parentName} - Category ${index}${
        level > 0 ? ` Level ${level}` : ""
      } (${uniqueId})`
    : `Category ${index}${level > 0 ? ` Level ${level}` : ""} (${uniqueId})`;

  // Generate unique slug
  let slug = slugify(name);
  let counter = 1;
  while (existingSlugs.has(slug)) {
    slug = `${slugify(name)}-${counter}`;
    counter++;
  }
  existingSlugs.add(slug);

  return {
    name,
    slug,
    status: "active" as const,
    metaTitle: `Meta Title for ${name}`,
    metaDescription: `Meta Description for ${name}`,
    keywords: `keyword1, keyword2, keyword3`,
    parentCategoryId: parentId,
    createdAt: new Date(),
  };
}

// export async function POST(request: Request) {
//   try {
//     const data = await request.json();

//     if (!Array.isArray(data)) {
//       return NextResponse.json(
//         { error: "Invalid data format. Expected an array." },
//         { status: 400 }
//       );
//     }

//     // Create a Map to track unique slugs
//     const uniqueSlugs = new Map();

//     // Filter out duplicates based on slug
//     const uniqueData = data.filter((item) => {
//       if (uniqueSlugs.has(item?.slug)) {
//         return false; // Skip if slug already exists
//       }
//       uniqueSlugs.set(item?.slug, true);
//       return true;
//     });

//     const categoryData = uniqueData.map((item) => ({
//       id: parseInt(item?.id),
//       name: item?.name,
//       slug: item?.slug,
//       position: null,
//       publishStatus: "active" as const,
//       description: item?.bio || "",
//       facebookLink: null,
//       instagramLink: null,
//       twitterLink: null,
//       muckrackLink: null,
//       personalPortfolio: null,
//       linkedin: null,
//       image: item?.avatar,
//       metaTitle: item?.name,
//       metaDescription: "",
//       keywords: "",
//       createdAt: new Date(),
//     }));

//     // Insert categories into the database
//     const result = await db.insert(authors).values(categoryData);

//     return NextResponse.json(
//       {
//         message: "Categories imported successfully",
//         count: categoryData.length,
//         skipped: data.length - uniqueData.length, // Number of duplicates skipped
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error importing categories:", error);
//     return NextResponse.json(
//       { error: "Failed to import categories" },
//       { status: 500 }
//     );
//   }
// }

// Helper function to transform a single item

// const transformItem = (item: any) =>
//   ({
//     newItem: {
//       id: item?.id,
//       title: item?.title,
//       slug: item?.slug,
//       date: item?.date,
//       content: item?.content,
//       excerpt: item?.excerpt,
//       featured_image: item?.featured_image,
//       authorId: item?.author.id,
//       categories: item?.categories.map((category: any) => String(category.id)), // Added this line
//     },
//     author: {
//       id: item?.author.id,
//       name: item?.author.name,
//       slug: item?.author.slug,
//       bio: item?.author.bio,
//       avatar: item?.author.avatar,
//     },
//     categories: item?.categories,
//   } as any);

// // POST handler for processing large array and combining data
// export async function POST(request: NextRequest) {
//   try {
//     const { data, batchSize = 100 } = await request.json(); // Parse incoming JSON data, with optional batchSize

//     if (!Array.isArray(data)) {
//       return NextResponse.json(
//         { success: false, error: "Input must be an array" },
//         { status: 400 }
//       );
//     }

//     // Initialize arrays for combined data
//     const allNews = [];
//     const allAuthors = new Map(); // Use Map to avoid duplicate authors (keyed by author.id)
//     const allCategories = new Map(); // Use Map to avoid duplicate categories (keyed by category.id)

//     // Process data in batches
//     for (let i = 0; i < data.length; i += batchSize) {
//       const batch = data.slice(i, i + batchSize).map(transformItem);

//       batch.forEach(({ newItem, author, categories }) => {
//         // Add news item
//         allNews.push(newItem);

//         // Add author if not already present
//         if (!allAuthors.has(author.id)) {
//           allAuthors.set(author.id, author);
//         }

//         // Add categories if not already present
//         categories.forEach((category) => {
//           if (!allCategories.has(category.id)) {
//             allCategories.set(category.id, category);
//           }
//         });
//       });
//     }

//     // Convert Maps to arrays
//     const combinedData = {
//       new: allNews,
//       author: Array.from(allAuthors.values()),
//       categories: Array.from(allCategories.values()),
//     };

//     return NextResponse.json(
//       { success: true, data: combinedData },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error transforming and combining data:", error);
//     return NextResponse.json(
//       { success: false, error: "Failed to transform and combine data" },
//       { status: 500 }
//     );
//   }
// }

// export async function POST(request: Request) {
//   try {
//     console.time("Total Time");

//     let data;
//     try {
//       data = await request.json();
//     } catch (parseError) {
//       return NextResponse.json(
//         { error: "Invalid JSON data in request body" },
//         { status: 400 }
//       );
//     }

//     if (!Array.isArray(data)) {
//       return NextResponse.json(
//         { error: "Invalid data format. Expected an array." },
//         { status: 400 }
//       );
//     }

//     console.log(`Received ${data.length} items`);

//     const startDedup = performance.now();
//     const uniqueSlugs = new Map();
//     const uniqueData = data.filter((item) => {
//       if (uniqueSlugs.has(item?.slug)) return false;
//       uniqueSlugs.set(item?.slug, true);
//       return true;
//     });
//     const date = new Date();
//     console.log(`Deduplication done in ${performance.now() - startDedup}ms`);
//     console.log(`Unique items to insert: ${uniqueData.length}`);

//     return await db.transaction(async (tx) => {
//       try {
//         console.time("News Preparation");
//         const newsData = uniqueData.map((item) => ({
//           title: item?.title,
//           slug: item?.slug,
//           description: item?.excerpt || "",
//           details: item?.content || "",
//           publishStatus: "active" as const,
//           activeStatus: "active" as const,
//           publishDate: new Date(item?.date) || date,
//           metaTitle: item?.title,
//           metaDescription: item?.excerpt || "",
//           keywords: "",
//           featureImage: item?.featured_image || null,
//           authorId: item?.authorId ?? null,
//           createdAt: date,
//         }));
//         console.timeEnd("News Preparation");

//         console.time("News Insertion");
//         const insertedNews = await tx.insert(news).values(newsData).returning();
//         console.timeEnd("News Insertion");

//         console.time("Category Mapping");
//         const newsCategoriesData = uniqueData.flatMap((item, index) => {
//           const newsArticle = insertedNews[index];
//           return item?.categories
//             .map((category: any) => {
//               const parsedId = parseInt(category);
//               if (isNaN(parsedId)) {
//                 console.warn(`Invalid category ID for news: ${item?.title}`);
//                 return null;
//               }
//               return {
//                 newsId: newsArticle.id,
//                 categoryId: parsedId,
//                 createdAt: date,
//               };
//             })
//             .filter((relation: any) => relation !== null);
//         });
//         console.timeEnd("Category Mapping");

//         console.time("Category Insertion");
//         if (newsCategoriesData.length > 0) {
//           await tx.insert(newsCategories).values(newsCategoriesData);
//         }
//         console.timeEnd("Category Insertion");

//         console.timeEnd("Total Time");
//         return NextResponse.json(
//           {
//             message: "News and categories imported successfully",
//             counts: {
//               news: insertedNews.length,
//               newsCategories: newsCategoriesData.length,
//               skipped: data.length - uniqueData.length,
//             },
//           },
//           { status: 200 }
//         );
//       } catch (error) {
//         console.error("Error processing news and categories data:", error);
//         throw error;
//       }
//     });
//   } catch (error) {
//     console.error("Error importing news and categories:", error);
//     return NextResponse.json({ error: error }, { status: 500 });
//   }
// }
export async function GET(req: Request) {
  console.log("[Category GET] Received request");
  try {
    // Use recursive CTE to get full category hierarchy with all parent IDs
    const categoriesQuery = sql`
      WITH RECURSIVE category_path AS (
        -- Base case: root categories (no parent)
        SELECT
          c.id,
          c.name,
          c.slug,
          c.parent_category_id,
          c.slug::TEXT AS full_slug,
          ARRAY[]::INTEGER[] AS parent_ids
        FROM categories c
        WHERE c.parent_category_id IS NULL

        UNION ALL

        -- Recursive case: child categories
        SELECT
          child.id,
          child.name,
          child.slug,
          child.parent_category_id,
          (parent.full_slug || '/' || child.slug) AS full_slug,
          (parent.parent_ids || parent.id) AS parent_ids
        FROM categories child
        JOIN category_path parent
          ON child.parent_category_id = parent.id
      )
      SELECT
        name,
        slug,
        full_slug,
        parent_ids
      FROM category_path
      ORDER BY name
    `;

    const result = await db.execute(categoriesQuery);

    // Map the results to the desired format
    const categoriesData = result.rows.map((row: any) => ({
      name: row.name,
      slug: row.slug,
      fullSlug: row.full_slug,
      // parentIds: row.parent_ids || [],
    }));

    console.log("[Category GET] Fetched categories:", categoriesData);

    return apiResponse(
      categoriesData,
      200,
      true,
      "Categories fetched successfully"
    );
  } catch (error) {
    console.error("[Category GET] Error:", error);
    return apiResponse(
      null,
      500,
      false,
      error instanceof Error ? error.message : "Internal error"
    );
  }
}