module.exports = {
  apps: [
    {
      name: "ef-whatsapp-prod-front",
      script: "npm",
      args: "start-app",
      env: {
        PORT: 9002,
      },
    },
  ],
};
