import { getAuthorNewsWithCategoriesOptimized } from "@/app/actions/client-actions/author";
import PageGridWrapper from "@/components/client-components/grid-wrapper";
import Loader from "@/components/client-components/Loader";
import { db } from "@/lib/db/db";
import { authors } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { Metadata } from "next";
import { unstable_cache } from "next/cache";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import { Suspense } from "react";

const AuthorDetailComponent = dynamic(
  () => import("@/components/client-components/author-detail"),
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
      title: authors.metaTitle,
      des: authors.metaDescription,
      keyword: authors.keywords,
    })
    .from(authors)
    .where(eq(authors.slug, slug))
    .limit(1);

  const data = metaData[0];

  return {
    title: data?.title || "",
    description: data?.des || "",
    keywords: data?.keyword || "",

    // Canonical URL
    alternates: {
      canonical: `https://boltontoday.co.uk/author/${slug}`,
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

const getCachedAuthorData = (slug: string) =>
  unstable_cache(
    async () =>
      getAuthorNewsWithCategoriesOptimized({
        slug: `${slug}`,
        page: "1",
      }),
    ["author-detail", slug],
    { revalidate: 60 }
  )();

const AuthorDetails = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;

  const result = await getCachedAuthorData(slug);
  if (result?.data === null) return notFound();

  // console.log(result, "result:");
  if (result.success) {
    // console.log("Author:", result.data.author);
    // console.log("News:", result.data.news);
    // console.log("Pagination:", result.data.pagination);
  } else {
    // console.error("Error:", result.message);
  }

  return (
    <>

      <PageGridWrapper>
        <Suspense fallback={<Loader />}>
          <AuthorDetailComponent result={result} slug={slug} />
        </Suspense>
      </PageGridWrapper>
    </>
  );
};

export default AuthorDetails;
