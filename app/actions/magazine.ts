import { db } from "@/lib/db/db";
import { magzines, media } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
export const dynamic = "force-dynamic";

export async function getMagzineById(id: number) {
  if (!id || typeof id !== "number") {
    return null;
  }

  const coverImageAlias = alias(media, "coverImage");
  const pdfFileAlias = alias(media, "pdfFile");
  
  const category = await db
    .select({
      id: magzines.id,
      title: magzines.title,
      slug: magzines.slug,
      description: magzines.description,
      status: magzines.status,
      metaTitle: magzines.metaTitle,
      metaDescription: magzines.metaDescription,
      keywords: magzines.keywords,
      coverImage: {
        id: coverImageAlias.id,
        title: coverImageAlias.title,
        type: coverImageAlias.type,
        filePath: coverImageAlias.filePath,
      },
      pdfFile: {
        id: pdfFileAlias.id,
        title: pdfFileAlias.title,
        type: pdfFileAlias.type,
        filePath: pdfFileAlias.filePath,
      },
    })
    .from(magzines)
    .leftJoin(coverImageAlias, eq(coverImageAlias.id, magzines.coverImage))
    .leftJoin(pdfFileAlias, eq(pdfFileAlias.id, magzines.pdfFile))
    .where(eq(magzines.id, id));
  
  return category[0] || null;
}
