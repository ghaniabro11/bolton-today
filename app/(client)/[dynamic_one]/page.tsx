import { getNewsByCategorySlug } from "@/app/actions/client-actions/category";
import PageGridWrapper from "@/components/client-components/grid-wrapper";
import Loader from "@/components/client-components/Loader";
import NewsCard from "@/components/client-components/news-card";
import { Typography } from "@/components/client-components/typography";
import { ClientPagination } from "@/components/reuse-client-pagination";
import { db } from "@/lib/db/db";
import { categories } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { Metadata } from "next";
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
      canonical: `https://boltontoday.co.uk/${dynamic_one}/`,
    },

  
    robots: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-video-preview": -1,
      "max-image-preview": "large",
    },
  };
}
const DynamicOne = async ({
  params,
  searchParams,
}: {
  params: Promise<{ dynamic_one: string }>;
  searchParams: Promise<{ page: number }>;
}) => {
  const { dynamic_one } = await params;

  const page = (await searchParams).page ?? 1;
  const { category, newsList, totalCount } = await getNewsByCategorySlug(
    dynamic_one,
    page
  );
  console.log(newsList, "newsList");
  return (
    <>
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: `https://boltontoday.co.uk/`,
            },
            {
              "@type": "ListItem",
              position: 2,
              name: category.name,
              item: `https://boltontoday.co.uk/${dynamic_one}/`,
            },
          ],
        })}
      </script>
      <PageGridWrapper>
        <main>
          <div className="bg-black p-5 text-white">
            <Typography variant="h1" className="font-semibold">
              {category.name}
            </Typography>
          </div>

          <section>
            <Suspense fallback={<Loader />}>
              {newsList?.length === 0 ? (
                <p>No news found in this category.</p>
              ) : (
                newsList?.map((newsItem) => (
                  <NewsCard
                    key={newsItem?.id}
                    category={category}
                    date={newsItem?.publishDate}
                    description={newsItem?.description}
                    imageUrl={newsItem?.featureImage}
                    title={newsItem?.title}
                    newsSlug={newsItem?.slug}
                    authorName={newsItem?.authorName}
                    authorSlug={newsItem?.authorSlug}
                  />
                ))
              )}
            </Suspense>
            <ClientPagination
              currentPage={1}
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
      </PageGridWrapper>{" "}
    </>
  );
};

export default DynamicOne;
