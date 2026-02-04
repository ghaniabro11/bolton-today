import { DOMAIN_URL, NEWS_LANGUAGE, NEWS_PUBLICATION_NAME } from "@/constant/apiUrl";
import { db } from "@/lib/db/db";
import { toISO8601 } from "@/utils/date";
import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";

function sitemapLastmod(dateStr: string | undefined | null): string {
  const iso = toISO8601(dateStr ?? "");
  const raw = iso ?? new Date().toISOString();
  return String(raw).replace(/(\.\d{3})?Z$/, "+00:00");
}

/** Escape XML special characters for use inside element content. */
function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
export async function GET() {
  try {
    // Get timestamp for 48 hours ago
    const fortyEightHoursAgo = new Date();
    fortyEightHoursAgo.setHours(fortyEightHoursAgo.getHours() - 48);

    const formattedTimestamp = fortyEightHoursAgo
      .toISOString()
      .replace("T", " ")
      .replace(/\.\d+Z$/, "");

    // Fetch recent news with one category mapping
    const newsItems = await db.execute(sql`
      SELECT 
        n.slug AS news_slug, 
        n.title AS news_title,
        nc.category_id, 
        c.slug AS category_slug,
        c.parent_category_id,
        n.publish_date AS publish_date
      FROM news n
      JOIN news_categories nc ON n.id = nc.news_id
      JOIN categories c ON nc.category_id = c.id
      WHERE n.publish_date >= ${formattedTimestamp}::timestamp
      AND n.publish_status = 'active'
      AND n.active_status = 'active'
    `);

    if (newsItems.rows.length === 0) {
      return new NextResponse(
        `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>`,
        { headers: { "Content-Type": "text/xml" } }
      );
    }

    // Fetch all categories for parent mapping
    const categoriesResult = await db.execute(sql`
      SELECT id, slug, parent_category_id FROM categories
    `);

    const categoryMap = new Map<number, { slug: string; parent_category_id: number | null }>();
    categoriesResult.rows.forEach((cat: any) => {
      categoryMap.set(cat.id, {
        slug: cat.slug,
        parent_category_id: cat.parent_category_id,
      });
    });

    // Helper to build full slug chain for category
    const buildCategoryChain = (categoryId: number): string => {
      const parts: string[] = [];
      let currentId: number | null = categoryId;

      while (currentId) {
        const category = categoryMap.get(currentId);
        if (!category) break;
        parts.unshift(category.slug);
        currentId = category.parent_category_id;
      }

      return parts.join("/");
    };

    // Generate full URLs
    const dynamicUrls = newsItems.rows.map((row: any) => {
      const fullCategoryPath = buildCategoryChain(row.category_id);
      return {
        loc: `${DOMAIN_URL}/${fullCategoryPath}/${row.news_slug}`,
        lastmod: new Date().toISOString(),
        changefreq: "weekly",
        priority: "0.8",
        publication_date: row.publish_date,
        title: row.news_title,
      };
    });

    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${dynamicUrls
        .map(
          (url: any) => `  <url>
    <loc>${escapeXml(url.loc)}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <news:news>
      <news:publication>
        <news:name>${escapeXml(NEWS_PUBLICATION_NAME)}</news:name>
        <news:language>${NEWS_LANGUAGE}</news:language>
      </news:publication>
      <news:publication_date>${sitemapLastmod(url.publication_date)}</news:publication_date>
      <news:title>${escapeXml(String(url.title ?? ""))}</news:title>
    </news:news>
  </url>`
        )
        .join("\n")}
</urlset>`;
    //     // Generate XML
    //     const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
    // <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    //   ${dynamicUrls
    //     .map(
    //       (url) => `<url>
    //     <loc>${url.loc}</loc>
    //     <lastmod>${url.lastmod}</lastmod>
    //     <changefreq>${url.changefreq}</changefreq>
    //     <priority>${url.priority}</priority>
    //   </url>`
    //     )
    //     .join("")}
    // </urlset>`;

    return new NextResponse(sitemapXml, {
      headers: { "Content-Type": "text/xml" },
    });
  } catch (error) {
    console.error("Error generating news sitemap:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export const dynamic = "auto";
