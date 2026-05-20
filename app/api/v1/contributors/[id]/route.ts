import { db } from "@/lib/db/db";
import { contributors, media } from "@/lib/db/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
export const dynamic = "force-dynamic";

// GET /api/v1/contributor/[id] - Get a single contributor
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string}> }
) {
  const { id } = await params;
  try {
    const contributor = await db
      .select()
      .from(contributors)
      .where(eq(contributors.id, Number(id)))
      .limit(1);

    if (!contributor.length) {
      return NextResponse.json({ error: "Contributor not found" }, { status: 404 });
    }

    return NextResponse.json(contributor[0]);
  } catch (error) {
    console.error("GET /contributor/[id] error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// PUT /api/v1/contributor/[id] - Update an contributor
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

    // Check if contributor exists
    const existingContributor = await db
      .select()
      .from(contributors)
      .where(eq(contributors.id, Number(id)))
      .limit(1);

    if (!existingContributor.length) {
      return NextResponse.json({ error: "Contributor not found" }, { status: 404 });
    }

    // Check for slug uniqueness if slug is being updated
    if (slug && slug !== existingContributor[0].slug) {
      const slugExists = await db
        .select()
        .from(contributors)
        .where(eq(contributors.slug, slug));

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

    // Update contributor
    const updatedContributor = await db
      .update(contributors)
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
      .where(eq(contributors.id, Number(id)))
      .returning();

    return NextResponse.json(updatedContributor[0]);
  } catch (error) {
    console.error("PUT /contributor/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update contributor" },
      { status: 500 }
    );
  }
}

// DELETE /api/v1/contributor/[id] - Delete an contributor
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string}> }
) {
  try {
    const { id } = await params;
    // Check if contributor exists
    const existingContributor = await db
      .select()
      .from(contributors)
      .where(eq(contributors.id, Number(id)))
      .limit(1);

    if (!existingContributor.length) {
      return NextResponse.json({ error: "Contributor not found" }, { status: 404 });
    }

    // Delete contributor
    await db.delete(contributors).where(eq(contributors.id, Number(id)));

    return NextResponse.json(
      { message: "Contributor deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE /contributor/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete contributor" },
      { status: 500 }
    );
  }
}
