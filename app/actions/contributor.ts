import { db } from "@/lib/db/db";
import { contributors, media } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
export const dynamic = "force-dynamic";

export async function getContributorById(id: number) {
  const contributor = await db
    .select({
      id: contributors.id,
      name: contributors.name,
      slug: contributors.slug,
      position: contributors.position,
      description: contributors.description,
      facebookLink: contributors.facebookLink,
      instagramLink: contributors.instagramLink,
      twitterLink: contributors.twitterLink,
      muckrackLink: contributors.muckrackLink,
      personalPortfolio: contributors.personalPortfolio,
      linkedin: contributors.linkedin,
      metaTitle: contributors.metaTitle,
      metaDescription: contributors.metaDescription,
      keywords: contributors.keywords,
      publishStatus: contributors.publishStatus,
      image: {
        id: media.id,
        title: media.title,
        type: media.type,
        filePath: media.filePath,
      },
    })
    .from(contributors)
    .leftJoin(media, eq(media.id, contributors.image))
    .where(eq(contributors.id, id));

  return contributor[0] || null;
}

export async function getContributors() {
  const contributorsData = await db
    .select({ id: contributors.id, name: contributors.name })
    .from(contributors);
  return contributorsData ?? [];
}
