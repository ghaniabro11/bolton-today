import { db } from "@/lib/db/db";
import { sql } from "drizzle-orm";

export const dynamic = "force-dynamic";


export async function getAllPoliticians({
  page = 1,
  limit = 12,
}: {
  page?: number;
  limit?: number;
}) {
  try {
    const offset = (page - 1) * limit;

    const result = await db.execute(sql`
      SELECT
        j.id,
        j.name,
        j.slug,
        j.position,
        j.description,
        j.publish_status,

        m.id as image_id,
        m.title as image_title,
        m.slug as image_slug,
        m.caption as image_caption,
        m.file_path as image_file_path,
        m.type as image_type

      FROM politicians j

      LEFT JOIN media m
        ON j.image = m.id

      WHERE j.publish_status = 'active'

      ORDER BY j.id DESC

      LIMIT ${limit}
      OFFSET ${offset}
    `);

    const countResult = await db.execute(sql`
      SELECT COUNT(*) as total
      FROM politicians
      WHERE publish_status = 'active'
    `);

    const totalCount = Number(countResult.rows[0]?.total || 0);

    return {
      success: true,

      data: result.rows.map((row: any) => ({
        id: row.id,
        name: row.name,
        slug: row.slug,
        position: row.position,
        description: row.description,

        image: row.image_id
          ? {
              id: row.image_id,
              title: row.image_title,
              slug: row.image_slug,
              caption: row.image_caption,
              filePath: row.image_file_path,
              type: row.image_type,
            }
          : null,
      })),

      pagination: {
        currentPage: page,
        totalCount,
        limit,
      },
    };
  } catch (error: any) {
    console.error("Error fetching politicians listing:", error);

    return {
      success: false,
      message: "Failed to fetch politicians",
      error: error.message,
      data: [],
    };
  }
}


export async function getPoliticianNewsWithCategoriesOptimized({
  slug,
  page = 1,
}: {
  slug: any;
  page: any;
}) {
  try {
    const result = await db.execute(sql`
      WITH RECURSIVE politician_data AS (
        SELECT 
          a.id as politician_id,
          a.name as politician_name,
          a.slug as politician_slug,
          a.position,
          a.description as politician_description,
          a.facebook_link,
          a.instagram_link,
          a.twitter_link,
          a.muckrack_link,
          a.personal_portfolio,
          a.linkedin,
          a.publish_status as politician_status,
          am.id as politician_image_id,
          am.title as politician_image_title,
          am.slug as politician_image_slug,
          am.caption as politician_image_caption,
          am.file_path as politician_image_file_path,
          am.type as politician_image_type
        FROM politicians a
        LEFT JOIN media am ON a.image = am.id
        WHERE a.slug = ${slug}
      ),

      category_hierarchy AS (
        SELECT 
          id,
          parent_category_id,
          slug::TEXT AS full_slug
        FROM categories
        WHERE parent_category_id IS NULL

        UNION ALL

        SELECT 
          c.id,
          c.parent_category_id,
          (ch.full_slug || '/' || c.slug) AS full_slug
        FROM categories c
        INNER JOIN category_hierarchy ch 
          ON c.parent_category_id = ch.id
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

          ad.politician_id,
          ad.politician_name,
          ad.politician_slug,
          ad.position,
          ad.politician_description,
          ad.facebook_link,
          ad.instagram_link,
          ad.twitter_link,
          ad.muckrack_link,
          ad.personal_portfolio,
          ad.linkedin,
          ad.politician_status,
          ad.politician_image_id,
          ad.politician_image_title,
          ad.politician_image_slug,
          ad.politician_image_caption,
          ad.politician_image_file_path,
          ad.politician_image_type

        FROM news n
        CROSS JOIN politician_data ad
        LEFT JOIN media nm ON n.feature_image = nm.id

        WHERE n.publish_status = 'active'
          AND n.active_status = 'active'

        ORDER BY n.id, n.publish_date DESC
      )

      SELECT 
        nd.*,
        c.id as category_id,
        c.name as category_name,
        c.slug as category_slug,
        ch.full_slug as category_full_slug

      FROM news_data nd
      LEFT JOIN news_categories nc 
        ON nd.id = nc.news_id

      LEFT JOIN categories c 
        ON nc.category_id = c.id

      LEFT JOIN category_hierarchy ch 
        ON c.id = ch.id

      ORDER BY nd.publish_date DESC
    `);

    // total count
    const countResult = await db.execute(sql`
      SELECT COUNT(*) as total
      FROM news n
      WHERE n.publish_status = 'active'
        AND n.active_status = 'active'
    `);

    const totalCount = Number(countResult.rows[0]?.total || 0);

    // Politician check
    if (!result.rows || result.rows.length === 0) {
      const politicianResult = await db.execute(sql`
        SELECT 
          a.id as politician_id,
          a.name as politician_name,
          a.slug as politician_slug,
          a.position,
          a.description as politician_description,
          a.facebook_link,
          a.instagram_link,
          a.twitter_link,
          a.muckrack_link,
          a.personal_portfolio,
          a.linkedin,
          a.publish_status as politician_status,

          am.id as politician_image_id,
          am.title as politician_image_title,
          am.slug as politician_image_slug,
          am.caption as politician_image_caption,
          am.file_path as politician_image_file_path,
          am.type as politician_image_type

        FROM politicians a
        LEFT JOIN media am ON a.image = am.id
        WHERE a.slug = ${slug}
      `);

      if (!politicianResult.rows?.length) {
        return {
          success: false,
          message: "Politician not found",
          data: null,
        };
      }

      const firstRow = politicianResult.rows[0];

      return {
        success: true,
        data: {
          politician: firstRow,
          news: [],
          pagination: {
            currentPage: page,
            totalCount: 0,
          },
        },
      };
    }

    const firstRow = result.rows[0];

    return {
      success: true,
      data: {
        politician: {
          id: firstRow.politician_id,
          name: firstRow.politician_name,
          slug: firstRow.politician_slug,
          position: firstRow.position,
          description: firstRow.politician_description,

          socialLinks: {
            facebook: firstRow.facebook_link,
            instagram: firstRow.instagram_link,
            twitter: firstRow.twitter_link,
            muckrack: firstRow.muckrack_link,
            portfolio: firstRow.personal_portfolio,
            linkedin: firstRow.linkedin,
          },

          publishStatus: firstRow.politician_status,

          image: firstRow.politician_image_id
            ? {
                id: firstRow.politician_image_id,
                title: firstRow.politician_image_title,
                slug: firstRow.politician_image_slug,
                caption: firstRow.politician_image_caption,
                filePath: firstRow.politician_image_file_path,
                type: firstRow.politician_image_type,
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
                slug: row.category_full_slug,
              }
            : null,
        })),

        pagination: {
          currentPage: page,
          totalCount,
        },
      },
    };
  } catch (error: any) {
    console.error(
      "Error fetching politician news (optimized):",
      error
    );

    return {
      success: false,
      message: "Failed to fetch politician news",
      error: error.message,
      data: null,
    };
  }
}