/** @type {import('next').NextConfig} */
const { env } = require("./env-config");

const nextConfig = {
  env,
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
