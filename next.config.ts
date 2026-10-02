import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: process.env.NEXT_DIST_DIR || ".next",
  async headers() {
    return [{ source: "/verify-university-email", headers: [
      { key: "Cache-Control", value: "no-store" },
      { key: "Referrer-Policy", value: "no-referrer" },
      { key: "X-Robots-Tag", value: "noindex, nofollow" },
    ] }];
  },
  async rewrites() {
    const backend = process.env.NEXT_PUBLIC_API_URL?.trim().replace(/\/$/, "");
    if (!backend) return [];
    return ["/api/auth/sign-in/email", "/api/auth/get-session", "/api/auth/sign-out", "/api/v1/universities", "/api/v1/user/me", "/api/v1/user/university-email/verify", "/api/v1/admin/:path*"].map((path) => ({
      source: path,
      destination: `${backend}${path}`,
    }));
  },
};

export default nextConfig;
