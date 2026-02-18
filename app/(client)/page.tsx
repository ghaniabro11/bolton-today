import dynamic from "next/dynamic";

import PageGridWrapper from "@/components/client-components/grid-wrapper";
import { ImageWithFallback } from "@/components/client-components/image-fallback";
import Loader from "@/components/client-components/Loader";
import OceanCityCarousel from "@/components/client-components/news-components-for-home/dynamic-carousal";
import { SectionSkeletonFive, SectionSkeletonOne } from "@/components/client-components/section-skeleton";
import { Typography } from "@/components/client-components/typography";
import { DOMAIN_URL, NEWS_PUBLICATION_NAME } from "@/constant/apiUrl";
import { db } from "@/lib/db/db";
import { categories, media, news, newsCategories } from "@/lib/db/schema";
import { and, desc, eq, sql } from "drizzle-orm";
import Link from "next/link";
import { Suspense } from "react";
import fetchNewsData from "../actions/client-actions/home";

const ComponentOne = dynamic(
  () => import("@/components/client-components/news-components-for-home/one"),
  {
    ssr: true,
    loading: () => <SectionSkeletonOne />,
  }
);

const ComponentFive = dynamic(
  () => import("@/components/client-components/news-components-for-home/five"),
  {
    ssr: true,
    loading: () => <SectionSkeletonFive />,
  }
);

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ s: string }>;
}) {
  const searchQuery = (await searchParams).s;
  return {
    title: "Bolton Today News | Latest News from Bolton",
    description:
      "Get the latest Bolton news, including local updates, events, politics, sports, crime, and inspiring stories from communities across the town.",
    keywords: ["news", "latest updates", "breaking news", "international news"],
    alternates: {
      ...(!searchQuery && {
        canonical: "https://boltontoday.co.uk",
      }),
    },
    robots: {
      index: !searchQuery ? true : false,
      follow: !searchQuery ? true : false,
      "max-snippet": -1,
      "max-video-preview": -1,
      "max-image-preview": "large",
    },

    openGraph: {
      title: "Bolton Today News | Latest News from Bolton",
      description:
        "Get the latest Bolton news, including local updates, events, politics, sports, crime, and inspiring stories from communities across the town.",
      url: !searchQuery ? "https://boltontoday.co.uk" : undefined,
      images: [
        {
          url: `https://boltontoday.co.uk/bolton_logo.svg`, // Replace with your image URL
          width: 1200,
          height: 630,
          alt: "Bolton Today News | Latest News from Bolton",
        },
      ],
    },
  };
}

