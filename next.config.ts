import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "washingtoninsider.net",
      "localhost",
      "31.97.133.203",
      "staging.washingtoninsider.net",
    ],
  },
  trailingSlash: true,
  async redirects() {
    return [
      {
        source: "/:path*[^/]", // Matches all paths that don't end with a slash
        has: [
          {
            type: "host",
            value: "(.*)", // To ensure it's generic
          },
        ],
        permanent: true,
        destination: "/:path*/", // Redirect to version with trailing slash
      },
    ];
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
