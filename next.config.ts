import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avispark.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
