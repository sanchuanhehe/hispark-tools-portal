import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  ...(process.env.NEXT_PUBLIC_BASE_PATH ? {
    output: "export",
    trailingSlash: true,
  } : {}),
};
export default nextConfig;
