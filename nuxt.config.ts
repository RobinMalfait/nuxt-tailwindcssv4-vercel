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
  auth: {
    globalAppMiddleware: true,
    baseURL: '/api/auth',
    provider: {
      type: 'local',
      pages: {
        login: '/sign-in'
      },
      endpoints: {
        signIn: { path: '/login', method: 'post' },
        signOut: { path: '/logout', method: 'post' },
        signUp: { path: '/register', method: 'post' },
        getSession: { path: '/session', method: 'get' },
      },
      token: {
        signInResponseTokenPointer: '/token',
        cookieName: 'auth.token',
        type: 'Bearer',
        headerName: 'Authorization',
        maxAgeInSeconds: 3600 * 124, // 120 hours
        sameSiteAttribute: 'lax'
      }
    }
  },
  css: ['~/assets/css/tailwind.css'],
  devtools: { enabled: true },
  runtimeConfig: {
    varnishToken: '',
    public: {
      apiUrl: '',
      apiUrlBrowser: '',
      papersEndpoint: '/account/papers'
    }
  },
  googleFonts: {
    families: {
      Lato: [400, 700]
    }
  },
  gtag: {
    enabled: true,
    id: 'GTM-5Q3VQ68',
    initCommands: [
      // Setup up consent mode
      ['consent', 'default', {
        ad_user_data: 'granted',
        ad_personalization: 'granted',
        ad_storage: 'granted',
        analytics_storage: 'granted',
        wait_for_update: 500,
      }]
    ]
  },
  icon: {
    serverBundle: {
      collections: ['heroicons-outline', 'heroicons-solid', 'flowbite', 'emojione-monotone', 'fa', 'material-symbols']
    }
  },
  lodash: {
    prefix: "_",
    upperAfterPrefix: false
  },
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
  pwa: {
    manifest: {
      name: 'Paper Authoring Tool',
      description: 'A tool to author RCT study papers',
      lang: 'en',
      short_name: 'PAT',
      theme_color: '#22AC2E',
      background_color: '#FFFFFF',
      icons: [
        {
          "src": "pwa-64x64.png",
          "sizes": "64x64",
          "type": "image/png"
        },
        {
          "src": "pwa-192x192.png",
          "sizes": "192x192",
          "type": "image/png"
        },
        {
          "src": "pwa-512x512.png",
          "sizes": "512x512",
          "type": "image/png"
        },
        {
          "src": "maskable-icon-512x512.png",
          "sizes": "512x512",
          "type": "image/png",
          "purpose": "maskable"
        }
      ]
    }
  },
  vite: {
    plugins: [
      tailwindcss(),
    ],
  }
})
