module.exports = {
  apps: [
    {
      name: 'Nuxt-Plais',
      port: '3000',
      exec_mode: 'cluster',
      instances: 'max',
      script: './server/index.mjs',
    },
  ],
}
