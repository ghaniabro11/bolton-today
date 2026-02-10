import {
  validateCategoryPathWithNews,
  validateNewsUrl,
} from "@/app/actions/client-actions/news";
import CategoryPage from "@/components/client-components/category-page";
import NewDetailPage from "@/components/client-components/news-page";
import { DOMAIN_URL, NEWS_PUBLICATION_NAME, socialMediaLinks } from "@/constant/apiUrl";
import { db } from "@/lib/db/db";
import { categories, news } from "@/lib/db/schema";
import { stripHtml } from "@/lib/utils";
import { formatDate } from "@/utils/date";
import { eq } from "drizzle-orm";
import { Metadata } from "next";
import { notFound } from "next/navigation";
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{
    dynamic_one: string;
    dynamic_two: string;
    dynamic_three: string;
  }>;
}): Promise<Metadata> {
  const { dynamic_one, dynamic_two, dynamic_three } = await params;
  let metaData;
  metaData = await db
    .select({
      title: news.metaTitle,
      des: news.metaDescription,
      keyword: news.keywords,
    })
    .from(news)
    .where(eq(news.slug, dynamic_three))
    .limit(1);
  if (metaData?.length === 0) {
    metaData = await db
      .select({
        title: categories.metaTitle,
        des: categories.metaDescription,
        keyword: categories.keywords,
      })
      .from(categories)
      .where(eq(categories.slug, dynamic_three))
      .limit(1);
  }
  const data = metaData[0];

  return {
    title: data?.title || "",
    description: data?.des || "",
    keywords: data?.keyword || "",

    // Canonical URL
    alternates: {
      canonical: `https://boltontoday.co.uk/${dynamic_one}/${dynamic_two}/${dynamic_three}`,
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
const DynamicTwo = async ({
  params,
}: {
  params: Promise<{
    dynamic_one: string;
    dynamic_two: string;
    dynamic_three: string;
  }>;
}) => {
  const { dynamic_one, dynamic_two, dynamic_three } = await params;

  let newsDetails;
  let categoriesWithNews;
  newsDetails = (await validateNewsUrl([
    dynamic_one,
    dynamic_two,
    dynamic_three,
  ])) as any;

  if (!newsDetails.valid) {
    categoriesWithNews = (await validateCategoryPathWithNews({
      slugParts: [dynamic_one, dynamic_two, dynamic_three],
      limit: 20,
      page: 1,
    })) as any;
  }
  if (!categoriesWithNews?.valid && !newsDetails.valid) return notFound();


  return (
    <>
      {/* <script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5687793259503722"
        crossOrigin="anonymous"
      ></script> */}
      {newsDetails?.valid ? (
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
                  name: newsDetails?.categoryChain[0]?.name,
                  item: `https://boltontoday.co.uk/${newsDetails?.categoryChain[0]?.slug}`,
                },
                {
                  "@type": "ListItem",
                  position: 3,
                  name: newsDetails?.categoryChain[1]?.name,
                  item: `https://boltontoday.co.uk/${newsDetails?.categoryChain[0]?.slug}/${newsDetails?.categoryChain[1]?.slug}`,
                },
                {
                  "@type": "ListItem",
                  position: 4,
                  name: newsDetails?.news[0]?.title,
                  item: `https://boltontoday.co.uk/${newsDetails?.categoryChain[0]?.slug}/${newsDetails?.categoryChain[1]?.slug}/${newsDetails?.news[0]?.slug}`,
                },
              ],
            })}
          </script>
          {newsDetails?.include_body ? (

            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org/",
                  "@type": "newsDetails",
                  "@id": `${DOMAIN_URL}/${newsDetails.completeUrl}#newsDetails`,
                  url: `${DOMAIN_URL}/${newsDetails.completeUrl}`,
                  headline: newsDetails?.title,
                  mainEntityOfPage: `${DOMAIN_URL}/${newsDetails.completeUrl}`,
                  datePublished:
                    (newsDetails?.news[0]?.publishDate),
                  dateModified:
                    (newsDetails?.news[0]?.publishDate),
                  description: newsDetails?.metaDescription,
                  articleSection: newsDetails?.categoryName,
                  articleBody: stripHtml(newsDetails?.news[0]?.details),
                  keywords: newsDetails?.keywords,
                  name: newsDetails?.news[0]?.title,
                  thumbnailUrl: newsDetails?.featureImage,
                  wordCount: newsDetails?.news[0]?.details?.length,
                  timeRequired: `${newsDetails?.news[0]?.details?.length / 200} minutes`,
                  mainEntity: {
                    "@type": "WebPage",
                    "@id": `${DOMAIN_URL}/${newsDetails.completeUrl}`,
                  },
                  author: {
                    "@type": "Person",
                    name: newsDetails?.news[0]?.authorName,
                    description: newsDetails?.news[0]?.authorDescription,
                    url: `${DOMAIN_URL}/author/${newsDetails?.news[0]?.authorSlug}`,
                    sameAs: [
                      newsDetails?.news[0]?.facebookLink,
                      newsDetails?.news[0]?.twitterLink, // X is Twitter
                      newsDetails?.news[0]?.instagramLink,
                      newsDetails?.news[0]?.linkedin,
                      newsDetails?.news[0]?.personalPortfolio,
                      newsDetails?.news[0]?.muckrackLink,
                    ],
                    image: {
                      "@type": "ImageObject",
                      url: newsDetails?.news[0]?.authorImage,
                      height: 112,
                      width: 112,
                    },
                  },
                  editor: {
                    "@type": "Person",
                    name: newsDetails?.news[0]?.authorName,
                    description: newsDetails?.news[0]?.authorDescription,
                    url: `${DOMAIN_URL}/author/${newsDetails?.news[0]?.authorSlug}`,
                    sameAs: [
                      newsDetails?.news[0]?.facebookLink,
                      newsDetails?.news[0]?.twitterLink, // X is Twitter
                      newsDetails?.news[0]?.instagramLink,
                      newsDetails?.news[0]?.linkedin,
                      newsDetails?.news[0]?.personalPortfolio,
                      newsDetails?.news[0]?.muckrackLink,
                    ],
                    image: {
                      "@type": "ImageObject",
                      url: newsDetails?.news[0]?.authorImage,
                      height: 112,
                      width: 112,
                    },
                  },
                  publisher: {
                    "@type": "Organization",
                    name: NEWS_PUBLICATION_NAME,
                    url: DOMAIN_URL,
                    logo: {
                      "@type": "ImageObject",
                      url: `${DOMAIN_URL}/bolton_logo.svg`,
                      width: 160,
                      height: 50,
                    },
                  },
                  image: [
                    {
                      "@type": "ImageObject",
                      "@id": `${DOMAIN_URL}/${newsDetails.completeUrl}#primaryimage`,
                      url: newsDetails?.news[0]?.featureImage,
                      width: "1250",
                      height: "700",
                      caption: newsDetails?.news[0]?.featureImageCaption,
                    },
                  ],
                }),
              }}
            />
          ) : !newsDetails?.include_body ? (
            <script type="application/ld+json">
              {JSON.stringify({
                "@context": "https://schema.org",
                "@type": "NewsArticle",
                mainEntityOfPage: {
                  "@type": "WebPage",
                  "@id": `${DOMAIN_URL}/${newsDetails.completeUrl}`,
                },
                headline: newsDetails?.news[0]?.title,
                description: newsDetails?.metaDescription,
                image: {
                  "@type": "ImageObject",
                  url: newsDetails?.news[0]?.featureImage,
                  width: 1200,
                  height: 675,
                },
                datePublished:
                  (newsDetails?.news[0]?.publishDate),
                dateModified:
                  (newsDetails?.news[0]?.publishDate),
                author: {
                  "@type": "Person",
                  name: newsDetails?.news[0]?.authorName,
                  url: `${DOMAIN_URL}/author/${newsDetails?.news[0]?.authorSlug}`,
                },
                publisher: {
                  "@type": "NewsMediaOrganization",
                  name: NEWS_PUBLICATION_NAME,
                  logo: {
                    "@type": "ImageObject",
                    url: `${DOMAIN_URL}/bolton_logo.svg`,
                  },
                  sameAs: socialMediaLinks,
                },
                isAccessibleForFree: "True",
                hasPart: {
                  "@type": "WebPageElement",
                  isAccessibleForFree: "True",
                  cssSelector: ".entry-content",
                },
              })}
            </script>
          ) : null}

          <NewDetailPage
            data={{
              ...newsDetails?.news[0],
              categoryName: newsDetails.categoryName,
              categorySlug: newsDetails.categoryUrl,
            }}
          ></NewDetailPage>
        </>
      ) : (
        <>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
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
                    name: categoriesWithNews?.categoryChain[0]?.name,
                    item: `https://boltontoday.co.uk/${categoriesWithNews?.categoryChain[0]?.slug}`,
                  },
                  {
                    "@type": "ListItem",
                    position: 3,
                    name: categoriesWithNews?.categoryChain[1]?.name,
                    item: `https://boltontoday.co.uk/${categoriesWithNews?.categoryChain[0]?.slug}/${categoriesWithNews?.categoryChain[1]?.slug}`,
                  },
                  {
                    "@type": "ListItem",
                    position: 4,
                    name: categoriesWithNews?.categoryChain[2]?.name,
                    item: `https://boltontoday.co.uk/${categoriesWithNews?.categoryChain[0]?.slug}/${categoriesWithNews?.categoryChain[1]?.slug}/${categoriesWithNews?.categoryChain[2]?.slug}`,
                  },
                ],
              }),
            }}
          />
          <CategoryPage
            category={categoriesWithNews?.categoryChain[2]}
            newsList={categoriesWithNews?.newsList}
            totalCount={Number(categoriesWithNews.totalCount)}
            slug={`${dynamic_one}/${dynamic_two}/${dynamic_three}`}
            currentPage={Number(categoriesWithNews?.currentPage)}
            limit={categoriesWithNews?.limit}
          />
        </>
      )}
    </>
  );
};

export default DynamicTwo;
