import CategoryTable from "@/app/admin/(protected)/category/components/category-table";
import PageHeader from "@/components/page-header";
import { db } from "@/lib/db/db";
import { categories, media } from "@/lib/db/schema";
import { desc, eq, like, or, sql } from "drizzle-orm";
import { Metadata } from "next";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

// Custom metadata: title and noindex/nofollow
export const generateMetadata = async (): Promise<Metadata> => {
  return {
    title: "Category Management",
    description: "View and manage all categories in the system.",
    robots: "noindex, nofollow",
  };
};

const CategoryPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ page?: number; limit?: number; search?: string }>;
}) => {
  const params = await searchParams;
  const page = parseInt(String(params?.page || DEFAULT_PAGE), 10);
  const limit = parseInt(String(params?.limit || DEFAULT_LIMIT), 10);
  const search = params?.search?.trim() || "";
  const offset = (page - 1) * limit;

  let whereClause = undefined;

  if (search) {
    whereClause = or(
      like(categories.name, `%${search}%`),
      like(categories.slug, `%${search}%`)
    );
  }

  const countResult = await db
    .select({ count: sql`count(*)` })
    .from(categories)
    .where(whereClause);

  const count = Number(countResult[0]?.count ?? 0);
  const categoryData = await db
    .select({
      id: categories.id,
      name: categories.name,
      slug: categories.slug,
      // description: categories.description,
      status: categories.status,
      metaTitle: categories.metaTitle,
      metaDescription: categories.metaDescription,
      keywords: categories.keywords,
      parentCategoryId: categories.parentCategoryId,
      image: {
        filePath: media.filePath,
        title: media.title,
      },
    })
    .from(categories)
    .where(whereClause)
    .leftJoin(media, eq(media.id, categories.image))
    .orderBy(desc(categories.createdAt), desc(categories.id))
    .limit(limit)
    .offset(offset);
  console.log(categoryData, "categoryData");
  return (
    <>
      <PageHeader
        heading="Category Management"
        description="View and manage all categories in the system."
      />
      <CategoryTable
        users={categoryData as any}
        currentPage={page}
        totalItems={count}
        limit={limit}
        searchValue={search}
      />
    </>
  );
};

export default CategoryPage;
