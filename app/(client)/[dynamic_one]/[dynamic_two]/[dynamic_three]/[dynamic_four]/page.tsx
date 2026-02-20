import { validateNewsUrl } from "@/app/actions/client-actions/news";
import NewDetailPage from "@/components/client-components/news-page";
import { DOMAIN_URL, NEWS_PUBLICATION_NAME, socialMediaLinks } from "@/constant/apiUrl";
import { db } from "@/lib/db/db";
import { categories, news } from "@/lib/db/schema";
import { stripHtml } from "@/lib/utils";
import { eq } from "drizzle-orm";
import { Metadata } from "next";
import { notFound } from "next/navigation";
export const dynamic = "force-dynamic";
// export const dyn

export async function generateMetadata({
  params,
}: {
  params: Promise<{
    dynamic_one: string;
    dynamic_two: string;
    dynamic_three: string;
    dynamic_four: string;
  }>;
}): Promise<Metadata> {
  const { dynamic_one, dynamic_two, dynamic_three, dynamic_four } =
    await params;
  let metaData;
  metaData = await db
    .select({
      title: news.metaTitle,
      des: news.metaDescription,
      keyword: news.keywords,
    })
    .from(news)
    .where(eq(news.slug, dynamic_four))
    .limit(1);
  if (metaData?.length === 0) {
    metaData = await db
      .select({
        title: categories.metaTitle,
        des: categories.metaDescription,
        keyword: categories.keywords,
      })
      .from(categories)
      .where(eq(categories.slug, dynamic_four))
      .limit(1);
  }
  const data = metaData[0];

  return {
    title: data?.title || "",
    description: data?.des || "",
    keywords: data?.keyword || "",

    // Canonical URL
    alternates: {
      canonical: `${DOMAIN_URL}/${dynamic_one}/${dynamic_two}/${dynamic_three}/${dynamic_four}`,
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
    dynamic_four: string;
  }>;
}) => {
  const { dynamic_one, dynamic_two, dynamic_three, dynamic_four } =
    await params;
  const newsDetail = (await validateNewsUrl([
    dynamic_one,
    dynamic_two,
    dynamic_three,
    dynamic_four,
  ])) as any;

  if (!newsDetail.valid) return notFound();

  const data = newsDetail?.news[0] ?? [];

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
              name: newsDetail?.categoryChain[0]?.name,
              item: `https://boltontoday.co.uk/${newsDetail?.categoryChain[0]?.slug}`,
            },
            {
              "@type": "ListItem",
              position: 3,
              name: newsDetail?.categoryChain[1]?.name,
              item: `https://boltontoday.co.uk/${newsDetail?.categoryChain[0]?.slug}/${newsDetail?.categoryChain[1]?.slug}`,
            },
            {
              "@type": "ListItem",
              position: 4,
              name: newsDetail?.categoryChain[2]?.name,
              item: `https://boltontoday.co.uk/${newsDetail?.categoryChain[0]?.slug}/${newsDetail?.categoryChain[1]?.slug}/${newsDetail?.categoryChain[2]?.slug}`,
            },
            {
              "@type": "ListItem",
              position: 5,
              name: newsDetail?.news[0]?.title,
              item: `https://boltontoday.co.uk/${newsDetail?.categoryChain[0]?.slug}/${newsDetail?.categoryChain[1]?.slug}/${newsDetail?.categoryChain[2]?.slug}/${newsDetail?.news[0]?.slug}`,
            },
          ],
        })}
      </script>
      {newsDetail?.include_body ? (

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org/",
              "@type": "newsDetails",
              "@id": `${DOMAIN_URL}/${newsDetail?.completeUrl}#newsDetails`,
              url: `${DOMAIN_URL}/${newsDetail?.completeUrl}`,
              headline: newsDetail?.title,
              mainEntityOfPage: `${DOMAIN_URL}/${newsDetail?.completeUrl}`,
              datePublished:
                (newsDetail?.news[0]?.publishDate),
              dateModified:
                (newsDetail?.news[0]?.publishDate),
              description: newsDetail?.metaDescription,
              articleSection: newsDetail?.categoryName,
              articleBody: stripHtml(newsDetail?.news[0]?.details),
              keywords: newsDetail?.keywords,
              name: newsDetail?.news[0]?.title,
              thumbnailUrl: newsDetail?.featureImage,
              wordCount: newsDetail?.news[0]?.details?.length,
              timeRequired: `${newsDetail?.news[0]?.details?.length / 200} minutes`,
              mainEntity: {
                "@type": "WebPage",
                "@id": `${DOMAIN_URL}/${newsDetail?.completeUrl}`,
              },
              author: {
                "@type": "Person",
                name: newsDetail?.news[0]?.authorName,
                description: newsDetail?.news[0]?.authorDescription,
                url: `${DOMAIN_URL}/author/${newsDetail?.news[0]?.authorSlug}`,
                sameAs: [
                  newsDetail?.news[0]?.facebookLink,
                  newsDetail?.news[0]?.twitterLink, // X is Twitter
                  newsDetail?.news[0]?.instagramLink,
                  newsDetail?.news[0]?.linkedin,
                  newsDetail?.news[0]?.personalPortfolio,
                  newsDetail?.news[0]?.muckrackLink,
                ],
                image: {
                  "@type": "ImageObject",
                  url: newsDetail?.news[0]?.authorImage,
                  height: 112,
                  width: 112,
                },
              },
              editor: {
                "@type": "Person",
                name: newsDetail?.news[0]?.authorName,
                description: newsDetail?.news[0]?.authorDescription,
                url: `${DOMAIN_URL}/author/${newsDetail?.news[0]?.authorSlug}`,
                sameAs: [
                  newsDetail?.news[0]?.facebookLink,
                  newsDetail?.news[0]?.twitterLink, // X is Twitter
                  newsDetail?.news[0]?.instagramLink,
                  newsDetail?.news[0]?.linkedin,
                  newsDetail?.news[0]?.personalPortfolio,
                  newsDetail?.news[0]?.muckrackLink,
                ],
                image: {
                  "@type": "ImageObject",
                  url: newsDetail?.news[0]?.authorImage,
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
                  "@id": `${DOMAIN_URL}/${newsDetail?.completeUrl}#primaryimage`,
                  url: newsDetail?.news[0]?.featureImage,
                  width: "1250",
                  height: "700",
                  caption: newsDetail?.news[0]?.featureImageCaption,
                },
              ],
            }),
          }}
        />
      ) : !newsDetail?.include_body ? (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "NewsArticle",
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": `${DOMAIN_URL}/${newsDetail?.completeUrl}`,
            },
            headline: newsDetail?.news[0]?.title,
            description: newsDetail?.metaDescription,
            image: {
              "@type": "ImageObject",
              url: newsDetail?.news[0]?.featureImage,
              width: 1200,
              height: 675,
            },
            datePublished:
              (newsDetail?.news[0]?.publishDate),
            dateModified:
              (newsDetail?.news[0]?.publishDate),
            author: {
              "@type": "Person",
              name: newsDetail?.news[0]?.authorName,
              url: `${DOMAIN_URL}/author/${newsDetail?.news[0]?.authorSlug}`,
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
          ...data,
          categoryName: newsDetail.categoryName,
          categorySlug: newsDetail.categoryUrl,
        }}
      ></NewDetailPage>
    </>
  );
};

export default DynamicTwo;
