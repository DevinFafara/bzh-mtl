<script setup>
const sceneLocaleItems = [
  { label: 'Groupes Locaux', to: '/groupes' },
  { label: 'Salles', to: '/salles' },
  { label: 'Festivals', to: '/festivals' }
];
const autresItems = [
  { label: 'Agenda', to: '/evenements' },
  { label: 'À Propos', to: '/a-propos' },
  { label: 'Contact', to: '/contact' },
  { label: 'News', to: '/chroniques/news' }
];
const legalItems = [
  { label: 'Mentions Légales', to: '/mentions-legales' },
  { label: 'CGU', to: '/cgu' },
  { label: 'Crédits', to: '/credits' }
];
</script>

<template>
  <footer class="bg-black text-gray-400">
    <div class="container mx-auto px-4 py-8">
      
      <div class="flex flex-col md:flex-row justify-between gap-8">
        
        <div class="w-full md:w-1/3 lg:w-1/2">
          <NuxtLink to="/" class="inline-flex items-center space-x-2 mb-4">
            <NuxtImg class="h-10 w-auto" src="/menu-logo.svg" alt="Logo Breizh Metal" width="40" height="40" loading="lazy" />
            <span class="font-bold text-white text-lg">Breizh Metal</span>
          </NuxtLink>
          <p class="text-sm max-w-sm">
            Le portail de la scène metal en Bretagne. Agenda des concerts, news, et fiches des groupes et salles locales.
          </p>
        </div>

        <div class="w-full md:w-2/3 lg:w-1/2">
          <div class="footer-grid">
            
            <div>
              <h3 class="font-semibold text-white tracking-wider uppercase mb-4 text-sm">Scène Locale</h3>
              <ul class="space-y-2">
                <li v-for="item in sceneLocaleItems" :key="item.label">
                  <NuxtLink :to="item.to" class="hover:text-white transition-colors text-sm">{{ item.label }}</NuxtLink>
                </li>
              </ul>
            </div>

            <div>
              <h3 class="font-semibold text-white tracking-wider uppercase mb-4 text-sm">Site</h3>
              <ul class="space-y-2">
                <li v-for="item in autresItems" :key="item.label">
                  <NuxtLink :to="item.to" class="hover:text-white transition-colors text-sm">{{ item.label }}</NuxtLink>
                </li>
              </ul>
            </div>

            <div>
              <h3 class="font-semibold text-white tracking-wider uppercase mb-4 text-sm">Légal</h3>
              <ul class="space-y-2">
                <li v-for="item in legalItems" :key="item.label">
                  <NuxtLink :to="item.to" class="hover:text-white transition-colors text-sm">{{ item.label }}</NuxtLink>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </div>

      <div class="mt-8 pt-8 border-t border-gray-800 text-center">
        <p class="text-sm text-gray-500">
          © {{ new Date().getFullYear() }} Breizh Metal. Tous droits réservés.
        </p>
      </div>

    </div>
  </footer>
</template>

<style scoped>
.footer-grid {
  display: grid;
  gap: 1.5rem;
}

/* Très petit écran (mobile) : 1 colonne empilée */
@media (max-width: 479px) {
  .footer-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}

/* Petit écran (grand mobile/tablette) : 2x2 */
@media (min-width: 480px) and (max-width: 767px) {
  .footer-grid {
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
  }
}

/* Moyen écran (tablette/petit desktop) : 2x2 avec plus d'espace */
@media (min-width: 768px) and (max-width: 1023px) {
  .footer-grid {
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }
}

/* Grand écran (desktop) : 4 colonnes côte à côte */
@media (min-width: 1024px) {
  .footer-grid {
    grid-template-columns: 1fr 1fr 1fr 1fr;
    gap: 1.5rem;
  }
}
</style>