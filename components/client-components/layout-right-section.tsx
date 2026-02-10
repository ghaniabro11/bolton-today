import { db } from "@/lib/db/db";
import { categories, news, newsCategories } from "@/lib/db/schema";
import { and, desc, eq, sql } from "drizzle-orm";
import Link from "next/link";
import React, { Suspense } from "react";
import Loader from "./Loader";
import Search from "./search";
import { Typography } from "./typography";

const RecentNews = async () => {
  const latestPostQuery = sql`
  WITH RECURSIVE category_path AS (
    SELECT 
      c.id,
      c.slug,
      c.parent_category_id,
      c.slug::TEXT AS full_slug
    FROM categories c
    WHERE c.parent_category_id IS NULL

    UNION ALL

    SELECT 
      child.id,
      child.slug,
      child.parent_category_id,
      (parent.full_slug || '/' || child.slug) AS full_slug
    FROM categories child
    INNER JOIN category_path parent ON child.parent_category_id = parent.id
  )

  SELECT 
    n.title AS title,
    n.slug AS slug,
    cp.full_slug AS categorySlug
  FROM news n
  LEFT JOIN news_categories nc ON n.id = nc.news_id
  LEFT JOIN categories c ON nc.category_id = c.id
  LEFT JOIN category_path cp ON c.id = cp.id
  WHERE n.publish_status = 'active' 
    AND n.active_status = 'active'
`;

  const latestQuery = sql`
  ${latestPostQuery}
  ORDER BY n.publish_date DESC
  LIMIT 6
`;

  const latestResult = await db.execute(latestQuery);
  const latest = latestResult.rows.length > 0 ? latestResult.rows : null;

  // console.log(newsData, "newsData");
  return (
    <>
      <Suspense fallback={<Loader />}>
        <section className="space-y-4 px-[10%] sticky top-10">
          <Search />
          <Typography variant="h2">Recent Bolton News</Typography>
          <BulletSection items={latest as any} />
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
    <ul className=" mt-2">
      {items.map((item, index) => (
        <li
          key={index}
          className={`flex items-start gap-2 border-t border-gray-300 list-decimal 
          ${index === items.length - 1 ? "border-b border-gray-300" : ""}`}
        >
          <span className="text-head text-4xl font-bold mt-3 no-underline hover:no-underline">
            {index + 1}
          </span>
          <Link
            href={`/${item?.categoryslug}/${item?.slug}`.replace(/\/\/+/g, "/")}
          >
            <Typography
              variant="h3"
              className={`flex items-start gap-2 py-3 w-full hover:underline text-sm text-gray-800`}
            >
              {item?.title ?? "--"}
            </Typography>
          </Link>
        </li>
      ))}
    </ul>
  );
};
