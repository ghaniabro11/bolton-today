// app/(protected)/authors/page.tsx
import { Metadata } from "next";
import PageHeader from "@/components/page-header";
import AuthorTable from "./components/auth-table";
import { db } from "@/lib/db/db";
import { authors, media } from "@/lib/db/schema";
import { sql, like, or, desc, eq } from "drizzle-orm";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

export const generateMetadata = async (): Promise<Metadata> => {
  return {
    title: "Author Management",
    description: "View and manage all authors in the system.",
    robots: "noindex, nofollow",
  };
};
export const dynamic = "force-dynamic";

const AuthorsPage = async ({
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
      like(authors?.name, `%${search}%`),
      like(authors?.slug, `%${search}%`)
    );
  }

  const countResult = await db
    .select({ count: sql`count(*)` })
    .from(authors)
    .where(whereClause);

  const count = Number(countResult[0]?.count ?? 0);

  const authorData = await db
    .select({
      id: authors?.id,
      name: authors?.name,
      slug: authors?.slug,
      position: authors?.position,
      publishStatus: authors?.publishStatus,
      image: { filePath: media?.filePath, title: media?.title },
    })
    .from(authors)
    .leftJoin(media, eq(media.id, authors?.image))
    .where(whereClause)
    .orderBy(desc(authors?.id))
    .limit(limit)
    .offset(offset);
  console.log(authorData);
  return (
    <>
      <PageHeader
        heading="Author Management"
        description="View and manage all authors in the system."
      />
      <AuthorTable
        authors={authorData as any}
        currentPage={page}
        totalItems={count}
        limit={limit}
        searchValue={search}
      />
    </>
  );
};

export default AuthorsPage;
