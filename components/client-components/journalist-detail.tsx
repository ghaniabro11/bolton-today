"use client";
import { formatDate } from "@/utils/date";
import { Globe, Loader, Link as Url, User2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { ClientPagination } from "../reuse-client-pagination";
import { Facebook } from "./icons/facebook";
import { Instagram } from "./icons/instagram";
import { Linkedin } from "./icons/linkdin";
import { Muckrack } from "./icons/muckrack";
import { Twitter } from "./icons/twitter";
import { Typography } from "./typography";
import NewsCard from "./news-card";

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

const JournalistDetailComponent = ({
  result,
  slug,
}: {
  result: any;
  slug: string;
}) => {
  const [mounted, setmounted] = useState(false);
  const journalistData = result?.data?.journalist as any;
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  useEffect(() => {
    setmounted(true);
  }, []);
  if (!mounted) return null;
  return (
    <div suppressHydrationWarning>
      <div className="p-5">
        <div className="flex flex-col gap-4">
          {/* Left Section - Image */}
          <div className="shrink-0">
            <div className="relative">
              {journalistData?.image?.filePath ? (
                <Image
                  src={journalistData?.image.filePath}
                  alt={journalistData?.image.title || "Journalist Image"}
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
          <div className="block w-px bg-linear-to-b from-transparent via-gray-200 to-transparent"></div>

          {/* Right Section - Content */}
          <div className="flex-1 space-y-6">
            {/* Name */}
            {journalistData?.name && (
              <Typography
                weight="400"
                variant="h1"
                className="text-2xl lg:text-4xl font-bold text-gray-900 mb-2"
              >
                {journalistData?.name}
              </Typography>
            )}

            {/* Description */}
            {journalistData?.description && (
              <div>
                <p
                  className={`text-gray-700 leading-relaxed text-sm mb-0! ${
                    !isDescriptionExpanded ? "line-clamp-4" : ""
                  }`}
                >
                  {journalistData?.description}
                </p>
                {journalistData?.description.length > 200 && (
                  <button
                    className="text-(--custom-red) text-sm font-bold hover:underline "
                    onClick={() => setIsDescriptionExpanded((prev) => !prev)}
                  >
                    {isDescriptionExpanded ? "View Less" : "View More"}
                  </button>
                )}
              </div>
            )}

            {/* Social Links */}
            {Object.values(journalistData?.socialLinks || {}).some(Boolean) && (
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
                  Connect With Me
                </h3>
                <div className="flex flex-wrap gap-3">
                  {Object.entries(journalistData?.socialLinks || {}).map(
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

      {/* Pagination */}
      {/* <ClientPagination
        slug={slug}
        currentPage={Number(result.data.pagination.currentPage)}
        totalItems={Number(result.data.pagination.totalCount)}
        limit={Number(result.data.pagination.limit)}
        url="journalist"
      /> */}
    </div>
  );
};

export default JournalistDetailComponent;
