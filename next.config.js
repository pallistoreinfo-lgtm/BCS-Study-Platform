/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'vhhpazfulykrylqzpjti.supabase.co',
      },
    ],
  },
}

module.exports = nextConfig
