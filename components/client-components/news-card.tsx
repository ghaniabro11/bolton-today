import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Typography } from "./typography";
import { ImageWithFallback } from "./image-fallback";
import { formatDate } from "@/utils/date";

type NewsCardProps = {
  date: string;
  category?: any;
  title: string;
  imageUrl: string;
  description: string;
  newsSlug: string;
  authorSlug: string;
  authorName: string;
};

const NewsCard: React.FC<NewsCardProps> = ({
  date,
  category = [],
  title,
  imageUrl,
  description,
  newsSlug,
  authorSlug,
  authorName,
}) => {
  return (
    <section className="p-5 border border-gray-300 mt-5 space-y-4 max-w-4xl">
      <p className="text-gray-400 text-sm">
        {formatDate(date)} <span className="text-black mx-1">By</span>
        <Link href={`/author/${authorSlug}`}>
          <span className="text-gray-400 no-underline">{authorName}</span>
        </Link>
      </p>

      <div className="flex md:flex-nowrap flex-wrap  gap-4 mt-4">
        <div className="md:min-w-64 md:w-64 w-full md:min-h-36 min-h-60 relative ">
          <ImageWithFallback
            src={imageUrl ?? ""}
            alt="news-card"
            className="object-cover  "
            layout="fill"
          />
        </div>
        <Link
          href={`/${category?.slug}/${newsSlug}`.replace(/\/\/+/g, "/")}
          className="hover:underline "
        >
          <Typography variant="h2">{title}</Typography>
        </Link>
      </div>
      <hr />
    </section>
  );
};

export default NewsCard;
