import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "storage.quocdk.id.vn",
        port: "",
        pathname: "/**", // Explicitly allow all paths
      },
      {
        protocol: "https",
        hostname: "r2-storage.quocdk.id.vn",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;