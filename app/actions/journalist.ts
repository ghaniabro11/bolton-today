import { db } from "@/lib/db/db";
import { journalists, media } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
export const dynamic = "force-dynamic";

export async function getJournalistById(id: number) {
  const journalist = await db
    .select({
      id: journalists.id,
      name: journalists.name,
      slug: journalists.slug,
      position: journalists.position,
      description: journalists.description,
      facebookLink: journalists.facebookLink,
      instagramLink: journalists.instagramLink,
      twitterLink: journalists.twitterLink,
      muckrackLink: journalists.muckrackLink,
      personalPortfolio: journalists.personalPortfolio,
      linkedin: journalists.linkedin,
      metaTitle: journalists.metaTitle,
      metaDescription: journalists.metaDescription,
      keywords: journalists.keywords,
      publishStatus: journalists.publishStatus,
      image: {
        id: media.id,
        title: media.title,
        type: media.type,
        filePath: media.filePath,
      },
    })
    .from(journalists)
    .leftJoin(media, eq(media.id, journalists.image))
    .where(eq(journalists.id, id));

  return journalist[0] || null;
}

export async function getJournalists() {
  const journalistsData = await db
    .select({ id: journalists.id, name: journalists.name })
    .from(journalists);
  return journalistsData ?? [];
}
