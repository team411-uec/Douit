import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // パフォーマンス最適化
  experimental: {
    // optimizeCss: true, // crittersモジュールエラーのため一時的に無効化
    optimizePackageImports: ["@radix-ui/themes"],
  },

  // Turbopack設定（開発環境での高速ビルド）
  turbopack: {
    resolveExtensions: [".mdx", ".tsx", ".ts", ".jsx", ".js", ".mjs", ".json"],
  },

  // 画像最適化
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // セキュリティヘッダー
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
        ],
      },
    ];
  },

  // webpack設定（Firebase対応）
  webpack: (config: {
    resolve: { fallback: Record<string, boolean | string> };
    optimization: { splitChunks: Record<string, unknown> };
  }) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: false,
    };

    // バンドルサイズ分析
    config.optimization.splitChunks = {
      chunks: "all",
      cacheGroups: {
        firebase: {
          test: /[\\/]node_modules[\\/](firebase|@firebase)[\\/]/,
          name: "firebase",
          chunks: "all",
        },
        radix: {
          test: /[\\/]node_modules[\\/]@radix-ui[\\/]/,
          name: "radix-ui",
          chunks: "all",
        },
      },
    };

    return config;
  },

  // 本番環境での最適化
  compress: true,
  poweredByHeader: false,

  // TypeScript設定
  typescript: {
    ignoreBuildErrors: false,
  },

  // ESLint設定
  eslint: {
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;
