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

// État pour le modal d'image
const showImageModal = ref(false);
</script>

<template>
  <div v-if="author" class="container mx-auto p-2 md:p-8">
    <div class="max-w-6xl mx-auto">

      <!-- LAYOUT 2 COLONNES -->
      <div class="author-layout">
        
        <!-- COLONNE GAUCHE : Photo + Nom + Citation -->
        <div class="author-sidebar bg-gray-50 p-6 rounded-lg">
          <div class="flex flex-col items-center text-center space-y-4">
            <NuxtImg
              v-if="author.image"
              :src="author.image.asset._ref"
              provider="sanity"
              class="h-64 w-64 rounded-full object-cover cursor-pointer transition-transform duration-300 hover:scale-105 hover:shadow-lg"
              @click="showImageModal = true"
            />
            <h2 class="font-semibold text-xl">
              {{ author.name }}
            </h2>
            <div v-if="author.citation" class="text-gray-600 italic text-sm">
              <p>{{ author.citation }}</p>
            </div>
          </div>
        </div>

        <!-- COLONNE DROITE : Biographie -->
        <div class="author-content flex-1 bg-white p-6 rounded-lg border border-gray-200">
          <div v-if="author.bio">
            <CustomSanityContent :blocks="author.bio" />
          </div>
        </div>

      </div>

    </div>
  </div>

  <!-- Message si l'auteur n'est pas trouvé -->
  <div v-else class="text-center p-16">
    <p>Auteur non trouvé...</p>
  </div>

  <!-- Modal pour l'image agrandie -->
  <div 
    v-if="showImageModal && author?.image" 
    class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
    @click="showImageModal = false"
  >
    <div class="relative max-w-4xl max-h-full">
      <NuxtImg
        :src="author.image.asset._ref"
        provider="sanity"
        class="max-w-full max-h-full object-contain rounded-lg"
        @click.stop
      />
      <button
        @click="showImageModal = false"
        class="absolute top-4 right-4 text-white hover:text-gray-300 text-3xl font-bold"
        aria-label="Fermer"
      >
        ×
      </button>
    </div>
  </div>
</template>

<style scoped>
.author-layout {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.author-sidebar {
  width: 100%;
}

@media (min-width: 1014px) {
  .author-layout {
    flex-direction: row;
  }
  
  .author-sidebar {
    width: 320px;
    flex-shrink: 0;
  }
}
</style>