import { db } from "@/lib/db/db";
import {
  authors,
  categories,
  media,
  news,
  newsCategories,
} from "@/lib/db/schema";
import { and, desc, eq } from "drizzle-orm";
export const dynamic = "force-dynamic";

export async function getCategoryById(id: number) {
  if (!id || typeof id !== "number") {
    return null;
  }

  const category = await db
    .select({
      id: categories.id,
      name: categories.name,
      slug: categories.slug,
      description: categories.description,
      status: categories.status,
      metaTitle: categories.metaTitle,
      metaDescription: categories.metaDescription,
      keywords: categories.keywords,
      parentCategoryId: categories.parentCategoryId,
      image: {
        id: media.id,
        title: media.title,
        type: media.type,
        filePath: media.filePath,
      },
    })
    .from(categories)
    .leftJoin(media, eq(media.id, categories.image))
    .where(eq(categories.id, id));

  return category[0] || null;
}
export async function getCategories() {
  const categries = await db
    .select({
      id: categories.id,
      name: categories.name,
      slug: categories.slug,
    })
    .from(categories);
  return categries || [];
}

export async function getNewsByCategorySlug(slug: string) {
  // 1. Find category by slug
  const category = await db.query.categories.findFirst({
    where: eq(categories.slug, slug),
  });

  if (!category) {
    throw new Error("Category not found"); // Handle 404 in SSR function
  }

  // 2. Fetch news linked to the category via news_categories join table
  const newsList = await db
    .select({
      id: news.id,
      title: news.title,
      slug: news.slug,
      description: news.description,
      publishDate: news.publishDate,
      featureImage: news.featureImage,
      authorName: authors.name,
    })
    .from(news)
    .innerJoin(newsCategories, eq(news.id, newsCategories.newsId))
    .innerJoin(authors, eq(news.authorId, authors.id))
    .where(
      and(
        eq(newsCategories.categoryId, category.id),
        eq(news.publishStatus, "active"),
        eq(news.activeStatus, "active")
      )
    )
    .orderBy(desc(news.publishDate));

  return { category, newsList };
}
