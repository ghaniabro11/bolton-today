import { db } from "@/lib/db/db";
import {
  authors,
  categories,
  media,
  news,
  newsCategories,
} from "@/lib/db/schema";
import { and, desc, eq, isNull, sql } from "drizzle-orm";
import { notFound } from "next/navigation";
export const dynamic = "force-dynamic";

export async function getNewsByCategorySlug(
  slug: string,
  page: number = 1
): Promise<{ category: any; newsList: any[]; totalCount: number }> {
  const LIMIT = 20;
  // Find the category and ensure it's a top-level active category
  const category = await db.query.categories.findFirst({
    where: and(
      eq(categories.slug, slug),
      eq(categories.status, "active"),
      isNull(categories.parentCategoryId) // ❗ Make sure it's not a subcategory
    ),
    columns: {
      id: true,
      name: true,
      slug: true,
      description: true,
    },
  });

  if (!category) {
    notFound(); // ❗ Triggers Next.js 404 if category doesn't exist or is a subcategory
  }
  // Fetch total count for pagination
  const [{ count: totalCount }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(news)
    .innerJoin(newsCategories, eq(news.id, newsCategories.newsId))
    .where(
      and(
        eq(newsCategories.categoryId, category.id),
        eq(news.publishStatus, "active"),
        eq(news.activeStatus, "active")
      )
    );

  const offset = (page - 1) * LIMIT;

  const newsList = await db
    .select({
      id: news.id,
      title: news.title,
      slug: news.slug,
      description: news.description,
      publishDate: news.publishDate,
      featureImage: media.filePath,
      authorName: authors.name,
      authorSlug: authors.slug,
    })
    .from(news)
    .innerJoin(newsCategories, eq(news.id, newsCategories.newsId))
    .innerJoin(media, eq(media.id, news.featureImage))
    .innerJoin(authors, eq(news.authorId, authors.id))
    .where(
      and(
        eq(newsCategories.categoryId, category.id),
        eq(news.publishStatus, "active"),
        eq(news.activeStatus, "active")
      )
    )
    .orderBy(desc(news.publishDate))
    .limit(LIMIT)
    .offset(offset);
  return { category, newsList, totalCount };
}
