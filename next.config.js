/** @type {import('next').NextConfig} */
const { env } = require("./env-config");

const nextConfig = {
  env,
  reactStrictMode: true,
  swcMinify: true,
  async rewrites() {
    return [
      {
        source: "/",
        destination: "/pages/login",
      },
    ];
  },
};

module.exports = nextConfig;
