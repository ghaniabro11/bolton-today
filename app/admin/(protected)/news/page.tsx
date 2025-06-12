import { Metadata } from "next";
import PageHeader from "@/components/page-header";
import NewsTable from "./components/news-table";
import { db } from "@/lib/db/db";
import { news, media } from "@/lib/db/schema";
import { sql, like, or, desc, eq } from "drizzle-orm";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
export const dynamic = "force-dynamic";

export const generateMetadata = async (): Promise<Metadata> => {
  return {
    title: "News Management",
    description: "View and manage all news articles in the system.",
    robots: "noindex, nofollow",
  };
};

const NewsPage = async ({
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
      like(news.title, `%${search}%`),
      like(news.slug, `%${search}%`)
    );
  }

  const countResult = await db
    .select({ count: sql`count(*)` })
    .from(news)
    .where(whereClause);

  const count = Number(countResult[0]?.count ?? 0);
  console.log(count, "count");
  const newsData = await db
    .select({
      id: news.id,
      title: news.title,
      slug: news.slug,
      description: news.description,
      publishStatus: news.publishStatus,
      publishDate: news.publishDate,
      // featureImage: media.filePath,
      image: {
        filePath: media.filePath,
        title: media.title,
      },
    })
    .from(news)
    // .innerJoin(media, eq(media.id, news.featureImage))
    .leftJoin(media, eq(media.id, news.featureImage))
    .where(whereClause)
    .orderBy(desc(news.publishDate), desc(news.id))
    .limit(limit)
    .offset(offset);
  // console.log(newsData, "news");
  return (
    <>
      <PageHeader
        heading="News Management"
        description="View and manage all news articles in the system."
      />
      <NewsTable
        news={newsData as any}
        currentPage={page}
        totalItems={count}
        limit={limit}
        searchValue={search}
      />
    </>
  );
};

export default NewsPage;
