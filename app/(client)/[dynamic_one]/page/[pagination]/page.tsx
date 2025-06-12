import { getNewsByCategorySlug } from "@/app/actions/client-actions/category";
import PageGridWrapper from "@/components/client-components/grid-wrapper";
import NewsCard from "@/components/client-components/news-card";
import { Typography } from "@/components/client-components/typography";
import { ClientPagination } from "@/components/reuse-client-pagination";
import { db } from "@/lib/db/db";
import { categories } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { Metadata } from "next";
import { permanentRedirect } from "next/navigation";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ dynamic_one: string }>;
}): Promise<Metadata> {
  const { dynamic_one } = await params;

  const metaData = await db
    .select({
      title: categories.metaTitle,
      des: categories.metaDescription,
      keyword: categories.keywords,
    })
    .from(categories)
    .where(eq(categories.slug, dynamic_one))
    .limit(1);

  const data = metaData[0];
  console.log(metaData, "data");
  return {
    title: data?.title || "",
    description: data?.des || "",
    keywords: data?.keyword || "",

    // Canonical URL
    alternates: {
      canonical: `https://boltontoday.co.uk/${dynamic_one}`,
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
  params: Promise<{ dynamic_one: string; pagination: string }>;
  searchParams: Promise<{ page: number }>;
}) => {
  const { dynamic_one, pagination } = await params;

  if (pagination === "1") {
    permanentRedirect(`/${dynamic_one}`);
  }
  const { category, newsList, totalCount } = await getNewsByCategorySlug(
    dynamic_one,
    Number(pagination)
  );
  console.log(newsList, "newsList");
  return (
    <PageGridWrapper>
      <main>
        <div className="bg-black p-5 text-white">
          <Typography variant="h1" className="font-semibold">
            {category.name}
          </Typography>
        </div>

        <section>
          <Suspense fallback={<>Please wait...</>}>
            {newsList.length === 0 ? (
              <p>No news found in this category.</p>
            ) : (
              newsList.map((newsItem) => (
                <NewsCard
                  key={newsItem.id}
                  category={category}
                  date={newsItem.publishDate.toString()}
                  description={newsItem.description}
                  imageUrl={newsItem.featureImage}
                  title={newsItem.title}
                  newsSlug={newsItem?.slug}
                  authorName={newsItem?.authorName}
                  authorSlug={newsItem?.authorSlug}
                />
              ))
            )}
          </Suspense>
          <ClientPagination
            currentPage={Number(pagination)}
            totalItems={totalCount}
            slug={dynamic_one}
            limit={20}
          />
          <div className="px-3">
            <h2 className="text-lg">About This Category</h2>
            <p
              dangerouslySetInnerHTML={{
                __html: category?.description ?? "N/A",
              }}
            ></p>
          </div>
        </section>
      </main>
    </PageGridWrapper>
  );
};

export default DynamicOneWithPagination;
