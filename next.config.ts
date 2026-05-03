import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable Turbopack to avoid lightningcss native module issues on Vercel
  turbopack: false,
  // Configure for external packages
  serverExternalPackages: ["@tailwindcss/postcss"],
};

export default nextConfig;
