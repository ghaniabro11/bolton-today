import { Metadata } from "next";
import PageHeader from "@/components/page-header";
import UserTable from "@/app/admin/(protected)/user/components/user-table";
import { db } from "@/lib/db/db";
import { users } from "@/lib/db/schema";
import { sql, like, or, desc } from "drizzle-orm";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

// Custom metadata: title and noindex/nofollow
export const generateMetadata = async (): Promise<Metadata> => {
  return {
    title: "User Management",
    description: "View and manage all users in the system.",
    robots: "noindex, nofollow",
  };
};

const Home = async ({
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
      like(users.fullname, `%${search}%`),
      like(users.email, `%${search}%`)
    );
  }

  const countResult = await db
    .select({ count: sql`count(*)` })
    .from(users)
    .where(whereClause);

  const count = Number(countResult[0]?.count ?? 0);

  const userData = await db
    .select()
    .from(users)
    .where(whereClause)
    .orderBy(desc(users.id))

    .limit(limit)
    .offset(offset);
  // console.log(userData,"user dara")
  return (
    <>
      <PageHeader
        heading="User Management"
        description="View and manage all users in the system."
      />
      <UserTable
        users={userData as any}
        currentPage={page}
        totalItems={count}
        limit={limit}
        searchValue={search}
      />
    </>
  );
};

export default Home;
