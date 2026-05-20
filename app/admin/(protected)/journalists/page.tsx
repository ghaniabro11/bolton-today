// app/(protected)/journalists/page.tsx
import { Metadata } from "next";
import PageHeader from "@/components/page-header";
import JournalistTable from "./components/auth-table";
import { db } from "@/lib/db/db";
import { journalists, media } from "@/lib/db/schema";
import { sql, like, or, desc, eq } from "drizzle-orm";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

export const generateMetadata = async (): Promise<Metadata> => {
  return {
    title: "Journalist Management",
    description: "View and manage all journalists in the system.",
    robots: "noindex, nofollow",
  };
};
export const dynamic = "force-dynamic";

const JournalistsPage = async ({
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
      like(journalists?.name, `%${search}%`),
      like(journalists?.slug, `%${search}%`)
    );
  }

  const countResult = await db
    .select({ count: sql`count(*)` })
    .from(journalists)
    .where(whereClause);

  const count = Number(countResult[0]?.count ?? 0);

  const journalistData = await db
    .select({
      id: journalists?.id,
      name: journalists?.name,
      slug: journalists?.slug,
      position: journalists?.position,
      publishStatus: journalists?.publishStatus,
      image: { filePath: media?.filePath, title: media?.title },
    })
    .from(journalists)
    .leftJoin(media, eq(media.id, journalists?.image))
    .where(whereClause)
    .orderBy(desc(journalists?.id))
    .limit(limit)
    .offset(offset);
  console.log(journalistData);
  return (
    <>
      <PageHeader
        heading="Journalist Management"
        description="View and manage all journalists in the system."
      />
      <JournalistTable
        journalists={journalistData as any}
        currentPage={page}
        totalItems={count}
        limit={limit}
        searchValue={search}
      />
    </>
  );
};

export default JournalistsPage;
