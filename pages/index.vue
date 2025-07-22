<script setup lang="ts">
// Types pour les données
interface Post {
  _id: string;
  title: string;
  slug: string;
  articleType: string;
  author: string;
  publishedAt: string;
  mainImage?: any;
}

interface Event {
  _id: string;
  title: string;
  slug: string;
  date?: string; // Pour rétrocompatibilité
  dateInfo?: {
    eventDuration: 'single' | 'multiple';
    singleDate?: string;
    startDate?: string;
    endDate?: string;
  };
  poster?: any;
  eventType?: string;
  venue?: {
    venueType: string;
    venueText?: string;
    venueDetails?: {
      name: string;
      city?: string;
    };
  };
}

interface Band {
  _id: string;
  name: string;
  slug: string;
  pressPhoto?: any;
  styles?: Array<{title: string}>;
}

// Requête pour les 3 dernières chroniques (tous types d'articles)
const chroniquesQuery = groq`*[_type == "post"] | order(publishedAt desc) [0...3] {
  _id,
  title,
  "slug": slug.current,
  articleType,
  "author": author->name,
  publishedAt,
  mainImage
}`;

// Requête pour les 3 prochains événements
const eventsQuery = groq`*[_type == "event" && (
  (dateInfo.eventDuration == "single" && dateInfo.singleDate >= now()) ||
  (dateInfo.eventDuration == "multiple" && dateInfo.endDate >= now()) ||
  date >= now()
)] | order(
  coalesce(dateInfo.singleDate, dateInfo.startDate, date) asc
) [0...3] {
  _id,
  title,
  "slug": slug.current,
  date, // Pour rétrocompatibilité
  dateInfo,
  poster,
  "eventType": eventType->title,
  venue {
    venueType,
    venueText,
    "venueDetails": venueReference->{
      name,
      city
    }
  }
}`;

// Requête pour 6 groupes récents (on en prendra 3 au hasard)
const bandsQuery = groq`*[_type == "band"] | order(_createdAt desc) [0...6] {
  _id,
  name,
  "slug": slug.current,
  pressPhoto,
  "styles": styles[]->{title}
}`;

// Exécution des requêtes
const { data: chroniques } = await useSanityQuery<Post[]>(chroniquesQuery);
const { data: events } = await useSanityQuery<Event[]>(eventsQuery);
const { data: allBands } = await useSanityQuery<Band[]>(bandsQuery);

// Sélection de 3 groupes aléatoires côté client uniquement
const randomBands = ref<Band[]>([]);

