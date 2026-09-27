import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/vethospital-os",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
