import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Turbopackでのバンドリング最適化
    turbo: {
      resolveExtensions: [".mdx", ".tsx", ".ts", ".jsx", ".js", ".mjs", ".json"],
    },
  },
  // Firebase関連のモジュール設定
  webpack: (config: NextConfig) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    return config;
  },
};

export default nextConfig;
