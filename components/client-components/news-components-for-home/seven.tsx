import Link from "next/link";
import { CategoryItem } from "../category-item";
import { Typography } from "../typography";

const ComponentSeven = async ({
  usNationWideCat = [],
}: {
  usNationWideCat: any;
}) => {
  const dataOne = usNationWideCat?.slice(0, 3);
  const dataTwo = usNationWideCat?.slice(4, 7);
  const dataThree = usNationWideCat?.slice(8, 11);
  const dataFour = usNationWideCat?.slice(12, 15);
  if (usNationWideCat?.length > 0)
    return (
      <>
        <div className="flex justify-between items-center w-full">
          <Typography
            variant="h2"
            weight="600"
            className="text-2xl text-[var(--custom-red)] font-semibold py-2"
          >
            {dataOne[0]?.categoryname}
          </Typography>
          <Link
            href={`/${dataOne[0]?.categoryslug}`}
            className="hover:underline  uppercase text-xs"
          >
             <span className="hover:underline  uppercase text-xs">
              Read More
            </span>
          </Link>
        </div>
        <section className="grid grid-cols-1 lg:grid-cols-4 gap- border-y border-black/20 divide-y lg:divide-y-0 lg:divide-x divide-black/20  overflow-hidden">
          <div className="p-4 space-y-3">
            {dataOne?.map((item: any, index: any) => (
              <CategoryItem
                key={index}
                categoryName={item?.categoryname}
                categorySlug={item?.categoryslug}
                slug={item?.slug}
                title={item?.title}
              />
            ))}
          </div>
          <div className="p-4 space-y-3">
            {dataTwo?.map((item: any, index: any) => (
              <CategoryItem
                key={index}
                categoryName={item?.categoryname}
                categorySlug={item?.categoryslug}
                slug={item?.slug}
                title={item?.title}
              />
            ))}
          </div>
          <div className="p-4 space-y-3">
            {dataThree?.map((item: any, index: any) => (
              <CategoryItem
                key={index}
                categoryName={item?.categoryname}
                categorySlug={item?.categoryslug}
                slug={item?.slug}
                title={item?.title}
              />
            ))}
          </div>
          <div className="p-4 space-y-3">
            {dataFour?.map((item: any, index: any) => (
              <CategoryItem
                key={index}
                categoryName={item?.categoryname}
                categorySlug={item?.categoryslug}
                slug={item?.slug}
                title={item?.title}
              />
            ))}
          </div>
        </section>
      </>
    );
};

export default ComponentSeven;
