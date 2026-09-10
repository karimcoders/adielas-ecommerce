import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Vercel-friendly: no standalone output needed on serverless */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};

export default nextConfig;
