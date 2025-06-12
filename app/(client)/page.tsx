import dynamic from "next/dynamic";

import PageGridWrapper from "@/components/client-components/grid-wrapper";
import { ImageWithFallback } from "@/components/client-components/image-fallback";
import Loader from "@/components/client-components/Loader";
import { Typography } from "@/components/client-components/typography";
import { db } from "@/lib/db/db";
import { categories, media, news, newsCategories } from "@/lib/db/schema";
import { and, desc, eq, sql } from "drizzle-orm";
import Link from "next/link";
import { Suspense } from "react";
import fetchNewsData from "../actions/client-actions/home";

// Optional: Create a simple loading component
const Loading = () => <Loader />;

const ComponentOne = dynamic(
  () => import("@/components/client-components/news-components-for-home/one"),
  {
    ssr: true,
    loading: () => <Loading />,
  }
);

const ComponentTwo = dynamic(
  () => import("@/components/client-components/news-components-for-home/two"),
  {
    ssr: true,
    loading: () => <Loading />,
  }
);

const ComponentThree = dynamic(
  () => import("@/components/client-components/news-components-for-home/three"),
  {
    ssr: true,
    loading: () => <Loading />,
  }
);

const ComponentFour = dynamic(
  () => import("@/components/client-components/news-components-for-home/four"),
  {
    ssr: true,
    loading: () => <Loading />,
  }
);

const ComponentFive = dynamic(
  () => import("@/components/client-components/news-components-for-home/five"),
  {
    ssr: true,
    loading: () => <Loading />,
  }
);

const ComponentSix = dynamic(
  () => import("@/components/client-components/news-components-for-home/six"),
  {
    ssr: true,
    loading: () => <Loading />,
  }
);

const ComponentSeven = dynamic(
  () => import("@/components/client-components/news-components-for-home/seven"),
  {
    ssr: true,
    loading: () => <Loading />,
  }
);

const ComponentEight = dynamic(
  () => import("@/components/client-components/news-components-for-home/eight"),
  {
    ssr: true,
    loading: () => <Loading />,
  }
);

const ComponentNine = dynamic(
  () => import("@/components/client-components/news-components-for-home/nine"),
  {
    ssr: true,
    loading: () => <Loading />,
  }
);

const ComponentTen = dynamic(
  () => import("@/components/client-components/news-components-for-home/ten"),
  {
    ssr: true,
    loading: () => <Loading />,
  }
);

