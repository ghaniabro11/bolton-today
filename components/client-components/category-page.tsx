import React, { Suspense } from "react";
import PageGridWrapper from "./grid-wrapper";
import { Typography } from "./typography";
import Loader from "./Loader";
import NewsCard from "./news-card";
import { ClientPagination } from "../reuse-client-pagination";
import "./content.css";
import AdBanner from "../AdBanner";

export default function CategoryPage({
  category,
  newsList,
  totalCount,
  slug,
  currentPage = 1,
  limit,
}: any) {
  console.log(newsList, "new data in component");

  return (
    <>
      <PageGridWrapper>
        <div>
          <div className=" bg-head p-6 rounded-2xl text-btn shadow-md ">
            <Typography
              variant="h1"
              className="text-2xl md:text-3xl font-bold mb-2"
            >
              {category.name}
            </Typography>

            <p
              className="text-base md:text-lg leading-relaxed text-white"
              dangerouslySetInnerHTML={{
                __html: category?.description ?? "N/A",
              }}
            ></p>
          </div>
          <section>
            <Suspense fallback={<Loader />}>
              {newsList?.length === 0 ? (
                <p className="px-3 mt-5">No news found in this category.</p>
              ) : (
                newsList?.map((newsItem: any, index: number) => (
                  <React.Fragment key={newsItem?.id || index}>
                    <NewsCard
                      url={newsItem.completeSlug}
                      date={newsItem?.publishDate || newsItem?.publish_date}
                      imageUrl={
                        newsItem?.featureImage || newsItem?.feature_image
                      }
                      title={newsItem?.title}
                      newsSlug={newsItem?.slug}
                      authorName={newsItem?.authorName || newsItem?.author_name}
                      authorSlug={newsItem?.authorSlug || newsItem?.author_slug}
                    />


                  </React.Fragment>
                ))
              )}
            </Suspense>

            <ClientPagination
              currentPage={currentPage}
              totalItems={Number(totalCount)}
              slug={slug}
              limit={Number(limit)}
            />
          </section>
        </div>
      </PageGridWrapper>
    </>
  );
}
