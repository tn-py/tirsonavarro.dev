/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'tn-pull-zone.b-cdn.net',
      },
    ],
  },
};

export default nextConfig;
