import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['decorator-porthole-ebony.ngrok-free.dev'],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn3.alegra.com",
      },
    ],
  },
}

export default nextConfig