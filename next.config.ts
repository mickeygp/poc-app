import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // POC: keep builds green without blocking on lint.
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
