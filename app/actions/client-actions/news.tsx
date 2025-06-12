import { db } from "@/lib/db/db"; // Your database instance
import {
  authors,
  categories,
  media,
  news,
  newsCategories,
} from "@/lib/db/schema"; // Your schema
import { and, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { toast } from "sonner";

// Type definitions for the result
export interface NewsDetailResult {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  details: string | null;
  publishStatus: string;
  activeStatus: string;
  publishDate: Date;
  metaTitle: string | null;
  metaDescription: string | null;
  keywords: string | null;
  featureImage: {
    filePath: string | null;
    caption: string | null;
    title: string | null;
  };
  createdAt: Date;
  author: {
    id: number | null;
    name: string | null;
  };
  category: {
    id: number;
    name: string;
    slug: string;
    description: string | null;
  };
}

// Custom error classes for better error handling
export class NewsNotFoundError extends Error {
  constructor(newsSlug: string) {
    super(`News with slug "${newsSlug}" not found`);
    this.name = "NewsNotFoundError";
  }
}

export class CategoryNotFoundError extends Error {
  constructor(categorySlug: string) {
    super(`Category with slug "${categorySlug}" not found`);
    this.name = "CategoryNotFoundError";
  }
}

export class NewsNotInCategoryError extends Error {
  constructor(newsSlug: string, categorySlug: string) {
    super(
      `News "${newsSlug}" is not associated with category "${categorySlug}"`
    );
    this.name = "NewsNotInCategoryError";
  }
}

/**
 * Get news detail with category information by news and category slugs
 * @param newsSlug - The slug of the news article
 * @param categorySlug - The slug of the category
 * @returns Promise<NewsDetailResult> - The news detail with category info
 * @throws {NewsNotFoundError} - When news with given slug doesn't exist
 * @throws {CategoryNotFoundError} - When category with given slug doesn't exist
 * @throws {NewsNotInCategoryError} - When news is not associated with the category
 */
// export async function getNewsDetailBySlug(
//   newsSlug: string,
//   categorySlug: string
// ): Promise<NewsDetailResult> {
//   // Input validation
//   if (!newsSlug || typeof newsSlug !== "string" || newsSlug.trim() === "") {
//     throw new Error("News slug is required and must be a non-empty string");
//   }

//   if (
//     !categorySlug ||
//     typeof categorySlug !== "string" ||
//     categorySlug.trim() === ""
//   ) {
//     throw new Error("Category slug is required and must be a non-empty string");
//   }

//   // Trim slugs to handle whitespace
//   const trimmedNewsSlug = newsSlug.trim();
//   const trimmedCategorySlug = categorySlug.trim();

//   try {
//     // Step 1: Validate news exists and get basic info
//     const newsResult = await db
//       .select({
//         id: news.id,
//         title: news.title,
//         slug: news.slug,
//         description: news.description,
//         details: news.details,
//         publishStatus: news.publishStatus,
//         activeStatus: news.activeStatus,
//         publishDate: news.publishDate,
//         metaTitle: news.metaTitle,
//         metaDescription: news.metaDescription,
//         keywords: news.keywords,
//         featureImage: news.featureImage,
//         authorId: news.authorId,
//         createdAt: news.createdAt,
//       })
//       .from(news)
//       .where(eq(news.slug, trimmedNewsSlug))
//       .limit(1);

//     if (newsResult.length === 0) {
//       throw new NewsNotFoundError(trimmedNewsSlug);
//     }

//     const newsData = newsResult[0];

//     // Step 2: Validate category exists
//     const categoryResult = await db
//       .select({
//         id: categories.id,
//         name: categories.name,
//         slug: categories.slug,
//         description: categories.description,
//       })
//       .from(categories)
//       .where(eq(categories.slug, trimmedCategorySlug))
//       .limit(1);

//     if (categoryResult.length === 0) {
//       throw new CategoryNotFoundError(trimmedCategorySlug);
//     }

//     const categoryData = categoryResult[0];

//     // Step 3: Validate the news-category relationship exists
//     const relationshipResult = await db
//       .select({
//         newsId: newsCategories.newsId,
//         categoryId: newsCategories.categoryId,
//       })
//       .from(newsCategories)
//       .where(
//         and(
//           eq(newsCategories.newsSlug, trimmedNewsSlug),
//           eq(newsCategories.categorySlug, trimmedCategorySlug)
//         )
//       )
//       .limit(1);

//     if (relationshipResult.length === 0) {
//       throw new NewsNotInCategoryError(trimmedNewsSlug, trimmedCategorySlug);
//     }

//     // Step 4: Get author information if exists
//     let authorData = { id: null, name: null };

//     if (newsData.authorId) {
//       const authorResult = await db
//         .select({
//           id: authors.id,
//           name: authors.name, // Assuming authors table has a name field
//         })
//         .from(authors)
//         .where(eq(authors.id, newsData.authorId))
//         .limit(1);

//       if (authorResult.length > 0) {
//         authorData = authorResult[0];
//       }
//     }

//     // Step 5: Construct and return the result
//     const result: NewsDetailResult = {
//       id: newsData.id,
//       title: newsData.title,
//       slug: newsData.slug,
//       description: newsData.description,
//       details: newsData.details,
//       publishStatus: newsData.publishStatus,
//       activeStatus: newsData.activeStatus,
//       publishDate: newsData.publishDate,
//       metaTitle: newsData.metaTitle,
//       metaDescription: newsData.metaDescription,
//       keywords: newsData.keywords,
//       featureImage: newsData.featureImage,
//       createdAt: newsData.createdAt,
//       author: authorData,
//       category: {
//         id: categoryData.id,
//         name: categoryData.name,
//         slug: categoryData.slug,
//         description: categoryData.description,
//       },
//     };

//     return result;
//   } catch (error) {
//     // Re-throw custom errors
//     if (
//       error instanceof NewsNotFoundError ||
//       error instanceof CategoryNotFoundError ||
//       error instanceof NewsNotInCategoryError
//     ) {
//       throw error;
//     }

//     // Handle unexpected database errors
//     console.error("Database error in getNewsDetailBySlug:", error);
//     throw new Error("Failed to retrieve news details due to database error");
//   }
// }

// Alternative version with a single optimized query (more efficient)

export const dynamic = "force-dynamic";

export async function getNewsDetailBySlugOptimized(
  newsSlug: string,
  categorySlug: string
): Promise<any> {
  // Input validation
  if (!newsSlug || typeof newsSlug !== "string" || newsSlug.trim() === "") {
    toast.error("News slug is required and must be a non-empty string");
    return null; // Add return statement
  }

  if (
    !categorySlug ||
    typeof categorySlug !== "string" ||
    categorySlug.trim() === ""
  ) {
    toast.error("Category slug is required and must be a non-empty string");
    return null; // Add return statement
  }

  console.log(newsSlug, "news slug", categorySlug, "category");
  const trimmedNewsSlug = newsSlug.trim(); // Actually trim the values
  const trimmedCategorySlug = categorySlug.trim();

  try {
    // Single query with joins for better performance
    const result = await db
      .select({
        // News fields
        newsId: news.id,
        newsTitle: news.title,
        newsSlug: news.slug,
        newsDescription: news.description,
        newsDetails: news.details,
        publishStatus: news.publishStatus,
        activeStatus: news.activeStatus,
        publishDate: news.publishDate,
        // metaTitle: news.metaTitle,
        metaDescription: news.metaDescription,
        // keywords: news.keywords,
        newsCreatedAt: news.createdAt,
        featureImage: media.filePath, // Fixed: uncommented and properly referenced
        featureImageTitle: media.title, // Fixed: uncommented and properly referenced
        featureImageCaption: media.caption, // Fixed: uncommented and properly referenced

        // Category fields
        categoryId: categories.id,
        categoryName: categories.name,
        categorySlug: categories.slug,
        categoryDescription: categories.description,

        // Author fields
        authorId: authors.id,
        authorName: authors.name,
        authorSlug: authors.slug,
      })
      .from(news)
      .innerJoin(newsCategories, eq(news.id, newsCategories.newsId))
      .leftJoin(media, eq(media.id, news.featureImage)) // Fixed: uncommented
      .innerJoin(categories, eq(newsCategories.categoryId, categories.id))
      .leftJoin(authors, eq(news.authorId, authors.id))
      .where(
        and(
          eq(news.slug, trimmedNewsSlug),
          eq(categories.slug, trimmedCategorySlug),
          // Add status filters for better data integrity
          eq(news.publishStatus, "active"),
          eq(news.activeStatus, "active")
        )
      )
      .limit(1);

    console.log(result, "result");

    if (result.length === 0) {
      // Better error handling - check what specifically failed

      // Check if news exists with proper status
      const newsExists = await db
        .select({ id: news.id })
        .from(news)
        .where(
          and(
            eq(news.slug, trimmedNewsSlug),
            eq(news.publishStatus, "active"),
            eq(news.activeStatus, "active")
          )
        )
        .limit(1);

      if (newsExists.length === 0) {
        console.log("News not found or not active:", trimmedNewsSlug);
        return notFound();
      }

      // Check if category exists
      const categoryExists = await db
        .select({ id: categories.id })
        .from(categories)
        .where(
          and(
            eq(categories.slug, trimmedCategorySlug),
            eq(categories.status, "active")
          )
        )
        .limit(1);

      if (categoryExists.length === 0) {
        console.log("Category not found or not active:", trimmedCategorySlug);
        return notFound();
      }

      // Check if news is in the category
      const newsInCategory = await db
        .select({ newsId: newsCategories.newsId })
        .from(newsCategories)
        .innerJoin(news, eq(news.id, newsCategories.newsId))
        .innerJoin(categories, eq(categories.id, newsCategories.categoryId))
        .where(
          and(
            eq(news.slug, trimmedNewsSlug),
            eq(categories.slug, trimmedCategorySlug)
          )
        )
        .limit(1);

      if (newsInCategory.length === 0) {
        console.log(
          "News not in specified category:",
          trimmedNewsSlug,
          trimmedCategorySlug
        );
        return notFound();
      }

      // If we reach here, something else went wrong
      console.log("Unexpected case - news and category exist but query failed");
      return notFound();
    }

    const data = result[0];

    return {
      id: data.newsId,
      title: data.newsTitle,
      slug: data.newsSlug,
      description: data.newsDescription,
      details: data.newsDetails,
      publishStatus: data.publishStatus,
      activeStatus: data.activeStatus,
      publishDate: data.publishDate,
      // metaTitle: data.metaTitle,
      metaDescription: data.metaDescription,
      // keywords: data.keywords,
      featureImage: data.featureImage, // Now properly available
      featureImageCaption: data.featureImageCaption, // Now properly available
      featureImageTitle: data.featureImageTitle, // Now properly available
      createdAt: data.newsCreatedAt,
      author: data.authorId
        ? {
            id: data.authorId,
            name: data.authorName,
            slug: data.authorSlug,
          }
        : null, // Handle case where author might be null
      category: {
        id: data.categoryId,
        name: data.categoryName,
        slug: data.categorySlug,
        description: data.categoryDescription,
      },
    };
  } catch (error) {
    console.error("Database error in getNewsDetailBySlugOptimized:", error);
    return notFound();
  }
}

// Usage example:
/*
try {
  const newsDetail = await getNewsDetailBySlug('my-news-article', 'technology');
  console.log('News:', newsDetail.title);
  console.log('Category:', newsDetail.category.name);
  console.log('Author:', newsDetail.author.name);
} catch (error) {
  if (error instanceof NewsNotFoundError) {
    console.error('News not found:', error.message);
  } else if (error instanceof CategoryNotFoundError) {
    console.error('Category not found:', error.message);
  } else if (error instanceof NewsNotInCategoryError) {
    console.error('News not in category:', error.message);
  } else {
    console.error('Unexpected error:', error.message);
  }
}
*/
