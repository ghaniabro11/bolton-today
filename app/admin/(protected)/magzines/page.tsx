import PageHeader from "@/components/page-header";
import { db } from "@/lib/db/db";
import { magzines, media } from "@/lib/db/schema";
import { desc, eq, like, or, sql } from "drizzle-orm";
import { Metadata } from "next";
import MagzineTable from "./components/magzines-table";
import { alias } from "drizzle-orm/pg-core";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

// Custom metadata: title and noindex/nofollow
export const generateMetadata = async (): Promise<Metadata> => {
  return {
    title: "Magazines Management",
    description: "View and manage all categories in the system.",
    robots: "noindex, nofollow",
  };
};

const MagzinesPage = async ({
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
      like(magzines.title, `%${search}%`),
      like(magzines.slug, `%${search}%`)
    );
  }

  const countResult = await db
    .select({ count: sql`count(*)` })
    .from(magzines)
    .where(whereClause);

  const count = Number(countResult[0]?.count ?? 0);
  const coverImageAlias = alias(media, "coverImage");
  const pdfFileAlias = alias(media, "pdfFile");

  const magzinesData = await db
    .select({
      id: magzines.id,
      title: magzines.title,
      slug: magzines.slug,
      description: magzines.description,
      status: magzines.status,
      metaTitle: magzines.metaTitle,
      metaDescription: magzines.metaDescription,
      keywords: magzines.keywords,
      coverImage: {
        filePath: coverImageAlias.filePath,
      },
      pdfFile: {
        filePath: pdfFileAlias.filePath,
      },
    })
    .from(magzines)
    .leftJoin(coverImageAlias, eq(coverImageAlias.id, magzines.coverImage))
    .leftJoin(pdfFileAlias, eq(pdfFileAlias.id, magzines.pdfFile))
    .where(whereClause)
    .orderBy(desc(magzines.createdAt))
    .limit(limit)
    .offset(offset);
  console.log(magzinesData, "user dara");
  return (
    <>
      <PageHeader
        heading="Magazine Management"
        description="View and manage all magazines in the system."
      />
      <MagzineTable
        users={magzinesData as any}
        currentPage={page}
        totalItems={count}
        limit={limit}
        searchValue={search}
      />
    </>
  );
};

export default MagzinesPage;
