import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@rental/ui", "@rental/config", "@rental/types", "@rental/utils"],
};

export default nextConfig;
