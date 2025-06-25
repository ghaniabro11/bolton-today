import { DOMAIN_URL } from "@/constant/apiUrl";
import { db } from "@/lib/db/db";
import { categories } from "@/lib/db/schema";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Fetch all categories with necessary fields
    const allCategories = await db
      .select({
        id: categories.id,
        slug: categories.slug,
        parentCategoryId: categories.parentCategoryId,
      })
      .from(categories);

    // Helper to find full path from child to root
    const buildFullSlug = (category: any, map: Map<number, any>): string => {
      let parts = [category.slug];
      let parentId = category.parentCategoryId;

      while (parentId) {
        const parent = map.get(parentId);
        if (!parent) break;
        parts.unshift(parent.slug);
        parentId = parent.parentCategoryId;
      }

      return parts.join("/");
    };

    // Create a map for fast lookup
    const categoryMap = new Map<number, any>();
    for (const cat of allCategories) {
      categoryMap.set(cat.id, cat);
    }

    // Generate full URLs
    const dynamicUrls = allCategories.map((category) => {
      const fullSlug = buildFullSlug(category, categoryMap);
      return {
        loc: `${DOMAIN_URL}/${fullSlug}`,
        lastmod: new Date().toISOString(),
        changefreq: "weekly",
        priority: "0.8",
      };
    });

    // Convert to sitemap XML
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
    console.error("Error generating category sitemap:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
