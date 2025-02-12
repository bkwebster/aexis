/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    // Enable modern build optimizations
    optimizePackageImports: [
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-avatar",
      "@radix-ui/react-scroll-area",
    ],
  },
  webpack: (config, { isServer }) => {
    // Optimize client-side bundling
    if (!isServer) {
      config.optimization.splitChunks.cacheGroups = {
        ...config.optimization.splitChunks.cacheGroups,
        default: false,
        defaultVendors: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;
