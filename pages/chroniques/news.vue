<!-- pages/chroniques/news.vue -->
<script setup lang="ts">
// Récupération des paramètres de route pour la pagination
const route = useRoute();
const router = useRouter();

// Types
interface Post {
  _id: string;
  title: string;
  slug: string;
  articleType: string;
  mainImage?: any;
  publishedAt: string;
  author: string;
}

interface QueryResult {
  posts: Post[];
  total: number;
}

// Pagination
const currentPage = computed(() => {
  const page = parseInt(route.query.page as string) || 1;
  return page > 0 ? page : 1;
});

const itemsPerPage = 30;
const offset = computed(() => (currentPage.value - 1) * itemsPerPage);

// 1. La requête GROQ pour récupérer les posts avec pagination
const query = groq`{
  "posts": *[_type == "post" && articleType == "news"] | order(publishedAt desc) [$offset...$limit] {
    _id,
    title,
    "slug": slug.current,
    articleType,
    mainImage,
    publishedAt,
    "author": author->name
  },
  "total": count(*[_type == "post" && articleType == "news"])
}`;

// 2. Créer une clé réactive pour forcer le rechargement
const queryKey = computed(() => `news-${currentPage.value}`);

// On exécute la requête avec pagination
const { data, pending } = await useLazyAsyncData(queryKey, async () => {
  const { data: result } = await useSanityQuery<QueryResult>(query, {
    offset: offset.value,
    limit: offset.value + itemsPerPage - 1
  });
  return result.value;
});

const posts = computed(() => Array.isArray(data.value?.posts) ? data.value.posts : []);
const totalPosts = computed(() => data.value?.total || 0);
const totalPages = computed(() => Math.ceil(totalPosts.value / itemsPerPage));

// Fonction pour grouper les posts par mois
const postsByMonth = computed(() => {
  const groups: { [key: string]: (Post & { monthLabel: string })[] } = {};
  
  posts.value.forEach((post: Post) => {
    if (post.publishedAt) {
      const date = new Date(post.publishedAt);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthLabel = date.toLocaleDateString('fr-FR', { 
        year: 'numeric', 
        month: 'long' 
      });
      
      if (!groups[monthKey]) {
        groups[monthKey] = [];
      }
      groups[monthKey].push({ ...post, monthLabel });
    }
  });
  
  return groups;
});

// Navigation pagination
const goToPage = (page: number) => {
  router.push({ 
    path: route.path, 
    query: { ...route.query, page: page.toString() } 
  });
};

const prevPage = () => {
  if (currentPage.value > 1) {
    goToPage(currentPage.value - 1);
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    goToPage(currentPage.value + 1);
  }
};
</script>

<template>
  <div class="container mx-auto p-4 md:p-8">
    <h1 class="text-2xl md:text-4xl font-bold mb-8">News</h1>
    <p class="text-lg text-gray-600 mb-12">Dernières nouvelles de la scène Metal / Punk / Hardcore.</p>

    <!-- Affichage des posts groupés par mois -->
    <div v-if="posts && posts.length > 0">
      <div v-for="(monthPosts, monthKey) in postsByMonth" :key="monthKey" class="mb-12">
        <!-- Titre du mois -->
        <h2 class="text-3xl font-bold mb-8 text-center bg-gray-100 py-4 rounded-lg capitalize">
          {{ monthPosts[0]?.monthLabel }}
        </h2>
        
        <!-- Grille des posts pour ce mois -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          <div v-for="post in monthPosts" :key="post._id">
            <PostCard :post="post" />
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex justify-center items-center gap-4 mt-12">
        <!-- Bouton précédent -->
        <button 
          @click="prevPage" 
          :disabled="currentPage === 1"
          class="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          ← Précédent
        </button>

        <!-- Numéros de page -->
        <div class="flex gap-2">
          <template v-for="page in Math.min(totalPages, 10)" :key="page">
            <button 
              v-if="page === currentPage || Math.abs(page - currentPage) <= 2 || page === 1 || page === totalPages"
              @click="goToPage(page)"
              :class="[
                'px-3 py-2 rounded-lg transition-colors',
                page === currentPage 
                  ? 'bg-yellow-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              ]"
            >
              {{ page }}
            </button>
            <span v-else-if="Math.abs(page - currentPage) === 3" class="px-3 py-2 text-gray-500">
              ...
            </span>
          </template>
        </div>

        <!-- Bouton suivant -->
        <button 
          @click="nextPage" 
          :disabled="currentPage === totalPages"
          class="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          Suivant →
        </button>
      </div>

      <!-- Info pagination -->
      <div class="text-center text-gray-600 mt-4">
        Page {{ currentPage }} sur {{ totalPages }} ({{ totalPosts }} news au total)
      </div>
    </div>

    <!-- Message si aucune news n'est trouvée -->
    <div v-else class="text-center py-16 bg-gray-50 rounded-lg">
      <p class="text-lg text-gray-700">Aucune news trouvée pour le moment.</p>
      <p class="text-gray-500 mt-2">Revenez bientôt !</p>
    </div>
  </div>
</template>