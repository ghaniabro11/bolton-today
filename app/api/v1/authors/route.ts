import { db } from "@/lib/db/db";
import { authors, media } from "@/lib/db/schema";
import { NextResponse } from "next/server";
import { eq, sql } from "drizzle-orm";
export const dynamic = "force-dynamic";

// GET /api/v1/author - Get all authors
export async function GET() {
  try {
    const allAuthors = await db.select().from(authors);
    return NextResponse.json(allAuthors);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch authors: ${error}` },
      { status: 500 }
    );
  }
}

// POST /api/v1/author - Create a new author
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      slug,
      position,
      publishStatus,
      description,
      facebookLink,
      instagramLink,
      twitterLink,
      muckrackLink,
      personalPortfolio,
      linkedin,
      image,
      metaTitle,
      metaDescription,
      keywords,
    } = body;

    // Validate required fields
    if (!name || !slug) {
      return NextResponse.json(
        { error: "Name and slug are required" },
        { status: 400 }
      );
    }

    // Check for unique slug
    const existingAuthor = await db
      .select()
      .from(authors)
      .where(eq(authors.slug, slug));

    if (existingAuthor.length > 0) {
      return NextResponse.json(
        { error: "Slug already exists" },
        { status: 409 }
      );
    }
    // ✅ Fix sequence before insert (only once after manual seeding)
    await db.execute(
      sql`SELECT setval(pg_get_serial_sequence('authors', 'id'), (SELECT MAX(id) FROM authors))`
    );

    // Create new author
    const newAuthor = await db
      .insert(authors)
      .values({
        name,
        slug,
        position,
        publishStatus: publishStatus || "inactive",
        description,
        facebookLink,
        instagramLink,
        twitterLink,
        muckrackLink,
        personalPortfolio,
        linkedin,
        image,
        metaTitle,
        metaDescription,
        keywords,
      })
      .returning();

    return NextResponse.json(newAuthor[0], { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create author" },
      { status: 500 }
    );
  }
}
