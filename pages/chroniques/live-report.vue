<!-- pages/chroniques/live-report.vue -->
<script setup lang="ts">
// 1. La requête GROQ pour récupérer TOUS les posts où articleType est 'live-report'
// On trie par date de publication, du plus récent au plus ancien.
const query = groq`*[_type == "post" && articleType == "live-report"] | order(publishedAt desc) {
  _id,
  title,
  "slug": slug.current,
  articleType,
  mainImage,
  publishedAt,
  "author": author->name
}`;

// 2. On exécute la requête
const { data: posts } = await useSanityQuery<Array<any>>(query);
</script>

<template>
  <div class="container mx-auto p-4 md:p-8">
    <h1 class="text-2xl md:text-4xl font-bold mb-8">Live Reports</h1>
    <p class="text-lg text-gray-600 mb-12">Derniers rapports en direct de la scène metal.</p>

    <!-- 3. On utilise la même grille responsive que pour les groupes et les salles -->
    <div v-if="posts && posts.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
      <!-- On fait une boucle sur les posts récupérés -->
      <div v-for="post in posts" :key="post._id">
        <!-- On utilise notre nouveau composant réutilisable ! -->
        <PostCard :post="post" />
      </div>
    </div>

    <!-- Message si aucune live-report n'est trouvée -->
    <div v-else class="text-center py-16 bg-gray-50 rounded-lg">
      <p class="text-lg text-gray-700">Aucun Live Report trouvé pour le moment.</p>
      <p class="text-gray-500 mt-2">Revenez bientôt !</p>
    </div>
  </div>
</template>