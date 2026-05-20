import { db } from "@/lib/db/db";
import { politicians, media } from "@/lib/db/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
export const dynamic = "force-dynamic";

// GET /api/v1/politician/[id] - Get a single politician
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string}> }
) {
  const { id } = await params;
  try {
    const politician = await db
      .select()
      .from(politicians)
      .where(eq(politicians.id, Number(id)))
      .limit(1);

    if (!politician.length) {
      return NextResponse.json({ error: "Politician not found" }, { status: 404 });
    }

    return NextResponse.json(politician[0]);
  } catch (error) {
    console.error("GET /politician/[id] error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// PUT /api/v1/politician/[id] - Update an politician
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string}> }
) {
  const { id } = await params;

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

    // Check if politician exists
    const existingPolitician = await db
      .select()
      .from(politicians)
      .where(eq(politicians.id, Number(id)))
      .limit(1);

    if (!existingPolitician.length) {
      return NextResponse.json({ error: "Politician not found" }, { status: 404 });
    }

    // Check for slug uniqueness if slug is being updated
    if (slug && slug !== existingPolitician[0].slug) {
      const slugExists = await db
        .select()
        .from(politicians)
        .where(eq(politicians.slug, slug));

      if (slugExists.length > 0) {
        return NextResponse.json(
          { error: "Slug already exists" },
          { status: 409 }
        );
      }
    }

    // Step 1: Handle image (insert/find)
    let imageId: number | null = null;
    if (image?.filePath) {
      const existingMedia = await db.query.media.findFirst({
        where: eq(media.filePath, image.filePath),
      });

      if (existingMedia) {
        imageId = existingMedia.id;
      } else {
        const newMedia = await db
          .insert(media)
          .values({
            filePath: image.filePath,
            title: image.title,
            slug: image.slug,
            caption: image.caption,
          })
          .returning({ id: media.id });

        imageId = newMedia[0]?.id ?? null;
      }
    }

    // Update politician
    const updatedPolitician = await db
      .update(politicians)
      .set({
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
      })
      .where(eq(politicians.id, Number(id)))
      .returning();

    return NextResponse.json(updatedPolitician[0]);
  } catch (error) {
    console.error("PUT /politician/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update politician" },
      { status: 500 }
    );
  }
}

// DELETE /api/v1/politician/[id] - Delete an politician
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string}> }
) {
  try {
    const { id } = await params;
    // Check if politician exists
    const existingPolitician = await db
      .select()
      .from(politicians)
      .where(eq(politicians.id, Number(id)))
      .limit(1);

    if (!existingPolitician.length) {
      return NextResponse.json({ error: "Politician not found" }, { status: 404 });
    }

    // Delete politician
    await db.delete(politicians).where(eq(politicians.id, Number(id)));

    return NextResponse.json(
      { message: "Politician deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE /politician/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete politician" },
      { status: 500 }
    );
  }
}
