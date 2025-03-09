// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  css: ['~/assets/css/tailwind.css'],
  devtools: { enabled: true },
  vite: {
    plugins: [
      tailwindcss(),
    ],
  }
})
