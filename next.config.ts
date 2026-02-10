import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Enable optimization for smaller downloads and better LCP (WebP/AVIF, resizing)
    // unoptimized: false,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ["image/avif", "image/webp"],
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
    ],
    domains: [
      "washingtoninsider.net",
      "localhost",
      "staging.washingtoninsider.net",
      "boltontoday.co.uk",
    ],
  },

  // webpack: (config, { isServer }) => {
  //   if (!isServer) {
  //     config.resolve.fallback = {
  //       ...config.resolve.fallback,
  //       fs: false,
  //       net: false,
  //       tls: false,
  //       dns: false,
  //     };
  //   }
  //   return config;
  // },
};

export default nextConfig;
