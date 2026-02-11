import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Enable optimization for smaller downloads and better LCP (WebP/AVIF, resizing)
    qualities: [25, 50, 75],
    // unoptimized: false,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ["image/avif", "image/webp"],
    // Cache optimized images for 1 year (improves repeat-visit performance)
    minimumCacheTTL: 31536000,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "boltontoday.co.uk",
        pathname: "/files/**",
      },
      {
        protocol: "https",
        hostname: "www.boltontoday.co.uk",
        pathname: "/files/**",

      },
      {
        protocol: "https",
        hostname: "washingtoninsider.us",
        pathname: "/files/**",

      },
    ],

  },

  async headers() {
    return [
      {
        source: "/bolton_logo.svg",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

};

export default nextConfig;
