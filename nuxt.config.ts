// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode',
    '@nuxtjs/google-fonts',
    '@nuxtjs/i18n'
  ],

  css: [
    '~/assets/css/main.css',
    'aos/dist/aos.css'
  ],

  colorMode: {
    classSuffix: '',
    preference: 'system',
    fallback: 'light'
  },

  googleFonts: {
    families: {
      Tajawal: [200, 300, 400, 500, 700, 800, 900],
      Inter: [300, 400, 500, 600, 700, 800]
    },
    display: 'swap',
    prefetch: true,
    preconnect: true
  },

  i18n: {
    locales: [
      {
        code: 'ar',
        language: 'ar-EG',
        dir: 'rtl',
        name: 'العربية',
        file: 'ar.ts'
      },
      {
        code: 'en',
        language: 'en-US',
        dir: 'ltr',
        name: 'English',
        file: 'en.ts'
      }
    ],
    defaultLocale: 'ar',
    strategy: 'prefix_except_default',
    detectBrowserLanguage: false,
    bundle: {
      optimizeTranslationDirective: false
    }
  },

  app: {
    head: {
      meta: [
        { name: 'theme-color', content: '#1e6bb8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/images/logo.png' }
      ]
    }
  }
})
