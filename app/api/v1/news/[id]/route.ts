import { db } from "@/lib/db/db";
import {
  authors,
  categories,
  media,
  news,
  newsCategories,
} from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

// GET /api/v1/news/[id] - Get a single article
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string}> }
) {
  const { id } = await params;
  try {
    // Get article with author and feature image details
    const article = await db
      .select({
        id: news.id,
        title: news.title,
        slug: news.slug,
        description: news.description,
        details: news.details,
        publishStatus: news.publishStatus,
        publishDate: news.publishDate,
        activeStatus: news.activeStatus,
        metaTitle: news.metaTitle,
        metaDescription: news.metaDescription,
        keywords: news.keywords,
        author: {
          id: authors.id,
          name: authors.name,
          slug: authors.slug,
          position: authors.position,
          image: {
            filePath: media.filePath,
            title: media.title,
          } as any,
        },
        featureImage: {
          id: media.id,
          filePath: media.filePath,
          title: media.title,
          caption: media.caption,
        },
      })
      .from(news)
      .leftJoin(authors, eq(authors.id, news.authorId))
      .leftJoin(media, eq(media.id, news.featureImage))
      .leftJoin(media as any, eq(media.id, authors.image)) // Add this line
      .where(eq(news.id, Number(id)));

    if (!article.length) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    // Get categories for the article
    const articleCategoriesList = await db
      .select({
        categoryId: newsCategories.categoryId,
        category: {
          id: categories.id,
          name: categories.name,
          slug: categories.slug,
        },
      })
      .from(newsCategories)
      .leftJoin(categories, eq(categories.id, newsCategories.categoryId))
      .where(eq(newsCategories.newsId, Number(id)));

    const articleWithCategories = {
      ...article[0],
      categories: articleCategoriesList,
    };

    return NextResponse.json(articleWithCategories);
  } catch (error) {
    console.error("GET /news/[id] error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
// PUT /api/v1/news/[id] - Update an article
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string}> }
) {
  const { id } = await params;

  try {
    const body = await request.json();
    const {
      title,
      slug,
      description,
      details,
      categories,
      authorId,
      publishStatus,
      featureImage,
      publishDate,
      activeStatus,
      metaTitle,
      metaDescription,
      keywords,
    } = body;

    // Check if article exists
    const existingArticle = await db
      .select()
      .from(news)
      .where(eq(news.id, Number(id)))
      .limit(1);

    if (!existingArticle.length) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    // Check for slug uniqueness if slug is being updated
    if (slug && slug !== existingArticle[0].slug) {
      const slugExists = await db
        .select()
        .from(news)
        .where(eq(news.slug, slug));

      if (slugExists.length > 0) {
        return NextResponse.json(
          { error: "Slug already exists" },
          { status: 409 }
        );
      }
    }

    // Handle feature image
    let featureImageId: number | null = null;
    if (featureImage?.filePath) {
      const existingMedia = await db.query.media.findFirst({
        where: eq(media.filePath, featureImage.filePath),
      });

      if (existingMedia) {
        featureImageId = existingMedia.id;
      } else {
        const newMedia = await db
          .insert(media)
          .values({
            filePath: featureImage.filePath,
            title: featureImage.title,
            slug: featureImage.slug,
            caption: featureImage.caption,
          })
          .returning({ id: media.id });

        featureImageId = newMedia[0]?.id ?? null;
      }
    }

    // Update article
    const updatedArticle = await db
      .update(news)
      .set({
        title,
        slug,
        description,
        details,
        authorId,
        publishStatus,
        featureImage,
        publishDate: publishDate ? new Date(publishDate) : new Date(),
        activeStatus,
        metaTitle,
        metaDescription,
        keywords,
        createdAt: new Date(),
      })
      .where(eq(news.id, Number(id)))
      .returning();
    console.log(categories, "categories");
    // Update categories if provided
    if (categories) {
      // Delete existing categories
      await db.delete(newsCategories).where(eq(newsCategories.newsId, Number(id)));

      // Insert new categories
      if (categories.length > 0) {
        await db.insert(newsCategories).values(
          categories.map((category: { id: string; slug: string }) => ({
            newsId: id,
            categoryId: category.id,
            newsSlug: slug,
            categorySlug: category.slug,
          }))
        );
      }
    }

    return NextResponse.json(updatedArticle[0]);
  } catch (error) {
    console.error("PUT /news/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update article" },
      { status: 500 }
    );
  }
}

// DELETE /api/v1/news/[id] - Delete an article
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string}> }
) {
  try {
    // Check if article exists
    const { id } = await params;
    const existingArticle = await db
      .select()
      .from(news)
      .where(eq(news.id, Number(id)))
      .limit(1);

    if (!existingArticle.length) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    // Start a transaction
    await db.transaction(async (tx) => {
      // Delete article categories first (due to foreign key constraint)
      await tx.delete(newsCategories).where(eq(newsCategories.newsId, Number(id)));

      // Delete article
      await tx.delete(news).where(eq(news.id, Number(id)));
    });

    return NextResponse.json(
      { message: "News deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE /news/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete news" },
      { status: 500 }
    );
  }
}
