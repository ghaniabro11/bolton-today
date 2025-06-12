import Image from "next/image";
import Link from "next/link";
import { CategoryItem } from "../category-item";
import { Typography } from "../typography";
import { ImageWithFallback } from "../image-fallback";

const ComponentFour = async ({
  capitolHillPoliticsCat = [],
}: {
  capitolHillPoliticsCat: any;
}) => {
  const centerdata = capitolHillPoliticsCat[0] as any;
  const leftData = capitolHillPoliticsCat?.slice(1, 6);
  const rightData = capitolHillPoliticsCat?.slice(6, 11);

  if (capitolHillPoliticsCat?.length > 0)
    return (
      <>
        <div className="flex justify-between items-center w-full">
           <Typography
            variant="h2"
            weight="600"
            className="text-2xl text-[var(--custom-red)] font-semibold py-2"
          >
            {centerdata?.categoryname}
          </Typography>
          <Link
            href={`/${centerdata?.categoryslug}`}
            className="hover:underline  uppercase text-xs"
          >
             <span className="hover:underline  uppercase text-xs">
              Read More
            </span>
          </Link>
        </div>
        <section className="grid grid-cols-1 lg:grid-cols-4 gap- border-y border-black/20 divide-y lg:divide-y-0 lg:divide-x divide-black/20  overflow-hidden">
          {/* Left News Column */}
          <div className="p-4 space-y-3">
            {leftData?.map((item: any, index: any) => (
              <CategoryItem
                key={index}
                categoryName={item?.categoryname}
                categorySlug={item?.categoryslug}
                slug={item?.slug}
                title={item?.title}
                isLastItem={index === leftData.length - 1}
              />
            ))}
          </div>

          {/* Center Image and News Title */}
          <div className="lg:col-span-2 p-4 flex flex-col items-center space-y-4">
            <div className="pr-5 h-[45dvh] w-full relative">
              <ImageWithFallback
                layout="fill"
                priority
                className="w-full object-cover "
                src={`${centerdata?.image ?? ""}`}
                alt={centerdata?.imageTitle ?? "image"}
              />
            </div>
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

          {/* Right Opinions Column */}
          <div className="p-4 space-y-3 ">
            {rightData?.map((item: any, index: any) => (
              <CategoryItem
                key={index}
                categoryName={item?.categoryname}
                categorySlug={item?.categoryslug}
                slug={item?.slug}
                title={item?.title}
                isLastItem={index === rightData.length - 1}
              />
            ))}
          </div>
        </section>
      </>
    );
};

export default ComponentFour;
