import { db } from "@/lib/db/db";
import { categories, media } from "@/lib/db/schema";
import { categorySchema } from "@/constant/zod-schema";
import { apiResponse } from "@/constant/apiRes";
import { eq, sql } from "drizzle-orm";

export async function POST(req: Request) {
  console.log("[Category POST] Received request");
  try {
    const body = await req.json();
    console.log("[Category POST] Request body:", body);

    const parsed = categorySchema.safeParse(body);
    if (!parsed.success) {
      console.error(
        "[Category POST] Validation failed:",
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
    console.log("[Category POST] Validated data:", data);

    // Step 1: Insert/find media
    let imageId: number | null = null;
    if (data.image?.filePath) {
      console.log("[Category POST] Processing image:", data.image);
      const existingMedia = await db.query.media.findFirst({
        where: eq(media.filePath, data.image.filePath),
      });

      if (existingMedia) {
        console.log("[Category POST] Found existing media:", existingMedia);
        imageId = existingMedia.id;
      } else {
        console.log("[Category POST] Creating new media entry");
        const newMedia = await db
          .insert(media)
          .values({
            filePath: data.image.filePath,
            title: data.image.title,
            slug: data.image.slug,
            caption: data.image.caption,
          })
          .returning({ id: media.id });

        imageId = newMedia[0]?.id ?? null;
        console.log("[Category POST] Created new media with ID:", imageId);
      }
    }

    // Step 2: Ensure slug uniqueness
    console.log("[Category POST] Checking slug uniqueness:", data.slug);
    const slugExists = await db.query.categories.findFirst({
      where: eq(categories.slug, data.slug),
    });

    if (slugExists) {
      console.log("[Category POST] Slug already exists:", data.slug);
      return apiResponse(null, 409, false, "Slug already exists");
    }
    // Step 2.1: Check if parentCategoryId is not the same as the category being created
    if (data.parentCategoryId) {
      const parentCategory = await db.query.categories.findFirst({
        where: eq(categories.id, data.parentCategoryId),
      });

      if (!parentCategory) {
        console.log(
          "[Category POST] Parent category not found:",
          data.parentCategoryId
        );
        return apiResponse(null, 404, false, "Parent category not found");
      }
    }
    // Step 3: Insert category
    console.log("[Category POST] Creating new category");
    const result = await db
      .insert(categories)
      .values({
        name: data.name,
        slug: data.slug,
        description: data.description,
        status: data.status,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        keywords: data.keywords,
        image: data.image,
        parentCategoryId: data.parentCategoryId ?? null,
        createdAt: new Date(),
      })
      .returning();

    console.log("[Category POST] Category created successfully:", result[0]);
    return apiResponse(result[0], 201, true, "Category created");
  } catch (error) {
    console.error("[Category POST] Error:", error);
    return apiResponse(
      null,
      500,
      false,
      error instanceof Error ? error.message : "Internal error"
    );
  }
}
export async function GET(req: Request) {
  console.log("[Category GET] Received request");
  try {
    // Get pagination parameters from URL
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const offset = (page - 1) * limit;

    // Get total count of categories
    const totalCount = await db
      .select({ count: sql`count(*)` })
      .from(categories);

    // First, get all parent categories to ensure we have the complete hierarchy
    const parentCategories = await db
      .select({
        id: categories.id,
        name: categories.name,
        slug: categories.slug,
        status: categories.status,
        // metaTitle: categories.metaTitle,
        // metaDescription: categories.metaDescription,
        // keywords: categories.keywords,
        parentCategoryId: categories.parentCategoryId,
        // image: {
        //   id: media.id,
        //   filePath: media.filePath,
        //   title: media.title,
        //   type: media.type,
        // },
      })
      .from(categories);
    // .leftJoin(media, eq(media.id, categories.image));
    // .where(eq(categories.parentCategoryId, null));

    // Then get the paginated child categories
    const childCategories = await db
      .select({
        id: categories.id,
        name: categories.name,
        slug: categories.slug,
        status: categories.status,
        metaTitle: categories.metaTitle,
        metaDescription: categories.metaDescription,
        keywords: categories.keywords,
        parentCategoryId: categories.parentCategoryId,
        image: {
          id: media.id,
          filePath: media.filePath,
          title: media.title,
          type: media.type,
        },
      })
      .from(categories)
      .leftJoin(media, eq(media.id, categories.image))
      .where(sql`${categories.parentCategoryId} IS NOT NULL`)
      .limit(limit)
      .offset(offset);

    // Create a map for quick lookup
    const categoryMap = new Map();
    const rootCategories = [] as any;

    // First pass: Create map of all categories
    [...parentCategories, ...childCategories].forEach((category) => {
      categoryMap.set(category.id, {
        ...category,
        subcategories: [],
      });
    });

    // Second pass: Build hierarchy
    [...parentCategories, ...childCategories].forEach((category) => {
      const categoryWithSubs = categoryMap.get(category.id);
      if (category.parentCategoryId) {
        // This is a subcategory
        const parent = categoryMap.get(category.parentCategoryId);
        if (parent) {
          parent.subcategories.push(categoryWithSubs);
        }
      } else {
        // This is a root category
        rootCategories.push(categoryWithSubs);
      }
    });

    const total = Number(totalCount[0]?.count || 0);
    const totalPages = Math.ceil(total / limit);

    const response = {
      categories: rootCategories,
      pagination: {
        total,
        totalPages,
        currentPage: page,
        limit,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };

    return apiResponse(response, 200, true, "Categories fetched successfully");
  } catch (error) {
    console.error("[Category GET] Error:", error);
    return apiResponse(
      null,
      500,
      false,
      error instanceof Error ? error.message : "Internal error"
    );
  }
}
