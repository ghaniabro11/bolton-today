import Link from "next/link";
import { ImageWithFallback } from "../image-fallback";
import { Typography } from "../typography";

const ComponentTen = async ({ europeCat = [] }: { europeCat: any }) => {
  if (europeCat?.length > 0)
    return (
    <>
      <div className="flex justify-between items-center w-full">
        <Typography
          variant="h2"
          weight="600"
          className="text-2xl text-[var(--custom-red)] font-semibold pt-2 py-2"
        >
          {europeCat[0]?.categoryname}
        </Typography>
        <Link
          href={`/${europeCat[0]?.categoryslug}`}
          className="hover:underline  uppercase text-xs"
        >
           <span className="hover:underline  uppercase text-xs">
              Read More
            </span>
        </Link>
      </div>
      <section className="grid grid-cols-1 lg:grid-cols-4 gap- border-y border-black/20 divide-y lg:divide-y-0 lg:divide-x divide-black/20  overflow-hidden">
        {europeCat?.map((item: any, index: any) => (
          <div
            key={index}
            className="lg:col-span-1 p-4 flex  items-center space-y-4 space-x-2"
          >
            <Link href={`/${item?.categoryslug}/${item?.slug}`}>
              <Typography
                weight="600"
                variant="h3"
                className=" hover:underline text-start text-lg"
              >
                {item?.title ?? ""}
              </Typography>
            </Link>
            <div className="relative">
              <ImageWithFallback
                src={`${item?.image ?? ""}`}
                alt={item?.imageTitle}
                className="h-20 w-28 object-cover rounded-none"
                layout="fill"
              />
            </div>
          </div>
        ))}
      </section>
    </>
  );
};

export default ComponentTen;
