import { DOMAIN_URL } from "@/constant/apiUrl";
import { db } from "@/lib/db/db";
import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";

/** Format date as ISO 8601 for sitemap: YYYY-MM-DDTHH:mm:ss+00:00 */
function sitemapLastmod(dateStr: string | Date | undefined | null): string {
  const date =
    dateStr instanceof Date
      ? dateStr
      : dateStr != null && dateStr !== ""
        ? new Date(dateStr)
        : new Date();
  const raw = date.toISOString();
  return raw.replace(/(\.\d{3})?Z$/, "+00:00");
}

/** Escape XML special chars so URLs with & etc. parse correctly. */
function escapeXml(str: string): string {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

type RouteContext = { params: Promise<{ page: string }> };

/**
 * Serves post-sitemap/1, post-sitemap/2, ... (200 posts per chunk).
 * Fetches news with full slug (category path + news slug), image URL from media, and lastmod.
 * Content-Type: application/xml. Uses sitemap + image extension.
 */
export async function GET(_request: Request, context: RouteContext) {
  try {
    const { page: pageParam } = await context.params;
    const page = Math.max(1, parseInt(String(pageParam), 10));
    if (!Number.isFinite(page)) {
      return new NextResponse("Invalid page", { status: 400 });
    }

    const offset = (page - 1) * 200;

    // Fetch paginated news with one category and feature image URL (same pattern as news-sitemap)
    const newsItems = await db.execute(sql`
      SELECT DISTINCT ON (n.id)
        n.slug AS news_slug,
        n.publish_date AS publish_date,
        nc.category_id,
        m.file_path AS image_url
      FROM news n
      LEFT JOIN news_categories nc ON n.id = nc.news_id
      LEFT JOIN media m ON n.feature_image = m.id
      WHERE n.publish_status = 'active'
        AND n.active_status = 'active'
      ORDER BY n.id, nc.category_id
      OFFSET ${offset}
      LIMIT 200
    `);

    if (newsItems?.rows.length === 0) {
      const emptySitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"></urlset>`;
      return new NextResponse(emptySitemap, {
        headers: { "Content-Type": "text/xml" },
      });
    }

    // Fetch all categories for parent mapping (same as news-sitemap)
    const categoriesResult = await db.execute(sql`
      SELECT id, slug, parent_category_id FROM categories
    `);

    const categoryMap = new Map<
      number,
      { slug: string; parent_category_id: number | null }
    >();
    for (const cat of categoriesResult.rows as { id: number; slug: string; parent_category_id: number | null }[]) {
      categoryMap.set(cat?.id, {
        slug: cat?.slug,
        parent_category_id: cat?.parent_category_id,
      });
    }

    const buildCategoryChain = (categoryId: number | null): string => {
      if (categoryId == null) return "";
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

    type NewsRow = { news_slug: string; publish_date: string | Date; category_id: number | null; image_url: string | null };
    const dynamicUrls = (newsItems?.rows as NewsRow[]).map((row) => {
      const fullCategoryPath = buildCategoryChain(row.category_id);
      const pathSegments = fullCategoryPath
        ? `${fullCategoryPath}/${row.news_slug}`
        : row.news_slug;
      const loc = escapeXml(`${DOMAIN_URL}/${pathSegments}`);
      const lastmod = sitemapLastmod(row?.publish_date);
      const imageUrl = row?.image_url?.trim();
      const imageLoc = imageUrl ? escapeXml(imageUrl) : null;
      return { loc, lastmod, imageLoc };
    });

    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${dynamicUrls
        .map(
          (url) => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
${url.imageLoc ? `    <image:image>
    <image:loc>${url.imageLoc}</image:loc>
</image:image>
` : ""}  </url>`
        )
        .join("\n")}
</urlset>`;

    return new NextResponse(sitemapXml, {
      headers: { "Content-Type": "text/xml" },
    });
  } catch (error) {
    console.error("Error generating post sitemap chunk:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export const dynamic = "force-dynamic";
