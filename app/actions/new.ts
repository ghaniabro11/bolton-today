import { db } from "@/lib/db/db";
import { news, media, newsCategories, categories } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
export const dynamic = "force-dynamic";

export async function getNewsById(id: number) {
  const article = await db
    .select({
      id: news.id,
      title: news.title,
      slug: news.slug,
      description: news.description,
      details: news.details,
      publishStatus: news.publishStatus,
      authorId: news.authorId,
      publishDate: news.publishDate,
      activeStatus: news.activeStatus,
      metaTitle: news.metaTitle,
      metaDescription: news.metaDescription,
      keywords: news.keywords,
      featureImage: {
        id: media.id,
        title: media.title,
        type: media.type,
        filePath: media.filePath,
      },
    })
    .from(news)
    .leftJoin(media, eq(media.id, news.featureImage))

    .where(eq(news.id, id));

  // Get categories for the article
  const articleCategories = await db
    .select({
      id: categories.id,
      name: categories.name,
      slug: categories.slug,
    })
    .from(newsCategories)
    .leftJoin(categories, eq(categories.id, newsCategories.categoryId))
    .where(eq(newsCategories.newsId, id));

  return article[0]
    ? {
        ...article[0],
        categories: articleCategories,
      }
    : null;
}
