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
      {
        protocol: "https",
        hostname: "indigomusic.com",
      },
      {
        protocol: "https",
        hostname: "wallpapers.com",
      },
      {
        protocol: "https",
        hostname: "www.browardcenter.org",
      },
      {
        protocol: "https",
        hostname: "sysfilessacbe149174fee.blob.core.windows.net",
      },
      {
        protocol: "https",
        hostname: "img.newsroom.cj.net",
      },
      {
        protocol: "https",
        hostname: "m.media-amazon.com",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
      },
    ],
  },
};

export default nextConfig;
