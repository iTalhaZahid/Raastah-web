import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: process.env.NEXT_DIST_DIR || ".next",
  async rewrites() {
    const backend = process.env.NEXT_PUBLIC_API_URL?.trim().replace(/\/$/, "");
    if (!backend) return [];
    return ["/api/auth/sign-in/email", "/api/auth/get-session", "/api/auth/sign-out", "/api/v1/admin/:path*"].map((path) => ({
      source: path,
      destination: `${backend}${path}`,
    }));
  },
};

export default nextConfig;
