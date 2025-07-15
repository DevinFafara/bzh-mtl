<script setup lang="ts">
// 1. La requête GROQ pour récupérer tous les groupes
// On trie par nom (name asc)
// On récupère les champs dont on a besoin pour la vignette
const query = groq`*[_type == "band"] | order(name asc) {
  _id,
  name,
  "slug": slug.current,
  pressPhoto,
  // On récupère le tableau complet des styles liés
  // et pour chaque style, on prend son titre.
  "styles": styles[]->{title}
}`;

// 2. On exécute la requête
const { data: bands } = await useSanityQuery<Array<any>>(query);

// 3. Configuration du filtrage alphabétique
const alphabetFilters = [
  { label: 'Tous', range: 'all' },
  { label: 'A - C', range: 'a-c' },
  { label: 'D - H', range: 'd-h' },
  { label: 'I - P', range: 'i-p' },
  { label: 'Q - Z', range: 'q-z' },
  { label: '0 - 9', range: '0-9' }
];

// 4. État du filtre actuel
const currentFilter = ref('all');

// 5. Fonction pour vérifier si un groupe correspond au filtre
const matchesFilter = (bandName: string, filterRange: string): boolean => {
  if (filterRange === 'all') return true;
  
  const firstChar = bandName.charAt(0).toLowerCase();
  
  switch (filterRange) {
    case 'a-c':
      return firstChar >= 'a' && firstChar <= 'c';
    case 'd-h':
      return firstChar >= 'd' && firstChar <= 'h';
    case 'i-p':
      return firstChar >= 'i' && firstChar <= 'p';
    case 'q-z':
      return firstChar >= 'q' && firstChar <= 'z';
    case '0-9':
      return /[0-9]/.test(firstChar);
    default:
      return true;
  }
};

// 6. Groupes filtrés (computed)
const filteredBands = computed(() => {
  if (!bands.value) return [];
  return bands.value.filter(band => matchesFilter(band.name, currentFilter.value));
});

// 7. Fonction pour changer le filtre
const setFilter = (filterRange: string) => {
  currentFilter.value = filterRange;
};
</script>

<template>
  <div class="container mx-auto p-4 md:p-8">
    <h1 class="text-2xl md:text-4xl font-bold mb-8">La Scène Bretonne</h1>

    <!-- Barre de filtrage alphabétique -->
    <div class="mb-8">
      <div class="flex flex-wrap gap-2 justify-center sm:justify-start">
        <button
          v-for="filter in alphabetFilters"
          :key="filter.range"
          @click="setFilter(filter.range)"
          :class="[
            'px-4 py-2 rounded-lg font-medium transition-all duration-200',
            currentFilter === filter.range
              ? 'bg-yellow-500 text-white shadow-md'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:shadow-sm'
          ]"
        >
          {{ filter.label }}
        </button>
      </div>
      
      <!-- Compteur de résultats -->
      <div class="mt-4 text-sm text-gray-600">
        <span v-if="currentFilter === 'all'">
          {{ bands?.length || 0 }} groupe{{ (bands?.length || 0) > 1 ? 's' : '' }} au total
        </span>
        <span v-else>
          {{ filteredBands.length }} groupe{{ filteredBands.length > 1 ? 's' : '' }} 
          {{ currentFilter === 'a-c' ? 'de A à C' : '' }}
          {{ currentFilter === 'd-h' ? 'de D à H' : '' }}
          {{ currentFilter === 'i-p' ? 'de I à P' : '' }}
          {{ currentFilter === 'q-z' ? 'de Q à Z' : '' }}
          {{ currentFilter === '0-9' ? 'commençant par un chiffre' : '' }}
        </span>
      </div>
    </div>

    <!-- 3. On crée la grille pour afficher les vignettes -->
    <div v-if="filteredBands && filteredBands.length > 0" class="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <!-- On fait une boucle sur les groupes filtrés -->
      <div v-for="band in filteredBands" :key="band._id">
        <!-- On utilise un composant pour la vignette (qu'on va créer juste après) -->
        <BandCard :band="band" />
      </div>
    </div>
    
    <!-- Message si aucun groupe dans le filtre sélectionné -->
    <div v-else-if="currentFilter !== 'all'" class="text-center py-12">
      <p class="text-gray-500 text-lg">Aucun groupe trouvé pour cette sélection alphabétique.</p>
      <button 
        @click="setFilter('all')"
        class="mt-4 px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
      >
        Voir tous les groupes
      </button>
    </div>
    
    <!-- Message si aucun groupe du tout -->
    <div v-else class="text-center py-12">
      <p class="text-gray-500 text-lg">Aucun groupe trouvé. Ajoutez-en dans Sanity !</p>
    </div>
  </div>
</template>