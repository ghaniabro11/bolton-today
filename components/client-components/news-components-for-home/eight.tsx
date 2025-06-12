import Link from "next/link";
import { ImageWithFallback } from "../image-fallback";
import { Typography } from "../typography";

const ComponentEight = async ({
  businessFinanceCat = [],
}: {
  businessFinanceCat: any;
}) => {
  const centerdata = businessFinanceCat[0] as any;
  const centerdataBelow = businessFinanceCat?.slice(1, 3) as any;
  const leftData = businessFinanceCat?.slice(4, 9);
  const rightData = businessFinanceCat?.slice(10, 15);
  if (businessFinanceCat?.length > 0)
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
          <div className="lg:col-span-2 p-4 flex flex-col items-start space-y-4">
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
            <ul className="list-disc text-start px-5">
              {centerdataBelow?.map((item: any, index: any) => (
                <Link key={index} href={`/${item?.categoryslug}/${item?.slug}`}>
                  <li>
                    <Typography variant="h3" className="text-base">
                      {item?.title}{" "}
                    </Typography>
                  </li>
                </Link>
              ))}
            </ul>
          </div>
          <div className="p-4 space-y-3">
            {leftData?.map((item: any, index: any) => (
              <div
                key={index}
                className={`my-2 min-h-28 py-2 ${
                  index === leftData.length - 1
                    ? ""
                    : "border-b border-black/30"
                }`}
              >
                <div className="flex relative gap-2 items-start">
                  <div className="relative">
                    <ImageWithFallback
                      src={`${item?.image ?? ""}`}
                      alt={item?.imageTitle}
                      className="h-16 w-20 object-cover rounded-none"
                      layout="fill"
                    />
                  </div>
                  <Link href={`/${item?.categoryslug}/${item?.slug}`}>
                    <Typography
                      weight="600"
                      variant="h3"
                      className="text-[16px] hover:underline"
                    >
                      {item?.title}
                    </Typography>
                  </Link>
                </div>

                {/* <hr className="w-full h-0.5 border-b border-t-0 border-black/30" /> */}
              </div>
            ))}
          </div>
          <div className="p-4 space-y-3">
            {rightData?.map((item: any, index: any) => (
              <div
                key={index}
                className={`my-2 min-h-28 py-2 ${
                  index === rightData?.length - 1
                    ? ""
                    : "border-b border-black/30"
                }`}
              >
                <div className="flex  gap-2 items-start">
                  <div className="relative">
                    <ImageWithFallback
                      src={`${item?.image ?? ""}`}
                      alt={item?.imageTitle}
                      layout="fill"
                      className="h-16 w-20 object-cover rounded-none"
                    />
                  </div>
                  <Link href={`/${item?.categoryslug}/${item?.slug}`}>
                    <Typography
                      weight="600"
                      variant="h3"
                      className="text-[16px] hover:underline"
                    >
                      {item?.title}
                    </Typography>
                  </Link>
                </div>

                {/* <hr className="w-full h-0.5 border-b border-t-0 border-black/30" /> */}
              </div>
            ))}
          </div>
          {/* <div className="p-4 space-y-3 bg-[#F5F5F5]">
        <div className="flex items-end gap-3">
          <h2 className="text-red-500 font-semibold whitespace-nowrap">
            Opinions
          </h2>
          <hr className="w-full h-0.5 border-b border-t-0 border-black/30" />
        </div>
        {categoryNews.map((item: any, index: any) => (
          <div key={index} className="space-y-3 my-2">
            <p className="text-xs font-semibold hover:underline">
              <Link href={`/${item?.categorySlug}`}>{item?.categoryname}</Link>
            </p>
            <h3 className="text-lg hover:underline">
              <Link href={`/${item?.categorySlug}/${item?.slug}`}>
                {item?.title}
              </Link>
            </h3>
            <hr className="w-full h-0.5 border-b border-t-0 border-black/30" />
          </div>
        ))}
      </div> */}
        </section>
      </>
    );
};

export default ComponentEight;
