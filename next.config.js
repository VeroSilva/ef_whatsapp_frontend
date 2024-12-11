const { env } = require("./env-config");

const nextConfig = {
  env: {
    API_URL: process.env.API_URL,
    API_SOCKET: process.env.API_SOCKET,
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
  // Configuración de dominios de imágenes
  images: {
    domains: [
      "scontent.whatsapp.net",
      "efperfumes.com",
      "kinsta.com",
      "api.efperfumes.com",
      "wa.efperfumes.com",
      "lacasadelperfumeperu.com",
      "vzla.efperfumes.com",
      "scontent-*.xx.fbcdn.net",
      "scontent.xx.fbcdn.net",
      "lacasadelperfumista.com",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "efperfumes.com",
        port: "",
        pathname: "/wp-content/uploads/**",
      },
      {
        protocol: "https",
        hostname: "vzla.efperfumes.com",
        port: "",
        pathname: "/wp-content/uploads/**",
      },
      {
        protocol: "https",
        hostname: "scontent-*.xx.fbcdn.net",
      },
      {
        protocol: "https",
        hostname: "scontent.xx.fbcdn.net",
      },
    ],
  },
  // Configuración de TypeScript
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(ogg|mp3|wav|mpe?g)$/i,
      use: {
        loader: "file-loader",
        options: {
          name: "[name].[ext]",
          publicPath: "/_next/static/sounds/",
          outputPath: "static/sounds/",
        },
      },
    });

    return config;
  },
};

module.exports = nextConfig;
