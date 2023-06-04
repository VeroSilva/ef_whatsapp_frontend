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
  webpack: (config) => {
    config.module.rules.push({
        test: /\.scss$/,
        use: [
            'style-loader',
            'css-loader',
            'sass-loader'
        ]
    });

    return config;
  }
};

module.exports = nextConfig;
