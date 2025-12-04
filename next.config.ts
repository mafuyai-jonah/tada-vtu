import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Production optimizations
  poweredByHeader: false,
  compress: true,
  // Image optimization
  images: {
    domains: ['tadavtu.com', 'www.tadavtu.com'],
  },
};

export default nextConfig;
