import { getNewsDetailBySlugOptimized } from "@/app/actions/client-actions/news";
import PageGridWrapper from "@/components/client-components/grid-wrapper";
import { Typography } from "@/components/client-components/typography";
import { Separator } from "@/components/ui/separator";
import { db } from "@/lib/db/db";
import { news } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
export const dynamic = "force-dynamic";
import "@/app/(client)/[dynamic_one]/[dynamic_two]/content.css";
import { formatDate } from "@/utils/date";
// export const dyn

export async function generateMetadata({
  params,
}: {
  params: Promise<{ dynamic_one: string; dynamic_two: string }>;
}): Promise<Metadata> {
  const { dynamic_one, dynamic_two } = await params;

  const metaData = await db
    .select({
      title: news.metaTitle,
      des: news.metaDescription,
      keyword: news.keywords,
    })
    .from(news)
    .where(eq(news.slug, dynamic_two))
    .limit(1);

  const data = metaData[0];

  return {
    title: data?.title || "",
    description: data?.des || "",
    keywords: data?.keyword || "",

    // Canonical URL
    alternates: {
      canonical: `https://boltontoday.co.uk/${dynamic_one}/${dynamic_two}/`,
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
  params: Promise<{ dynamic_one: string; dynamic_two: string }>;
}) => {
  const { dynamic_one, dynamic_two } = await params;
  const newsDetails = await getNewsDetailBySlugOptimized(
    dynamic_two,
    dynamic_one
  );
  console.log(newsDetails, "ndjdnskndksj");
  if (!newsDetails) return notFound();

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
              position: 1,
              name: newsDetails?.category?.name,
              item: `https://boltontoday.co.uk/${newsDetails?.category?.slug}/`,
            },
            {
              "@type": "ListItem",
              position: 1,
              name: newsDetails?.title,
              item: `https://boltontoday.co.uk/${newsDetails?.category?.slug}/${newsDetails?.slug}/`,
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
            "@id": `https://boltontoday.co.uk/${dynamic_one}/${dynamic_two}/`,
          },
          headline: newsDetails?.title,
          image: [newsDetails?.featureImage],
          datePublished: formatDate(newsDetails?.createdAt),
          author: {
            "@type": "Person",
            name: newsDetails?.author?.name,
            url: `https://boltontoday.co.uk/author/${newsDetails?.author?.slug}/`,
          },
          publisher: {
            "@type": "NewsMediaOrganization",
            name: "Bolton Today",
            logo: {
              "@type": "ImageObject",
              url: "https://boltontoday.co.uk/Washington-Insider-Magazine-black-logo.webp",
              width: 600,
              height: 60,
            },
          },
          description: newsDetails?.metaDescription,
        })}
      </script>
      <PageGridWrapper>
        <main className=" px-4  space-y-6">
          {/* Breadcrumbs */}
          <div className="text-sm text-gray-500 space-x-2">
            <Link href="/" className="hover:underline cursor-pointer">
              Home
            </Link>
            <span>/</span>
            <Link
              className="text-primary font-semibold"
              href={`/${newsDetails?.category.slug}`.replace(/\/\/+/g, "/")}
            >
              {newsDetails?.category.name}
            </Link>
          </div>

          {/* Title */}
          <h1 className="text-5xl text-[#333] font-playfair-display font-semibold">
            {newsDetails?.title ?? ""}
          </h1>

          {/* Author and Date */}
          <p className="text-sm text-gray-600 mb-2! mt-0!">
            In{" "}
            <Link href={`/${newsDetails?.category?.slug}`}>
              <span className=" text-gray-400 text-base font-medium">
                {newsDetails?.category.name}
              </span>
            </Link>{" "}
            by{" "}
            <Link href={`/author/${newsDetails?.author?.slug}`}>
              <span className="font-medium text-gray-400 text-base">
                {newsDetails?.author.name}
              </span>
            </Link>{" "}
            – {formatDate(newsDetails?.publishDate)}
          </p>

          <Separator />

          {/* Featured Image */}
          <div className="relative w-full aspect-video   mb-1!">
            {newsDetails?.featureImage && (
              <>
                <Image
                  src={`${newsDetails?.featureImage}`}
                  alt={`${newsDetails?.featureImageTitle ?? null}`}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-md shadow"
                />
              </>
            )}
          </div>
          <p className=" my-0!">{newsDetails?.featureImageCaption}</p>

          {/* News Details */}
          {newsDetails?.details && (
            <div
              className="entry-content overflow-auto"
              dangerouslySetInnerHTML={{ __html: newsDetails?.details }}
            />
          )}
        </main>
      </PageGridWrapper>{" "}
    </>
  );
};

export default DynamicTwo;
