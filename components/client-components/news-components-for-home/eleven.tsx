import Link from "next/link";
import { CategoryItem } from "../category-item";
import { Typography } from "../typography";

const chunkArray = (array: any[], chunkSize: number) => {
  const result = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize));
  }
  return result;
};

const ComponentEleven = async ({
  middleEastCat = [],
}: {
  middleEastCat: any[];
}) => {
  const chunks = chunkArray(middleEastCat, 2); // 2 items per column

  if (!middleEastCat || middleEastCat.length === 0) return null;

  return (
    <>
     <div className="flex justify-between items-center w-full">
        <Typography
          variant="h2"
          weight="600"
          className="text-2xl text-[var(--custom-red)] font-semibold pt-2 py-2"
        >
          {middleEastCat[0]?.categoryname}
        </Typography>
        <Link
          href={`/${middleEastCat[0]?.categoryslug}`}
          className="hover:underline  uppercase text-xs"
        >
           <span className="hover:underline  uppercase text-xs">
              Read More
            </span>
        </Link>
      </div>
      <section className="grid grid-cols-1 lg:grid-cols-4 gap- border-y border-black/20 divide-y lg:divide-y-0 lg:divide-x divide-black/20 overflow-hidden">
        {chunks.map((chunk, colIndex) => (
          <div key={colIndex} className="p-4 space-y-3">
            {chunk.map((item, itemIndex) => (
              <CategoryItem
                key={itemIndex}
                categoryName={item?.categoryname}
                categorySlug={item?.categoryslug}
                slug={item?.slug}
                title={item?.title}
                isLastItem={itemIndex === chunk.length - 1}
              />
            ))}
          </div>
        ))}
      </section>
    </>
  );
};

export default ComponentEleven;