const Home = async ({
  searchParams,
}: {
  searchParams: Promise<{ s: string }>;
}) => {
  const newsData = await fetchNewsData(db);
  // const newsData = posts;
  const searchQuery = (await searchParams).s;
  if (!searchQuery) {
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
                item: "https://boltontoday.co.uk/",
              },
            ],
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "@id": `${DOMAIN_URL}/#collectionpage`,
            "name": NEWS_PUBLICATION_NAME,
            "description": "Get the latest Bolton news, including local updates, events, politics, sports, crime, and inspiring stories from communities across the town.",
            "url": `${DOMAIN_URL}`,
            "isPartOf": {
              "@type": "WebSite",
              "@id": `${DOMAIN_URL}/#website`
            },
            "publisher": {
              "@type": "Organization",
              "name": NEWS_PUBLICATION_NAME,
              "url": `${DOMAIN_URL}/`,
              "logo": {
                "@type": "ImageObject",
                "url": `${DOMAIN_URL}/bolton_logo.svg`
              }
            },
            "mainEntity": {
              "@type": "ItemList",
              "itemListOrder": "https://schema.org/ItemListOrderDescending",
              "numberOfItems": 10,
              "itemListElement": newsData?.latest?.map((item: any, index: number) => (
                {
                  "@type": "ListItem",
                  "position": index + 1,
                  "url": `${DOMAIN_URL}/${item?.categoryslug}/${item?.slug}`
                }
              ))
            }
          })}
        </script>
        <>
          <h1 className="sr-on  ly">{NEWS_PUBLICATION_NAME}</h1>
          <ComponentOne
            latest={newsData?.latest ?? null}
            opinionCategory={newsData?.categoryOne ?? null}
          />

          <OceanCityCarousel
            data={newsData?.categoryOne ?? []}
          ></OceanCityCarousel>
          <ComponentFive
            diplomacyCat={newsData?.categoryTwo ?? []}
            priorityImage
          />

          <OceanCityCarousel
            data={newsData?.categoryThree ?? []}
          ></OceanCityCarousel>
          <ComponentFive diplomacyCat={newsData?.categoryFour ?? []} />

          <OceanCityCarousel
            data={newsData?.categoryFive ?? []}
          ></OceanCityCarousel>
          <ComponentFive diplomacyCat={newsData?.categorySix ?? []} />

          <OceanCityCarousel
            data={newsData?.categorySeven ?? []}
          ></OceanCityCarousel>
          <ComponentFive diplomacyCat={newsData?.categoryEight ?? []} />

          <OceanCityCarousel
            data={newsData?.categoryNine ?? []}
          ></OceanCityCarousel>

          <ComponentFive diplomacyCat={newsData?.categoryTen ?? []} />
          <OceanCityCarousel
            data={newsData?.categoryEleven ?? []}
          ></OceanCityCarousel>

          <ComponentFive diplomacyCat={newsData?.categoryTwelve ?? []} />

          <OceanCityCarousel
            data={newsData?.categoryThirteen ?? []}
          ></OceanCityCarousel>

          <ComponentFive diplomacyCat={newsData?.categoryFourteen ?? []} />

          <OceanCityCarousel
            data={newsData?.categoryEleven ?? []}
          ></OceanCityCarousel>

          {/* <ComponentFive diplomacyCat={newsData?.categoryFourteen ?? []} /> */}
        </>

        {/* <ComponentFive diplomacyCat={newsData?.categoryTwo ?? []} /> */}
        {/* <Line/> */}
      </>
    );
  }
  // Replace the Drizzle query builder query with raw SQL to include category chain
  const searchQuerySql = sql`
  WITH RECURSIVE category_path AS (
    SELECT 
      c.id,
      c.slug,
      c.parent_category_id,
      c.slug::TEXT AS full_slug
    FROM categories c
    WHERE c.parent_category_id IS NULL

    UNION ALL

    SELECT 
      child.id,
      child.slug,
      child.parent_category_id,
      (parent.full_slug || '/' || child.slug) AS full_slug
    FROM categories child
    INNER JOIN category_path parent ON child.parent_category_id = parent.id
  )

  SELECT 
    n.title,
    n.slug,
    n.description,
    c.name AS "categoryName",
    c.slug AS "categorySlug",
    cp.full_slug AS "categoryChainSlug",
    m.file_path AS "featureImage.filePath",
    m.title AS "featureImage.title",
    m.caption AS "featureImage.caption"
  FROM news n
  INNER JOIN news_categories nc ON n.id = nc.news_id
  INNER JOIN categories c ON nc.category_id = c.id
  LEFT JOIN category_path cp ON c.id = cp.id
  INNER JOIN media m ON n.feature_image = m.id
  WHERE n.search_vector @@ plainto_tsquery('english', ${searchQuery})
    AND n.active_status = 'active'
  ORDER BY n.publish_date DESC
  `;

  const resultRows = await db.execute(searchQuerySql);
  const result = resultRows.rows.map((row: any) => ({
    ...row,
    featureImage: {
      filePath: row["featureImage.filePath"],
      title: row["featureImage.title"],
      caption: row["featureImage.caption"],
    },
  }));
  return (
    <Suspense fallback={<Loader />}>
      <PageGridWrapper>
        <div className="bg-head  p-5 mb-5">
          <span className=" text-btn">{result.length} Search Result For:</span>
          <Typography variant="h2" className="font-semibold text-white">
            {searchQuery}
          </Typography>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <Suspense fallback={<Loader />}>
            {result.length === 0 ? (
              <p className="uppercase">No news found.</p>
            ) : (
              result.map((newsItem: any, index: number) => (
                <div
                  key={index}
                  className="flex flex-col md:flex-row border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  {/* Image */}
                  <div className="relative w-full md:w-1/3 h-60 md:h-auto">
                    <ImageWithFallback
                      src={newsItem?.featureImage?.filePath ?? ""}
                      alt={newsItem?.featureImage?.title ?? ""}
                      className="object-cover"
                      layout="fill"
                      sizes="(min-width: 768px) 33vw, 100vw"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-5 flex flex-col justify-between w-full md:w-2/3">
                    <div>
                      <p className="text-sm text-gray-500 mb-2">
                        <Link
                          href={`/${newsItem?.categoryChainSlug}`}
                          className="underline hover:text-blue-600"
                        >
                          {newsItem?.categoryName}
                        </Link>
                      </p>
                      <Link
                        href={`/${newsItem?.categoryChainSlug}/${newsItem.slug}`.replace(
                          /\/\/+/g,
                          "/"
                        )}
                      >
                        <Typography
                          variant="h2"
                          className="text-xl font-semibold mb-2 hover:underline"
                        >
                          {newsItem.title}
                        </Typography>
                      </Link>
                      <p className="text-gray-600 text-sm line-clamp-3">
                        {newsItem.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </Suspense>
        </div>
      </PageGridWrapper>
    </Suspense>
  );
};

export default Home;
