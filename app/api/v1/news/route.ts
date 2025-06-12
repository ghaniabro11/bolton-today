import { db } from "@/lib/db/db";
import { media, news, newsCategories } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

// GET /api/v1/news - Get all news
export async function GET() {
  try {
    const allArticles = await db.select().from(news);
    return NextResponse.json(allArticles);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch news: ${error}` },
      { status: 500 }
    );
  }
}

// POST /api/v1/news - Create a new article
export async function POST(request: Request) {
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

    // Validate required fields
    if (!title || !slug) {
      return NextResponse.json(
        { error: "Title and slug are required" },
        { status: 400 }
      );
    }
    // Validate authorId
    if (!authorId) {
      return NextResponse.json(
        { error: "Please select at least one author" },
        { status: 400 }
      );
    }

    // Validate categories
    if (!categories || categories.length === 0) {
      return NextResponse.json(
        { error: "At least one category is required" },
        { status: 400 }
      );
    }

    // Check for unique slug
    const existingArticle = await db
      .select()
      .from(news)
      .where(eq(news.slug, slug));

    if (existingArticle.length > 0) {
      return NextResponse.json(
        { error: "Slug already exists" },
        { status: 409 }
      );
    }

    // Create new article
    const newArticle = await db
      .insert(news)
      .values({
        title,
        slug,
        description,
        details,
        authorId,
        publishStatus: publishStatus || "active",
        featureImage,
        publishDate: publishDate ? new Date(publishDate) : new Date(),
        activeStatus: activeStatus || "active",
        metaTitle,
        metaDescription,
        keywords,
      })
      .returning();

    // Handle categories if provided
    if (categories && categories.length > 0) {
      await db.insert(newsCategories).values(
        categories.map((category: { id: string; slug: string }) => ({
          newsId: newArticle[0].id,
          categoryId: parseInt(category.id, 10), // Convert string to number
          newsSlug: newArticle[0].slug,
          categorySlug: category.slug,
        }))
      );
    }

    return NextResponse.json(newArticle[0], { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
