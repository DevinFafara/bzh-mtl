<!-- pages/auteurs/[slug].vue -->
<!-- pages/auteurs/[slug].vue -->
<script setup lang="ts">
const route = useRoute();
const { client } = useSanity(); // On récupère le client Sanity pour faire les requêtes

// 1. REQUÊTE POUR L'AUTEUR
// On utilise useAsyncData pour être cohérent et gérer l'état 'pending'.
const authorQuery = groq`*[_type == "author" && slug.current == $slug][0] {
  _id, // On récupère l'ID pour la deuxième requête
  name,
  image,
  citation,
  bio
}`;
const { data: author, pending: pendingAuthor } = await useAsyncData(
  'author-data', 
  () => client.fetch(authorQuery, { slug: route.params.slug })
);


// 2. REQUÊTE POUR LES ARTICLES DE CET AUTEUR
// On utilise un deuxième useAsyncData. Il attendra que le premier soit résolu.
const postsQuery = groq`*[_type == "post" && author._ref == $authorId] | order(publishedAt desc) {
  _id,
  title,
  "slug": slug.current,
  mainImage,
  "category": category->title
}`;

// Le 'watch' va automatiquement relancer cette requête si 'author' change.
// Le '!!author.value' garantit que la requête ne se lance que si un auteur a été trouvé.
const { data: posts, pending: pendingPosts } = await useAsyncData(
  'author-posts', 
  () => client.fetch(postsQuery, { authorId: author.value._id }),
  {
    watch: [author],
    immediate: !!author.value
  }
);
</script>

<template>
  <div v-if="author" class="container mx-auto p-2 md:p-8">
    <div class="max-w-8xl mx-auto">

      <!-- 1. BLOC DE PRÉSENTATION DE L'AUTEUR -->
        <div v-if="author" class="bg-gray-50 p-2 rounded-lg mb-8">
          <div class="flex items-start gap-4">
            <NuxtImg
              v-if="author.image"
              :src="author.image.asset._ref"
              provider="sanity"
              class="h-20 w-20 rounded-full object-cover flex-shrink-0"
            />
            <div class="flex-1 mt-2">
              <h2 class="font-semibold text-2xl md:text-3xl">
                  {{ author.name }}
              </h2>
              <div v-if="author.citation" class="text-gray-600 italic mt-2 prose prose-sm">
                <p>{{ author.citation }}</p>
              </div>
            </div>
          </div>
        </div>


      <!-- 2. BIOGRAPHIE DE L'AUTEUR -->
      <div v-if="author.bio" class="max-w-none mb-12">
        <CustomSanityContent :blocks="author.bio" />
      </div>


    </div>
  </div>

  <!-- Message si l'auteur n'est pas trouvé -->
  <div v-else class="text-center p-16">
    <p>Auteur non trouvé...</p>
  </div>
</template>

<style scoped>
/* Pas besoin de CSS spécifique, Tailwind gère tout */
</style>