import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import Link from "next/link";
import { CategoryItem } from "../category-item";
import { Typography } from "../typography";
import { ImageWithFallback } from "../image-fallback";

const ComponentTwo = async ({
  lightHouseCat = [],
  latest = [],
}: {
  lightHouseCat: any;
  latest: any;
}) => {
  const centerdata = lightHouseCat[0] as any;
  const centerdataBelow = lightHouseCat?.slice(1, 3) as any;
  const leftData = lightHouseCat?.slice(3, 11);
  if (lightHouseCat?.length > 0)
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
            <div className="pr-5 h-[45dvh] w-full relative">
              <ImageWithFallback
                layout="fill"
                priority
                className="w-full min-h-[45dvh] object-cover "
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
            <ul className="list-disc text-start px-5">
              {centerdataBelow?.map((item: any, index: any) => (
                <Link key={index} href={`/${item?.categoryslug}/${item?.slug}`}>
                  <li>
                    <Typography
                      variant="h3"
                      className="text-base hover:underline"
                    >
                      {item?.title}{" "}
                    </Typography>
                  </li>
                </Link>
              ))}
            </ul>
          </div>
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
          <Tabs defaultValue="tab1" className="p-4 gap-0">
            <TabsList className="bg-white rounded-md px-0 shadow-none">
              <TabsTrigger
                value="tab1"
                className="data-[state=active]:bg-[#F0F0F0] px-5 py-5 rounded-none data-[state=active]:shadow-none"
              >
                Recent
              </TabsTrigger>
              <TabsTrigger
                value="tab2"
                className="data-[state=active]:bg-[#F0F0F0] px-5 py-5 rounded-none data-[state=active]:shadow-none"
              >
                Popular
              </TabsTrigger>
            </TabsList>

            <TabsContent value="tab1" className="bg-[#F0F0F0] mt-0 px-2">
              {latest.slice(0, 4).map((item: any, index: number) => (
                <div key={index}>
                  <div className="space-y-3 my-2 flex items-center gap-2 ">
                    {item?.image && (
                      <Image
                        src={item?.image}
                        alt={item?.title}
                        className="size-14 object-cover rounded"
                        height={100}
                        width={100}
                      />
                    )}

                    <h3 className="text-sm font-semibold hover:underline">
                      <Link href={`/${item?.categoryslug}/${item?.slug}`}>
                        {item?.title}
                      </Link>
                    </h3>
                  </div>
                  {index !== leftData.length - 1 && (
                    <hr className="w-full h-0.5 border-b border-t-0 border-gray-500/30 mb-5" />
                  )}
                </div>
              ))}
            </TabsContent>
            <TabsContent value="tab2" className="bg-[#F0F0F0] mt-0 px-2">
              {latest?.slice(0, 4)?.map((item: any, index: number) => (
                <div key={index}>
                  <div className="space-y-3 my-2 flex items-center gap-2 ">
                    {item?.image && (
                      <Image
                        src={item?.image}
                        alt={item?.title}
                        className="size-14 object-cover rounded"
                        height={100}
                        width={100}
                      />
                    )}

                    <h3 className="text-sm font-semibold hover:underline">
                      <Link href={`/${item?.categoryslug}/${item?.slug}`}>
                        {item?.title}
                      </Link>
                    </h3>
                  </div>
                  {index !== leftData.length - 1 && (
                    <hr className="w-full h-0.5 border-b border-t-0 border-gray-500/30 mb-5" />
                  )}{" "}
                </div>
              ))}
            </TabsContent>
          </Tabs>

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

export default ComponentTwo;
