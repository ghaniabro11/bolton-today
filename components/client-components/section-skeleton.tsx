"use client";

import { cn } from "@/lib/utils";

/**
 * In-flow skeleton that reserves space to prevent CLS when dynamic content loads.
 * Use as the `loading` placeholder for dynamic() imports so layout doesn't shift.
 */
export function SectionSkeletonOne() {
  return (
    <section
      className={cn(
        "grid grid-cols-1 lg:grid-cols-5 gap-4 border-b border-black/20 overflow-hidden",
        "min-h-[55dvh] w-full"
      )}
      aria-hidden="true"
    >
      <div className="lg:col-span-2 flex flex-col gap-4 p-4">
        <div className="aspect-4/3 max-h-[45dvh] w-full bg-muted animate-pulse rounded" />
        <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
        <div className="h-4 w-full bg-muted animate-pulse rounded" />
      </div>
      <div className="lg:col-span-2 p-4 flex flex-col gap-3">
        <div className="h-4 w-1/4 bg-muted animate-pulse rounded" />
        <div className="h-8 w-full bg-muted animate-pulse rounded" />
        <div className="h-4 w-full bg-muted animate-pulse rounded" />
        <div className="h-4 w-2/3 bg-muted animate-pulse rounded" />
        <div className="mt-4 space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-5 w-full bg-muted animate-pulse rounded" />
          ))}
        </div>
      </div>
      <div className="p-4 space-y-3">
        <div className="h-5 w-20 bg-muted animate-pulse rounded" />
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-4 w-full bg-muted animate-pulse rounded" />
        ))}
      </div>
    </section>
  );
}

/**
 * Reserves space for ComponentFive (category grid with image + items).
 */
export function SectionSkeletonFive() {
  return (
    <div className="w-full min-h-[45dvh]" aria-hidden="true">
      <div className="border-b-3 border-b-btn w-fit my-2">
        <div className="h-8 w-48 bg-muted animate-pulse rounded" />
      </div>
      <section className="grid grid-cols-1 lg:grid-cols-6 gap-4 overflow-hidden py-4">
        <div className="lg:col-span-2">
          <div className="aspect-4/3 max-h-[30dvh] w-full bg-muted animate-pulse rounded" />
          <div className="h-5 w-full mt-2 bg-muted animate-pulse rounded" />
        </div>
        <div className="lg:col-span-2 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-2">
              <div className="size-24 shrink-0 bg-muted animate-pulse rounded" />
              <div className="h-4 flex-1 bg-muted animate-pulse rounded" />
            </div>
          ))}
        </div>
        <div className="lg:col-span-2 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-2">
              <div className="size-24 shrink-0 bg-muted animate-pulse rounded" />
              <div className="h-4 flex-1 bg-muted animate-pulse rounded" />
            </div>
          ))}
        </div>
      </section>
      <div className="flex items-center justify-center w-full py-4">
        <div className="h-8 w-24 bg-muted animate-pulse rounded-full" />
      </div>
    </div>
  );
}
