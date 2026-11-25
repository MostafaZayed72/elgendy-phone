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

  runtimeConfig: {
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
    cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY || '',
    cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET || '',
    adminUsername: process.env.ADMIN_USERNAME || 'elgendy',
    adminPassword: process.env.ADMIN_PASSWORD || '123456',
    maxImagesLimit: Number(process.env.MAX_IMAGES_LIMIT || 250),
    public: {
      supabaseUrl: process.env.NUXT_PUBLIC_SUPABASE_URL || '',
      supabaseAnonKey: process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY || ''
    }
  },

  routeRules: {
    '/api/**': { cache: false },
    '/admin/**': { ssr: false, cache: false }
  },

  app: {
    head: {
      meta: [
        { name: 'theme-color', content: '#1e6bb8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' }
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/images/logo.png' },
        { rel: 'apple-touch-icon', href: '/icons/apple-touch-icon.png' },
        { rel: 'manifest', href: '/manifest.webmanifest' }
      ],
      script: [
        {
          innerHTML: "window.__pwaInstallPrompt=null;window.addEventListener('beforeinstallprompt',function(e){e.preventDefault();window.__pwaInstallPrompt=e;window.dispatchEvent(new Event('pwa-prompt-ready'));});",
          type: 'text/javascript'
        }
      ]
    }
  }
})
