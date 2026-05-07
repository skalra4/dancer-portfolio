import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "i.vimeocdn.com",
        pathname: "/**",
      },
      {
        // Sanity image CDN — used when assets are uploaded to a Sanity project
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/images/**",
      },
    ],
  },
};

export default nextConfig;
