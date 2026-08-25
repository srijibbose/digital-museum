import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Development-only LAN access for testing the exhibit on a phone.
  // Next.js ignores this allowlist in production builds.
  allowedDevOrigins: ["192.168.0.2"],
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
    const anatomyAssetCache = [
      {
        key: "Cache-Control",
        value: "public, max-age=31536000, immutable",
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
      {
        source: "/models/anatomy/:path*",
        headers: anatomyAssetCache,
      },
      {
        source: "/media/anatomy/:path*",
        headers: anatomyAssetCache,
      },
    ];
  },
};

export default nextConfig;
