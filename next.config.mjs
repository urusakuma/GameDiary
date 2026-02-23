/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export',
  trailingSlash: true,
  basePath: '/GameDiary',
  assetPrefix: '/GameDiary',
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
