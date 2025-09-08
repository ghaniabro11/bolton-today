"use client";
import { useEffect } from "react";

export default function AdUnit() {
  useEffect(() => {
    try {
      // Push ad request to Google after component mounts
      // @ts-ignore
      (adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
    //   console.error("AdSense error:", e);
    }
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{ display: "block" }}
      data-ad-client="ca-pub-5687793259503722"
      data-ad-slot="2408660894"
      data-ad-format="auto"
      data-full-width-responsive="true"
    ></ins>
  );
}
