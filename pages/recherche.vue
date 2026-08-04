<script setup lang="ts">
const route = useRoute();
const router = useRouter();

// Types pour les résultats de recherche
interface SearchResult {
  _type: 'post' | 'band' | 'event' | 'venue';
  _id: string;
  title: string;
  slug: string;
  image?: {
    asset?: {
      _ref: string;
    };
  };
  date?: string;
  rawTitle?: string;
  rawName?: string;
}

interface DebugInfo {
  searchTerm?: string;
  queryExecuted?: string;
  timestamp?: string;
  resultsCount?: number;
  rawResults?: SearchResult[];
}

interface ErrorDetails {
  message: string;
  stack?: string;
  query?: string;
  searchTerm?: string;
}

// État de debug et d'erreur
const debugInfo = ref<DebugInfo>({});
const errorDetails = ref<ErrorDetails | null>(null);

// On utilise watchEffect pour réagir aux changements de l'URL
const searchTerm = ref<string>((route.query.q as string) || '');

// Retire les accents/diacritiques et met en minuscule, pour que "Otztal" trouve "Ötztal" et inversement
// (l'opérateur GROQ "match" ne fait pas cette équivalence).
const normalizeForSearch = (value: string): string => {
  return (value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
};

// 1er temps : liste légère (juste le texte à comparer) de tous les documents cherchables
const candidatesQuery = groq`
  *[_type in ["post", "band", "event", "venue"]] {
    _type,
    _id,
    _createdAt,
    "searchText": coalesce(title, name)
  }
`;

// 2e temps : détails complets, uniquement pour les documents retenus après comparaison en JS
const detailsQuery = groq`
  *[_id in $ids] | order(_createdAt desc) {
    _type,
    _id,
    "title": coalesce(title, name),
    "slug": slug.current,
    "image": coalesce(mainImage, pressPhoto, logoImage),
    "date": coalesce(publishedAt, date, _createdAt),
    // Champs spécifiques pour les groupes (bands)
    _type == "band" => {
      name,
      pressPhoto,
      "styles": styles[]->{title}
    },
    // Champs spécifiques pour les articles (posts)
    _type == "post" => {
      title,
      mainImage,
      publishedAt,
      articleType,
      "author": author->name
    },
    // Champs spécifiques pour les salles (venues)
    _type == "venue" => {
      name,
      "image": coalesce(image, mainImage),
      city
    },
    // Champs spécifiques pour les événements (events)
    _type == "event" => {
      title,
      date,
      "image": coalesce(image, mainImage),
      "venue": venue->{name}
    }
  }
`;

// Fonction de recherche avec gestion d'erreur complète
const performSearch = async (): Promise<SearchResult[]> => {
  try {
    debugInfo.value = {
      searchTerm: searchTerm.value,
      queryExecuted: candidatesQuery,
      timestamp: new Date().toISOString()
    };

    if (!searchTerm.value || searchTerm.value.trim().length < 2) {
      return [];
    }

    const sanity = useSanity();
    const termNormalized = normalizeForSearch(searchTerm.value.trim());

    const candidates = await sanity.fetch<Array<{ _type: string; _id: string; _createdAt: string; searchText?: string }>>(candidatesQuery);

    const matchedIds = (candidates || [])
      .filter((c) => normalizeForSearch(c.searchText || '').includes(termNormalized))
      .sort((a, b) => new Date(b._createdAt).getTime() - new Date(a._createdAt).getTime())
      .slice(0, 20)
      .map((c) => c._id);

    const results = matchedIds.length
      ? await sanity.fetch<SearchResult[]>(detailsQuery, { ids: matchedIds })
      : [];

    debugInfo.value = {
      ...debugInfo.value,
      resultsCount: results?.length || 0,
      rawResults: results
    };

    return results || [];
  } catch (err: any) {
    console.error('Erreur de recherche:', err);
    errorDetails.value = {
      message: err?.message || 'Erreur inconnue',
      stack: err?.stack,
      query: candidatesQuery,
      searchTerm: searchTerm.value
    };
    
    // En cas d'erreur, on retourne des données de test pour voir si l'affichage fonctionne
    if (import.meta.dev) {
      return [
        {
          _type: 'post',
          _id: 'test-post-1',
          title: 'Test Article - Erreur simulée',
          slug: 'test-article',
          date: '2024-01-15T10:00:00Z',
          image: undefined
        },
        {
          _type: 'band',
          _id: 'test-band-1',
          title: 'Test Band - Erreur simulée',
          slug: 'test-band',
          date: '2024-01-10T10:00:00Z',
          image: undefined
        }
      ];
    }
    
    return [];
  }
};

// useAsyncData avec gestion d'erreur améliorée
const { data: results, pending, error, refresh } = await useAsyncData<SearchResult[]>(
  `search-${searchTerm.value}`, 
  performSearch,
  {
    watch: [searchTerm],
    default: () => []
  }
);

// Mettre à jour le terme de recherche si l'URL change
watch(() => route.query.q, (newQuery) => {
  searchTerm.value = (newQuery as string) || '';
  errorDetails.value = null; // Reset les erreurs
});

// Helper pour déterminer le chemin de base en fonction du type de document
const getPathForType = (type: string) => {
  switch (type) {
    case 'post': return '/articles';
    case 'band': return '/groupes';
    case 'event': return '/evenements';
    case 'venue': return '/salles';
    default: return '/';
  }
};

// Helper pour obtenir le type lisible
const getReadableType = (type: string) => {
  switch (type) {
    case 'post': return 'Article';
    case 'band': return 'Groupe';
    case 'event': return 'Événement';
    case 'venue': return 'Salle';
    default: return type;
  }
};

// Fonction pour formater la date
const formatDate = (dateString: string) => {
  try {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch {
    return 'Date inconnue';
  }
};

// Computed properties pour filtrer les résultats par type
const bandsFound = computed(() => {
  return results.value?.filter(item => item._type === 'band') || [];
});

const postsFound = computed(() => {
  return results.value?.filter(item => item._type === 'post') || [];
});

const venuesFound = computed(() => {
  return results.value?.filter(item => item._type === 'venue') || [];
});

const eventsFound = computed(() => {
  return results.value?.filter(item => item._type === 'event') || [];
});
</script>

<template>
  <div class="container mx-auto p-4 md:p-8">
    <h1 class="text-2xl md:text-4xl font-bold mb-2">
      Résultats de recherche
    </h1>
    <p class="text-lg text-gray-600 mb-8">
      Pour le terme : <span class="font-semibold text-yellow-600">"{{ searchTerm }}"</span>
    </p>

    <!-- Zone de debug (visible en mode développement) -->
    <!-- <div v-if="errorDetails || Object.keys(debugInfo).length > 0" class="mb-8 p-4 bg-gray-100 rounded-lg">
      <h3 class="font-bold text-lg mb-2">🐛 Informations de debug</h3>
      
      <div v-if="errorDetails" class="mb-4 p-3 bg-red-100 border border-red-300 rounded">
        <h4 class="font-semibold text-red-800">Erreur détectée :</h4>
        <p class="text-red-700">{{ errorDetails.message }}</p>
        <details class="mt-2">
          <summary class="text-sm text-red-600 cursor-pointer">Détails techniques</summary>
          <pre class="text-xs mt-2 p-2 bg-red-50 overflow-auto">{{ JSON.stringify(errorDetails, null, 2) }}</pre>
        </details>
      </div>

      <div v-if="Object.keys(debugInfo).length > 0" class="p-3 bg-blue-100 border border-blue-300 rounded">
        <h4 class="font-semibold text-blue-800">Informations de debug :</h4>
        <details class="mt-2">
          <summary class="text-sm text-blue-600 cursor-pointer">Voir les détails</summary>
          <pre class="text-xs mt-2 p-2 bg-blue-50 overflow-auto">{{ JSON.stringify(debugInfo, null, 2) }}</pre>
        </details>
      </div>
    </div> -->

    <!-- Affichage du chargement -->
    <div v-if="pending" class="text-center py-16">
      <div class="animate-spin inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mb-4"></div>
      <p>Recherche en cours...</p>
    </div>

    <!-- Affichage des erreurs système -->
    <div v-else-if="error" class="text-center py-16 text-red-500">
      <p class="text-xl font-semibold">Une erreur est survenue lors de la recherche.</p>
      <p class="text-sm mt-2">{{ error }}</p>
    </div>

    <!-- Affichage des résultats -->
    <div v-else-if="results && Array.isArray(results) && results.length > 0" class="space-y-12">
      <p class="text-gray-500 font-bold mb-6">{{ results.length }} résultat(s) trouvé(s)</p>
      
      <!-- Section Groupes trouvés -->
      <div v-if="bandsFound.length > 0" class="space-y-6 mb-12">
        <h2 class="text-gray-800">Groupes trouvés ({{ bandsFound.length }})</h2>
        
        <!-- Grille inspirée de groupes/index.vue -->
        <div class="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <div v-for="band in bandsFound" :key="band._id">
            <BandCard :band="band" />
          </div>
        </div>
      </div>

      <!-- Section Salles trouvées -->
      <div v-if="venuesFound.length > 0" class="space-y-6 mb-12">
        <h2 class="text-gray-800">Salles trouvées ({{ venuesFound.length }})</h2>
        
        <!-- Grille des salles avec VenueCard -->
        <div class="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <VenueCard 
            v-for="venue in venuesFound" 
            :key="venue._id"
            :venue="venue"
          />
        </div>
      </div>

      <!-- Section Articles trouvés -->
      <div v-if="postsFound.length > 0" class="space-y-6 mb-12">
        <h2 class="text-gray-800">Articles trouvés ({{ postsFound.length }})</h2>
        
        <!-- Liste des articles avec PostCard -->
        <div class="space-y-4">
          <PostCard 
            v-for="post in postsFound" 
            :key="post._id"
            :post="post"
          />
        </div>
      </div>


      <!-- Section Événements trouvés -->
      <div v-if="eventsFound.length > 0" class="space-y-6 mb-12">
        <h2 class="text-gray-800">Événements trouvés ({{ eventsFound.length }})</h2>
        
        <!-- Liste des événements -->
        <div class="space-y-4">
          <NuxtLink 
            v-for="event in eventsFound" 
            :key="event._id" 
            :to="`${getPathForType(event._type)}/${event.slug}`"
            class="group flex bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 w-full"
          >
            <!-- Image à gauche -->
            <div class="w-32 h-24 flex-shrink-0 bg-gray-100">
              <NuxtImg
                v-if="event.image?.asset?._ref"
                :src="event.image.asset._ref"
                provider="sanity"
                class="w-full h-full object-cover"
                :alt="`Image pour ${event.title}`"
              />
              <div v-else class="h-full flex items-center justify-center">
                <Icon 
                  name="heroicons:calendar-days"
                  class="h-8 w-8 text-gray-300" 
                />
              </div>
            </div>

            <!-- Contenu à droite -->
            <div class="flex-1 p-4 flex flex-col justify-between">
              <div>
                <span class="text-sm font-medium text-blue-600 uppercase tracking-wide">
                  {{ getReadableType(event._type) }}
                </span>
                <h3 class="text-lg font-bold mt-1 group-hover:text-blue-600 transition-colors">
                  {{ event.title || 'Titre manquant' }}
                </h3>
              </div>
              <p v-if="event.date" class="text-xs text-gray-500 mt-2">
                {{ formatDate(event.date) }}
              </p>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Terme de recherche trop court -->
    <div v-else-if="searchTerm && searchTerm.length < 2" class="text-center py-16">
      <p class="text-xl font-semibold text-gray-700">Terme de recherche trop court</p>
      <p class="text-gray-500 mt-2">Veuillez entrer au moins 2 caractères pour effectuer une recherche.</p>
    </div>

    <!-- Aucun résultat -->
    <div v-else-if="searchTerm" class="text-center py-16">
      <p class="text-xl font-semibold text-gray-700">Aucun résultat trouvé.</p>
      <p class="text-gray-500 mt-2">Essayez avec d'autres mots-clés.</p>
    </div>

    <!-- Aucun terme de recherche -->
    <div v-else class="text-center py-16">
      <p class="text-xl font-semibold text-gray-700">Effectuez une recherche</p>
      <p class="text-gray-500 mt-2">Utilisez la barre de recherche pour trouver des articles, groupes ou événements.</p>
    </div>
  </div>
</template>