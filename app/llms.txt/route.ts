import { DOMAIN_URL } from "@/constant/apiUrl";
import { db } from "@/lib/db/db";
import { categories } from "@/lib/db/schema";
import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Fetch latest 50 news articles with title, slug, meta description, and category
    // Using DISTINCT ON to get one category per news article
    const newsItems = await db.execute(sql`
      SELECT DISTINCT ON (n.id)
        n.id,
        n.title,
        n.slug AS news_slug,
        n.meta_title,
        n.meta_description,
        nc.category_id,
        c.slug AS category_slug,
        c.parent_category_id
      FROM news n
      JOIN news_categories nc ON n.id = nc.news_id
      JOIN categories c ON nc.category_id = c.id
      WHERE n.publish_status = 'active'
      AND n.active_status = 'active'
      ORDER BY n.id DESC, n.publish_date DESC, nc.category_id
      LIMIT 50
    `);

    // Fetch all categories for parent mapping
    const categoriesResult = await db.execute(sql`
      SELECT id, slug, parent_category_id FROM categories
    `);

    const categoryMap = new Map<
      number,
      { slug: string; parent_category_id: number | null }
    >();
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

    // Fetch all categories with Drizzle ORM (same as category-sitemap.xml)
    const allCategories = await db
      .select({
        id: categories.id,
        slug: categories.slug,
        parentCategoryId: categories.parentCategoryId,
      })
      .from(categories);

    // Helper to find full path from child to root (same as category-sitemap.xml)
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
    const categoryMapForSitemap = new Map<number, any>();
    for (const cat of allCategories) {
      categoryMapForSitemap.set(cat.id, cat);
    }

    // Generate category URLs
    const categoryUrls = allCategories.map((category) => {
      const fullSlug = buildFullSlug(category, categoryMapForSitemap);
      return `${DOMAIN_URL}/${fullSlug}`;
    });

    // Build the static llms.txt content
    const staticContent = `## llms.txt for Bolton Today

## About Bolton Today
Bolton Today (https://boltontoday.co.uk) is a local news website dedicated to delivering timely, trustworthy, and engaging news that matters to the people of Bolton, UK. We cover local news, politics, town centre regeneration, crime & safety, sports & entertainment, community stories, and history & heritage.

## Mission
To inform, inspire, and reflect the spirit of Bolton through independent, community-driven journalism free from sensationalism and corporate influence.

## Content Types
- News Articles: Local news, breaking headlines, in-depth political coverage
- Authors: Journalist profiles and author pages
- Categories: Organized news by topics (politics, sports, community, etc.)
- Magazines: Special publications and features
- Community Stories: Uplifting local stories and cultural events

## Main Pages
- Home: https://boltontoday.co.uk/
- About Us: https://boltontoday.co.uk/about-us
- Contact Us: https://boltontoday.co.uk/contact-us
- Privacy Policy: https://boltontoday.co.uk/privacy-policy
- Cookie Policy: https://boltontoday.co.uk/cookie-policy
- Terms and Conditions: https://boltontoday.co.uk/terms-and-conditions

## Sitemaps
- Main Sitemap: https://boltontoday.co.uk/sitemap.xml
- News Sitemap: https://boltontoday.co.uk/news-sitemap.xml
- Author Sitemap: https://boltontoday.co.uk/author-sitemap.xml
- Category Sitemap: https://boltontoday.co.uk/category-sitemap.xml
- Pages Sitemap: https://boltontoday.co.uk/pages-sitemap.xml

## Contact Information
- Email: contact@boltontoday.co.uk
- Website: https://boltontoday.co.uk

## Technical Details
- Framework: Next.js 15.5.8
- Database: PostgreSQL with Drizzle ORM
- Content Management: Custom admin panel
- SEO: Dynamic metadata generation, sitemaps, structured data

## Content Guidelines
- Focus on local news and community stories relevant to Bolton
- Independent journalism without corporate influence
- Community-driven platform
- Accurate, relevant, and timely reporting

## Posts
`;

    // Generate posts section
    const postsSection =
      newsItems.rows.length > 0
        ? newsItems.rows
            .map((row: any) => {
              const fullCategoryPath = buildCategoryChain(row.category_id);
              const fullUrl = `${DOMAIN_URL}/${fullCategoryPath}/${row.news_slug}`;
              const title = row.meta_title || row.title;
              const metaDescription = row.meta_description || "";

              return `- [${title}](${fullUrl}): ${metaDescription || ""}`;
            })
            .join("\n")
        : "## No recent posts available";

    // Generate categories section
    const categoriesSection =
      categoryUrls.length > 0
        ? categoryUrls.map((url) => `- ${url}`).join("\n")
        : "## No categories available";

    const llmsTxtContent = `${staticContent}\n${postsSection}\n\n## Categories
${categoriesSection}`;

    return new NextResponse(llmsTxtContent, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("Error generating llms.txt:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export const dynamic = "force-dynamic";
