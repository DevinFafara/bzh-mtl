<script setup lang="ts">
// Configuration SEO pour la page de groupes
useSeoMeta({
  title: 'Groupes - Breizh Metal',
  description: 'Découvrez tous les groupes de metal de Bretagne et d\'ailleurs. Biographies, discographies, actualités et concerts des artistes metal bretons.',
  ogTitle: 'Groupes Metal - Breizh Metal',
  ogDescription: 'Tous les groupes de metal référencés sur Breizh Metal. Découvrez la scène metal bretonne.',
  ogImage: '/BM-logo-large.png',
  twitterCard: 'summary_large_image'
})

// 1. La requête GROQ pour récupérer tous les groupes
// On ne trie PAS ici car on va le faire côté frontend pour gérer les accents
const query = groq`*[_type == "band"] {
  _id,
  name,
  "slug": slug.current,
  pressPhoto,
  // On récupère le tableau complet des styles liés
  // et pour chaque style, on prend son titre.
  "styles": styles[]->{title}
}`;

// 2. On exécute la requête
const { data: bandsData } = await useSanityQuery<Array<any>>(query);

// 3. Fonction pour normaliser les chaînes (enlever les accents)
const normalizeString = (str: string): string => {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
};

// 4. Trier les groupes en normalisant les noms pour gérer les accents
const bands = computed(() => {
  if (!bandsData.value) return [];
  
  return [...bandsData.value].sort((a, b) => {
    const nameA = normalizeString(a.name);
    const nameB = normalizeString(b.name);
    return nameA.localeCompare(nameB);
  });
});

// 5. Configuration du filtrage alphabétique
const alphabetFilters = [
  { label: 'Tous', range: 'all' },
  { label: 'A - C', range: 'a-c' },
  { label: 'D - H', range: 'd-h' },
  { label: 'I - P', range: 'i-p' },
  { label: 'Q - Z', range: 'q-z' },
  { label: '0 - 9', range: '0-9' }
];

// 6. État du filtre actuel et recherche
const currentFilter = ref('all');
const searchQuery = ref('');

// 7. Fonction pour vérifier si un groupe correspond au filtre alphabétique
const matchesFilter = (bandName: string, filterRange: string): boolean => {
  if (filterRange === 'all') return true;
  
  // Utiliser la normalisation pour gérer les accents
  const firstChar = normalizeString(bandName).charAt(0);
  
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

// 8. Fonction pour vérifier si un groupe correspond à la recherche
const matchesSearch = (bandName: string, query: string): boolean => {
  if (!query.trim()) return true;
  
  // Utiliser la normalisation pour la recherche aussi
  const normalizedBandName = normalizeString(bandName);
  const normalizedQuery = normalizeString(query.trim());
  
  // 1-2 lettres : recherche par début
  if (normalizedQuery.length <= 2) {
    return normalizedBandName.startsWith(normalizedQuery);
  }
  
  // 3+ lettres : recherche par contenu
  return normalizedBandName.includes(normalizedQuery);
};

// 9. Groupes filtrés (computed) - combine filtre alphabétique et recherche
const filteredBands = computed(() => {
  if (!bands.value) return [];
  return bands.value.filter(band => 
    matchesFilter(band.name, currentFilter.value) && 
    matchesSearch(band.name, searchQuery.value)
  );
});

// 10. Fonction pour changer le filtre alphabétique
const setFilter = (filterRange: string) => {
  currentFilter.value = filterRange;
};

// 11. Fonction pour réinitialiser la recherche
const clearSearch = () => {
  searchQuery.value = '';
};
</script>

<template>
  <div class="container mx-auto p-4 md:p-8">
    <h1 class="text-2xl md:text-4xl font-bold mb-8">La Scène Bretonne</h1>

    <p>Cette liste n’est pas définitive, nous ajoutons des groupes chaque semaine.
      Une condition : avoir au moins un EP (ou une démo)
    </p>
    <br></br>
    <!-- Barre de recherche -->
    <div class="mb-6">
      <div class="max-w-md mx-auto sm:mx-0">
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Rechercher un groupe..."
            class="w-full px-4 py-3 pl-11 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors"
          />
          <!-- Icône de recherche -->
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <!-- Bouton pour effacer -->
          <button
            v-if="searchQuery"
            @click="clearSearch"
            class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <!-- Aide contextuelle -->
        <div class="mt-2 text-xs text-gray-500">
          <span v-if="!searchQuery">
            Saisissez au moins 1 lettre pour rechercher un groupe.
          </span>
          <span v-else-if="searchQuery.length <= 2">
            Recherche des groupes commençant par "{{ searchQuery }}"
          </span>
          <span v-else>
            Recherche des groupes contenant "{{ searchQuery }}"
          </span>
        </div>
      </div>
    </div>

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
        <span v-if="searchQuery && currentFilter === 'all'">
          {{ filteredBands.length }} groupe{{ filteredBands.length > 1 ? 's' : '' }} trouvé{{ filteredBands.length > 1 ? 's' : '' }}
        </span>
        <span v-else-if="searchQuery">
          {{ filteredBands.length }} groupe{{ filteredBands.length > 1 ? 's' : '' }} trouvé{{ filteredBands.length > 1 ? 's' : '' }}
          {{ currentFilter === 'a-c' ? ' (A à C)' : '' }}
          {{ currentFilter === 'd-h' ? ' (D à H)' : '' }}
          {{ currentFilter === 'i-p' ? ' (I à P)' : '' }}
          {{ currentFilter === 'q-z' ? ' (Q à Z)' : '' }}
          {{ currentFilter === '0-9' ? ' (chiffres)' : '' }}
        </span>
        <span v-else-if="currentFilter === 'all'">
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
    
    <!-- Message si aucun groupe dans le filtre/recherche -->
    <div v-else-if="searchQuery || currentFilter !== 'all'" class="text-center py-12">
      <p class="text-gray-500 text-lg">
        <span v-if="searchQuery">Aucun groupe trouvé pour "{{ searchQuery }}"</span>
        <span v-else>Aucun groupe trouvé pour cette sélection alphabétique.</span>
      </p>
      <div class="mt-4 space-x-4">
        <button 
          v-if="searchQuery"
          @click="clearSearch"
          class="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
        >
          Effacer la recherche
        </button>
        <button 
          v-if="currentFilter !== 'all'"
          @click="setFilter('all')"
          class="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          Voir tous les groupes
        </button>
      </div>
    </div>
    
    <!-- Message si aucun groupe du tout -->
    <div v-else class="text-center py-12">
      <p class="text-gray-500 text-lg">Aucun groupe trouvé. Ajoutez-en dans Sanity !</p>
    </div>
  </div>
</template>