const { env } = require("./env-config");

const nextConfig = {
  env: {
    API_URL: process.env.API_URL,
    SOCKET_URL: process.env.SOCKET_URL,
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
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "efperfumes.com",
        port: "",
        pathname: "/wp-content/uploads/**",
      },
    ],
  },
  // Configuración de TypeScript
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
