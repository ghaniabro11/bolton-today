"use client";

import {
  Pagination as ShadPagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationProps {
  totalItems: number;
  currentPage: number;
  limit: number;
  search?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  totalItems,
  currentPage,
  limit,
  search = "",
}) => {
  const totalPages = Math.ceil(totalItems / limit);
  const maxVisiblePages = 5;
  const halfVisible = Math.floor(maxVisiblePages / 2);

  if (totalPages <= 1) return null;

  let startPage = Math.max(1, currentPage - halfVisible);
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  const buildQuery = (page: number) => {
    const params = new URLSearchParams({
      page: page.toString(),
    //   limit: limit.toString(),
    });
    if (search) params.set("search", search);
    return `?${params.toString()}`;
  };

  return (
    <ShadPagination>
      <PaginationContent>
        {currentPage > 1 && (
          <PaginationItem>
            <PaginationPrevious href={buildQuery(currentPage - 1)} />
          </PaginationItem>
        )}

        {startPage > 1 && (
          <>
            <PaginationItem>
              <PaginationLink href={buildQuery(1)}>1</PaginationLink>
            </PaginationItem>
            {startPage > 2 && <PaginationEllipsis />}
          </>
        )}

        {Array.from({ length: endPage - startPage + 1 }, (_, i) => {
          const page = startPage + i;
          return (
            <PaginationItem key={page}>
              <PaginationLink
                href={buildQuery(page)}
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
              <PaginationLink href={buildQuery(totalPages)}>
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          </>
        )}

        {currentPage < totalPages && (
          <PaginationItem>
            <PaginationNext href={buildQuery(currentPage + 1)} />
          </PaginationItem>
        )}
      </PaginationContent>
    </ShadPagination>
  );
};
