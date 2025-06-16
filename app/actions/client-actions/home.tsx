import { sql } from "drizzle-orm";
export const dynamic = "force-dynamic";

// Define the data structure for news
export interface NewsItem {
  title: string;
  slug: string;
  description: string;
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
  categoryOne: NewsItem[] | null;
  categoryTwo: NewsItem[] | null;
  categoryThree: NewsItem[] | null;
  categoryFour: NewsItem[] | null;
  categoryFive: NewsItem[] | null;
  categorySix: NewsItem[] | null;
  categorySeven: NewsItem[] | null;
  categoryEight: NewsItem[] | null;
  categoryNine: NewsItem[] | null;
  categoryTen: NewsItem[] | null;
  categoryEleven: NewsItem[] | null;
  categoryTwelve: NewsItem[] | null;
  categoryThirteen: NewsItem[] | null;
  categoryFourteen: NewsItem[] | null;
  // categoryFiveteen: NewsItem[] | null;
}

// Assume db is your Drizzle ORM database instance
async function fetchNewsData(db: any): Promise<NewsResponse> {
  try {
    // Base SQL query for news data with joins
    const baseQuery = sql`
      SELECT 
        n.title,
        n.slug,
        n.description,
        a.name AS authorName,
        a.slug AS authorSlug,
        a.id AS authorId,
        n.publish_date AS publishDate,
        c.name AS categoryName,
        c.slug AS categorySlug,
        c.description AS categorydes,
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
          WITH RECURSIVE category_path AS (
          SELECT 
            c.id,
            c.slug,
            c.parent_category_id,
            c.slug::TEXT AS full_slug
          FROM categories c
          WHERE c.parent_category_id IS NULL

          UNION ALL

          SELECT 
            child.id,
            child.slug,
            child.parent_category_id,
            (parent.full_slug || '/' || child.slug) AS full_slug
          FROM categories child
          INNER JOIN category_path parent ON child.parent_category_id = parent.id
        )

        SELECT 
          n.title,
          n.slug AS slug,
          n.description AS description,
          n.publish_date AS publishDate,
          a.name AS authorName,
          a.slug AS authorSlug,
          a.id AS authorId,
          cp.full_slug AS categoryslug,
          cp.id AS categoryId,
          c.name AS categoryName,
          m.file_path AS image,
          m.title AS imageTitle,
          m.slug AS imageSlug,
          m.caption AS imageCaption
        FROM news n
        LEFT JOIN authors a ON n.author_id = a.id
        LEFT JOIN media m ON n.feature_image = m.id
        LEFT JOIN news_categories nc ON n.id = nc.news_id
        LEFT JOIN categories c ON nc.category_id = c.id
        LEFT JOIN category_path cp ON c.id = cp.id
        WHERE n.publish_status = 'active' 
          AND n.active_status = 'active'
`;
    // Fetch latest 4 news items
    const latestQuery = sql`
      ${latestPostQuery}
      ORDER BY n.publish_date DESC
      LIMIT 7
    `;
    const latestResult = await db.execute(latestQuery);
    const latest = latestResult.rows.length > 0 ? latestResult.rows : null;

    // Fetch news for category ID 1, limit 7
    const categoryOneQuery = sql`
      ${baseQuery}
      AND nc.category_id = 1
      ORDER BY n.publish_date DESC
      LIMIT 7
    `;
    const categoryOneResult = await db.execute(categoryOneQuery);
    const categoryOne =
      categoryOneResult.rows.length > 0 ? categoryOneResult.rows : null;

    // Fetch news for category ID 2, limit 7
    const categoryTwoQuery = sql`
      ${baseQuery}
      AND nc.category_id = 2
      ORDER BY n.publish_date DESC
      LIMIT 7
    `;
    const categoryTwoResult = await db.execute(categoryTwoQuery);
    const categoryTwo =
      categoryTwoResult.rows.length > 0 ? categoryTwoResult.rows : null;

    // Fetch news for category ID 3, limit 7
    const categoryThreeQuery = sql`
      ${baseQuery}
      AND nc.category_id = 3
      ORDER BY n.publish_date DESC
      LIMIT 7
    `;
    const categoryThreeResult = await db.execute(categoryThreeQuery);
    const categoryThree =
      categoryThreeResult.rows.length > 0 ? categoryThreeResult.rows : null;

    // Fetch news for category ID 3, limit 7
    const categoryFourQuery = sql`
      ${baseQuery}
      AND nc.category_id = 4
      ORDER BY n.publish_date DESC
      LIMIT 7
    `;
    const categoryFourResult = await db.execute(categoryFourQuery);
    const categoryFour =
      categoryFourResult.rows.length > 0 ? categoryFourResult.rows : null;

    // // Fetch news for category ID 3, limit 7
    const categoryFiveQuery = sql`
      ${baseQuery}
      AND nc.category_id = 5
      ORDER BY n.publish_date DESC
      LIMIT 7
    `;
    const categoryFiveResult = await db.execute(categoryFiveQuery);
    const categoryFive =
      categoryFiveResult.rows.length > 0 ? categoryFiveResult.rows : null;

    const categorySixQuery = sql`
      ${baseQuery}
      AND nc.category_id = 6
      ORDER BY n.publish_date DESC
      LIMIT 7
    `;
    const categorySixResult = await db.execute(categorySixQuery);
    const categorySix =
      categorySixResult.rows.length > 0 ? categorySixResult.rows : null;

    const categorySevenQuery = sql`
      ${baseQuery}
      AND nc.category_id = 7
      ORDER BY n.publish_date DESC
      LIMIT 7
    `;
    const categorySevenResult = await db.execute(categorySevenQuery);
    const categorySeven =
      categorySevenResult.rows.length > 0 ? categorySevenResult.rows : null;

    const categoryEightQuery = sql`
      ${baseQuery}
      AND nc.category_id = 8
      ORDER BY n.publish_date DESC
      LIMIT 7
    `;
    const categoryEightResult = await db.execute(categoryEightQuery);
    const categoryEight =
      categoryEightResult.rows.length > 0 ? categoryEightResult.rows : null;

    const categoryNineQuery = sql`
      ${baseQuery}
      AND nc.category_id = 9
      ORDER BY n.publish_date DESC
      LIMIT 7
    `;
    const categoryNineResult = await db.execute(categoryNineQuery);
    const categoryNine =
      categoryNineResult.rows.length > 0 ? categoryNineResult.rows : null;

    const categoryTenQuery = sql`
      ${baseQuery}
      AND nc.category_id = 10
      ORDER BY n.publish_date DESC
      LIMIT 7
    `;
    const categoryTenResult = await db.execute(categoryTenQuery);
    const categoryTen =
      categoryTenResult.rows.length > 0 ? categoryTenResult.rows : null;

    const categoryElevenQuery = sql`
      ${baseQuery}
      AND nc.category_id = 11
      ORDER BY n.publish_date DESC
      LIMIT 7
    `;
    const categoryElevenResult = await db.execute(categoryElevenQuery);
    const categoryEleven =
      categoryElevenResult.rows.length > 0 ? categoryElevenResult.rows : null;

    const categoryTwelveQuery = sql`
      ${baseQuery}
      AND nc.category_id = 12
      ORDER BY n.publish_date DESC
      LIMIT 7
    `;
    const categoryTwelveResult = await db.execute(categoryTwelveQuery);
    const categoryTwelve =
      categoryTwelveResult.rows.length > 0 ? categoryTwelveResult.rows : null;

    const categoryThirteenQuery = sql`
      ${baseQuery}
      AND nc.category_id = 13
      ORDER BY n.publish_date DESC
      LIMIT 7
    `;
    const categoryThirteenResult = await db.execute(categoryThirteenQuery);
    const categoryThirteen =
      categoryThirteenResult.rows.length > 0
        ? categoryThirteenResult.rows
        : null;

    const categoryFourteenQuery = sql`
      ${baseQuery}
      AND nc.category_id = 14
      ORDER BY n.publish_date DESC
      LIMIT 7
    `;
    const categoryFourteenResult = await db.execute(categoryFourteenQuery);
    const categoryFourteen =
      categoryFourteenResult.rows.length > 0
        ? categoryFourteenResult.rows
        : null;

    // const categoryElevenQuery = sql`
    //   ${baseQuery}
    //   AND nc.category_id = 3
    //   ORDER BY n.publish_date DESC
    //   LIMIT 7
    // `;
    // const categoryThreeResult = await db.execute(categoryThreeQuery);
    // const categoryThree = categoryThreeResult.rows.length > 0 ? categoryThreeResult.rows : null;

    // Return the structured response
    return {
      latest,
      categoryOne,
      categoryTwo,
      categoryThree,
      categoryFour,
      categoryFive,
      categorySix,
      categorySeven,
      categoryEight,
      categoryNine,
      categoryTen,
      categoryEleven,
      categoryTwelve,
      categoryThirteen,
      categoryFourteen,
      // categoryFiveteen,
    };
  } catch (error) {
    console.error("Error fetching news data:", error);
    // Return null for all sections in case of an error
    return {
      latest: null,
      categoryOne: null,
      categoryTwo: null,
      categoryThree: null,
      categoryFour: null,
      categoryFive: null,
      categorySix: null,
      categorySeven: null,
      categoryEight: null,
      categoryNine: null,
      categoryTen: null,
      categoryEleven: null,
      categoryTwelve: null,
      categoryThirteen: null,
      categoryFourteen: null,
      // categoryFiveteen: null,
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
