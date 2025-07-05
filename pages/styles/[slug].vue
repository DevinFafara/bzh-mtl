<script setup lang="ts">
const route = useRoute();
const styleSlug = route.params.slug; // On récupère le slug du style depuis l'URL

// 1. La requête GROQ pour récupérer les infos du style ET les groupes associés
// C'est une requête un peu plus complexe qui fait deux choses en une.
const query = groq`{
  // Première partie : on récupère les détails du style actuel (pour afficher son nom, sa description...)
  "style": *[_type == "style" && slug.current == $slug][0] {
    title,
    description
  },
  // Deuxième partie : on récupère TOUS les groupes qui ont une référence à ce style
  "bands": *[_type == "band" && references(*[_type=="style" && slug.current == $slug][0]._id)] | order(name asc) {
    _id,
    name,
    "slug": slug.current,
    pressPhoto,
    "styles": styles[]->{title} // On récupère aussi les styles pour nos vignettes
  }
}`;

// 2. On exécute la requête en lui passant le slug de l'URL
type StyleQueryResult = {
  style?: {
    title?: string;
    description?: string;
  };
  bands?: Array<{
    _id: string;
    name: string;
    slug: string;
    pressPhoto?: any;
    styles?: Array<{ title: string }>;
  }>;
};
const { data } = await useSanityQuery<StyleQueryResult>(query, { slug: styleSlug });

// On extrait les données pour une utilisation plus simple dans le template
const styleDetails = data.value?.style;
const bands = data.value?.bands;
</script>

<template>
  <div class="container mx-auto p-4 md:p-8">
    <div v-if="styleDetails">
      <!-- 3. On affiche le titre et la description du style -->
      <h1 class="text-2xl md:text-4xl font-bold mb-2">Groupes de {{ styleDetails.title }}</h1>
      <p v-if="styleDetails.description" class="text-lg text-gray-600 mb-8">{{ styleDetails.description }}</p>

      <!-- 4. On réutilise notre grille et notre composant BandCard ! -->
      <div v-if="bands && bands.length > 0" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mobile-single-col">
        <div v-for="band in bands" :key="band._id">
          <!-- La beauté des composants : on réutilise le même que sur la page /groupes -->
          <BandCard :band="band" />
        </div>
      </div>
      <div v-else>
        <p>Aucun groupe trouvé pour ce style pour le moment.</p>
      </div>
    </div>
    
    <div v-else class="text-center p-16">
      <p>Style musical non trouvé.</p>
    </div>
  </div>
</template>

<style scoped>
/* Affichage d'une seule carte par ligne uniquement sur les très petits écrans */
@media (max-width: 480px) {
  .mobile-single-col {
    grid-template-columns: 1fr !important;
  }
}
</style>