import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: '2024-11-01',
  modules: ['@nuxt/icon', '@nuxt/image', '@nuxt/scripts', '@nuxt/ui'],
  app: {
    head: {
      title:
        'PLAIS - The Polish Chapter of Association for Information Systems',
      meta: [
        {
          name: 'description',
          content: 'Polish Association for Information Systems',
        },
        {
          name: 'author',
          content:
            'Alessio Ricciardi, Kacper Kazimierczuk, Wojciech Bieńkowski',
        },
        {
          name: 'keywords',
          content: 'PLAIS, AIS',
        },
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1.0',
        },
        {
          name: 'robots',
          content: 'index, follow',
        },
      ],
    },
  },
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [tailwindcss()],
  },
  runtimeConfig: {
    public: {
      API_URL: process.env.API_URL,
    },
  },
  ui: {
    colorMode: false,
  },
  devtools: { enabled: false },
  devServer: {
    https: {
      key: 'localhost-key.pem',
      cert: 'localhost.pem',
    },
  },
})
