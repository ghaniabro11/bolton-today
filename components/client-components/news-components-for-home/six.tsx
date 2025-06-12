import Link from "next/link";
import { CategoryItem } from "../category-item";
import { ImageWithFallback } from "../image-fallback";
import { Typography } from "../typography";

const ComponentSix = async ({ securityCat = [] }: { securityCat: any }) => {
  const centerdata = securityCat[0] as any;
  const leftData = securityCat?.slice(1, 10);

  if (securityCat?.length > 0)
    return (
    <>
      <div className="flex justify-between items-center w-full">
        <Typography
          variant="h2"
          weight="600"
          className="text-2xl text-[var(--custom-red)] font-semibold pt-2 py-2"
        >
          {centerdata?.categoryname}
        </Typography>
        <Link
          href={`/${centerdata?.categoryslug}`}
          className="hover:underline  uppercase text-xs"
        >
          <span className="hover:underline  uppercase text-xs">Read More</span>
        </Link>
      </div>
      <section className="grid grid-cols-1 lg:grid-cols-4 gap- border-y border-black/20 divide-y lg:divide-y-0 lg:divide-x divide-black/20  overflow-hidden">
        <div className="p-4 space-y-3 lg:col-span-2">
          {leftData?.map((item: any, index: any) => (
            <CategoryItem
              key={index}
              categoryName={item?.categoryname}
              categorySlug={item?.categoryslug}
              slug={item?.slug}
              title={item?.title}
              isLastItem={index === leftData?.length - 1}
            />
          ))}
        </div>
        <div className="lg:col-span-2 p-4 flex flex-col items-center space-y-4">
          {centerdata?.image && (
            <div className="pr-5 h-[50dvh] w-full relative">
              <ImageWithFallback
                layout="fill"
                priority
                className="w-full object-cover "
                src={`${centerdata?.image ?? ""}`}
                alt={centerdata?.imageTitle ?? "image"}
              />
            </div>
          )}
          <Link href={`/${centerdata?.categoryslug}/${centerdata?.slug}`}>
            <Typography
              weight="600"
              variant="h3"
              className=" hover:underline text-start text-4xl"
            >
              {centerdata?.title ?? ""}
            </Typography>
          </Link>
        </div>
      </section>
    </>
  );
};

export default ComponentSix;
