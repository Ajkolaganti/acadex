/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'picsum.photos'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  async rewrites() {
    // Only add rewrites if API_BASE_URL is defined
    if (process.env.API_BASE_URL) {
      return [
        {
          source: '/api/:path*',
          destination: `${process.env.API_BASE_URL}/:path*`,
        },
      ];
    }
    return [];
  },
};

module.exports = nextConfig;