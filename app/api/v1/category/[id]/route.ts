import { apiResponse } from "@/constant/apiRes";
import { updateCategorySchema } from "@/constant/zod-schema";
import { db } from "@/lib/db/db";
import { categories } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function PUT(req: Request) {
  console.log("[PUT] Category update request received");
  try {
    const body = await req.json();
    console.log("[PUT] Request body:", body);

    const parsed = updateCategorySchema.safeParse(body);
    if (!parsed.success) {
      console.log(
        "[PUT] Validation failed:",
        parsed.error.flatten().fieldErrors
      );
      return apiResponse(
        parsed.error.flatten().fieldErrors,
        400,
        false,
        "Validation failed"
      );
    }

    const data = parsed.data;
    console.log("[PUT] Validated data:", data);

    // Step 2: Check slug conflict (ignore current ID)
    console.log("[PUT] Checking for slug conflict:", data.slug);
    const existingCategory = await db.query.categories.findFirst({
      where: eq(categories.slug, data.slug as string),
    });

    if (existingCategory && existingCategory.id !== data.id) {
      console.log("[PUT] Slug conflict detected:", existingCategory);
      return apiResponse(
        null,
        409,
        false,
        "Slug already exists for another category"
      );
    }
    // Add check for self-referential parent category
    if (data.parentCategoryId && data.parentCategoryId === data.id) {
      console.log("[PUT] Self-referential parent category detected");
      return apiResponse(
        null,
        400,
        false,
        "A category cannot be its own parent"
      );
    }

    // Check if parent category exists
    if (data.parentCategoryId) {
      const parentCategory = await db.query.categories.findFirst({
        where: eq(categories.id, data.parentCategoryId),
      });

      if (!parentCategory) {
        console.log("[PUT] Parent category not found:", data.parentCategoryId);
        return apiResponse(null, 404, false, "Parent category not found");
      }
    }
    // if (!data?.image) {
    //   console.log("[PUT] Image conflict detected:", data?.image);
    //   return apiResponse(null, 404, false, "Please Select Image");
    // }

    // Step 3: Update category
    console.log("[PUT] Updating category with ID:", data.id);
    const result = await db
      .update(categories)
      .set({
        name: data.name,
        slug: data.slug,
        description: data.description,
        status: data.status,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        keywords: data.keywords,
        image: data?.image ?? null,
        parentCategoryId: data.parentCategoryId ?? null,
      })
      .where(eq(categories.id, data.id as number))
      .returning();

    if (!result.length) {
      console.log("[PUT] Category not found with ID:", data.id);
      return apiResponse(null, 404, false, "Category not found");
    }

    console.log("[PUT] Category successfully updated:", result[0]);
    return apiResponse(result[0], 200, true, "Category updated");
  } catch (error) {
    console.error("[PUT] Error updating category:", error);
    return apiResponse(
      null,
      500,
      false,
      error instanceof Error ? error.message : "Internal error"
    );
  }
}
export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: number }> }
) {
  try {
    const { id } = await params;

    // Optional: Check if category exists before deleting
    const category = await db.query.categories.findFirst({
      where: eq(categories.id, id),
    });

    if (!category) {
      return apiResponse(null, 404, false, "Category not found");
    }

    // Perform delete
    await db.delete(categories).where(eq(categories.id, id));

    return apiResponse(null, 200, true, "Category deleted");
  } catch (error) {
    return apiResponse(
      null,
      500,
      false,
      error instanceof Error ? error.message : "Internal error"
    );
  }
}
