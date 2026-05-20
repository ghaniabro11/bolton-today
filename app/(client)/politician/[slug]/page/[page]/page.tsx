
import { redirect } from 'next/navigation';

const AuthRedirectPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  redirect(`/politician/${slug}`);
};

export default AuthRedirectPage;
// import { getJournalistNewsWithCategoriesOptimized } from "@/app/actions/client-actions/politician";
// import PageGridWrapper from "@/components/client-components/grid-wrapper";
// import Loader from "@/components/client-components/Loader";
// import { db } from "@/lib/db/db";
// import { politicians } from "@/lib/db/schema";
// import { eq } from "drizzle-orm";
// import { Metadata } from "next";
// import dynamic from "next/dynamic";
// import { notFound, permanentRedirect } from "next/navigation";
// import { Suspense } from "react";

// const JournalistDetailComponent = dynamic(
//   () => import("@/components/client-components/politician-detail"),
//   {
//     loading: () => <Loader />,
//     ssr: true, // optional – use only if you want client-side rendering only
//   }
// );

// // export async function generateMetadata({
// //   params,
// // }: {
// //   params: Promise<{ slug: string; page: string }>;
// // }): Promise<Metadata> {
// //   const { slug, page } = await params;

// //   const metaData = await db
// //     .select({
// //       title: politicians.metaTitle,
// //       des: politicians.metaDescription,
// //       keyword: politicians.keywords,
// //     })
// //     .from(politicians)
// //     .where(eq(politicians.slug, slug))
// //     .limit(1);

// //   const data = metaData[0];

// //   return {
// //     title: data?.title || "",
// //     description: data?.des || "",
// //     keywords: data?.keyword || "",

// //     // Canonical URL
// //     alternates: {
// //       canonical: `https://boltontoday.co.uk/politician/${slug}/page/${page}`,
// //     },

// //     // Robots meta (camelCase keys)
// //     // // Robots meta (camelCase keys)
// //     // robots: {
// //     //   index: true,
// //     //   follow: true,
// //     //   "max-snippet": -1,
// //     //   "max-video-preview": -1,
// //     //   "max-image-preview": "large",
// //     // },
// //     robots: {
// //       index: true,
// //       follow: true,
// //       "max-snippet": -1,
// //       "max-video-preview": -1,
// //       "max-image-preview": "large",
// //     },
// //   };
// // }
// const JournalistDetails = async ({
//   params,
// }: {
//   params: Promise<{ slug: string; page: string }>;
// }) => {
//   const { slug, page } = await params;
//   if (page === "1") {
//     permanentRedirect(`/politician/${slug}`);
//   }
//   const result = await getJournalistNewsWithCategoriesOptimized({
//     slug: `${slug}`,
//     page: page,
//     limit: 4,
//   });
//   if (result?.data === null) return notFound();

//   // if (result.success) {
//   //   console.log("Politician:", result.data.politician);
//   //   console.log("News:", result.data.news);
//   //   console.log("Pagination:", result.data.pagination);
//   // } else {
//   //   console.error("Error:", result.message);
//   // }

//   return (
//     <>
//       {/* <script
//         async
//         src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5687793259503722"
//         crossOrigin="anonymous"
//       ></script> */}
//       <PageGridWrapper>
//         <Suspense fallback={<Loader />}>
//           <JournalistDetailComponent result={result} slug={slug} />
//         </Suspense>
//       </PageGridWrapper>
//     </>
//   );
// };

// export default JournalistDetails;
