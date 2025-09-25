import { db } from "@/lib/db/db";
import { authors, media } from "@/lib/db/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
export const dynamic = "force-dynamic";

// GET /api/v1/author/[id] - Get a single author
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string}> }
) {
  const { id } = await params;
  try {
    const author = await db
      .select()
      .from(authors)
      .where(eq(authors.id, Number(id)))
      .limit(1);

    if (!author.length) {
      return NextResponse.json({ error: "Author not found" }, { status: 404 });
    }

    return NextResponse.json(author[0]);
  } catch (error) {
    console.error("GET /author/[id] error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// PUT /api/v1/author/[id] - Update an author
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

    // Check if author exists
    const existingAuthor = await db
      .select()
      .from(authors)
      .where(eq(authors.id, Number(id)))
      .limit(1);

    if (!existingAuthor.length) {
      return NextResponse.json({ error: "Author not found" }, { status: 404 });
    }

    // Check for slug uniqueness if slug is being updated
    if (slug && slug !== existingAuthor[0].slug) {
      const slugExists = await db
        .select()
        .from(authors)
        .where(eq(authors.slug, slug));

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

    // Update author
    const updatedAuthor = await db
      .update(authors)
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
      .where(eq(authors.id, Number(id)))
      .returning();

    return NextResponse.json(updatedAuthor[0]);
  } catch (error) {
    console.error("PUT /author/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update author" },
      { status: 500 }
    );
  }
}

// DELETE /api/v1/author/[id] - Delete an author
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string}> }
) {
  try {
    const { id } = await params;
    // Check if author exists
    const existingAuthor = await db
      .select()
      .from(authors)
      .where(eq(authors.id, Number(id)))
      .limit(1);

    if (!existingAuthor.length) {
      return NextResponse.json({ error: "Author not found" }, { status: 404 });
    }

    // Delete author
    await db.delete(authors).where(eq(authors.id, Number(id)));

    return NextResponse.json(
      { message: "Author deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE /author/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete author" },
      { status: 500 }
    );
  }
}
