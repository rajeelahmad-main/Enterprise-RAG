import path from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ['bcryptjs'],
  outputFileTracingRoot: path.resolve('.'),
};

export default nextConfig;
