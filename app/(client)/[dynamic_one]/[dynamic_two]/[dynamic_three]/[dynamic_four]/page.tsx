import { validateNewsUrl } from "@/app/actions/client-actions/news";
import NewDetailPage from "@/components/client-components/news-page";
import { db } from "@/lib/db/db";
import { categories, news } from "@/lib/db/schema";
import { formatDate } from "@/utils/date";
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
      canonical: `https://boltontoday.co.uk/${dynamic_one}/${dynamic_two}/${dynamic_three}/${dynamic_four}/`,
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
  const test = (await validateNewsUrl([
    dynamic_one,
    dynamic_two,
    dynamic_three,
    dynamic_four,
  ])) as any;

  if (!test.valid) return notFound();

  const data = test?.news[0] ?? [];
  // console.log(test, "news///////////////////");
  // const breadcrumbJSON = {
  //   "@context": "https://schema.org",
  //   "@type": "BreadcrumbList",
  //   itemListElement: [
  //     {
  //       "@type": "ListItem",
  //       position: 1,
  //       name: "Home",
  //       item: `https://boltontoday.co.uk/`,
  //     },
  //     {
  //       "@type": "ListItem",
  //       position: 2,
  //       name: slug1CategoryDetails?.name,
  //       item: `https://boltontoday.co.uk/${slug1CategoryDetails?.slug}/`,
  //     },
  //     {
  //       "@type": "ListItem",
  //       position: 3,
  //       name: slug2CategoryDetails?.name,
  //       item: `https://boltontoday.co.uk/${slug1CategoryDetails?.slug}/${slug2CategoryDetails?.slug}/`,
  //     },
  //   ],
  // };
  return (
    <>
      {/* <script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5687793259503722"
        crossOrigin="anonymous"
      ></script> */}

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
              name: test?.categoryChain[0]?.name,
              item: `https://boltontoday.co.uk/${test?.categoryChain[0]?.slug}`,
            },
            {
              "@type": "ListItem",
              position: 3,
              name: test?.categoryChain[1]?.name,
              item: `https://boltontoday.co.uk/${test?.categoryChain[0]?.slug}/${test?.categoryChain[1]?.slug}`,
            },
            {
              "@type": "ListItem",
              position: 4,
              name: test?.categoryChain[2]?.name,
              item: `https://boltontoday.co.uk/${test?.categoryChain[0]?.slug}/${test?.categoryChain[1]?.slug}/${test?.categoryChain[2]?.slug}`,
            },
            {
              "@type": "ListItem",
              position: 5,
              name: test?.news[0]?.title,
              item: `https://boltontoday.co.uk/${test?.categoryChain[0]?.slug}/${test?.categoryChain[1]?.slug}/${test?.categoryChain[2]?.slug}/${test?.news[0]?.slug}`,
            },
          ],
        })}
      </script>
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "NewsArticle",
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": `https://boltontoday.co.uk/${dynamic_one}/${dynamic_two}/${dynamic_three}/${dynamic_four}`,
          },
          headline: data?.title,
          image: [data?.featureImage],
          datePublished: formatDate(data?.createdAt),
          author: {
            "@type": "Person",
            name: data?.authorName,
            url: `https://boltontoday.co.uk/author/${data?.authorSlug}`,
          },
          publisher: {
            "@type": "NewsMediaOrganization",
            name: "Bolton Today News",
            logo: {
              "@type": "ImageObject",
              url: "https://boltontoday.co.uk/bolton_logo.svg",
              width: 600,
              height: 60,
            },
          },
          description: data?.metaDescription,
        })}
      </script>

      <NewDetailPage
        data={{
          ...data,
          categoryName: test.categoryName,
          categorySlug: test.categoryUrl,
        }}
      ></NewDetailPage>
    </>
  );
};

export default DynamicTwo;
