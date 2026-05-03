import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.metmuseum.org' },
      { protocol: 'https', hostname: 'collectionapi.metmuseum.org' },
    ],
  },
};

export default nextConfig;