// On fait la sélection aléatoire uniquement côté client pour éviter les problèmes d'hydratation
onMounted(() => {
  if (allBands.value && Array.isArray(allBands.value) && allBands.value.length > 0) {
    const shuffled = [...allBands.value].sort(() => Math.random() - 0.5);
    randomBands.value = shuffled.slice(0, 3);
  }
});
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Bannière avec logo et titre -->
    <section class="relative bg-stone-900 text-white overflow-hidden">
      <!-- Logo en arrière-plan -->
      <div class="absolute inset-0 flex items-center justify-center opacity-90">
        <img 
          src="~/assets/img/logo.png" 
          alt="BZH-MTL Logo Background" 
          class="h-64 w-64 md:h-80 md:w-80 lg:h-96 lg:w-96 object-contain"
        />
      </div>
      
      <!-- Contenu par-dessus -->
      <div class="relative z-10 container mx-auto px-4 py-12 md:py-16">
        <div class="text-center">
          <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 hero-title">
            Breizh Metal Magazine
          </h1>
          <p class="text-lg md:text-xl text-white-300 font-medium hero-subtitle">
            Scène bretonne • Chroniques • Concerts
          </p>
        </div>
      </div>
      
      <!-- Ancien affichage en commentaire -->
      <!--
      <div class="container mx-auto px-4 py-12 md:py-16">
        <div class="flex flex-col md:flex-row items-center justify-between">
          <div class="flex items-center space-x-4 mb-6 md:mb-0">
            <img 
              src="~/assets/img/logo.png" 
              alt="BZH-MTL Logo" 
              class="h-16 w-16 md:h-20 md:w-20 rounded-full shadow-lg"
            />
            <div>
              <h1 class="text-3xl md:text-4xl font-bold tracking-tight">
                Breizh Metal Magazine
              </h1>
            </div>
          </div>
          
          <div class="text-center md:text-right">
            <p class="text-sm md:text-base text-stone-300">
              Scène bretonne • Chroniques • Concerts
            </p>
          </div>
        </div>
      </div>
      -->
    </section>

    <!-- Contenu principal -->
    <main class="container mx-auto px-4 py-8 md:py-12">
      
      <!-- Section Dernières Chroniques -->
      <section class="mb-12">
        <div class="flex items-center justify-between mb-8">
          <h2 class="text-2xl md:text-2xl font-bold text-gray-900">
            Derniers Articles
          </h2>
          <NuxtLink 
            to="/articles" 
            class="text-purple-600 hover:text-purple-700 font-medium transition-colors"
          >
            Voir tous →
          </NuxtLink>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="chronique in (chroniques || [])" :key="chronique._id">
            <PostCard :post="chronique" />
          </div>
        </div>
        
        <!-- Message si pas de chroniques -->
        <div v-if="!chroniques || chroniques.length === 0" class="text-center py-8 text-gray-500">
          <p>Aucun article disponible pour le moment.</p>
        </div>
      </section>

      <!-- Section Prochains Événements -->
      <section class="mb-12">
        <div class="flex items-center justify-between mb-8">
          <h2 class="text-2xl md:text-2xl font-bold text-gray-900">
            Prochains Événements
          </h2>
          <NuxtLink 
            to="/evenements" 
            class="text-purple-600 hover:text-purple-700 font-medium transition-colors"
          >
            Voir l'agenda →
          </NuxtLink>
        </div>
        
        <ul v-if="events && events.length > 0" class="space-y-2">
          <li v-for="event in (events || [])" :key="event._id">
            <EventCard :event="event" />
          </li>
        </ul>
        
        <!-- Message si pas d'événements -->
        <div v-else class="text-center py-8 text-gray-500">
          <p>Aucun événement à venir pour le moment.</p>
        </div>
      </section>

      <!-- Section Groupes à Découvrir -->
      <section class="mb-12">
        <div class="flex items-center justify-between mb-8">
          <h2 class="text-2xl md:text-2xl font-bold text-gray-900">
            Groupes à Découvrir
          </h2>
          <NuxtLink 
            to="/groupes" 
            class="text-purple-600 hover:text-purple-700 font-medium transition-colors"
          >
            Voir tous →
          </NuxtLink>
        </div>
        
        <div v-if="randomBands && randomBands.length > 0" class="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <div v-for="band in randomBands" :key="band._id">
            <BandCard :band="band" />
          </div>
        </div>
        
        <!-- Skeleton loading côté client -->
        <div v-else-if="allBands && allBands.length > 0" class="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <div v-for="n in 3" :key="n" class="animate-pulse">
            <div class="bg-gray-200 rounded-lg h-64"></div>
          </div>
        </div>
        
        <!-- Message si pas de groupes -->
        <div v-else class="text-center py-8 text-gray-500">
          <p>Aucun groupe disponible pour le moment.</p>
        </div>
      </section>

    </main>
  </div>
</template>

<style scoped>
.hero-title {
  text-shadow: 
    2px 2px 4px rgba(0, 0, 0, 0.8),
    0 0 10px rgba(0, 0, 0, 0.5),
    0 0 20px rgba(0, 0, 0, 0.3);
}

.hero-subtitle {
  text-shadow: 
    1px 1px 3px rgba(0, 0, 0, 0.7),
    0 0 8px rgba(0, 0, 0, 0.4);
}
</style>