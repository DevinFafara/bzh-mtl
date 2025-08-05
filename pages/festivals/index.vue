<script setup lang="ts">
// Configuration pour le SEO et la page
definePageMeta({
  title: 'Festivals'
});

useSeoMeta({
  title: 'Festivals - Breizh Metal Magazine',
  description: 'Découvrez les festivals de metal en Bretagne et au-delà.'
});

// Requête pour récupérer la liste des festivals
const query = groq`*[_type == "festival"] | order(name asc) {
  _id,
  name,
  "slug": slug.current,
  description,
  mainImage,
  location,
  foundedYear,
  "musicalStyles": musicalStyles[]->{ title, "slug": slug.current },
  capacity,
  duration,
  website
}`;

interface Festival {
  _id: string;
  name: string;
  slug: string;
  description?: any; // blockContent
  mainImage?: { asset: { _ref: string } };
  location?: {
    city: string;
    department?: string;
    region?: string;
    venue?: string;
  };
  foundedYear?: number;
  musicalStyles?: Array<{ title: string; slug: string }>;
  capacity?: number;
  duration?: {
    days: number;
    period: string;
  };
  website?: string;
}

const { data: festivals, pending } = await useSanityQuery<Festival[]>(query);
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header de la page -->
    <header class="bg-stone-800 text-white py-16 md:py-24">
      <div class="container mx-auto px-4 text-center">
        <h1 class="text-4xl md:text-6xl font-extrabold mb-4">Festivals</h1>
        <p class="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
          Découvrez les festivals de metal en Bretagne et au-delà
        </p>
      </div>
    </header>

    <!-- Contenu principal -->
    <main class="container mx-auto px-4 py-12">
      <div v-if="pending" class="text-center">
        <div class="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
          <div class="animate-pulse">
            <div class="h-16 w-16 bg-gray-300 rounded-full mx-auto mb-4"></div>
            <div class="h-6 bg-gray-300 rounded mb-2"></div>
            <div class="h-4 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>

      <div v-else-if="festivals && festivals.length > 0">
        <!-- Grille des festivals -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="festival in festivals" 
            :key="festival._id"
            class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <!-- Image/Poster -->
            <div class="relative h-48 overflow-hidden">
              <NuxtImg
                v-if="festival.mainImage"
                :src="festival.mainImage.asset._ref"
                provider="sanity"
                class="w-full h-full object-cover"
                :alt="`Image de ${festival.name}`"
              />
              <div v-else class="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                <Icon name="heroicons:musical-note" class="h-16 w-16 text-gray-400" />
              </div>
            </div>

            <!-- Contenu -->
            <div class="p-6">
              <h3 class="text-xl font-bold text-gray-900 mb-2">{{ festival.name }}</h3>
              
              <div class="space-y-2 mb-4">
                <div v-if="festival.location?.city" class="flex items-center text-gray-600 text-sm">
                  <Icon name="heroicons:map-pin" class="h-4 w-4 mr-2" />
                  <span>{{ festival.location.city }}{{ festival.location.department ? ` (${festival.location.department})` : '' }}</span>
                </div>
                
                <div v-if="festival.duration" class="flex items-center text-gray-600 text-sm">
                  <Icon name="heroicons:calendar-days" class="h-4 w-4 mr-2" />
                  <span>{{ festival.duration.days }} jour{{ festival.duration.days > 1 ? 's' : '' }}{{ festival.duration.period ? ` en ${festival.duration.period}` : '' }}</span>
                </div>

                <div v-if="festival.foundedYear" class="flex items-center text-gray-600 text-sm">
                  <Icon name="heroicons:clock" class="h-4 w-4 mr-2" />
                  <span>Depuis {{ festival.foundedYear }}</span>
                </div>
              </div>

              <!-- Styles musicaux -->
              <div v-if="festival.musicalStyles && festival.musicalStyles.length > 0" class="mb-4">
                <div class="flex flex-wrap gap-1">
                  <span 
                    v-for="style in festival.musicalStyles.slice(0, 3)" 
                    :key="style.slug"
                    class="bg-gray-200 text-gray-800 text-xs font-medium px-2 py-1 rounded-full"
                  >
                    {{ style.title }}
                  </span>
                  <span v-if="festival.musicalStyles.length > 3" class="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                    +{{ festival.musicalStyles.length - 3 }}
                  </span>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex items-center justify-between">
                <NuxtLink 
                  :to="`/festivals/${festival.slug}`"
                  class="inline-flex items-center text-yellow-600 hover:text-yellow-700 font-medium text-sm"
                >
                  En savoir plus
                  <Icon name="heroicons:arrow-right" class="h-4 w-4 ml-1" />
                </NuxtLink>
                
                <a 
                  v-if="festival.website" 
                  :href="festival.website" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  class="text-gray-400 hover:text-gray-600"
                >
                  <Icon name="heroicons:globe-alt" class="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- État vide -->
      <div v-else class="text-center">
        <div class="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
          <Icon name="heroicons:musical-note" class="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 class="text-2xl font-bold text-gray-900 mb-2">Aucun festival</h2>
          <p class="text-gray-600">
            Aucun festival n'est encore disponible. Revenez bientôt !
          </p>
        </div>
      </div>
    </main>
  </div>
</template>
