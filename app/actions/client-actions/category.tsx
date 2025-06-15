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

export async function getNewsByParentAndChildSlug(
  categorySlug: string,
  childSlug: string,
  page: number = 1
): Promise<{ parent: any; child: any; newsList: any[]; totalCount: number }> {
  const LIMIT = 20;
  const offset = (page - 1) * LIMIT;

  // 1. Get parent category
  const parent = await db.query.categories.findFirst({
    where: and(
      eq(categories.slug, categorySlug),
      eq(categories.status, "active"),
      // Must be a top-level category
      isNull(categories.parentCategoryId)
    ),
    columns: {
      id: true,
      slug: true,
      name: true,
    },
  });

  if (!parent) return notFound();

  // 2. Get child category and validate it's a child of the above
  const child = await db.query.categories.findFirst({
    where: and(
      eq(categories.slug, childSlug),
      eq(categories.status, "active"),
      eq(categories.parentCategoryId, parent.id)
    ),
    columns: {
      id: true,
      slug: true,
      name: true,
    },
  });

  if (!child) return notFound();

  // 3. Count total news
  const [{ count: totalCount }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(news)
    .innerJoin(newsCategories, eq(news.id, newsCategories.newsId))
    .where(
      and(
        eq(newsCategories.categoryId, child.id),
        eq(news.publishStatus, "active"),
        eq(news.activeStatus, "active")
      )
    );

  // 4. Fetch news list
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
        eq(newsCategories.categoryId, child.id),
        eq(news.publishStatus, "active"),
        eq(news.activeStatus, "active")
      )
    )
    .orderBy(desc(news.publishDate))
    .limit(LIMIT)
    .offset(offset);

  return {
    parent,
    child,
    newsList,
    totalCount,
  };
}


export async function getNewsByCategoryHierarchy(
  categorySlug: string,
  childSlug: string,
  subchildSlug: string,
  page: number = 1
): Promise<{
  category: any;
  child: any;
  subchild: any;
  newsList: any[];
  totalCount: number;
}> {
  const LIMIT = 20;
  const offset = (page - 1) * LIMIT;

  // Step 1: Resolve subchild
  const subchild = await db.query.categories.findFirst({
    where: and(eq(categories.slug, subchildSlug), eq(categories.status, "active")),
    columns: {
      id: true,
      slug: true,
      name: true,
      parentCategoryId: true,
    },
  });
  if (!subchild || !subchild.parentCategoryId) notFound();

  // Step 2: Resolve child and ensure it's parent of subchild
  const child = await db.query.categories.findFirst({
    where: and(
      eq(categories.id, subchild.parentCategoryId),
      eq(categories.slug, childSlug),
      eq(categories.status, "active")
    ),
    columns: {
      id: true,
      slug: true,
      name: true,
      parentCategoryId: true,
    },
  });
  if (!child || !child.parentCategoryId) notFound();

  // Step 3: Resolve top-level category and ensure it's parent of child
  const category = await db.query.categories.findFirst({
    where: and(
      eq(categories.id, child.parentCategoryId),
      eq(categories.slug, categorySlug),
      eq(categories.status, "active"),
      isNull(categories.parentCategoryId)
    ),
    columns: {
      id: true,
      slug: true,
      name: true,
    },
  });
  if (!category) notFound();

  // Step 4: Count total news
  const [{ count: totalCount }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(news)
    .innerJoin(newsCategories, eq(news.id, newsCategories.newsId))
    .where(
      and(
        eq(newsCategories.categoryId, subchild.id),
        eq(news.publishStatus, "active"),
        eq(news.activeStatus, "active")
      )
    );

  // Step 5: Fetch paginated news
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
        eq(newsCategories.categoryId, subchild.id),
        eq(news.publishStatus, "active"),
        eq(news.activeStatus, "active")
      )
    )
    .orderBy(desc(news.publishDate))
    .limit(LIMIT)
    .offset(offset);

  return {
    category,
    child,
    subchild,
    newsList,
    totalCount,
  };
}