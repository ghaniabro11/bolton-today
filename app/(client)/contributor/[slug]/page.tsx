import { getContributorNewsWithCategoriesOptimized } from "@/app/actions/client-actions/contributor";
import PageGridWrapper from "@/components/client-components/grid-wrapper";
import Loader from "@/components/client-components/Loader";
import { db } from "@/lib/db/db";
import { contributors } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { Metadata } from "next";
import { unstable_cache } from "next/cache";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import { Suspense } from "react";

const ContributorDetailComponent = dynamic(
  () => import("@/components/client-components/contributor-detail"),
  {
    loading: () => <Loader />,
    ssr: true, // optional – use only if you want client-side rendering only
  }
);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const metaData = await db
    .select({
      title: contributors.metaTitle,
      des: contributors.metaDescription,
      keyword: contributors.keywords,
    })
    .from(contributors)
    .where(eq(contributors.slug, slug))
    .limit(1);

  const data = metaData[0];

  return {
    title: data?.title || "",
    description: data?.des || "",
    keywords: data?.keyword || "",

    // Canonical URL
    alternates: {
      canonical: `https://boltontoday.co.uk/contributor/${slug}`,
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

const getCachedContributorData = (slug: string) =>
  unstable_cache(
    async () =>
      getContributorNewsWithCategoriesOptimized({
        slug: `${slug}`,
        page: "1",
      }),
    ["contributor-detail", slug],
    { revalidate: 60 }
  )();

const ContributorDetails = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;

  const result = await getCachedContributorData(slug);
  if (result?.data === null) return notFound();

  // console.log(result, "result:");
  if (result.success) {
    // console.log("Contributor:", result.data.contributor);
    // console.log("News:", result.data.news);
    // console.log("Pagination:", result.data.pagination);
  } else {
    // console.error("Error:", result.message);
  }

  return (
    <>

      <PageGridWrapper>
        <Suspense fallback={<Loader />}>
          <ContributorDetailComponent result={result} slug={slug} />
        </Suspense>
      </PageGridWrapper>
    </>
  );
};

export default ContributorDetails;
