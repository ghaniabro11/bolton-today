import { db } from "@/lib/db/db";
import { categories, news, newsCategories } from "@/lib/db/schema";
import { and, desc, eq } from "drizzle-orm";
import Link from "next/link";
import React, { Suspense } from "react";
import Loader from "./Loader";
import Search from "./search";
import { Typography } from "./typography";

const RecentNews = async () => {
  const newsData = await db
    .select({
      slug: news.slug,
      title: news.title,
      categorySlug: categories.slug,
    })
    .from(news)
    .innerJoin(newsCategories, eq(news.id, newsCategories.newsId))
    .innerJoin(categories, eq(newsCategories.categoryId, categories.id))
    .orderBy(desc(news.publishDate))
    .limit(10)
    .where(
      and(eq(news.publishStatus, "active"), eq(news.activeStatus, "active"))
    );
  // console.log(newsData, "newsData");
  return (
    <>
      <Suspense fallback={<Loader />}>
        <section className="space-y-4 px-[10%] sticky top-10">
          <Search />
          <Typography variant="h2">Recent News</Typography>
          <BulletSection items={newsData} />
        </section>
      </Suspense>
    </>
  );
};

export default RecentNews;
interface BulletSectionProps {
  items: any[];
}

const BulletSection: React.FC<BulletSectionProps> = ({ items }) => {
  return (
    <div className=" mt-2">
      {items.map((item, index) => (
        <div
          key={index}
          className={`flex items-start gap-2 border-t border-gray-300 
          ${index === items.length - 1 ? "border-b border-gray-300" : ""}`}
        >
          <span className="text-gray-600 text-xl mt-2 no-underline hover:no-underline">
            »
          </span>
          <Link
            href={`/${item?.categorySlug}/${item?.slug}`.replace(/\/\/+/g, "/")}
          >
            <Typography
              variant="h3"
              className={`flex items-start gap-2 py-3 w-full hover:underline text-sm text-gray-800`}
            >
              {item?.title ?? "--"}
            </Typography>
          </Link>
        </div>
      ))}
    </div>
  );
};
