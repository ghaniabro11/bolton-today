import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "washingtoninsider.net",
      "localhost",
      "31.97.133.203",
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
