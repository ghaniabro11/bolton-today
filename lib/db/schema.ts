import { sql } from "drizzle-orm";
import {
  index,
  integer,
  pgEnum,
  PgSerial,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";

// Enums

export const statusEnum = pgEnum("status", ["active", "inactive"]);
export const roleEnum = pgEnum("role", ["admin", "editor"]);
export const mediaTypeEnum = pgEnum("media_type", [
  "image",
  "video",
  "document",
  "audio",
]);
export const publishStatusEnum = pgEnum("publish_status", [
  "active",
  "inactive",
]);
export const activeStatusEnum = pgEnum("active_status", ["active", "inactive"]);

// Users Table
export const users = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    username: varchar("username", { length: 50 }).notNull().unique(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    fullname: text("fullname").notNull(),
    password: varchar("password", { length: 255 }).notNull(),
    status: statusEnum("status").notNull().default("inactive"),
    role: roleEnum("role").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => ({
    usernameIdx: uniqueIndex("users_username_idx").on(table.username),
    emailIdx: uniqueIndex("users_email_idx").on(table.email),
    statusIdx: index("users_status_idx").on(table.status), // For filtering by status
  })
);

// Media Table
export const media = pgTable(
  "media",
  {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    caption: text("caption"),
    filePath: varchar("file_path", { length: 255 }).notNull(),
    type: mediaTypeEnum("type").notNull().default("image"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => ({
    slugIdx: uniqueIndex("media_slug_idx").on(table.slug),
    idIdx: index("media_id_idx").on(table.id),
  })
);

// Categories Table
export const categories = pgTable(
  "categories",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    description: text("description"),
    status: statusEnum("status").notNull().default("active"),
    metaTitle: text("meta_title"),
    metaDescription: text("meta_description"),
    keywords: text("keywords"),

    image: integer("image").references(() => media.id, {
      onDelete: "set null",
    }),

    parentCategoryId: integer("parent_category_id").references(
      (): PgSerial<any> => categories.id,
      { onDelete: "set null" }
    ),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => ({
    slugIdx: uniqueIndex("categories_slug_idx").on(table.slug),
    parentIdx: index("categories_parent_idx").on(table.parentCategoryId),
    statusIdx: index("categories_status_idx").on(table.status),
    createdAtIdx: index("categories_created_at_idx").on(table.createdAt), // For sorting/filtering
  })
);

// Authors Table
export const authors = pgTable(
  "authors",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull(),
    position: varchar("position", { length: 255 }),
    publishStatus: publishStatusEnum("publish_status")
      .notNull()
      .default("active"),
    description: text("description"),
    facebookLink: varchar("facebook_link", { length: 255 }),
    instagramLink: varchar("instagram_link", { length: 255 }),
    twitterLink: varchar("twitter_link", { length: 255 }),
    muckrackLink: varchar("muckrack_link", { length: 255 }),
    personalPortfolio: varchar("personal_portfolio", { length: 255 }),
    linkedin: varchar("linkedin", { length: 255 }),
    image: integer("image").references(() => media.id, {
      onDelete: "set null",
    }),

    metaTitle: varchar("meta_title", { length: 255 }),
    metaDescription: varchar("meta_description", { length: 500 }),
    keywords: text("keywords"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => ({
    nameIdx: index("authors_name_idx").on(table.name),
    slugIdx: uniqueIndex("authors_slug_idx").on(table.slug),
    publishStatusIdx: index("authors_publish_status_idx").on(
      table.publishStatus
    ),
    createdAtIdx: index("authors_created_at_idx").on(table.createdAt), // For sorting/filtering
  })
);

export const news = pgTable(
  "news",
  {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull(),
    description: text("description"),
    details: text("details"),
    publishStatus: publishStatusEnum("publish_status")
      .notNull()
      .default("active"),
    activeStatus: activeStatusEnum("active_status").notNull().default("active"),
    publishDate: timestamp("publish_date").notNull().defaultNow(),
    metaTitle: varchar("meta_title", { length: 255 }),
    metaDescription: text("meta_description"),
    keywords: text("keywords"),
    featureImage: integer("feature_image").references(() => media.id, {
      onDelete: "set null",
    }),
    authorId: integer("author_id").references(() => authors.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    searchVector: text("search_vector")
      .$type<string>()
      .generatedAlwaysAs(
        sql`to_tsvector('english', coalesce(title, '') || ' ' || coalesce(description, ''))`
      ),
  },
  (table) => ({
    slugIdx: uniqueIndex("news_slug_idx").on(table.slug),
    publishStatusIdx: index("news_publish_status_idx").on(table.publishStatus),
    activeStatusIdx: index("news_active_status_idx").on(table.activeStatus),
    publishDateIdx: index("news_publish_date_idx").on(table.publishDate),
    authorIdx: index("news_author_idx").on(table.authorId),
    createdAtIdx: index("news_created_at_idx").on(table.createdAt), // For sorting/filtering
    statusCompositeIdx: index("news_status_composite_idx").on(
      table.publishStatus,
      table.activeStatus
    ), // For combined status filters
    searchIdx: index("news_search_idx").on(table.searchVector),
  })
);

export const newsCategories = pgTable(
  "news_categories",
  {
    newsId: integer("news_id")
      .notNull()
      .references(() => news.id, { onDelete: "cascade" }),
    categoryId: integer("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "cascade" }),
    newsSlug: text("news_slug")
      .notNull(),
    categorySlug: text("category_slug")
      .notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => ({
    // Composite primary key
    pk: primaryKey({ columns: [table.newsId, table.categoryId] }),

    // Indexes for join searches
    newsIdx: index("news_categories_news_idx").on(table.newsId),
    categoryIdx: index("news_categories_category_idx").on(table.categoryId),

    // Added indexes on slug fields for faster lookups
    newsSlugIdx: index("news_categories_news_slug_idx").on(table.newsSlug),
    categorySlugIdx: index("news_categories_category_slug_idx").on(table.categorySlug),
  })
);
export const magzines = pgTable(
  "magzines",
  {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    description: text("description"),
    coverImage: integer("cover_image").references(() => media.id, {
      onDelete: "set null",
    }),
    pdfFile: integer("pdf_file").references(() => media.id, {
      onDelete: "set null",
    }),
    status: statusEnum("status").notNull().default("inactive"),

    metaTitle: varchar("meta_title", { length: 255 }),
    metaDescription: varchar("meta_description", { length: 500 }),
    keywords: text("keywords"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => ({
    slugIdx: uniqueIndex("documents_slug_idx").on(table.slug),
    titleIdx: index("documents_title_idx").on(table.title),
    createdAtIdx: index("documents_created_at_idx").on(table.createdAt),
  })
);
