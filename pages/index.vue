<script setup lang="ts">
// Configuration SEO pour la page d'accueil
useSeoMeta({
  title: 'Breizh Metal',
  description: 'Découvrez la scène metal bretonne sur Breizh Metal : actualités, groupes, festivals, concerts, chroniques. Suivez l\'actualité du metal en Bretagne et au-delà avec interviews, reviews et agenda.',
  ogTitle: 'Breizh Metal - Le portail metal de Bretagne',
  ogDescription: 'Breizh Metal, le webzine de référence de la scène metal bretonne. Actualités, groupes, festivals, concerts et chroniques.',
  ogImage: '/bzh-mtl-mgz_logo.png',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Breizh Metal',
  twitterDescription: 'Le portail de référence de la scène metal bretonne'
})

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

// Requête pour TOUS les groupes (on en prendra 4 au hasard côté client)
const bandsQuery = groq`*[_type == "band"] {
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
    randomBands.value = shuffled.slice(0, 4);
  }
});
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Bannière avec logo et titre -->
    <section class="relative bg-stone-900 text-white overflow-hidden">
      <!-- Logo en arrière-plan -->
      <!-- <div class="absolute inset-0 flex items-center justify-center opacity-90 p-8">
        <img 
          src="~/assets/img/bzh-mtl-mgz_logo.png" 
          alt="BZH-MTL Logo Background" 
          class="h-48 w-48 md:h-64 md:w-64 lg:h-72 lg:w-72 object-contain"
        />
      </div> -->
      
      <!-- Logo principal en tant que H1 -->
      <h1 class="flex items-center justify-center opacity-100">
        <img 
          src="~/assets/img/large-bm-logo-with-margin.png" 
          alt="Breizh Metal - Le portail de la scène metal bretonne" 
          class="w-full max-w-[500px] h-auto object-contain"
        />
      </h1>
    
    </section>

    <!-- Contenu principal -->
    <main class="container mx-auto px-4 py-8 md:py-12">
      
      <!-- Section d'introduction -->
            <!-- Section d'introduction -->
      <section class="mb-12 text-center">
        <p class="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
          Bienvenue sur le portail de référence de la scène metal bretonne. <br />
          Découvrez les groupes locaux, suivez l'actualité des festivals et concerts, <br />
          Plongez au cœur du metal en Bretagne !
        </p>
      </section>
      
      <!-- Section Dernières Chroniques -->
      <section class="mb-12" aria-labelledby="derniers-articles">
        <div class="flex items-center justify-between mb-8">
          <h2 id="derniers-articles" class="text-2xl md:text-2xl font-bold text-gray-900">
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
          <article v-for="chronique in (chroniques || [])" :key="chronique._id">
            <PostCard :post="chronique" />
          </article>
        </div>
        
        <!-- Message si pas de chroniques -->
        <div v-if="!chroniques || chroniques.length === 0" class="text-center py-8 text-gray-500">
          <p>Aucun article disponible pour le moment.</p>
        </div>
      </section>

      <!-- Section Groupes à Découvrir -->
      <section class="mb-12" aria-labelledby="groupes-decouvrir">
        <div class="flex items-center justify-between mb-8">
          <h2 id="groupes-decouvrir" class="text-2xl md:text-2xl font-bold text-gray-900">
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
          <article v-for="band in randomBands" :key="band._id">
            <BandCard :band="band" />
          </article>
        </div>
        
        <!-- Skeleton loading côté client -->
        <div v-else-if="allBands && allBands.length > 0" class="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <div v-for="n in 4" :key="n" class="animate-pulse">
            <div class="bg-gray-200 rounded-lg h-64"></div>
          </div>
        </div>
        
        <!-- Message si pas de groupes -->
        <div v-else class="text-center py-8 text-gray-500">
          <p>Aucun groupe disponible pour le moment.</p>
        </div>
      </section>
      
      <!-- Section Prochains Événements -->
      <section class="mb-12" aria-labelledby="prochains-evenements">
        <div class="flex items-center justify-between mb-8">
          <h2 id="prochains-evenements" class="text-2xl md:text-2xl font-bold text-gray-900">
            Prochains Événements
          </h2>
          <NuxtLink 
            to="/evenements" 
            class="text-purple-600 hover:text-purple-700 font-medium transition-colors"
          >
            Voir l'agenda →
          </NuxtLink>
        </div>
        
        <div v-if="events && events.length > 0" class="space-y-2">
          <article v-for="event in (events || [])" :key="event._id">
            <EventCard :event="event" />
          </article>
        </div>
        
        <!-- Message si pas d'événements -->
        <div v-else class="text-center py-8 text-gray-500">
          <p>Aucun événement à venir pour le moment.</p>
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