import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingRoot: process.cwd(),
  async headers() {
    const photoHeaders = [
      { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
      { key: "X-Robots-Tag", value: "noimageindex, noarchive" }
    ];

    return [
      { source: "/assets/:path*", headers: photoHeaders },
      { source: "/_next/image", headers: photoHeaders }
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com"
      },
      {
        protocol: "https",
        hostname: "images.pexels.com"
      }
    ]
  }
};

export default nextConfig;
