import { DOMAIN_URL } from "@/constant/apiUrl";
import { db } from "@/lib/db/db";
import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Calculate the date 48 hours ago
    const fortyEightHoursAgo = new Date();
    fortyEightHoursAgo.setHours(fortyEightHoursAgo.getHours() - 48);

    // Format the timestamp to match the database (YYYY-MM-DD HH:MM:SS)
    const formattedTimestamp = fortyEightHoursAgo
      .toISOString()
      .replace("T", " ")
      .replace(/\.\d+Z$/, "");

    console.log(`Fetching news published after: ${formattedTimestamp}`);

    // Fetch news and their categories using raw SQL
    const response = await db.execute(sql`
      SELECT 
        n.slug AS news_slug, 
        nc.category_slug
      FROM 
        news n
      JOIN 
        news_categories nc ON n.id = nc.news_id
      WHERE 
        n.publish_date >= ${formattedTimestamp}::timestamp
    `);

    console.log(`Found ${response.rows.length} news items.`);

    // Handle no data found
    if (response.rows.length === 0) {
      console.log("No news items found in the last 48 hours.");
      return new NextResponse(
        `<?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        </urlset>`,
        { headers: { "Content-Type": "text/xml" } }
      );
    }

    // Map the data to sitemap URLs
    const dynamicUrls = response.rows.map((row: any) => ({
      loc: `${DOMAIN_URL}/${row.category_slug}/${row.news_slug}`,
      lastmod: new Date().toISOString(),
      changefreq: "weekly",
      priority: "0.8",
    }));

    console.log(`Generated ${dynamicUrls.length} URLs for the sitemap.`);

    // Generate the XML for the sitemap
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
    console.error("Error fetching news data:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
export const dynamic = "auto";
