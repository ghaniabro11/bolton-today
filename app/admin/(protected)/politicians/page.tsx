// app/(protected)/politicians/page.tsx
import { Metadata } from "next";
import PageHeader from "@/components/page-header";
import PoliticianTable from "./components/auth-table";
import { db } from "@/lib/db/db";
import { politicians, media } from "@/lib/db/schema";
import { sql, like, or, desc, eq } from "drizzle-orm";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

export const generateMetadata = async (): Promise<Metadata> => {
  return {
    title: "Politician Management",
    description: "View and manage all politicians in the system.",
    robots: "noindex, nofollow",
  };
};
export const dynamic = "force-dynamic";

const PoliticiansPage = async ({
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
      like(politicians?.name, `%${search}%`),
      like(politicians?.slug, `%${search}%`)
    );
  }

  const countResult = await db
    .select({ count: sql`count(*)` })
    .from(politicians)
    .where(whereClause);

  const count = Number(countResult[0]?.count ?? 0);

  const politicianData = await db
    .select({
      id: politicians?.id,
      name: politicians?.name,
      slug: politicians?.slug,
      position: politicians?.position,
      publishStatus: politicians?.publishStatus,
      image: { filePath: media?.filePath, title: media?.title },
    })
    .from(politicians)
    .leftJoin(media, eq(media.id, politicians?.image))
    .where(whereClause)
    .orderBy(desc(politicians?.id))
    .limit(limit)
    .offset(offset);
  console.log(politicianData);
  return (
    <>
      <PageHeader
        heading="Politician Management"
        description="View and manage all politicians in the system."
      />
      <PoliticianTable
        politicians={politicianData as any}
        currentPage={page}
        totalItems={count}
        limit={limit}
        searchValue={search}
      />
    </>
  );
};

export default PoliticiansPage;
