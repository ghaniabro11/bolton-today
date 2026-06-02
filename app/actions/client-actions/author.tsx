import { db } from "@/lib/db/db";
import { sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function getContributorNewsWithCategoriesOptimized({
  slug,
  page = 1,
}: {
  slug: any;
  page: any;
}) {
  try {

    const result = await db.execute(sql`
      WITH RECURSIVE contributor_data AS (
        SELECT 
          a.id as contributor_id,
          a.name as contributor_name,
          a.slug as contributor_slug,
          a.position,
          a.description as contributor_description,
          a.facebook_link,
          a.instagram_link,
          a.twitter_link,
          a.muckrack_link,
          a.personal_portfolio,
          a.linkedin,
          a.publish_status as contributor_status,
          am.id as contributor_image_id,
          am.title as contributor_image_title,
          am.slug as contributor_image_slug,
          am.caption as contributor_image_caption,
          am.file_path as contributor_image_file_path,
          am.type as contributor_image_type
        FROM authors a
        LEFT JOIN media am ON a.image = am.id
        WHERE a.slug = ${slug}
        AND a.position = 'Contributor'
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
        INNER JOIN category_hierarchy ch ON c.parent_category_id = ch.id
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
          ad.contributor_id,
          ad.contributor_name,
          ad.contributor_slug,
          ad.position,
          ad.contributor_description,
          ad.facebook_link,
          ad.instagram_link,
          ad.twitter_link,
          ad.muckrack_link,
          ad.personal_portfolio,
          ad.linkedin,
          ad.contributor_status,
          ad.contributor_image_id,
          ad.contributor_image_title,
          ad.contributor_image_slug,
          ad.contributor_image_caption,
          ad.contributor_image_file_path,
          ad.contributor_image_type
        FROM news n
        CROSS JOIN contributor_data ad
        LEFT JOIN media nm ON n.feature_image = nm.id
        WHERE n.author_id = ad.contributor_id 
          AND n.publish_status = 'active' 
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
      LEFT JOIN news_categories nc ON nd.id = nc.news_id
      LEFT JOIN categories c ON nc.category_id = c.id
      LEFT JOIN category_hierarchy ch ON c.id = ch.id
      ORDER BY nd.publish_date DESC
    `);

    // Get total count
    const countResult = await db.execute(sql`
      SELECT COUNT(*) as total
      FROM news n
      JOIN authors a ON n.author_id = a.id
      WHERE a.slug = ${slug} 
        AND a.position = 'Contributor'
        AND n.publish_status = 'active' 
        AND n.active_status = 'active'
    `);

    const totalCount = Number(countResult.rows[0]?.total || 0);
    // Check if contributor exists
    if (!result.rows || result.rows.length === 0) {
      const contributorResult = await db.execute(sql`
        SELECT 
          a.id as contributor_id,
          a.name as contributor_name,
          a.slug as contributor_slug,
          a.position,
          a.description as contributor_description,
          a.facebook_link,
          a.instagram_link,
          a.twitter_link,
          a.muckrack_link,
          a.personal_portfolio,
          a.linkedin,
          a.publish_status as contributor_status,
          am.id as contributor_image_id,
          am.title as contributor_image_title,
          am.slug as contributor_image_slug,
          am.caption as contributor_image_caption,
          am.file_path as contributor_image_file_path,
          am.type as contributor_image_type
        FROM authors a
        LEFT JOIN media am ON a.image = am.id
        WHERE a.slug = ${slug}
          AND a.position = 'Contributor'
      `);

      if (!contributorResult.rows || contributorResult.rows.length === 0) {
        return {
          success: false,
          message: "Contributor not found",
          data: null,
        };
      }

      const firstRow = contributorResult.rows[0];
      return {
        success: true,
        data: {
          contributor: {
            id: firstRow.contributor_id,
            name: firstRow.contributor_name,
            slug: firstRow.contributor_slug,
            position: firstRow.position,
            description: firstRow.contributor_description,
            socialLinks: {
              facebook: firstRow.facebook_link,
              instagram: firstRow.instagram_link,
              twitter: firstRow.twitter_link,
              muckrack: firstRow.muckrack_link,
              portfolio: firstRow.personal_portfolio,
              linkedin: firstRow.linkedin,
            },
            publishStatus: firstRow.contributor_status,
            image: firstRow.contributor_image_id
              ? {
                id: firstRow.contributor_image_id,
                title: firstRow.contributor_image_title,
                slug: firstRow.contributor_image_slug,
                caption: firstRow.contributor_image_caption,
                filePath: firstRow.contributor_image_file_path,
                type: firstRow.contributor_image_type,
              }
              : null,
          },
          news: [],
          pagination: {
            currentPage: page,
            totalPages: 0,
            totalCount: 0,
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
        contributor: {
          id: firstRow.contributor_id,
          name: firstRow.contributor_name,
          slug: firstRow.contributor_slug,
          position: firstRow.position,
          description: firstRow.contributor_description,
          socialLinks: {
            facebook: firstRow.facebook_link,
            instagram: firstRow.instagram_link,
            twitter: firstRow.twitter_link,
            muckrack: firstRow.muckrack_link,
            portfolio: firstRow.personal_portfolio,
            linkedin: firstRow.linkedin,
          },
          publishStatus: firstRow.contributor_status,
          image: firstRow.contributor_image_id
            ? {
              id: firstRow.contributor_image_id,
              title: firstRow.contributor_image_title,
              slug: firstRow.contributor_image_slug,
              caption: firstRow.contributor_image_caption,
              filePath: firstRow.contributor_image_file_path,
              type: firstRow.contributor_image_type,
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
          totalCount
        },
      },
    };
  } catch (error: any) {
    console.error("Error fetching contributor news (optimized):", error);
    return {
      success: false,
      message: "Failed to fetch contributor news",
      error: error.message,
      data: null,
    };
  }
}
