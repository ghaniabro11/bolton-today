import Image from "next/image";
import Link from "next/link";
import { Typography } from "../typography";

const ComponentFive = async ({
  diplomacyCat = [],
  priorityImage = false,
}: {
  diplomacyCat: any;
  priorityImage?: boolean;
}) => {
  const centerdata = diplomacyCat[0] as any;
  const leftData = diplomacyCat?.slice(1, 4); // Gets 3 items (indices 1,2,3)
  const rightData = diplomacyCat?.slice(4, 7); // Gets 3 items (indices 4,5,6)

  if (diplomacyCat?.length > 0)
    return (
      <>
        <div className="border-b-3 border-b-btn w-fit my-2">
          <Link href={`/${centerdata?.categoryslug}`}>
            <Typography
              variant="h2"
              weight="600"
              className="text-2xl text-head font-semibold "
            >
              {centerdata?.categoryname}
            </Typography>
          </Link>
        </div>
        <section className="grid grid-cols-1 lg:grid-cols-6  overflow-hidden">
          {/* Center Image and News Title */}
          <div className="lg:col-span-2 p-4 flex flex-col items-start gap-2">
            <div className=" h-full md:max-h-[30dvh] min-h-[50dvh] max-h-[50dvh] md:min-h-[28dvh] w-full relative">
              <Image
                fill
                priority={priorityImage}
                height={264}
                width={364}
                className="w-full object-cover "
                src={`${centerdata?.image ?? ""}`}
                alt={centerdata?.imageTitle ?? "image"}
              />
            </div>
            <Link href={`/${centerdata?.categoryslug}/${centerdata?.slug}`}>
              <Typography
                weight="600"
                variant="h3"
                className="  text-start hover:text-gray text-black text-xl"
              >
                {centerdata?.title ?? ""}
              </Typography>
            </Link>
          </div>
          <div className="p-4 space-y-5 lg:col-span-2">
            {leftData?.map((item: any, index: any) => (
              <div key={index} className="flex  gap-2">
                <Image
                  src={item?.image}
                  alt={item?.imageTitle ?? "image"}
                  height={96}
                  width={96}
                  sizes="96px"
                  className="object-cover size-24"
                />
                <Link href={`/${item?.categoryslug}/${item?.slug}`}>
                  <Typography
                    variant="h3"
                    className="text-base hover:text-gray text-black"
                  >
                    {item?.title ?? ""}
                  </Typography>
                </Link>
              </div>
            ))}
          </div>
          {/* Right Opinions Column */}
          <div className="p-4 space-y-5  lg:col-span-2   ">
            {rightData?.map((item: any, index: any) => (
              <div key={index} className="flex  gap-2">
                <Image
                  src={item?.image}
                  alt={item?.imageTitle ?? "image"}
                  height={96}
                  width={96}
                  sizes="96px"
                  className="object-cover size-24"
                />
                <Link href={`/${item?.categoryslug}/${item?.slug}`}>
                  <Typography
                    variant="h3"
                    className="text-base hover:text-gray text-black"
                  >
                    {item?.title ?? ""}
                  </Typography>
                </Link>
              </div>
            ))}
          </div>
        </section>
        <div className="flex items-center justify-center w-full">
          <div className="flex-grow h-px bg-gray-300" />
          <span className="mx-4 px-4 py-1 bg-head hover:bg-head text-white hover:text-btn font-semibold rounded-full text-sm">
            <Link
              href={`/${centerdata?.categoryslug}`}
              className="hover:no-underline  uppercase text-xs"
            >
              <span className="hover:no-underline bg-head hover:bg-head text-white hover:text-btn  uppercase text-xs">
                Read More
              </span>
            </Link>{" "}
          </span>
          <div className="flex-grow h-px bg-gray-300" />
        </div>
      </>
    );
};

export default ComponentFive;