const ComponentEleven = dynamic(
  () =>
    import("@/components/client-components/news-components-for-home/eleven"),
  {
    ssr: true,
    loading: () => <Loading />,
  }
);

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ s: string }>;
}) {
  const searchQuery = (await searchParams).s;
  return {
    title: "Bolton Today | Latest News from Capitol Hill",
    description:
      "Discover latest news from Capitol Hill with in-depth analysis and recent developments that shape US politics.",
    keywords: ["news", "latest updates", "breaking news", "international news"],
    alternates: {
      ...(!searchQuery && {
        canonical: "https://boltontoday.co.uk/",
      }),
    },
    robots: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-video-preview": -1,
      "max-image-preview": "large",
    },

    openGraph: {
      title: "Bolton Today | Latest News from Capitol Hill",
      description:
        "Discover latest news from Capitol Hill with in-depth analysis and recent developments that shape US politics.",
      url: !searchQuery ? "https://boltontoday.co.uk/" : undefined,
      images: [
        {
          url: `https://boltontoday.co.uk/Washington-Insider-Magazine-black-logo.webp`, // Replace with your image URL
          width: 1200,
          height: 630,
          alt: "Bolton Today | Latest News from Capitol Hill",
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
  console.log(newsData, "newsData");
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
        <h1 className=" text-xs text-transparent absolute">
          {" "}
          Washington Insider Magazine
        </h1>
        <ComponentOne
          latest={newsData?.latest ?? null}
          opinionCategory={newsData?.opinionCategory ?? null}
        />
        <div className="h-1.5 w-full bg-gray-500 mt-12" />
        <ComponentTwo
          lightHouseCat={newsData?.lightHouseCat ?? []}
          latest={newsData?.latest ?? []}
        />
        <div className="h-1.5 w-full bg-gray-500 mt-12" />
        <ComponentThree donalTrumpCat={newsData?.donalTrumpCat ?? []} />
        <div className="h-1.5 w-full bg-gray-500 mt-12" />
        <ComponentFour
          capitolHillPoliticsCat={newsData?.capitolHillPoliticsCat ?? []}
        />
        <div className="h-1.5 w-full bg-gray-500 mt-12" />
        <ComponentFive diplomacyCat={newsData?.diplomacyCat ?? []} />
        <div className="h-1.5 w-full bg-gray-500 mt-12" />
        <ComponentSix securityCat={newsData?.securityCat ?? []} />
        <div className="h-1.5 w-full bg-gray-500 mt-12" />
        <ComponentSeven usNationWideCat={newsData?.usNationWideCat ?? []} />
        <div className="h-1.5 w-full bg-gray-500 mt-12" />
        <ComponentEight
          businessFinanceCat={newsData?.businessFinanceCat ?? []}
        />
        <div className="h-1.5 w-full bg-gray-500 mt-12" />
        <ComponentNine floridaCat={newsData?.floridaCat ?? []} />
        <div className="h-1.5 w-full bg-gray-500 mt-12" />
        <ComponentTen europeCat={newsData?.europeCat ?? []} />
        <div className="h-1.5 w-full bg-gray-500 mt-12" />
        <ComponentEleven middleEastCat={newsData?.middleEastCat ?? []} />
      </>
    );
  }

  // const searchResults = await db
  //   .select({
  //     title: news.title,
  //     description: news.description,
  //     featureImage: {
  //       filePath: media.filePath,
  //       title: media.title,
  //       caption: media.caption,
  //     },
  //   })
  //   .from(news)
  //   .innerJoin(media, eq(news.featureImage, media.id))
  //   .where(
  //     and(
  //       sql`${news.searchVector} @@ plainto_tsquery('english', ${searchQuery})`,
  //       sql`${news.publishStatus} = 'active'`,
  //       sql`${news.activeStatus} = 'active'`
  //     )
  //   );
  const result = await db
    .select({
      title: news.title,
      slug: news.slug,
      description: news.description,
      categoryName: categories.name,
      categorySlug: categories.slug,
      featureImage: {
        filePath: media.filePath,
        title: media.title,
        caption: media.caption,
      },
    })
    .from(news)
    .innerJoin(newsCategories, eq(news.id, newsCategories.newsId))
    .innerJoin(categories, eq(newsCategories.categoryId, categories.id))
    .innerJoin(media, eq(news.featureImage, media.id))

    .where(
      and(
        sql`news.search_vector @@ plainto_tsquery('english', ${searchQuery})`,
        eq(news.activeStatus, "active") // <-- ✅ status check
      )
    )
    .orderBy(desc(news.publishDate));
  // .limit(20); // optional pagination
  console.log(result, "result");
  return (
    <Suspense fallback={<Loader />}>
      <PageGridWrapper>
        <div className="bg-black  p-5 mb-5 text-white">
          {result.length} Search Result For:
          <Typography variant="h2" className="font-semibold">
            {searchQuery}
          </Typography>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <Suspense fallback={<Loader />}>
            {result.length === 0 ? (
              <p className="uppercase">No news found.</p>
            ) : (
              result.map((newsItem: any) => (
                <div
                  key={newsItem.slug}
                  className="flex flex-col md:flex-row border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  {/* Image */}
                  <div className="relative w-full md:w-1/3 h-60 md:h-auto">
                    <ImageWithFallback
                      src={newsItem?.featureImage?.filePath ?? ""}
                      alt={newsItem?.featureImage?.title}
                      className="object-cover"
                      layout="fill"
                      priority
                    />
                  </div>

                  {/* Content */}
                  <div className="p-5 flex flex-col justify-between w-full md:w-2/3">
                    <div>
                      <p className="text-sm text-gray-500 mb-2">
                        <Link
                          href={`/${newsItem?.categorySlug}`}
                          className="underline hover:text-blue-600"
                        >
                          {newsItem?.categoryName}
                        </Link>
                      </p>
                      <Link
                        href={`/${newsItem?.categorySlug}/${newsItem.slug}`.replace(
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
