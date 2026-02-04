import { DOMAIN_URL } from "@/constant/apiUrl";
import { db } from "@/lib/db/db";
import { news } from "@/lib/db/schema";
import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";

const POSTS_PER_SITEMAP = 200;

function sitemapLastmod(): string {
  return new Date().toISOString().replace(/(\.\d{3})?Z$/, "+00:00");
}

export async function GET() {
  try {
    const lastmod = sitemapLastmod();

    let postSitemapCount = 0;
    try {
      const totalPosts = await db.select({ count: sql`count(*)` }).from(news);
      console.log(totalPosts, "totalPosts");
      const total = Number(totalPosts[0]?.count);
      if (Number.isFinite(total) && total > 0) {
        postSitemapCount = Math.ceil(total / POSTS_PER_SITEMAP);
      }
    } catch {
      // leave postSitemapCount 0 if API fails
    }

    const postSitemapEntries =
      postSitemapCount > 0
        ? Array.from({ length: postSitemapCount }, (_, i) => i + 1)
          .map(
            (page) =>
              `  <sitemap>
    <loc>${DOMAIN_URL}/post-sitemap/${page}</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>`
          )
          .join("\n")
        : "";

    const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${DOMAIN_URL}/news-sitemap.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${DOMAIN_URL}/category-sitemap.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${DOMAIN_URL}/pages-sitemap.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${DOMAIN_URL}/author-sitemap.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
${postSitemapEntries ? postSitemapEntries + "\n" : ""}</sitemapindex>`;

    return new NextResponse(sitemapIndex, {
      headers: { "Content-Type": "text/xml" },
    });
  } catch (error) {
    console.error("Error generating sitemap index:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export const dynamic = "auto";




// import { DOMAIN_URL } from "@/constant/apiUrl";
// import { NextResponse } from "next/server";

// export async function GET(request: Request) {
//   const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
// <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
//   <sitemap>
//     <loc>${DOMAIN_URL}/news-sitemap.xml</loc>
//     <lastmod>${new Date().toISOString()}</lastmod>
//   </sitemap>
//   <sitemap>
//     <loc>${DOMAIN_URL}/category-sitemap.xml</loc>
//     <lastmod>${new Date().toISOString()}</lastmod>
//   </sitemap>
//   <sitemap>
//     <loc>${DOMAIN_URL}/pages-sitemap.xml</loc>
//     <lastmod>${new Date().toISOString()}</lastmod>
//   </sitemap>
//   <sitemap>
//     <loc>${DOMAIN_URL}/author-sitemap.xml</loc>
//     <lastmod>${new Date().toISOString()}</lastmod>
//   </sitemap>
// </sitemapindex>`;

//   return new NextResponse(sitemapIndex, {
//     headers: { "Content-Type": "text/xml" },
//   });
// }
// export const dynamic = "auto";
