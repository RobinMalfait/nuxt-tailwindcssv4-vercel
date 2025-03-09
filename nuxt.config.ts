// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  app: {
    head: {
      meta: [
        {charset: 'utf-8'},
        {name: 'viewport', content: 'width=device-width, initial-scale=1'},
        {
          name: 'description',
          content: 'Paper Authoring Tool'
        }
      ],
      link: [
        {
          rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'
        }
      ]
    }
  },
  devtools: { enabled: true },
  runtimeConfig: {
    varnishToken: '',
    public: {
      apiUrl: '',
      apiUrlBrowser: '',
      papersEndpoint: '/account/papers'
    }
  },
  css: ['~/assets/css/main.css'],
  modules: [
    '@vite-pwa/nuxt',
    'nuxt-gtag',
    '@nuxtjs/google-fonts',
    '@sidebase/nuxt-auth',
    'nuxt-auth-utils',
    'nuxt-lodash',
    '@pinia/nuxt',
    '@nuxt/icon',
    'nuxt-svgo'
  ],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  }
})
