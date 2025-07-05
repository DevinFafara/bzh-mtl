<script setup lang="ts">
// Interface pour les posts
interface Post {
  _id: string;
  title: string;
  slug: string;
  articleType: string;
  author: string;
  publishedAt: string;
  mainImage?: any;
}

// Requête GROQ pour récupérer tous les articles
// On trie par date de publication (publishedAt desc)
// On récupère les champs dont on a besoin pour PostCard
const query = groq`*[_type == "post"] | order(publishedAt desc) {
  _id,
  title,
  "slug": slug.current,
  articleType,
  "author": author->name,
  publishedAt,
  mainImage
}`;

// On exécute la requête
const { data: posts } = await useSanityQuery<Post[]>(query);
</script>

<template>
  <div class="container mx-auto p-4 md:p-8">
    <h1 class="text-2xl md:text-4xl font-bold mb-8">Tous les Articles</h1>

    <!-- Grille pour afficher les articles -->
    <div v-if="posts && posts.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- On fait une boucle sur les articles récupérés -->
      <div v-for="post in (posts || [])" :key="post._id">
        <!-- On utilise le composant PostCard -->
        <PostCard :post="post" />
      </div>
    </div>
    <div v-else class="text-center py-16">
      <p class="text-xl text-gray-500">Aucun article disponible pour le moment.</p>
      <p class="mt-2 text-gray-400">Revenez bientôt !</p>
    </div>
  </div>
</template>