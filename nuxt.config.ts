// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: ['@nuxtjs/tailwindcss'],

  devServer: {
    port: 8080
  },

  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL ||
        (process.env.NODE_ENV === 'development'
          ? 'http://localhost:3000'
          : 'https://backend-lending-earamf6ve-kapils-projects-43e4d3b3.vercel.app')
    }
  },

  app: {
    head: {
      title: 'Fund Direct - Business Loan Application',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Fund Direct business loan verification form' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  }
})
