module.exports = {
  apps: [
    {
      name: "ef-whatsapp-prod-front-1",
      script: "npm",
      args: "start",
      env: {
        PORT: 9002,
      },
    },
  ],
};
