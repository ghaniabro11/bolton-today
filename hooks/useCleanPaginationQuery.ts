// hooks/useCleanPaginationQuery.ts
"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export const useCleanPaginationQuery = (limit?: any) => {
    
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  useEffect(() => {
    const page = limit;

    if (page === "1") {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("page");

      const queryString = params.toString();
      const newUrl = queryString ? `?${queryString}` : pathname;

      router.replace(newUrl, { scroll: false });
    }
  }, [searchParams, router, limit]);
};
