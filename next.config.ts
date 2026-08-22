import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Development-only LAN access for testing the exhibit on a phone.
  // Next.js ignores this allowlist in production builds.
  allowedDevOrigins: ["192.168.0.2"],
  images: {
    qualities: [75, 90, 92],
  },
};

export default nextConfig;
