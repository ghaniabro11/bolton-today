import { sql } from "drizzle-orm";
export const dynamic = "force-dynamic";

// Define the data structure for news
export interface NewsItem {
  title: string;
  slug: string;
  authorName: string | null;
  authorSlug: string | null;
  authorId: number | null;
  publishDate: Date | null;
  categoryName: string | null;
  categorySlug: string | null;
  image: string | null;
}

// Define the response structure
export interface NewsResponse {
  latest: NewsItem[] | null;
  opinionCategory: NewsItem[] | null;
  lightHouseCat: NewsItem[] | null;
  donalTrumpCat: NewsItem[] | null;
  capitolHillPoliticsCat: NewsItem[] | null;
  diplomacyCat: NewsItem[] | null;
  securityCat: NewsItem[] | null;
  usNationWideCat: NewsItem[] | null;
  businessFinanceCat: NewsItem[] | null;
  floridaCat: NewsItem[] | null;
  europeCat: NewsItem[] | null;
  middleEastCat: NewsItem[] | null;
}

// Assume db is your Drizzle ORM database instance
async function fetchNewsData(db: any): Promise<NewsResponse> {
  try {
    // Base SQL query for news data with joins
    const baseQuery = sql`
      SELECT 
        n.title,
        n.slug,
        a.name AS authorName,
        a.slug AS authorSlug,
        a.id AS authorId,
        n.publish_date AS publishDate,
        c.name AS categoryName,
        c.slug AS categorySlug,
        m.file_path AS image,
        m.title AS imageTitle,
        m.slug AS imageSlug,
        m.caption AS imageCaption
      FROM news n
      LEFT JOIN authors a ON n.author_id = a.id
      LEFT JOIN media m ON n.feature_image = m.id
      LEFT JOIN news_categories nc ON n.id = nc.news_id
      LEFT JOIN categories c ON nc.category_id = c.id
      WHERE n.publish_status = 'active' AND n.active_status = 'active'
    `;
    const latestPostQuery = sql`
    SELECT 
      n.title,
      n.slug,
      a.name AS authorName,
      a.slug AS authorSlug,
      a.id AS authorId,
      n.publish_date AS publishDate,
      c.name AS categoryName,
      c.slug AS categorySlug,
      m.file_path AS image,
      m.title AS imageTitle,
      m.slug AS imageSlug,
      m.caption AS imageCaption
    FROM news n
    LEFT JOIN authors a ON n.author_id = a.id
    LEFT JOIN media m ON n.feature_image = m.id
    LEFT JOIN news_categories nc ON n.id = nc.news_id
    LEFT JOIN categories c ON nc.category_id = c.id
    WHERE n.publish_status = 'active' AND n.active_status = 'active'
    AND (nc.category_id IS NULL OR nc.category_id != 104)
  `;
    // Fetch latest 4 news items
    const latestQuery = sql`
      ${latestPostQuery}
      ORDER BY n.publish_date DESC
      LIMIT 6
    `;
    const latestResult = await db.execute(latestQuery);
    const latest = latestResult.rows.length > 0 ? latestResult.rows : null;

    // Fetch news for category ID 1, limit 4
    const opinionCategoryQuery = sql`
      ${baseQuery}
      AND nc.category_id = 12
      ORDER BY n.publish_date DESC
      LIMIT 5
    `;
    const opinionCategoryResult = await db.execute(opinionCategoryQuery);
    const opinionCategory =
      opinionCategoryResult.rows.length > 0 ? opinionCategoryResult.rows : null;

    // Fetch news for category ID 2, limit 4
    const lightHouseCatQuery = sql`
      ${baseQuery}
      AND nc.category_id = 16
      ORDER BY n.publish_date DESC
      LIMIT 10
    `;
    const lightHouseCatResult = await db.execute(lightHouseCatQuery);
    const lightHouseCat =
      lightHouseCatResult.rows.length > 0 ? lightHouseCatResult.rows : null;

    // Fetch news for category ID 3, limit 4
    const donalTrumpCatQuery = sql`
      ${baseQuery}
      AND nc.category_id = 17
      ORDER BY n.publish_date DESC
      LIMIT 8
    `;
    const donalTrumpCatResult = await db.execute(donalTrumpCatQuery);
    const donalTrumpCat =
      donalTrumpCatResult.rows.length > 0 ? donalTrumpCatResult.rows : null;

    // Fetch news for category ID 3, limit 4
    const capitolHillPoliticsCatQuery = sql`
      ${baseQuery}
      AND nc.category_id = 5
      ORDER BY n.publish_date DESC
      LIMIT 11
    `;
    const capitolHillPoliticsCatResult = await db.execute(
      capitolHillPoliticsCatQuery
    );
    const capitolHillPoliticsCat =
      capitolHillPoliticsCatResult.rows.length > 0
        ? capitolHillPoliticsCatResult.rows
        : null;

    // // Fetch news for category ID 3, limit 4
    const diplomacyCatQuery = sql`
      ${baseQuery}
      AND nc.category_id = 10
      ORDER BY n.publish_date DESC
      LIMIT 9
    `;
    const diplomacyCatResult = await db.execute(diplomacyCatQuery);
    const diplomacyCat =
      diplomacyCatResult.rows.length > 0 ? diplomacyCatResult.rows : null;

    const securityCatQuery = sql`
      ${baseQuery}
      AND nc.category_id = 2
      ORDER BY n.publish_date DESC
      LIMIT 10
    `;
    const securityCatResult = await db.execute(securityCatQuery);
    const securityCat =
      securityCatResult.rows.length > 0 ? securityCatResult.rows : null;

    const usNationWideCatQuery = sql`
      ${baseQuery}
      AND nc.category_id = 6
      ORDER BY n.publish_date DESC
      LIMIT 15
    `;
    const usNationWideCatResult = await db.execute(usNationWideCatQuery);
    const usNationWideCat =
      usNationWideCatResult.rows.length > 0 ? usNationWideCatResult.rows : null;

    const businessFinanceCatQuery = sql`
      ${baseQuery}
      AND nc.category_id = 9
      ORDER BY n.publish_date DESC
      LIMIT 15
    `;
    const businessFinanceCatResult = await db.execute(businessFinanceCatQuery);
    const businessFinanceCat =
      businessFinanceCatResult.rows.length > 0
        ? businessFinanceCatResult.rows
        : null;

    const floridaCatQuery = sql`
      ${baseQuery}
      AND nc.category_id = 19
      ORDER BY n.publish_date DESC
      LIMIT 7
    `;
    const floridaCatResult = await db.execute(floridaCatQuery);
    const floridaCat =
      floridaCatResult.rows.length > 0 ? floridaCatResult.rows : null;

    const europeCatQuery = sql`
      ${baseQuery}
      AND nc.category_id = 3
      ORDER BY n.publish_date DESC
      LIMIT 4
    `;
    const europeCatResult = await db.execute(europeCatQuery);
    const europeCat =
      europeCatResult.rows.length > 0 ? europeCatResult.rows : null;

    const middleEastCatQuery = sql`
      ${baseQuery}
      AND nc.category_id = 8
      ORDER BY n.publish_date DESC
      LIMIT 8
    `;
    const middleEastCatResult = await db.execute(middleEastCatQuery);
    const middleEastCat =
      middleEastCatResult.rows.length > 0 ? middleEastCatResult.rows : null;

    // const middleEastCatQuery = sql`
    //   ${baseQuery}
    //   AND nc.category_id = 3
    //   ORDER BY n.publish_date DESC
    //   LIMIT 4
    // `;
    // const donalTrumpCatResult = await db.execute(donalTrumpCatQuery);
    // const donalTrumpCat = donalTrumpCatResult.rows.length > 0 ? donalTrumpCatResult.rows : null;

    // Return the structured response
    return {
      latest,
      opinionCategory,
      lightHouseCat,
      donalTrumpCat,
      capitolHillPoliticsCat,
      diplomacyCat,
      securityCat,
      usNationWideCat,
      businessFinanceCat,
      floridaCat,
      europeCat,
      middleEastCat,
    };
  } catch (error) {
    console.error("Error fetching news data:", error);
    // Return null for all sections in case of an error
    return {
      latest: null,
      opinionCategory: null,
      lightHouseCat: null,
      donalTrumpCat: null,
      capitolHillPoliticsCat: null,
      diplomacyCat: null,
      securityCat: null,
      usNationWideCat: null,
      businessFinanceCat: null,
      floridaCat: null,
      europeCat: null,
      middleEastCat: null,
    };
  }
}

// Example usage
// async function example() {
//   const db = yourDrizzleDbInstance; // Replace with your Drizzle ORM instance
//   const newsData = await fetchNewsData(db);
//   console.log(newsData);
// }

export default fetchNewsData;
