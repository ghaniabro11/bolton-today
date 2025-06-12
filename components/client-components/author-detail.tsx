"use client";
import { formatDate } from "@/utils/date";
import { Globe, Link as Url, User2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ClientPagination } from "../reuse-client-pagination";
import { Facebook } from "./icons/facebook";
import { Instagram } from "./icons/instagram";
import { Linkedin } from "./icons/linkdin";
import { Muckrack } from "./icons/muckrack";
import { Twitter } from "./icons/twitter";
import { Typography } from "./typography";

type SocialIcons = {
  facebook: React.ReactNode;
  twitter: React.ReactNode;
  instagram: React.ReactNode;
  linkedin: React.ReactNode;
  portfolio: React.ReactNode;
  muckrack: React.ReactNode;
  [key: string]: React.ReactNode; // Allow additional keys
};

const socialIcons: SocialIcons = {
  facebook: <Facebook />,
  twitter: <Twitter />,
  instagram: <Instagram />,
  linkedin: <Linkedin />,
  portfolio: <Globe size={30} />,
  muckrack: <Muckrack />, // You can customize this icon
} as any;

const AuthorDetailComponent = ({
  result,
  slug,
}: {
  result: any;
  slug: string;
}) => {
  const [mounted, setmounted] = useState(false);
  const authorData = result?.data?.author as any;
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  useEffect(() => {
    setmounted(true);
  }, []);
  if (!mounted) return null;
  return (
    <main suppressHydrationWarning>
      <div className="p-5">
        <div className="flex flex-row gap-4">
          {/* Left Section - Image */}
          <div className="flex-shrink-0">
            <div className="relative">
              {authorData?.image?.filePath ? (
                <Image
                  src={authorData.image.filePath}
                  alt={authorData.image.title || "Author Image"}
                  width={160}
                  height={160}
                  className="w-[4.8rem] h-[4.8rem]  lg:w-36 lg:h-36 rounded-full object-cover shadow-lg ring-4 ring-gray-100"
                  priority
                />
              ) : (
                <div className="w-[4.8rem] h-[4.8rem] lg:w-40 lg:h-40 rounded-full bg-gray-100 flex items-center justify-center shadow-lg">
                  <User2 className="w-16 h-16 text-gray-400" />
                </div>
              )}
            </div>
          </div>

          {/* Vertical Divider */}
          <div className="block w-px bg-gradient-to-b from-transparent via-gray-200 to-transparent"></div>

          {/* Right Section - Content */}
          <div className="flex-1 space-y-6">
            {/* Name */}
            {authorData?.name && (
              <Typography
                weight="400"
                variant="h1"
                className="text-2xl lg:text-4xl font-bold text-gray-900 mb-2"
              >
                {authorData.name}
              </Typography>
            )}

            {/* Description */}
            {authorData?.description && (
              <div>
                <p
                  className={`text-gray-700 leading-relaxed text-sm mb-0! ${
                    !isDescriptionExpanded ? "line-clamp-4" : ""
                  }`}
                >
                  {authorData.description}
                </p>
                {authorData.description.length > 200 && (
                  <button
                    className="text-[var(--custom-red)] text-sm font-bold hover:underline "
                    onClick={() => setIsDescriptionExpanded((prev) => !prev)}
                  >
                    {isDescriptionExpanded ? "View Less" : "View More"}
                  </button>
                )}
              </div>
            )}

            {/* Social Links */}
            {Object.values(authorData?.socialLinks || {}).some(Boolean) && (
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
                  Connect With Me
                </h3>
                <div className="flex flex-wrap gap-3">
                  {Object.entries(authorData?.socialLinks || {}).map(
                    ([platform, url]: [string, any]) =>
                      url && (
                        <a
                          key={platform}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center w-7 h-7"
                          aria-label={platform}
                        >
                          {socialIcons[platform.toLowerCase()] || (
                            <Url className="w-5 h-5" />
                          )}
                        </a>
                      )
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">News Articles</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {result?.data?.news.length > 0 ? (
            result?.data?.news?.map((item: any, index: any) => (
              <div key={index} className="border-b pb-4 border p-4">
                <div className="text-gray-500 text-sm mb-2">
                  <Link
                    href={`/${item?.category?.slug}`}
                    className="text-black underline"
                  >
                    {item?.category?.name}
                  </Link>{" "}
                  on {formatDate(item?.publishDate)}
                </div>
                <Typography
                  variant="h3"
                  weight="400"
                  className="text-2xl font-medium hover:underline line-clamp-3"
                >
                  <Link href={`/${item?.category?.slug}/${item?.slug}`}>
                    {item?.title}
                  </Link>
                </Typography>
              </div>
            ))
          ) : (
            <div className="uppercase text-xs col-span-full">
              News not posted by this author
            </div>
          )}
        </div>
      </div>

      {/* Pagination */}
      <ClientPagination
        slug={slug}
        currentPage={Number(result.data.pagination.currentPage)}
        totalItems={Number(result.data.pagination.totalCount)}
        limit={Number(result.data.pagination.limit)}
        url="author"
      />
    </main>
  );
};

export default AuthorDetailComponent;
