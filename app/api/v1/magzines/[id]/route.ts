import { db } from "@/lib/db/db";
import { magzines } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";

// Validation schema for update - same as create, but all optional except slug maybe
const magazineUpdateSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  slug: z
    .string()
    .min(1)
    .max(255)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .optional(),
  description: z.string().optional(),
  coverImage: z.number().optional(),
  pdfFile: z.number().optional(),
  status: z.enum(["active", "inactive"]).optional(),
  metaTitle: z.string().max(255).optional(),
  metaDescription: z.string().max(500).optional(),
  keywords: z.string().optional(),
});

// Update magazine by ID (or slug if you want)
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const data = magazineUpdateSchema.parse(body);

    // If slug is being updated, check if the new slug is already taken by another magazine
    if (data.slug) {
      const existingMagazine = await db
        .select()
        .from(magzines)
        .where(eq(magzines.slug, data.slug))
        .limit(1);

      if (
        existingMagazine.length > 0 &&
        existingMagazine[0].id !== Number(id)
      ) {
        return NextResponse.json(
          { error: `Magazine with slug "${data.slug}" already exists.` },
          { status: 409 }
        );
      }
    }

    // Update the magazine record
    const updated = await db
      .update(magzines)
      .set(data)
      .where(eq(magzines.id, Number(id)))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json(
        { error: "Magazine not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Magazine updated", data: updated[0] },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ errors: error.errors }, { status: 400 });
    }
    console.error(error);
    return NextResponse.json(
      { error: `Internal Server Error: ${error}` },
      { status: 500 }
    );
  }
}

// Delete magazine by ID
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Delete magazine
    const deleted = await db
      .delete(magzines)
      .where(eq(magzines.id, Number(id)))
      .returning();

    if (deleted.length === 0) {
      return NextResponse.json(
        { error: "Magazine not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Magazine deleted", data: deleted[0] },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: `Internal Server Error: ${error}` },
      { status: 500 }
    );
  }
}
