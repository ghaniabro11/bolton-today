import { db } from "@/lib/db/db";
import { contributors, media } from "@/lib/db/schema";
import { NextResponse } from "next/server";
import { eq, sql } from "drizzle-orm";
export const dynamic = "force-dynamic";

// GET /api/v1/contributor - Get all contributors
export async function GET() {
  try {
    const allContributors = await db.select().from(contributors);
    return NextResponse.json(allContributors);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch contributors: ${error}` },
      { status: 500 }
    );
  }
}

// POST /api/v1/contributor - Create a new contributor
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
    const existingContributor = await db
      .select()
      .from(contributors)
      .where(eq(contributors.slug, slug));

    if (existingContributor.length > 0) {
      return NextResponse.json(
        { error: "Slug already exists" },
        { status: 409 }
      );
    }
    // Fix sequence before insert (only once after manual seeding)
    await db.execute(
      sql`SELECT setval(pg_get_serial_sequence('contributors', 'id'), (SELECT MAX(id) FROM contributors))`
    );

    // Create new contributor
    const newContributor = await db
      .insert(contributors)
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

    return NextResponse.json(newContributor[0], { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create contributor" },
      { status: 500 }
    );
  }
}
