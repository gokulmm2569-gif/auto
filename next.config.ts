import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/auto",
  images: {
    unoptimized: true
  }
};

export default nextConfig;