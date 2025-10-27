"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    adsbygoogle: any;
  }
}

export default function AdBanner() {
  const adRef = useRef<HTMLModElement>(null);
  const isLoadedRef = useRef(false); // prevent re-init

  useEffect(() => {
    if (!isLoadedRef.current) {
      try {
        if (typeof window !== "undefined" && adRef.current) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          isLoadedRef.current = true; // mark as loaded
        }
      } catch (e) {
        console.error("AdSense error:", e);
      }
    }
  }, []);

  return (
    <ins
      ref={adRef}
      className="adsbygoogle"
      style={{ display: "block" }}
      data-ad-client="ca-pub-5687793259503722"
      data-ad-slot="2408660894"
      data-ad-format="auto"
      data-full-width-responsive="true"
    ></ins>
  );
}
