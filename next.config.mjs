/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['fakestoreapi.com'],
    minimumCacheTTL: 60,
  },
  optimizeFonts: true,
};

export default nextConfig;
