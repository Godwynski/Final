import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ftiegwpjyymkjrrbuhna.supabase.co",
      },
      {
        protocol: "https",
        hostname: "pnblotjwwkffktpazetu.supabase.co",
      },
    ],
  },
};

export default nextConfig;
