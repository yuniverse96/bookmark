import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.gyeongju.go.kr',
      },
    ],
  },
};

export default nextConfig;
