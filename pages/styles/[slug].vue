<script setup lang="ts">
const route = useRoute();
const styleSlug = route.params.slug;

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

const styleDetails = data.value?.style;
const bands = data.value?.bands;

// Configuration SEO dynamique pour le style musical
useSeoMeta({
  title: () => styleDetails?.title ? `${styleDetails.title} - Styles - Breizh Metal Magazine` : 'Style Musical - Breizh Metal Magazine',
  description: () => {
    if (styleDetails) {
      if (styleDetails.description) {
        const description = styleDetails.description.length > 155 
          ? styleDetails.description.substring(0, 155) + '...' 
          : styleDetails.description;
        return description;
      }
      
      const bandCount = bands?.length || 0;
      return `Découvrez les groupes de ${styleDetails.title} sur Breizh Metal Magazine. ${bandCount} groupe${bandCount > 1 ? 's' : ''} référencé${bandCount > 1 ? 's' : ''} dans ce style musical.`;
    }
    return 'Découvrez les groupes par style musical sur Breizh Metal Magazine';
  },
  ogTitle: () => styleDetails?.title ? `Groupes de ${styleDetails.title}` : 'Style Musical - Breizh Metal Magazine',
  ogDescription: () => {
    if (styleDetails) {
      if (styleDetails.description) return styleDetails.description;
      const bandCount = bands?.length || 0;
      return `${bandCount} groupe${bandCount > 1 ? 's' : ''} de ${styleDetails.title} référencé${bandCount > 1 ? 's' : ''} sur Breizh Metal Magazine`;
    }
    return 'Groupes par style musical sur Breizh Metal Magazine';
  },
  ogImage: '/logo.png',
  twitterCard: 'summary_large_image'
});
</script>

<template>
  <div class="container mx-auto p-4 md:p-8">
    <div v-if="styleDetails">
      <h1 class="text-2xl md:text-4xl font-bold mb-2">Groupes de {{ styleDetails.title }}</h1>
      <p v-if="styleDetails.description" class="text-lg text-gray-600 mb-8">{{ styleDetails.description }}</p>

      <div v-if="bands && bands.length > 0" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mobile-single-col">
        <div v-for="band in bands" :key="band._id">
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
@media (max-width: 480px) {
  .mobile-single-col {
    grid-template-columns: 1fr !important;
  }
}
</style>