// Configuration du sitemap Nuxt
export default defineNuxtConfig({
  // Le module est déjà ajouté dans nuxt.config.ts
  
  // Configuration par défaut du sitemap
  runtimeConfig: {
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://breizhmetal.bzh'
    }
  }
})

// Le sitemap sera automatiquement généré à /sitemap.xml
// Il inclura toutes vos pages statiques et dynamiques

/*
Configuration avancée possible (à ajouter plus tard) :

1. Routes dynamiques depuis Sanity :
   - /articles/[slug]
   - /groupes/[slug] 
   - /evenements/[slug]
   - /salles/[slug]
   - /festivals/[slug]
   - /styles/[slug]

2. Exclusions :
   - Pages admin
   - Pages de test
   
3. Priorités SEO :
   - Page d'accueil : priority 1.0
   - Pages principales : priority 0.8
   - Articles : priority 0.6
   - Pages détail : priority 0.4

4. Fréquence de mise à jour :
   - Accueil : daily
   - Articles : weekly  
   - Pages statiques : monthly
*/