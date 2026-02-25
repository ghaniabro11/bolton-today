"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { useCleanPaginationQuery } from "@/hooks/useCleanPaginationQuery";

interface PaginationProps {
  slug: string;
  currentPage: number;
  totalItems: number;
  limit: number;
  url?: string | null;
}

export const ClientPagination = ({
  slug,
  currentPage,
  totalItems,
  limit,
  url,
}: PaginationProps) => {
  useCleanPaginationQuery(currentPage);
  const totalPages = Math.ceil(totalItems / limit);

  if (totalPages <= 1) return null;

  const maxVisiblePages = 5;
  const half = Math.floor(maxVisiblePages / 2);

  let startPage = Math.max(1, currentPage - half);
  let endPage = Math.min(totalPages, currentPage + half);

  if (endPage - startPage + 1 < maxVisiblePages) {
    if (startPage === 1) {
      endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    } else if (endPage === totalPages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
  }

  const getPageUrl = (page: number) =>
    url
      ? page === 1 || page === 0
        ? `/${url}/${slug}`
        : `/${url}/${slug}/page/${page}`
      : page === 1 || page === 0
        ? `/${slug}`
        : `/${slug}/page/${page}`;

  return (
    <Pagination className="py-6 flex-wrap justify-center">
      <PaginationContent className="gap-1 sm:gap-2">
        {/* Previous */}
        <PaginationItem>
          <PaginationPrevious
            href={getPageUrl(currentPage - 1)}
            className={
              currentPage === 1 ? "pointer-events-none opacity-50" : ""
            }
          />
        </PaginationItem>

        {/* Mobile view: current page only */}
        <div className="flex sm:hidden text-white items-center">
          <PaginationItem>
            <PaginationLink href={getPageUrl(currentPage)} isActive>
              {currentPage}
            </PaginationLink>
          </PaginationItem>
        </div>

        {/* Desktop view: full page links */}
        <div className="hidden sm:flex gap-1 items-center">
          {startPage > 1 && (
            <>
              <PaginationItem>
                <PaginationLink href={getPageUrl(1)}>1</PaginationLink>
              </PaginationItem>
              {startPage > 2 && <PaginationEllipsis />}
            </>
          )}

          {Array.from({ length: endPage - startPage + 1 }, (_, i) => {
            const page = startPage + i;
            return (
              <PaginationItem key={page}>
                <PaginationLink
                  href={getPageUrl(page)}
                  isActive={page === currentPage}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            );
          })}

          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && <PaginationEllipsis />}
              <PaginationItem>
                <PaginationLink href={getPageUrl(totalPages)}>
                  {totalPages}
                </PaginationLink>
              </PaginationItem>
            </>
          )}
        </div>

        {/* Next */}
        <PaginationItem>
          <PaginationNext
            href={getPageUrl(currentPage + 1)}
            className={
              currentPage === totalPages ? "pointer-events-none opacity-50" : ""
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
