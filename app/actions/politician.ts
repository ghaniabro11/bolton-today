import { db } from "@/lib/db/db";
import { politicians, media } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
export const dynamic = "force-dynamic";

export async function getPoliticianById(id: number) {
  const politician = await db
    .select({
      id: politicians.id,
      name: politicians.name,
      slug: politicians.slug,
      position: politicians.position,
      description: politicians.description,
      facebookLink: politicians.facebookLink,
      instagramLink: politicians.instagramLink,
      twitterLink: politicians.twitterLink,
      muckrackLink: politicians.muckrackLink,
      personalPortfolio: politicians.personalPortfolio,
      linkedin: politicians.linkedin,
      metaTitle: politicians.metaTitle,
      metaDescription: politicians.metaDescription,
      keywords: politicians.keywords,
      publishStatus: politicians.publishStatus,
      image: {
        id: media.id,
        title: media.title,
        type: media.type,
        filePath: media.filePath,
      },
    })
    .from(politicians)
    .leftJoin(media, eq(media.id, politicians.image))
    .where(eq(politicians.id, id));

  return politician[0] || null;
}

export async function getPoliticians() {
  const politiciansData = await db
    .select({ id: politicians.id, name: politicians.name })
    .from(politicians);
  return politiciansData ?? [];
}
