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
  newsSlug: string;
  authorSlug: string;
  authorName: string;
  url?: string;
};

const NewsCard: React.FC<NewsCardProps> = ({
  date,
  category = [],
  title,
  imageUrl,
  newsSlug,
  authorSlug,
  authorName,
  url,
}) => {
  return (
    <section className="p-4 border border-gray-300 mt-6 w-full max-w-xl space-y-4  ">
      {/* Image */}
      <div className="relative w-full h-60">
        <ImageWithFallback
          src={imageUrl ?? ""}
          alt="news-card"
          className="object-cover"
          layout="fill"
        />
      </div>

      {/* Title */}
      <Link
         href={
          url
            ? `/${url}`
            : `/${category?.slug}/${newsSlug}`.replace(/\/\/+/g, "/")
        }
        className="hover:underline"
      >
        <Typography
          variant="h2"
          className="text-2xl font-semibold leading-snug"
        >
          {title}
        </Typography>
      </Link>

      {/* Meta */}
      <p className="text-gray-500 text-sm">
        {formatDate(date)}
        <span className="text-black mx-1">by</span>
        <Link href={`/author/${authorSlug}`} className="hover:underline">
          <span className="text-gray-700 font-medium">{authorName}</span>
        </Link>
      </p>
    </section>
  );
};

export default NewsCard;
