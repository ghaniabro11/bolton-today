import Image from "next/image";
import Link from "next/link";
import { CategoryItem } from "../category-item";
import { Typography } from "../typography";
import { ImageWithFallback } from "../image-fallback";
import { formatDate } from "@/utils/date";

const ComponentThree = async ({
  donalTrumpCat = [],
}: {
  donalTrumpCat: any;
}) => {
  // console.log("Category News:", categoryNews);
  // console.log("Latest News:", latestNews);

  const centerdata = donalTrumpCat[0];
  const centerdataSide = donalTrumpCat[1];
  const leftData = donalTrumpCat?.slice(2, 8);
  console.log(centerdataSide, "centerdataSide");
  if (donalTrumpCat?.length > 0)
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
          <div className="p-4 space-y-3">
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
          <div className="lg:col-span-3 p-4 flex flex-col items-center space-y-4">
            <div className="pr-5 h-[60dvh] w-full relative">
              <ImageWithFallback
                layout="fill"
                priority
                className="w-full object-cover "
                src={`${centerdata?.image ?? ""}`}
                alt={centerdata?.imageTitle ?? "image"}
              />
            </div>
            <div className="lg:grid-cols-2 grid-cols-1 gap-2 grid ">
              <div>
                <Link
                  href={`/author/${centerdata?.authorslug}`}
                  className="flex items-center gap-1"
                >
                  <div className=" hover:underline text-start text-sm">
                    {centerdata?.authorname ?? ""}
                  </div>{" "}
                  <p className="text-xs my-0! text-gray-400">
                    On {formatDate(centerdata.publishdate)}
                  </p>
                </Link>
                <Link href={`/${centerdata?.categoryslug}/${centerdata?.slug}`}>
                  <Typography
                    weight="600"
                    variant="h3"
                    className=" hover:underline text-start text-3xl"
                  >
                    {centerdata?.title ?? ""}
                  </Typography>
                </Link>
              </div>
              <div className="flex gap-2">
                {centerdataSide?.image && (
                  <Image
                    src={centerdataSide?.image}
                    alt={centerdataSide?.imageTitle ?? "image"}
                    height={80}
                    width={80}
                    className="object-cover"
                  />
                )}
                <div>
                  <Link
                    href={`/author/${centerdataSide?.authorslug}`}
                    className="flex items-center gap-1"
                  >
                    <div className=" hover:underline text-start text-sm">
                      {centerdataSide?.authorname ?? ""}
                    </div>{" "}
                    <p className="text-xs my-0! text-gray-400">
                      On {formatDate(centerdata.publishdate)}
                    </p>
                  </Link>
                  <Link
                    href={`/${centerdataSide?.categoryslug}/${centerdataSide?.slug}`}
                  >
                    <Typography
                      weight="600"
                      variant="h3"
                      className=" hover:underline text-start text-lg"
                    >
                      {centerdataSide?.title ?? ""}
                    </Typography>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </>
    );
};

export default ComponentThree;
