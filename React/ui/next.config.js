/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async rewrites() {
    return {
      fallback: [
        {
          source: '/api/:path*',
          destination: `http://localhost:7071/api/:path*`,
        },
        {
          source: "/:any*",
          destination: "/",
        }
      ],
    }
  },
}

module.exports = nextConfig
