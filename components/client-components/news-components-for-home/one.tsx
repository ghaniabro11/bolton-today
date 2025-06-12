import Link from "next/link";
import { CategoryItem } from "../category-item";
import { ImageWithFallback } from "../image-fallback";
import { Typography } from "../typography";

const ComponentOne = async ({
  latest,
  opinionCategory,
}: {
  latest: any;
  opinionCategory: any;
}) => {
  if (
    (latest?.length === 0 && opinionCategory === 0) ||
    (!latest && !opinionCategory)
  )
    return null;

  const centerdata = latest[0] ?? (null as any);
  const leftData = latest?.slice(1, 6);

  return (
    <section className="grid grid-cols-1 lg:grid-cols-4 gap- border-b border-black/20 divide-y lg:divide-y-0 lg:divide-x divide-black/20  overflow-hidden">
      <div className="lg:col-span-2 py-4  flex min-lg:hidden flex-col items-center space-y-4">
        <div className=" h-full w-full relative">
          <ImageWithFallback
            layout="fill"
            priority
            className="w-full min-h-60  object-cover"
            src={`${centerdata?.image ?? ""}`}
            alt={centerdata?.imageTitle ?? "image"}
          />
        </div>
        <Link href={`/${centerdata?.categoryslug}/${centerdata?.slug}`}>
          <Typography
            weight="600"
            variant="h3"
            className="hover:underline text-start text-4xl"
          >
            {centerdata?.title ?? ""}
          </Typography>
        </Link>
      </div>
      <div className="p-4 space-y-3">
        <div className="flex items-end gap-3">
          <h2 className="text-[var(--custom-red)] whitespace-nowrap text-base font-semibold my-0!">
            LATEST NEWS
          </h2>
          <hr className="w-full h-0.5 border-b border-t-0 border-gray-500/30" />
        </div>
        {leftData?.map((item: any, index: any) => (
          <CategoryItem
            key={index}
            categoryName={item?.categoryname}
            categorySlug={item?.categoryslug}
            slug={item?.slug}
            title={item?.title}
            isLastItem={index === leftData.length - 1}
            isCategoryVisible
          />
        ))}
      </div>

      {/* Center Image and News Title */}
      <div className="lg:col-span-2 p-4  min-lg:flex hidden flex-col items-center space-y-4">
        <div className="mx-3 h-full w-full relative">
          <ImageWithFallback
            layout="fill"
            priority
            className="w-full min-h-[45dvh] object-cover"
            src={`${centerdata?.image ?? ""}`}
            alt={centerdata?.imageTitle ?? "image"}
          />
        </div>
        <Link href={`/${centerdata?.categoryslug}/${centerdata?.slug}`}>
          <Typography
            weight="600"
            variant="h3"
            className="hover:underline text-start text-4xl"
          >
            {centerdata?.title ?? ""}
          </Typography>
        </Link>
      </div>

      {/* Right Opinions Column */}
      <div className="p-4 space-y-3 bg-[#F5F5F5]">
        <div className="flex items-end gap-3">
          <h2 className="text-[var(--custom-red)] whitespace-nowrap text-base font-semibold my-0!">
            OPINIONS
          </h2>
          <hr className="w-full h-0.5 border-b border-t-0 border-gray-500/30" />
        </div>
        {opinionCategory?.map((item: any, index: any) => (
          <CategoryItem
            key={index}
            categoryName={item?.categoryname}
            categorySlug={item?.categoryslug}
            slug={item?.slug}
            title={item?.title}
            isLastItem={index === opinionCategory?.length - 1}
          />
        ))}
      </div>
    </section>
  );
};

export default ComponentOne;
