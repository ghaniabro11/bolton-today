// components/CategoryItem.tsx
import Link from "next/link";
import { Typography } from "./typography";

// ... existing code ...
type CategoryItemProps = {
  categoryName: string;
  categorySlug: string;
  slug: string;
  title: string;
  isLastItem?: boolean;
  isCategoryVisible?: boolean;
};

export const CategoryItem = ({
  categoryName,
  categorySlug,
  slug,
  title,
  isLastItem = false,
  isCategoryVisible = false,
}: CategoryItemProps) => {
  return (
    <div
      className={`mb-2 pt-0 ${
        !isLastItem ? "pb-3 border-b border-gray-500/30" : "pb-0"
      }`}
    >
      {isCategoryVisible && (
        <p className="text-xs font-bold hover:underline my-2">
          <Link href={`/${categorySlug}`}>{categoryName}</Link>
        </p>
      )}
      <Link href={`/${categorySlug}/${slug}`}>
        <Typography
          weight="600"
          variant="h3"
          className="text-lg hover:underline"
        >
          {title}
        </Typography>
      </Link>
    </div>
  );
};
