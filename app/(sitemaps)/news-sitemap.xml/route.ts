import { DOMAIN_URL } from "@/constant/apiUrl";
import { db } from "@/lib/db/db";
import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";

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
        nc.category_id, 
        c.slug AS category_slug,
        c.parent_category_id
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
      };
    });

    // Generate XML
    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${dynamicUrls
    .map(
      (url) => `<url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`
    )
    .join("")}
</urlset>`;

    return new NextResponse(sitemapXml, {
      headers: { "Content-Type": "text/xml" },
    });
  } catch (error) {
    console.error("Error generating news sitemap:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export const dynamic = "auto";
