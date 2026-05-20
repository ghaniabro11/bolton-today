// app/(protected)/contributors/page.tsx
import { Metadata } from "next";
import PageHeader from "@/components/page-header";
import ContributorTable from "./components/auth-table";
import { db } from "@/lib/db/db";
import { contributors, media } from "@/lib/db/schema";
import { sql, like, or, desc, eq } from "drizzle-orm";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

export const generateMetadata = async (): Promise<Metadata> => {
  return {
    title: "Contributor Management",
    description: "View and manage all contributors in the system.",
    robots: "noindex, nofollow",
  };
};
export const dynamic = "force-dynamic";

const ContributorsPage = async ({
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
      like(contributors?.name, `%${search}%`),
      like(contributors?.slug, `%${search}%`)
    );
  }

  const countResult = await db
    .select({ count: sql`count(*)` })
    .from(contributors)
    .where(whereClause);

  const count = Number(countResult[0]?.count ?? 0);

  const contributorData = await db
    .select({
      id: contributors?.id,
      name: contributors?.name,
      slug: contributors?.slug,
      position: contributors?.position,
      publishStatus: contributors?.publishStatus,
      image: { filePath: media?.filePath, title: media?.title },
    })
    .from(contributors)
    .leftJoin(media, eq(media.id, contributors?.image))
    .where(whereClause)
    .orderBy(desc(contributors?.id))
    .limit(limit)
    .offset(offset);
  console.log(contributorData);
  return (
    <>
      <PageHeader
        heading="Contributor Management"
        description="View and manage all contributors in the system."
      />
      <ContributorTable
        contributors={contributorData as any}
        currentPage={page}
        totalItems={count}
        limit={limit}
        searchValue={search}
      />
    </>
  );
};

export default ContributorsPage;
