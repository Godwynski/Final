import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Optimize package imports for smaller bundle size
    optimizePackageImports: ['lucide-react', 'recharts', 'flowbite'],
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  images: {
    // Enable modern image formats for better compression
    formats: ['image/avif', 'image/webp'],
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
  // Turbopack config (for Next.js 16+ dev mode)
  // Turbopack has great defaults, so we use empty config
  turbopack: {},
  // Webpack optimization for production builds only
  webpack: (config, { isServer }) => {
    // Only apply custom webpack config in production
    if (!isServer && process.env.NODE_ENV === 'production') {
      // Better code splitting for client bundles
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            // Common components shared across pages
            commons: {
              name: 'commons',
              chunks: 'all',
              minChunks: 2,
              priority: 10,
            },
            // Separate vendor bundle for third-party libraries
            lib: {
              test: /[\\/]node_modules[\\/]/,
              name: 'lib',
              priority: 20,
              reuseExistingChunk: true,
            },
            // Separate recharts (heavy charting library)
            charts: {
              test: /[\\/]node_modules[\\/]recharts[\\/]/,
              name: 'charts',
              priority: 30,
            },
          },
        },
      };
    }
    return config;
  },
  // Enable compression
  compress: true,
  // Optimize production builds
  productionBrowserSourceMaps: false,
};

export default nextConfig;
