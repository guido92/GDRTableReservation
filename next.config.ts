import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  /* experimental: {
    allowedDevOrigins: ['dev.gridottihome.it', 'localhost:3000'],
  }, */
};

export default nextConfig;
