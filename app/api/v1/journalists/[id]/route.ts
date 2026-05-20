import { db } from "@/lib/db/db";
import { journalists, media } from "@/lib/db/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
export const dynamic = "force-dynamic";

// GET /api/v1/journalist/[id] - Get a single journalist
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string}> }
) {
  const { id } = await params;
  try {
    const journalist = await db
      .select()
      .from(journalists)
      .where(eq(journalists.id, Number(id)))
      .limit(1);

    if (!journalist.length) {
      return NextResponse.json({ error: "Journalist not found" }, { status: 404 });
    }

    return NextResponse.json(journalist[0]);
  } catch (error) {
    console.error("GET /journalist/[id] error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// PUT /api/v1/journalist/[id] - Update an journalist
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

    // Check if journalist exists
    const existingJournalist = await db
      .select()
      .from(journalists)
      .where(eq(journalists.id, Number(id)))
      .limit(1);

    if (!existingJournalist.length) {
      return NextResponse.json({ error: "Journalist not found" }, { status: 404 });
    }

    // Check for slug uniqueness if slug is being updated
    if (slug && slug !== existingJournalist[0].slug) {
      const slugExists = await db
        .select()
        .from(journalists)
        .where(eq(journalists.slug, slug));

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

    // Update journalist
    const updatedJournalist = await db
      .update(journalists)
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
      .where(eq(journalists.id, Number(id)))
      .returning();

    return NextResponse.json(updatedJournalist[0]);
  } catch (error) {
    console.error("PUT /journalist/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update journalist" },
      { status: 500 }
    );
  }
}

// DELETE /api/v1/journalist/[id] - Delete an journalist
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string}> }
) {
  try {
    const { id } = await params;
    // Check if journalist exists
    const existingJournalist = await db
      .select()
      .from(journalists)
      .where(eq(journalists.id, Number(id)))
      .limit(1);

    if (!existingJournalist.length) {
      return NextResponse.json({ error: "Journalist not found" }, { status: 404 });
    }

    // Delete journalist
    await db.delete(journalists).where(eq(journalists.id, Number(id)));

    return NextResponse.json(
      { message: "Journalist deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE /journalist/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete journalist" },
      { status: 500 }
    );
  }
}
