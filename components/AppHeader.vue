<script setup>
// Import des icônes Heroicons
const isMobileMenuOpen = ref(false);
const isSearchModalOpen = ref(false);

const sceneLocaleItems = [
  { label: 'Groupes Locaux', to: '/groupes' },
  { label: 'Salles', to: '/salles' },
  { label: 'Festivals', to: '/festivals' }
];
const chroniquesItems = [
  { label: 'News', to: '/chroniques/news' },
  // { label: 'Album Review', to: '/chroniques/album-review' },
  { label: 'Live Report', to: '/chroniques/live-report' },
  { label: 'Interviews', to: '/chroniques/interviews' }
];
</script>

<template>
  <!-- Le header est 'sticky' et a un z-index élevé pour être au-dessus du reste -->
  <header class="bg-black/90 backdrop-blur-sm text-white sticky top-0 z-50 transition-all duration-300">
    <nav class="container mx-auto flex items-center justify-between p-4 h-20">
      <!-- 1. Le Logo -->
      <NuxtLink to="/" class="text-2xl font-bold flex items-center space-x-2">
            <img class="h-12 w-auto" src="~/assets/img/logo.png" alt="Logo Breizh Metal Magazine" />
            <span class="text-base">Breizh Metal Magazine</span>
      </NuxtLink>

      <!-- 2. Le Menu Desktop (caché sur mobile) -->
      <div class="max-md:hidden md:flex items-center space-x-4">
        <DropdownMenu title="Scène Locale" :items="sceneLocaleItems" />
        <DropdownMenu title="Chroniques" :items="chroniquesItems" />
        <!-- <NuxtLink to="/articles"
            class="relative font-medium text-white px-2 py-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-white after:transition-all after:duration-300 hover:after:w-full"
            active-class="after:w-full">Articles</NuxtLink> -->
        <NuxtLink to="/evenements"
            class="relative font-medium text-white px-2 py-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-white after:transition-all after:duration-300 hover:after:w-full"
            active-class="after:w-full">Agenda</NuxtLink>
        <NuxtLink to="/a-propos"
            class="relative font-medium text-white px-2 py-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-white after:transition-all after:duration-300 hover:after:w-full"
            active-class="after:w-full">À Propos</NuxtLink>
        <button @click="isSearchModalOpen = true" class="hover:text-gray-300 text-white p-2">
          <Icon name="heroicons:magnifying-glass" class="h-6 w-6" />
        </button>
      </div>
      
      <!-- 3. Le Bouton du Menu Burger (visible uniquement sur mobile) -->
      <div class="md:hidden">
        <button @click="isMobileMenuOpen = !isMobileMenuOpen" class="text-white p-2">
          <Icon v-if="!isMobileMenuOpen" name="heroicons:bars-3" class="h-8 w-8" />
          <Icon v-else name="heroicons:x-mark" class="h-8 w-8" />
        </button>
      </div>
    </nav>
    
    <!-- 4. Le Menu Mobile Déroulant -->
    <div v-if="isMobileMenuOpen" class="md:hidden bg-black border-t border-gray-700 p-4">
      <div class="flex flex-col space-y-4">
        <div>
        <span class="text-gray-400 font-semibold py-2 block">Scène Locale</span>
        <div class="flex flex-col pl-4">
            <NuxtLink 
                v-for="item in sceneLocaleItems" 
                :key="item.label" 
                :to="item.to" 
                @click="isMobileMenuOpen = false"
                class="text-white hover:text-gray-300 py-2 border-b border-gray-700">
                {{ item.label }}
            </NuxtLink>
        </div>
        </div>
        <div>
        <span class="text-gray-400 font-semibold py-2 block">Chroniques</span>
        <div class="flex flex-col pl-4">
            <NuxtLink 
                v-for="item in chroniquesItems" 
                :key="item.label" 
                :to="item.to" 
                @click="isMobileMenuOpen = false"
                class="text-white hover:text-gray-300 py-2 border-b border-gray-700">
                {{ item.label }}
            </NuxtLink>
        </div>
        </div>
        <NuxtLink to="/evenements" 
                  @click="isMobileMenuOpen = false"
                  class="text-white hover:text-gray-300 py-2 border-b border-gray-700">Agenda</NuxtLink>
        <NuxtLink to="/a-propos" 
                  @click="isMobileMenuOpen = false"
                  class="text-white hover:text-gray-300 py-2">À Propos</NuxtLink>
      </div>
        <button @click="isSearchModalOpen = true" class="hover:text-gray-300 text-white p-2">
          <Icon name="heroicons:magnifying-glass" class="h-6 w-6" />
        </button>
    </div>
  </header>
  <SearchModal :is-open="isSearchModalOpen" @close="isSearchModalOpen = false" />
</template>