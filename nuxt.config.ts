// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  compatibilityDate: '2025-06-30',
  ssr: false,
  modules: [
    '@nuxt/eslint',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/sanity'
  ],
  css: ['~/assets/css/tailwind.css'],
  sanity: {
    projectId: process.env.SANITY_PROJECT_ID,
    dataset: 'production',
    useCdn: false,
    apiVersion: '2024-03-07'
  },
  image: {
    sanity: {
      projectId: process.env.SANITY_PROJECT_ID
    }
  }
})