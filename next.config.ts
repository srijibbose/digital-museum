import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    qualities: [75, 90, 92],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "media.sketchfab.com",
        pathname: "/models/**",
      },
    ],
  },
  async headers() {
    const dinosaurAssetCache = [
      {
        key: "Cache-Control",
        value: "public, max-age=86400, stale-while-revalidate=604800",
      },
    ];

    return [
      {
        source: "/models/dinosaurs/:path*",
        headers: dinosaurAssetCache,
      },
      {
        source: "/media/dinosaurs/:path*",
        headers: dinosaurAssetCache,
      },
    ];
  },
};

export default nextConfig;
