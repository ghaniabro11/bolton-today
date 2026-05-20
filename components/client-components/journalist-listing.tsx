"use client";

import Image from "next/image";
import Link from "next/link";
import { User2 } from "lucide-react";
import { ClientPagination } from "../reuse-client-pagination";

const JournalistListingComponent = ({
  result,
}: {
  result: any;
}) => {
  const journalists = result?.data || [];

  return (
    <div className="py-6">
      {/* Heading */}
      <div className="mb-8">
        <h1 className="text-3xl lg:text-5xl font-bold">
          Our Journalists
        </h1>

        <p className="text-gray-500 mt-2">
          Meet our professional journalism team
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {journalists?.map((item: any) => (
          <Link
            key={item?.id}
            href={`/journalist/${item?.slug}`}
            className="group border rounded-2xl overflow-hidden bg-white hover:shadow-xl transition-all duration-300"
          >
            {/* Image */}
            <div className="relative h-72 overflow-hidden bg-gray-100">
              {item?.image?.filePath ? (
                <Image
                  src={item?.image?.filePath}
                  alt={item?.image?.title || item?.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-all duration-500"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <User2 className="w-20 h-20 text-gray-400" />
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-5">
              <h2 className="text-xl font-semibold line-clamp-1">
                {item?.name}
              </h2>

              {item?.position && (
                <p className="text-(--custom-red) text-sm mt-1">
                  {item?.position}
                </p>
              )}

              <p className="text-sm text-gray-600 mt-3 line-clamp-3">
                {item?.description}
              </p>

              <div className="mt-4 text-sm font-semibold text-(--custom-red)">
                View Profile →
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-10">
        <ClientPagination
            slug=""
            currentPage={Number(result?.pagination?.currentPage)}
            totalItems={Number(result?.pagination?.totalCount)}
            limit={Number(result?.pagination?.limit)}
            url="journalists"
            />
      </div>
    </div>
  );
};

export default JournalistListingComponent;