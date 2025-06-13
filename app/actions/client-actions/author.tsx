import { db } from "@/lib/db/db";
import { sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function getAuthorNewsWithCategoriesOptimized({
  slug,
  page = 1,
  limit = 10,
}: {
  slug: any;
  page: any;
  limit: number;
}) {
  try {
    const offset = (page - 1) * limit;

    // Single query to get all data at once
// Single query to get all data at once
const result = await db.execute(sql`
  WITH author_data AS (
    SELECT 
      a.id as author_id,
      a.name as author_name,
      a.slug as author_slug,
      a.position,
      a.description as author_description,
      a.facebook_link,
      a.instagram_link,
      a.twitter_link,
      a.muckrack_link,
      a.personal_portfolio,
      a.linkedin,
      a.publish_status as author_status,
      am.id as author_image_id,
      am.title as author_image_title,
      am.slug as author_image_slug,
      am.caption as author_image_caption,
      am.file_path as author_image_file_path,
      am.type as author_image_type
    FROM authors a
    LEFT JOIN media am ON a.image = am.id
    WHERE a.slug = ${slug}
  ),
  news_data AS (
    SELECT DISTINCT ON (n.id)
      n.id,
      n.title,
      n.slug,
      n.publish_date,
      nm.id as feature_image_id,
      nm.title as feature_image_title,
      nm.slug as feature_image_slug,
      nm.caption as feature_image_caption,
      nm.file_path as feature_image_file_path,
      nm.type as feature_image_type,
      ad.author_id,
      ad.author_name,
      ad.author_slug,
      ad.position,
      ad.author_description,
      ad.facebook_link,
      ad.instagram_link,
      ad.twitter_link,
      ad.muckrack_link,
      ad.personal_portfolio,
      ad.linkedin,
      ad.author_status,
      ad.author_image_id,
      ad.author_image_title,
      ad.author_image_slug,
      ad.author_image_caption,
      ad.author_image_file_path,
      ad.author_image_type
    FROM news n
    CROSS JOIN author_data ad
    LEFT JOIN media nm ON n.feature_image = nm.id
    WHERE n.author_id = ad.author_id 
      AND n.publish_status = 'active' 
      AND n.active_status = 'active'
    ORDER BY n.id, n.publish_date DESC
  )
  SELECT 
    nd.*,
    c.id as category_id,
    c.name as category_name,
    c.slug as category_slug
  FROM news_data nd
  LEFT JOIN news_categories nc ON nd.id = nc.news_id
  LEFT JOIN categories c ON nc.category_id = c.id
  ORDER BY nd.publish_date DESC
  LIMIT ${limit} OFFSET ${offset};
`);

    // Get total count
    const countResult = await db.execute(sql`
      SELECT COUNT(*) as total
      FROM news n
      JOIN authors a ON n.author_id = a.id
      WHERE a.slug = ${slug} 
        AND n.publish_status = 'active' 
        AND n.active_status = 'active'
    `);

    const totalCount = Number(countResult.rows[0]?.total || 0);
    const totalPages = Math.ceil(totalCount / limit);

    // Check if author exists
    if (!result.rows || result.rows.length === 0) {
      const authorResult = await db.execute(sql`
        SELECT 
          a.id as author_id,
          a.name as author_name,
          a.slug as author_slug,
          a.position,
          a.description as author_description,
          a.facebook_link,
          a.instagram_link,
          a.twitter_link,
          a.muckrack_link,
          a.personal_portfolio,
          a.linkedin,
          a.publish_status as author_status,
          am.id as author_image_id,
          am.title as author_image_title,
          am.slug as author_image_slug,
          am.caption as author_image_caption,
          am.file_path as author_image_file_path,
          am.type as author_image_type
        FROM authors a
        LEFT JOIN media am ON a.image = am.id
        WHERE a.slug = ${slug}
      `);

      if (!authorResult.rows || authorResult.rows.length === 0) {
        return {
          success: false,
          message: "Author not found",
          data: null,
        };
      }

      const firstRow = authorResult.rows[0];
      return {
        success: true,
        data: {
          author: {
            id: firstRow.author_id,
            name: firstRow.author_name,
            slug: firstRow.author_slug,
            position: firstRow.position,
            description: firstRow.author_description,
            socialLinks: {
              facebook: firstRow.facebook_link,
              instagram: firstRow.instagram_link,
              twitter: firstRow.twitter_link,
              muckrack: firstRow.muckrack_link,
              portfolio: firstRow.personal_portfolio,
              linkedin: firstRow.linkedin,
            },
            publishStatus: firstRow.author_status,
            image: firstRow.author_image_id
              ? {
                  id: firstRow.author_image_id,
                  title: firstRow.author_image_title,
                  slug: firstRow.author_image_slug,
                  caption: firstRow.author_image_caption,
                  filePath: firstRow.author_image_file_path,
                  type: firstRow.author_image_type,
                }
              : null,
          },
          news: [],
          pagination: {
            currentPage: page,
            totalPages: 0,
            totalCount: 0,
            limit,
            hasNextPage: false,
            hasPrevPage: false,
          },
        },
      };
    }

    // Format the response
    const firstRow = result.rows[0];

    return {
      success: true,
      data: {
        author: {
          id: firstRow.author_id,
          name: firstRow.author_name,
          slug: firstRow.author_slug,
          position: firstRow.position,
          description: firstRow.author_description,
          socialLinks: {
            facebook: firstRow.facebook_link,
            instagram: firstRow.instagram_link,
            twitter: firstRow.twitter_link,
            muckrack: firstRow.muckrack_link,
            portfolio: firstRow.personal_portfolio,
            linkedin: firstRow.linkedin,
          },
          publishStatus: firstRow.author_status,
          image: firstRow.author_image_id
            ? {
                id: firstRow.author_image_id,
                title: firstRow.author_image_title,
                slug: firstRow.author_image_slug,
                caption: firstRow.author_image_caption,
                filePath: firstRow.author_image_file_path,
                type: firstRow.author_image_type,
              }
            : null,
        },
        news: result.rows.map((row) => ({
          id: row.id,
          title: row.title,
          slug: row.slug,
          publishDate: row.publish_date,
          featureImage: row.feature_image_id
            ? {
                id: row.feature_image_id,
                title: row.feature_image_title,
                slug: row.feature_image_slug,
                caption: row.feature_image_caption,
                filePath: row.feature_image_file_path,
                type: row.feature_image_type,
              }
            : null,
          category: row.category_id
            ? {
                id: row.category_id,
                name: row.category_name,
                slug: row.category_slug,
              }
            : null,
        })),
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          limit,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      },
    };
  } catch (error: any) {
    console.error("Error fetching author news (optimized):", error);
    return {
      success: false,
      message: "Failed to fetch author news",
      error: error.message,
      data: null,
    };
  }
}