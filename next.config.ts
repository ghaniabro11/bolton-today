import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "boltontoday.co.uk",
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
