import {
  validateCategoryPathWithNews
} from "@/app/actions/client-actions/news";
import CategoryPage from "@/components/client-components/category-page";
import { db } from "@/lib/db/db";
import { categories } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{
    dynamic_one: string;
    dynamic_two: string;
    pagination: string;
  }>;
}): Promise<Metadata> {
  const { dynamic_one, dynamic_two, pagination } = await params;

  const metaData = await db
    .select({
      title: categories.metaTitle,
      des: categories.metaDescription,
      keyword: categories.keywords,
    })
    .from(categories)
    .where(eq(categories.slug, dynamic_two))
    .limit(1);

  const data = metaData[0];
  console.log(metaData, "data");
  return {
    title: data?.title || "",
    description: data?.des || "",
    keywords: data?.keyword || "",

    // Canonical URL
    alternates: {
      canonical: `https://boltontoday.co.uk/${dynamic_one}/${dynamic_two}/page/${pagination}`,
    },

    // // Robots meta (camelCase keys)
    // robots: {
    //   index: true,
    //   follow: true,
    //   "max-snippet": -1,
    //   "max-video-preview": -1,
    //   "max-image-preview": "large",
    // },
    robots: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-video-preview": -1,
      "max-image-preview": "large",
    },
  };
}
const DynamicOneWithPagination = async ({
  params,
  searchParams,
}: {
  params: Promise<{
    dynamic_one: string;
    dynamic_two: string;
    pagination: string;
  }>;
  searchParams: Promise<{ page: number }>;
}) => {
  const { dynamic_one, dynamic_two, pagination } = await params;

  if (pagination === "1") {
    permanentRedirect(`/${dynamic_one}/${dynamic_two}`);
  }
  const data = (await validateCategoryPathWithNews({
    slugParts: [dynamic_one, dynamic_two],
    limit: 20,
    page: Number(pagination),
  })) as any;

  console.log(data, "data");
  if (!data.valid || data?.newsList?.length === 0) return notFound();
  return (
    <CategoryPage
      category={data?.categoryChain[1]}
      newsList={data?.newsList}
      totalCount={Number(data.totalCount)}
      slug={`${dynamic_one}/${dynamic_two}`}
      currentPage={Number(data?.currentPage)}
      limit={data?.limit}
    />
  );
};

export default DynamicOneWithPagination;
