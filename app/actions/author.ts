import { db } from "@/lib/db/db";
import { authors, media } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
export const dynamic = "force-dynamic";

export async function getAuthorById(id: number) {
  const author = await db
    .select({
      id: authors.id,
      name: authors.name,
      slug: authors.slug,
      position: authors.position,
      description: authors.description,
      facebookLink: authors.facebookLink,
      instagramLink: authors.instagramLink,
      twitterLink: authors.twitterLink,
      muckrackLink: authors.muckrackLink,
      personalPortfolio: authors.personalPortfolio,
      linkedin: authors.linkedin,
      metaTitle: authors.metaTitle,
      metaDescription: authors.metaDescription,
      keywords: authors.keywords,
      publishStatus: authors.publishStatus,
      image: {
        id: media.id,
        title: media.title,
        type: media.type,
        filePath: media.filePath,
      },
    })
    .from(authors)
    .leftJoin(media, eq(media.id, authors.image))
    .where(eq(authors.id, id));

  return author[0] || null;
}

export async function getAuthors() {
  const authorsData = await db
    .select({ id: authors.id, name: authors.name })
    .from(authors);
  return authorsData ?? [];
}
