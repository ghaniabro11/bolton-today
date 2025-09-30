import { validateCategoryPathWithNews } from "@/app/actions/client-actions/news";
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
    pagination: string;
  }>;
}): Promise<Metadata> {
  const { dynamic_one, pagination } = await params;

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
      canonical: `https://boltontoday.co.uk/${dynamic_one}/page/${pagination}`,
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
  params: Promise<{ dynamic_one: string; pagination: string }>;
}) => {
  const { dynamic_one, pagination } = await params;

  if (pagination === "1") {
    permanentRedirect(`/${dynamic_one}`);
  }

  const newsList = (await validateCategoryPathWithNews({
    slugParts: [dynamic_one],
    limit: 20,
    page: Number(pagination),
  })) as any;

  if (!newsList.valid || newsList?.newsList?.length === 0) return notFound();

  const breadcrumbJSON = {
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
        name: newsList?.categoryChain[0]?.name,
        item: `https://boltontoday.co.uk/${newsList?.categoryChain[0]?.slug}/page/${pagination}`,
      },
    ],
  };

  return (
    <>
      {/* <script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5687793259503722"
        crossOrigin="anonymous"
      ></script> */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJSON) }}
      />
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
