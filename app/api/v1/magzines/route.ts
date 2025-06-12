import { db } from "@/lib/db/db";
import { magzines } from "@/lib/db/schema"; // your magzines table schema
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";

// Validation schema for input using Zod
const magazineSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(255)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must be URL-friendly (lowercase, numbers, hyphens)"
    ),
  description: z.string().optional(),
  coverImage: z.number().optional(),
  pdfFile: z.number().optional(),
  status: z.enum(["active", "inactive"]).optional(),
  metaTitle: z.string().max(255).optional(),
  metaDescription: z.string().max(500).optional(),
  keywords: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const data = magazineSchema.parse(body);
    // Check if magazine with the same slug already exists
    const existingMagazine = await db
      .select()
      .from(magzines)
      .where(eq(magzines.slug, data.slug))
      .limit(1);

    if (existingMagazine.length > 0) {
      return NextResponse.json(
        { error: `Magazine with slug "${data.slug}" already exists.` },
        { status: 409 } // Conflict
      );
    }

    // Insert into DB
    const inserted = await db
      .insert(magzines)
      .values({
        title: data.title,
        slug: data.slug,
        description: data.description ?? null,
        coverImage: data.coverImage ?? null,
        pdfFile: data.pdfFile ?? null,
        status: data.status ?? "inactive",
        metaTitle: data.metaTitle ?? null,
        metaDescription: data.metaDescription ?? null,
        keywords: data.keywords ?? null,
      })
      .returning();

    return NextResponse.json(
      { message: "Magazine created", data: inserted[0] },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ errors: error.errors });
    }
    console.error(error);
    NextResponse.json(
      { error: `Internal Server Error : ${error}` },
      { status: 500 }
    );
  }
}
