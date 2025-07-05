<!-- components/PostCard.vue -->
<script setup lang="ts">
// On définit que ce composant attend une "prop" appelée "post"
const props = defineProps({
  post: {
    type: Object,
    required: true
  }
});

// Une 'computed property' pour formater la date de publication
const formattedDate = computed(() => {
  if (!props.post?.publishedAt) return '';
  return new Date(props.post.publishedAt).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

// Une 'computed property' pour formater le type d'article avec des labels lisibles
type ArticleType = 'album-review' | 'interview' | 'live-report' | 'news';

const formattedArticleType = computed(() => {
  const typeLabels: Record<ArticleType, string> = {
    'album-review': 'Chronique d\'album',
    'interview': 'Interview',
    'live-report': 'Live Report',
    'news': 'News'
  };
  const articleType = props.post?.articleType as ArticleType | undefined;
  return (articleType && typeLabels[articleType]) || props.post?.articleType || '';
});
</script>

<template>
  <!-- Container avec design moderne - layout horizontal -->
  <NuxtLink 
    :to="`/articles/${post.slug}`" 
    class="group flex bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
  >
    <!-- Image à gauche avec overlay -->
    <div class="relative w-48 h-32 flex-shrink-0 overflow-hidden">
      <NuxtImg
        v-if="post.mainImage"
        :src="post.mainImage.asset._ref"
        provider="sanity"
        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        :alt="`Image pour l'article ${post.title}`"
      />
      <!-- Placeholder si aucune image -->
      <div v-else class="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
        <Icon name="heroicons:photo" class="h-8 w-8 text-gray-400" />
      </div>
      
      <!-- Overlay gradient -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <!-- Badge du type d'article -->
      <div v-if="post.articleType" class="absolute top-2 left-2">
        <span class="bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
          {{ formattedArticleType }}
        </span>
      </div>
    </div>

    <!-- Contenu à droite -->
    <div class="flex-1 p-4 flex flex-col justify-between">
      <!-- Titre de l'article -->
      <h3 class="text-lg font-bold text-gray-900 group-hover:text-yellow-600 transition-colors mb-2 line-clamp-2 leading-tight">
        {{ post.title }}
      </h3>

      <!-- Métadonnées et indicateur -->
      <div class="space-y-2">
        <!-- Auteur et Date -->
        <div class="flex items-center gap-4 text-sm text-gray-500">
          <div v-if="post.author" class="flex items-center gap-1">
            <Icon name="heroicons:user" class="h-3 w-3" />
            <span class="font-medium">{{ post.author }}</span>
          </div>
          <time v-if="post.publishedAt" :datetime="post.publishedAt" class="flex items-center gap-1">
            <Icon name="heroicons:calendar-days" class="h-3 w-3" />
            <span>{{ formattedDate }}</span>
          </time>
        </div>

        <!-- Indicateur de lecture -->
        <div class="flex items-center justify-between pt-2 border-t border-gray-100">
          <span class="text-sm text-gray-400">Lire l'article</span>
          <Icon name="heroicons:arrow-right" class="h-4 w-4 text-gray-400 group-hover:text-yellow-500 group-hover:translate-x-1 transition-all duration-300" />
        </div>
      </div>
    </div>
  </NuxtLink>
</template>

<style scoped>
/* Styles responsive pour mobile */
@media (max-width: 480px) {
  .group {
    flex-direction: column;
  }
  
  .group .relative {
    width: 100% !important;
    height: 12rem !important; /* h-48 */
  }
  
  .group .flex.items-center.gap-4 {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
</style>