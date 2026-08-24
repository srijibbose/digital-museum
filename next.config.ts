import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Development-only LAN access for testing the exhibit on a phone.
  // Next.js ignores this allowlist in production builds.
  allowedDevOrigins: ["192.168.0.2"],
  images: {
    qualities: [75, 90, 92],
  },
  async redirects() {
    return [
      {
        source: "/exhibits/earth",
        destination: "/exhibits/atlas-of-worlds?world=earth",
        permanent: true,
      },
      {
        source: "/exhibits/moon",
        destination: "/exhibits/atlas-of-worlds?world=moon",
        permanent: true,
      },
    ];
  },
  async headers() {
    const anatomyAssetCache = [
      {
        key: "Cache-Control",
        value: "public, max-age=31536000, immutable",
      },
    ];

    return [
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
