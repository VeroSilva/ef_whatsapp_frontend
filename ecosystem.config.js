module.exports = {
  apps: [
    {
      name: "ef-whatsapp-prod-front",
      script: "npm",
      args: "start",
      env: {
        PORT: 9002,
      },
    },
  ],
};
