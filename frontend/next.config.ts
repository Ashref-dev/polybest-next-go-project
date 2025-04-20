import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ytimg.com",
      },
      {
        protocol: "https",
        hostname: "www.bpmcdn.com",
      },
      {
        protocol: "https",
        hostname: "images.squarespace-cdn.com",
      },
      {
        protocol: "https",
        hostname: "www.browardcenter.org",
      },
      {
        protocol: "https",
        hostname: "images2.alphacoders.com",
      },
      {
        protocol: "https",
        hostname: "www.vitalthrills.com",
      },
    ],
  },
};

export default nextConfig;
