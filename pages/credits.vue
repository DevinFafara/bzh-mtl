<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 py-8">
      <!-- En-tête -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">Crédits</h1>
        <p class="text-xl text-gray-600">Équipe, technologies et remerciements</p>
      </div>

      <!-- Contenu -->
      <div class="max-w-4xl mx-auto space-y-8">
        
        <!-- Équipe -->
        <div class="bg-white rounded-lg shadow-sm p-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">Équipe éditoriale</h2>
          <div class="prose max-w-none">
            <p>
              <strong>Breizh Metal</strong> est un site indépendant créé par des passionnés de musique metal, dédié à la promotion de la scène metal bretonne.
            </p>
            <p>
              <strong>Direction éditoriale :</strong> Bruno Guézennec<br>
              <strong>Rédaction :</strong> Bruno Guézennec<br>
              <strong>Développement web, design, maintenance :</strong> Jean-Yves Cudonnec
            </p>
          </div>
        </div>

        <!-- Technologies -->
        <div class="bg-white rounded-lg shadow-sm p-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">Technologies utilisées</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <!-- Frontend -->
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Frontend</h3>
              <ul class="space-y-2">
                <li class="flex items-center">
                  <Icon name="logos:nuxt-icon" class="h-6 w-6 mr-3" />
                  <span><strong>Nuxt.js 3</strong> - Framework Vue.js</span>
                </li>
                <li class="flex items-center">
                  <Icon name="logos:vue" class="h-6 w-6 mr-3" />
                  <span><strong>Vue.js 3</strong> - Framework JavaScript</span>
                </li>
                <li class="flex items-center">
                  <Icon name="logos:tailwindcss-icon" class="h-6 w-6 mr-3" />
                  <span><strong>Tailwind CSS</strong> - Framework CSS</span>
                </li>
              </ul>
            </div>

            <!-- Backend -->
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Backend & Services</h3>
              <ul class="space-y-2">
                <li class="flex items-center">
                  <Icon name="simple-icons:sanity" class="h-6 w-6 mr-3" />
                  <span><strong>Sanity.io</strong> - CMS headless</span>
                </li>
                <li class="flex items-center">
                  <Icon name="simple-icons:netlify" class="h-6 w-6 mr-3" />
                  <span><strong>Netlify</strong> - Hébergement et déploiement</span>
                </li>
                <li class="flex items-center">
                  <Icon name="logos:github-icon" class="h-6 w-6 mr-3" />
                  <span><strong>GitHub</strong> - Contrôle de version & Hébergement du code</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Remerciements -->
        <div class="bg-white rounded-lg shadow-sm p-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">Remerciements</h2>
          <div class="prose max-w-none">
            <p>
              Nous remercions chaleureusement :
            </p>
            <ul>
              <li>Tous les groupes, salles et festivals qui participent à la richesse de la scène metal bretonne</li>
              <li>Tous les lecteurs et supporters du site</li>
            </ul>
          </div>
        </div>

        <!-- Contact -->
        <div class="bg-white rounded-lg shadow-sm p-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">Contact</h2>
          <div class="prose max-w-none">
            <p>
              Pour toute question technique ou suggestion d'amélioration :<br>
              <strong>Email :</strong> breizh.webzine@gmail.com
            </p>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
// Configuration SEO
useHead({
  title: 'Crédits - Breizh Metal',
  meta: [
    { name: 'description', content: 'Équipe, technologies et remerciements du site Breizh Metal' },
    { name: 'robots', content: 'index, follow' }
  ]
})
</script>
