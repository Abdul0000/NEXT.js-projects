import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '0w1lzybmm4.ufs.sh',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
