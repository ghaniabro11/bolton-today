import { db } from "@/lib/db/db"; // Your database instance
import {
  authors,
  categories,
  media,
  news,
  newsCategories,
} from "@/lib/db/schema"; // Your schema
import { eq, inArray, sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function validateNewsUrl(slugParts: string[]) {
  const logs = [];
  const slugLength = slugParts.length;

  if (slugLength < 2 || slugLength > 4) {
    return { valid: false, error: "Invalid URL structure." };
  }

  const newsSlug = slugParts[slugParts.length - 1];
  const categorySlugs = slugParts.slice(0, -1); // [category, subcategory, ...]

  // 1. Get news by slug
  const newsItem = await db
    .select({
      id: news.id,
      title: news.title,
      slug: news.slug,
      description: news.description,
      details: news.details,
      publishStatus: news.publishStatus,
      activeStatus: news.activeStatus,
      publishDate: news.publishDate,
      metaDescription: news.metaDescription,
      featureImage: media.filePath,
      featureImageTitle: media.title,
      featureImageCaption: media.caption,
      newsCreatedAt: news.createdAt,

      authorId: authors.id,
      authorName: authors.name,
      authorSlug: authors.slug,

      categoryId: categories.id,
      categoryName: categories.name,
      categorySlug: categories.slug,
      categoryDescription: categories.description,
    })
    .from(news)
    .leftJoin(media, eq(news.featureImage, media.id))
    .leftJoin(authors, eq(news.authorId, authors.id))
    .innerJoin(newsCategories, eq(news.id, newsCategories.newsId))
    .innerJoin(categories, eq(newsCategories.categoryId, categories.id))
    .where(eq(news.slug, newsSlug))
    .limit(1);

  if (!newsItem) {
    return { valid: false, error: "News not found." };
  }

  // 2. Get news-category links
  const newsCategoryLinks = await db.query.newsCategories.findMany({
    where: eq(newsCategories.newsId, newsItem[0]?.id),
  });
  const linkedCategoryIds = newsCategoryLinks.map((link) => link.categoryId);

  if (linkedCategoryIds?.length === 0) {
    return { valid: false, error: "News is not linked to any category." };
  }

  // 3. Fetch category chain from right to left
  const resolvedCategories: any[] = [];
  // let currentParentId: number | null = null;

  // for (let i = categorySlugs?.length - 1; i >= 0; i--) {
  //   const slug = categorySlugs[i];

  //   const category = await db.query.categories.findFirst({
  //     where: (cat, { eq, and }) =>
  //       and(
  //         eq(cat.slug, slug),
  //         currentParentId === null ? sql`true` : eq(cat.id, currentParentId)
  //       ),
  //   });

  //   if (!category) {
  //     return {
  //       valid: false,
  //       error: `Hierarchy mismatch at slug: "${slug}". It is not a valid parent.`,
  //     };
  //   }

  //   resolvedCategories.unshift(category); // Maintain correct order
  //   currentParentId = category.parentCategoryId;
  // }
  let expectedParentId: number | null = null;

  for (let i = 0; i < slugParts.length - 1; i++) {
    const slug = slugParts[i];

    const category = await db.query.categories.findFirst({
      where: (cat, { eq, and }) =>
        and(
          eq(cat.slug, slug),
          expectedParentId === null
            ? sql`true`
            : eq(cat.parentCategoryId, expectedParentId)
        ),
    });

    if (!category) {
      return {
        valid: false,
        error: `Category not found or incorrect parent-child relation at slug: "${slug}"`,
      };
    }

    // 💡 New strict check:
    if (i === 0 && category.parentCategoryId !== null) {
      return {
        valid: false,
        error: `Slug chain is incomplete. Missing parent for: "${slug}"`,
      };
    }

    resolvedCategories.push(category);
    expectedParentId = category.id;
  }
  // 4. Final category in chain should be directly linked with news
  const finalCategory = resolvedCategories[resolvedCategories.length - 1];
  const isLinked = linkedCategoryIds.includes(finalCategory.id);
  // 👇 Construct the full category path from the chain
  const fullCategorySlugPath = resolvedCategories
    .map((cat) => cat.slug)
    .join("/");

  if (!isLinked) {
    return {
      valid: false,
      error: "Final category in path is not linked to this news.",
    };
  }

  return {
    valid: true,
    news: newsItem,
    categoryChain: resolvedCategories,
    categoryName: finalCategory.name,
    categorySlug: finalCategory.slug,
    categoryUrl: fullCategorySlugPath, // e.g., "us/politics"
    completeUrl: `${fullCategorySlugPath}/${newsItem[0].slug}`, // e.g., "us/politics/biden-visits-nato"
  };
}

interface ValidateCategoryWithNewsOptions {
  slugParts: string[];
  page?: number;
  limit?: number;
}

export async function validateCategoryPathWithNews({
  slugParts,
  page = 1,
  limit = 20,
}: ValidateCategoryWithNewsOptions) {
  if (slugParts.length === 0 || slugParts.length > 3) {
    return { valid: false, error: "Invalid category path length." };
  }

  const resolvedCategories: any[] = [];
  let expectedParentId: number | null = null;

  for (let i = 0; i < slugParts.length; i++) {
    const slug = slugParts[i];

    const category = await db.query.categories.findFirst({
      where: (cat, { eq, and }) =>
        and(
          eq(cat.slug, slug),
          expectedParentId === null
            ? sql`true`
            : eq(cat.parentCategoryId, expectedParentId)
        ),
    });

    if (!category) {
      return {
        valid: false,
        error: `Category not found or incorrect parent-child relation at slug: "${slug}"`,
      };
    }

    // 💡 New strict check:
    if (i === 0 && category.parentCategoryId !== null) {
      return {
        valid: false,
        error: `Slug chain is incomplete. Missing parent for: "${slug}"`,
      };
    }

    resolvedCategories.push(category);
    expectedParentId = category.id;
  }

  const finalCategory = resolvedCategories[resolvedCategories.length - 1];

  // 1. Find news linked to final category
  const newsLinks = await db.query.newsCategories.findMany({
    where: eq(newsCategories.categoryId, finalCategory.id),
  });

  const newsIds = newsLinks.map((n) => n.newsId);
  if (newsIds.length === 0) {
    return {
      valid: true,
      categoryChain: resolvedCategories,
      newsList: [],
      totalCount: 0,
      currentPage: page,
      limit,
    };
  }

  // 2. Get total count
  const [{ count: totalCount }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(news)
    .where(inArray(news.id, newsIds));

  // 3. Get paginated news items
  const offset = (page - 1) * limit;

  const newsItems = await db
    .select({
      id: news.id,
      title: news.title,
      slug: news.slug,
      publishDate: news.publishDate,
      featureImage: media.filePath,
      authorName: authors.name,
      authorSlug: authors.slug,
    })
    .from(news)
    .leftJoin(authors, eq(news.authorId, authors.id))
    .leftJoin(media, eq(news.featureImage, media.id))
    .where(inArray(news.id, newsIds))
    .orderBy(sql`${news.publishDate} DESC`)
    .limit(limit)
    .offset(offset);

  // 4. Generate full slug path
  const prefix = resolvedCategories.map((c) => c.slug).join("/");
  const resultNews = newsItems.map((item) => ({
    ...item,
    completeSlug: `${prefix}/${item.slug}`,
  }));

  return {
    valid: true,
    categoryChain: resolvedCategories,
    newsList: resultNews,
    totalCount,
    currentPage: page,
    limit,
  };
}
