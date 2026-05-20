import { db } from "@/lib/db/db";
import { politicians, media } from "@/lib/db/schema";
import { NextResponse } from "next/server";
import { eq, sql } from "drizzle-orm";
export const dynamic = "force-dynamic";

// GET /api/v1/politician - Get all politicians
export async function GET() {
  try {
    const allPoliticians = await db.select().from(politicians);
    return NextResponse.json(allPoliticians);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch politicians: ${error}` },
      { status: 500 }
    );
  }
}

// POST /api/v1/politician - Create a new politician
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
    const existingPolitician = await db
      .select()
      .from(politicians)
      .where(eq(politicians.slug, slug));

    if (existingPolitician.length > 0) {
      return NextResponse.json(
        { error: "Slug already exists" },
        { status: 409 }
      );
    }
    // Fix sequence before insert (only once after manual seeding)
    await db.execute(
      sql`SELECT setval(pg_get_serial_sequence('politicians', 'id'), (SELECT MAX(id) FROM politicians))`
    );

    // Create new politician
    const newPolitician = await db
      .insert(politicians)
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

    return NextResponse.json(newPolitician[0], { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create politician" },
      { status: 500 }
    );
  }
}
