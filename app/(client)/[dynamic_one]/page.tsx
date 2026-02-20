import { validateCategoryPathWithNews } from "@/app/actions/client-actions/news";
import CategoryPage from "@/components/client-components/category-page";
import { DOMAIN_URL, NEWS_PUBLICATION_NAME } from "@/constant/apiUrl";
import { db } from "@/lib/db/db";
import { categories } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { Metadata } from "next";
import { notFound } from "next/navigation";

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
      canonical: `${DOMAIN_URL}/${dynamic_one}`,
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
}: {
  params: Promise<{ dynamic_one: string }>;
}) => {
  const { dynamic_one } = await params;

  const newsList = (await validateCategoryPathWithNews({
    slugParts: [dynamic_one],
    limit: 20,
    page: 1,
  })) as any;

  if (!newsList.valid) return notFound();
  const breadcrumbJSON = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${DOMAIN_URL}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: newsList?.categoryChain[0]?.name,
        item: `${DOMAIN_URL}/${newsList?.categoryChain[0]?.slug}`,
      },
    ],
  };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJSON) }}
      />
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "@id": `${DOMAIN_URL}/#collectionpage`,
          name: NEWS_PUBLICATION_NAME,
          description:
            "Get the latest Bolton news, including local updates, events, politics, sports, crime, and inspiring stories from communities across the town.",
          url: `${DOMAIN_URL}`,
          isPartOf: {
            "@type": "WebSite",
            "@id": `${DOMAIN_URL}/#website`,
          },
          publisher: {
            "@type": "Organization",
            name: NEWS_PUBLICATION_NAME,
            url: `${DOMAIN_URL}/`,
            logo: {
              "@type": "ImageObject",
              url: `${DOMAIN_URL}/bolton_logo.svg`,
            },
          },
          mainEntity: {
            "@type": "ItemList",
            itemListOrder: "https://schema.org/ItemListOrderDescending",
            numberOfItems: 10,
            itemListElement: newsList?.newsList?.map(
              (item: any, index: number) => ({
                "@type": "ListItem",
                position: index + 1,
                url: `${DOMAIN_URL}/${item?.completeSlug}`,
              }),
            ),
          },
        })}
      </script>
      <CategoryPage
        category={newsList?.categoryChain[0] ?? {}}
        newsList={newsList?.newsList ?? []}
        totalCount={newsList?.totalCount ?? 0}
        slug={dynamic_one}
        currentPage={newsList?.currentPage ?? 1}
        limit={newsList?.limit ?? 20}
      />
    </>
  );
};

export default DynamicOne;
