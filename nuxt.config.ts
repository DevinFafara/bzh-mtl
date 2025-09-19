// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  compatibilityDate: '2025-06-30',
  ssr: true, // Activer le SSR pour que les API routes fonctionnent correctement
  
  // Configuration SEO par défaut
  app: {
    head: {
      title: 'Breizh Metal',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { 
          name: 'description', 
          content: 'Découvrez la scène metal bretonne : groupes, festivals, concerts, chroniques et actualités. Le webzine de référence du metal en Bretagne.' 
        },
        { name: 'keywords', content: 'metal, bretagne, musique, festivals, concerts, groupes, chroniques, bzh, breizh' },
        { name: 'author', content: 'Breizh Metal' },
        { property: 'og:site_name', content: 'Breizh Metal' },
        { property: 'og:type', content: 'website' },
        { property: 'og:locale', content: 'fr_FR' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:site', content: '@BreizhMetal' }
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon-96x96.png', sizes: '96x96' },
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'shortcut icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'manifest', href: '/site.webmanifest' }
      ],
      script: [
        {
          defer: true,
          src: 'https://static.cloudflareinsights.com/beacon.min.js',
          'data-cf-beacon': '{"token": "${process.env.CLOUDFLARE_TOKEN}"}'
        }
      ]
    }
  },
  
  // Configuration Nitro pour Netlify avec fonctions personnalisées
  nitro: {
    preset: 'netlify',
    // Empêcher Netlify d'intercepter nos routes personnalisées
    experimental: {
      wasm: false
    }
  },
  
  modules: [
    '@nuxt/eslint',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/sanity',
    '@nuxtjs/sitemap'
  ],
  css: ['~/assets/css/tailwind.css'],
  
  // Configuration du sitemap
  site: {
    url: 'https://breizhmetal.bzh'
  },
  
  sitemap: {
    // Génération du sitemap avec les routes dynamiques
    urls: async () => {
      // Import dynamique pour éviter les problèmes de build
      const { createClient } = await import('@sanity/client')
      
      const client = createClient({
        projectId: process.env.SANITY_PROJECT_ID,
        dataset: 'production',
        useCdn: true,
        apiVersion: '2024-03-07'
      })
      
      try {
        // Récupère tous les slugs des différents types de contenu avec leurs images
        const [bands, articles, events, venues, styles, festivals] = await Promise.all([
          client.fetch(`*[_type == "band" && defined(slug.current) && !(_id in path('drafts.**'))]{"slug": slug.current, _updatedAt, "image": pressPhotos[0].asset->url}`),
          client.fetch(`*[_type == "post" && defined(slug.current) && !(_id in path('drafts.**'))]{"slug": slug.current, _updatedAt, "image": mainImage.asset->url}`),
          client.fetch(`*[_type == "event" && defined(slug.current) && !(_id in path('drafts.**'))]{"slug": slug.current, _updatedAt, "image": poster.asset->url}`),
          client.fetch(`*[_type == "venue" && defined(slug.current) && !(_id in path('drafts.**'))]{"slug": slug.current, _updatedAt, "image": photos[0].asset->url}`),
          client.fetch(`*[_type == "style" && defined(slug.current) && !(_id in path('drafts.**'))]{"slug": slug.current, _updatedAt}`),
          client.fetch(`*[_type == "festival" && defined(slug.current) && !(_id in path('drafts.**'))]{"slug": slug.current, _updatedAt, "mainImage": mainImage.asset->url}`)
        ])
        
        // Transforme en URLs pour le sitemap avec images
        const urls = [
          ...bands.map((item: any) => ({ 
            loc: `/groupes/${item.slug}`, 
            lastmod: item._updatedAt,
            images: item.image ? [item.image] : []
          })),
          ...articles.map((item: any) => ({ 
            loc: `/articles/${item.slug}`, 
            lastmod: item._updatedAt,
            images: item.image ? [item.image] : []
          })),
          ...events.map((item: any) => ({ 
            loc: `/evenements/${item.slug}`, 
            lastmod: item._updatedAt,
            images: item.image ? [item.image] : []
          })),
          ...venues.map((item: any) => ({ 
            loc: `/salles/${item.slug}`, 
            lastmod: item._updatedAt,
            images: item.image ? [item.image] : []
          })),
          ...styles.map((item: any) => ({ 
            loc: `/styles/${item.slug}`, 
            lastmod: item._updatedAt
          })),
          ...festivals.map((item: any) => ({ 
            loc: `/festivals/${item.slug}`, 
            lastmod: item._updatedAt,
            images: item.mainImage ? [item.mainImage] : []
          }))
        ]
        
        return urls
      } catch (error) {
        console.error('Erreur lors de la génération du sitemap:', error)
        return []
      }
    }
  },
  
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