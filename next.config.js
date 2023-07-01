/** @type {import('next').NextConfig} */
const { env } = require("./env-config");

const nextConfig = {
  env: {
    API_URL: process.env.API_URL,
    API_CUSTOM_HEADER: process.env.API_CUSTOM_HEADER,
  },
  async rewrites() {
    return [
      {
        source: "/",
        destination: "/pages/login",
      },
    ];
  },
  images: {
    domains: ["scontent.whatsapp.net", "efperfumes.com", "kinsta.com"],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // webpack: (config) => {
  //   config.module.rules.push({
  //       test: /\.scss$/,
  //       use: [
  //           'style-loader',
  //           'css-loader',
  //           'sass-loader'
  //       ]
  //   });

  //   return config;
  // }
};

module.exports = nextConfig;
