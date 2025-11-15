import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  turbopack: {
    resolveExtensions: ['.mdx', '.tsx', '.ts', '.jsx', '.js', '.mjs', '.json'],
  },
  webpack: (config) => {
    if (!config.resolve) {
      config.resolve = {};
    }

    config.resolve.fallback = {
      ...(config.resolve.fallback || {}),
      fs: false,
      net: false,
      tls: false,
    };

    return config;
  },
};

export default nextConfig;
