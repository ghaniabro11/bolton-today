CREATE TYPE "public"."active_status" AS ENUM('active', 'inactive');--> statement-breakpoint
CREATE TYPE "public"."media_type" AS ENUM('image', 'video', 'document', 'audio');--> statement-breakpoint
CREATE TYPE "public"."publish_status" AS ENUM('active', 'inactive');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('admin', 'editor');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('active', 'inactive');--> statement-breakpoint
CREATE TABLE "authors" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"position" varchar(255),
	"publish_status" "publish_status" DEFAULT 'active' NOT NULL,
	"description" text,
	"facebook_link" varchar(255),
	"instagram_link" varchar(255),
	"twitter_link" varchar(255),
	"muckrack_link" varchar(255),
	"personal_portfolio" varchar(255),
	"linkedin" varchar(255),
	"image" integer,
	"meta_title" varchar(255),
	"meta_description" varchar(500),
	"keywords" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"status" "status" DEFAULT 'active' NOT NULL,
	"meta_title" text,
	"meta_description" text,
	"keywords" text,
	"image" integer,
	"parent_category_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "magzines" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"description" text,
	"cover_image" integer,
	"pdf_file" integer,
	"status" "status" DEFAULT 'inactive' NOT NULL,
	"meta_title" varchar(255),
	"meta_description" varchar(500),
	"keywords" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "magzines_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "media" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"caption" text,
	"file_path" varchar(255) NOT NULL,
	"type" "media_type" DEFAULT 'image' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "media_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "news" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"description" text,
	"details" text,
	"publish_status" "publish_status" DEFAULT 'active' NOT NULL,
	"active_status" "active_status" DEFAULT 'active' NOT NULL,
	"publish_date" timestamp DEFAULT now() NOT NULL,
	"meta_title" varchar(255),
	"meta_description" text,
	"keywords" text,
	"feature_image" integer,
	"author_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"search_vector" text GENERATED ALWAYS AS (to_tsvector('english', coalesce(title, '') || ' ' || coalesce(description, ''))) STORED
);
--> statement-breakpoint
CREATE TABLE "news_categories" (
	"news_id" integer NOT NULL,
	"category_id" integer NOT NULL,
	"news_slug" text NOT NULL,
	"category_slug" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "news_categories_news_id_category_id_pk" PRIMARY KEY("news_id","category_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" varchar(50) NOT NULL,
	"email" varchar(255) NOT NULL,
	"fullname" text NOT NULL,
	"password" varchar(255) NOT NULL,
	"status" "status" DEFAULT 'inactive' NOT NULL,
	"role" "role" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "authors" ADD CONSTRAINT "authors_image_media_id_fk" FOREIGN KEY ("image") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "categories_image_media_id_fk" FOREIGN KEY ("image") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "categories_parent_category_id_categories_id_fk" FOREIGN KEY ("parent_category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "magzines" ADD CONSTRAINT "magzines_cover_image_media_id_fk" FOREIGN KEY ("cover_image") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "magzines" ADD CONSTRAINT "magzines_pdf_file_media_id_fk" FOREIGN KEY ("pdf_file") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "news" ADD CONSTRAINT "news_feature_image_media_id_fk" FOREIGN KEY ("feature_image") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "news" ADD CONSTRAINT "news_author_id_authors_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."authors"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "news_categories" ADD CONSTRAINT "news_categories_news_id_news_id_fk" FOREIGN KEY ("news_id") REFERENCES "public"."news"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "news_categories" ADD CONSTRAINT "news_categories_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "authors_name_idx" ON "authors" USING btree ("name");--> statement-breakpoint
CREATE UNIQUE INDEX "authors_slug_idx" ON "authors" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "authors_publish_status_idx" ON "authors" USING btree ("publish_status");--> statement-breakpoint
CREATE INDEX "authors_created_at_idx" ON "authors" USING btree ("created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "categories_slug_idx" ON "categories" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "categories_parent_idx" ON "categories" USING btree ("parent_category_id");--> statement-breakpoint
CREATE INDEX "categories_status_idx" ON "categories" USING btree ("status");--> statement-breakpoint
CREATE INDEX "categories_created_at_idx" ON "categories" USING btree ("created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "documents_slug_idx" ON "magzines" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "documents_title_idx" ON "magzines" USING btree ("title");--> statement-breakpoint
CREATE INDEX "documents_created_at_idx" ON "magzines" USING btree ("created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "media_slug_idx" ON "media" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "media_id_idx" ON "media" USING btree ("id");--> statement-breakpoint
CREATE UNIQUE INDEX "news_slug_idx" ON "news" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "news_publish_status_idx" ON "news" USING btree ("publish_status");--> statement-breakpoint
CREATE INDEX "news_active_status_idx" ON "news" USING btree ("active_status");--> statement-breakpoint
CREATE INDEX "news_publish_date_idx" ON "news" USING btree ("publish_date");--> statement-breakpoint
CREATE INDEX "news_author_idx" ON "news" USING btree ("author_id");--> statement-breakpoint
CREATE INDEX "news_created_at_idx" ON "news" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "news_status_composite_idx" ON "news" USING btree ("publish_status","active_status");--> statement-breakpoint
CREATE INDEX "news_search_idx" ON "news" USING btree ("search_vector");--> statement-breakpoint
CREATE INDEX "news_categories_news_idx" ON "news_categories" USING btree ("news_id");--> statement-breakpoint
CREATE INDEX "news_categories_category_idx" ON "news_categories" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "news_categories_news_slug_idx" ON "news_categories" USING btree ("news_slug");--> statement-breakpoint
CREATE INDEX "news_categories_category_slug_idx" ON "news_categories" USING btree ("category_slug");--> statement-breakpoint
CREATE UNIQUE INDEX "users_username_idx" ON "users" USING btree ("username");--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "users_status_idx" ON "users" USING btree ("status");