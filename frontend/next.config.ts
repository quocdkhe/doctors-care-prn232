import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "storage.quocdk.id.vn",
      },
      {
        protocol: 'https',
        hostname: 'r2-storage.quocdk.id.vn',
      },
    ],
  },
};

export default nextConfig;
