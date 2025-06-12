import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db/db";
import { magzines, media } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
export const dynamic = "force-dynamic";
const MagazineButton = async () => {
  const [latestMagazine] = await db
    .select({
      slug: magzines.slug,
      mediaTitle: media.title,
      mediaCaption: media.caption,
      mediaPath: media.filePath,
    })
    .from(magzines)
    .leftJoin(media, eq(magzines.coverImage, media.id))
    .orderBy(desc(magzines.createdAt))
    .limit(1);

  if (!latestMagazine) return null;

  return (
    <div className="flex flex-col gap-2">
      <Link
        href={`/magzine/${latestMagazine.slug}`}
        className="hidden md:block"
      >
        <Image
          src={`${latestMagazine.mediaPath}`}
          alt={
            latestMagazine.mediaCaption ||
            latestMagazine.mediaTitle ||
            "Magazine Cover"
          }
          width={100}
          height={100}
          priority
          className="mx-auto cursor-pointer hover:opacity-90 transition"
        />
      </Link>

      <Link href={`/print-edition`}>
        <button suppressHydrationWarning={true} className="bg-[var(--custom-red)] text-white hover:text-white dark:text-white text-xs px-4 w-full py-2 rounded hover:bg-[var(--custom-red)]/80 transition text-center">
          MAGAZINE
        </button>
      </Link>
    </div>
  );
};

export default MagazineButton;
