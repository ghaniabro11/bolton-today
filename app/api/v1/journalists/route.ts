import { db } from "@/lib/db/db";
import { journalists, media } from "@/lib/db/schema";
import { NextResponse } from "next/server";
import { eq, sql } from "drizzle-orm";
export const dynamic = "force-dynamic";

// GET /api/v1/journalist - Get all journalists
export async function GET() {
  try {
    const allJournalists = await db.select().from(journalists);
    return NextResponse.json(allJournalists);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch journalists: ${error}` },
      { status: 500 }
    );
  }
}

// POST /api/v1/journalist - Create a new journalist
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
    const existingJournalist = await db
      .select()
      .from(journalists)
      .where(eq(journalists.slug, slug));

    if (existingJournalist.length > 0) {
      return NextResponse.json(
        { error: "Slug already exists" },
        { status: 409 }
      );
    }
    // Fix sequence before insert (only once after manual seeding)
    await db.execute(
      sql`SELECT setval(pg_get_serial_sequence('journalists', 'id'), (SELECT MAX(id) FROM journalists))`
    );

    // Create new journalist
    const newJournalist = await db
      .insert(journalists)
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

    return NextResponse.json(newJournalist[0], { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create journalist" },
      { status: 500 }
    );
  }
}
