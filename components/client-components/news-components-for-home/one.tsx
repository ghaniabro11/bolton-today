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
  const leftData = latest?.slice(1, 3);
  const rightData = latest?.slice(3, 10);
  console.log(latest, "latest");
  return (
    <section className="grid grid-cols-1 lg:grid-cols-5 gap- border-b border-black/20 divide-y lg:divide-y-0 lg:divide-x divide-black/20  overflow-hidden">
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
      <div className="p-4 lg:col-span-2 flex flex-col justify-between gap-4 h-full">
        <div>
          <Link
            className="no-underline hover:no-underline"
            href={`/${centerdata.categoryslug}`}
          >
            <Typography
              variant="p"
              className="text-orange text-sm font-semibold"
            >
              {centerdata?.categoryname ?? ""}
            </Typography>{" "}
          </Link>
          <Link href={`/${centerdata?.categoryslug}/${centerdata?.slug}`}>
            <Typography
              variant="h3"
              className="hover:underline text-start text-3xl"
            >
              {centerdata?.title ?? ""}
            </Typography>
          </Link>
          <Typography variant="p" className="text-gray line-clamp-2">
            {centerdata?.description ?? ""}
          </Typography>
          <Link href={`/author/${centerdata?.authorslug}`}>
            <Typography
              variant="p"
              className="hover:underline text-start text-sm"
            >
              By {centerdata?.authorname ?? "--"}
            </Typography>
          </Link>
        </div>
        <div className="space-y-1">
          {leftData.map((item: any, index: number) => (
            <div key={index} className="px-2  border-l-orange border-l-3 ">
              <Link href={`/${centerdata?.categoryslug}/${centerdata?.slug}`}>
                <Typography
                  variant="h3"
                  className={`hover:underline text-start text-lg pb-2 ${
                    index === leftData?.length - 1
                      ? ""
                      : "border-b-2 border-b-gray-200"
                  }`}
                >
                  {centerdata?.title ?? ""}
                </Typography>
              </Link>
            </div>
          ))}
        </div>
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
      </div>

      {/* Right Opinions Column */}
      <div className="p-4 space-y-3 ">
        <div className="flex justify-between w-full gap-3">
          <h2 className="text-orange whitespace-nowrap text-base font-semibold my-0!">
            Latest
          </h2>
        </div>
        {rightData?.map((item: any, index: any) => (
          <CategoryItem
            key={index}
            categoryName={item?.categoryname}
            categorySlug={item?.categoryslug}
            slug={item?.slug}
            title={item?.title}
            isLastItem={index === rightData?.length - 1}
          />
        ))}
      </div>
    </section>
  );
};

export default ComponentOne;
