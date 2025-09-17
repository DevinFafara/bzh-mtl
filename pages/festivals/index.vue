<script setup lang="ts">
// Configuration pour le SEO et la page
definePageMeta({
  title: 'Festivals'
});

useSeoMeta({
  title: 'Festivals - Breizh Metal',
  description: 'Découvrez les festivals de metal en Bretagne et au-delà.'
});

// Requête pour récupérer la liste des festivals avec le département
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

// Définir l'ordre et les noms des départements
const departmentOrder = [
  { value: '29', title: 'Finistère (29)' },
  { value: '22', title: 'Côtes-d\'Armor (22)' },
  { value: '56', title: 'Morbihan (56)' },
  { value: '35', title: 'Ille-et-Vilaine (35)' },
  { value: '44', title: 'Loire-Atlantique (44)' },
  { value: 'autre', title: 'Autres départements' }
];

// Grouper les festivals par département
const groupedFestivals = computed(() => {
  const festivalsArray = Array.isArray(festivals.value) ? festivals.value : [];

  const groups = festivalsArray.reduce<Record<string, Festival[]>>((acc, festival) => {
    // Récupérer le département ou utiliser 'autre' par défaut
    const department = festival.location?.department || 'autre';

    if (!acc[department]) {
      acc[department] = [];
    }

    acc[department].push(festival);

    return acc;
  }, {});

  return groups;
});
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
        <!-- Boucle sur les départements -->
        <div v-for="dept in departmentOrder" :key="dept.value">
          
          <!-- Vérifier s'il y a des festivals pour ce département -->
          <div v-if="groupedFestivals[dept.value] && groupedFestivals[dept.value].length > 0">
            
            <!-- Titre du département -->
            <h2 class="text-2xl font-bold border-b-2 border-yellow-500 pb-2 mt-12 mb-8 first:mt-0">
              {{ dept.title }}
            </h2>
            
            <!-- Grille des festivals du département -->
            <div class="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
              <div v-for="festival in groupedFestivals[dept.value]" :key="festival._id">
                <FestivalCard :festival="festival" />
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
