<script setup>
// On garde les données des liens, c'est une bonne pratique.
const sceneLocaleItems = [
  { label: 'Groupes Locaux', to: '/groupes' },
  { label: 'Salles', to: '/salles' }
];
const chroniquesItems = [
  { label: 'News', to: '/chroniques/news' },
  { label: 'Album Review', to: '/chroniques/album-review' },
  { label: 'Live Report', to: '/chroniques/live-report' },
  { label: 'Interviews', to: '/chroniques/interviews' }
];
const autresItems = [
  { label: 'Agenda', to: '/evenements' },
  { label: 'À Propos', to: '/a-propos' },
  { label: 'Contact', to: '/contact' }
];
</script>

<template>
  <footer class="bg-black text-gray-400">
    <div class="container mx-auto px-4 py-8">
      
      <!-- Section supérieure avec les liens -->
      <div class="flex flex-col md:flex-row justify-between gap-8">
        
        <!-- Partie gauche : Logo et description -->
        <div class="w-full md:w-1/3 lg:w-1/2">
          <NuxtLink to="/" class="inline-flex items-center space-x-2 mb-4">
            <img class="h-10 w-auto" src="~/assets/img/logo.png" alt="Logo Breizh Metal Magazine" />
            <span class="font-bold text-white text-lg">Breizh Metal Magazine</span>
          </NuxtLink>
          <p class="text-sm max-w-sm">
            Le portail de la scène metal en Bretagne. Chroniques, interviews, agenda des concerts et fiches des groupes et salles locales.
          </p>
        </div>

        <!-- Partie droite : Les 3 colonnes de liens -->
        <div class="w-full md:w-2/3 lg:w-1/2 flex flex-col flex-row justify-between md:justify-end gap-8">
          
          <!-- Colonne 1 : Scène Locale -->
          <div class="w-full sm:w-1/3">
            <h3 class="font-semibold text-white tracking-wider uppercase mb-4">Scène Locale</h3>
            <ul class="space-y-2">
              <li v-for="item in sceneLocaleItems" :key="item.label">
                <NuxtLink :to="item.to" class="hover:text-white transition-colors">{{ item.label }}</NuxtLink>
              </li>
            </ul>
          </div>

          <!-- Colonne 2 : Chroniques -->
          <div class="w-full sm:w-1/3">
            <h3 class="font-semibold text-white tracking-wider uppercase mb-4">Chroniques</h3>
            <ul class="space-y-2">
              <li v-for="item in chroniquesItems" :key="item.label">
                <NuxtLink :to="item.to" class="hover:text-white transition-colors">{{ item.label }}</NuxtLink>
              </li>
            </ul>
          </div>

          <!-- Colonne 3 : Site -->
          <div class="w-full sm:w-1/3">
            <h3 class="font-semibold text-white tracking-wider uppercase mb-4">Site</h3>
            <ul class="space-y-2">
              <li v-for="item in autresItems" :key="item.label">
                <NuxtLink :to="item.to" class="hover:text-white transition-colors">{{ item.label }}</NuxtLink>
              </li>
            </ul>
          </div>

        </div>
      </div>

      <!-- Séparateur et partie basse du footer -->
      <div class="mt-8 pt-8 border-t border-gray-800 text-center">
        <p class="text-sm text-gray-500">
          © {{ new Date().getFullYear() }} Breizh Metal Magazine. Tous droits réservés.
        </p>
      </div>

    </div>
  </footer>
</template>