"use client";
import { usePathname } from "next/navigation";

export function getCurrentPath() {
  const pathname = usePathname();

  return pathname;
}
