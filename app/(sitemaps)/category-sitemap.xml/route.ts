import { DOMAIN_URL } from "@/constant/apiUrl";
import { db } from "@/lib/db/db"; // Import the database client
import { categories } from "@/lib/db/schema"; // Import the categories table
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Fetch category slugs directly from the database
    const categorySlugs = await db
      .select({ slug: categories.slug })
      .from(categories);

    // Map category slugs to sitemap URLs
    const dynamicUrls = categorySlugs.map((category) => ({
      loc: `${DOMAIN_URL}/${category.slug}`,
      lastmod: new Date().toISOString(),
      changefreq: "weekly",
      priority: "0.8",
    }));

    // Generate the XML for the sitemap
    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${dynamicUrls
    .map(
      (url: any) => `<url>
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
    console.error("Error fetching category slugs:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
