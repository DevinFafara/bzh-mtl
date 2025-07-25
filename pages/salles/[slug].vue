<!-- pages/salles/[slug].vue -->
<script setup lang="ts">
// 1. La requête GROQ pour récupérer la salle spécifique
const route = useRoute();

interface Venue {
  _id: string
  name: string
  image?: { asset: { _ref: string } }
  description?: any
  city?: string
  department?: string
  website?: string
  author?: {
    name: string
    slug: string
    image?: { asset: { _ref: string } }
    citation?: string
  }
}

interface RelatedPost {
  _id: string
  title: string
  slug: string
  mainImage?: { asset: { _ref: string } }
  publishedAt: string
  articleType: string
  author: string
}

interface UpcomingEvent {
  _id: string
  title: string
  slug: string
  date: string
  poster?: { asset: { _ref: string } }
  status?: string
  eventType?: string
  venue?: {
    venueType: string
    venueText?: string
    venueDetails?: {
      name: string
      city: string
    }
  }
}

const query = groq`*[_type == "venue" && slug.current == $slug][0] {
  _id,
  name,
  image,
  description,
  city,
  department,
  website,
  "author": author->{ name, "slug": slug.current, image, citation }
}`;

// Requête séparée pour les articles connexes
const relatedPostsQuery = groq`*[_type == "post" && relatedVenue._ref == $venueId] | order(publishedAt desc) [0...6] {
  _id,
  title,
  "slug": slug.current,
  mainImage,
  publishedAt,
  articleType,
  "author": author->name
}`;

// Requête pour les prochains événements dans cette salle
const upcomingEventsQuery = groq`*[_type == "event" && venue.venueReference._ref == $venueId && date >= now()] | order(date asc) [0...6] {
  _id,
  title,
  "slug": slug.current,
  date,
  poster,
  status,
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

const { data: venue } = await useSanityQuery<Venue>(query, { slug: route.params.slug });

// Requête pour les articles connexes (seulement si on a une salle)
const { data: relatedPosts } = await useSanityQuery<RelatedPost[]>(relatedPostsQuery, { 
  venueId: venue.value?._id || '' 
});

// Requête pour les prochains événements dans cette salle
const { data: upcomingEvents } = await useSanityQuery<UpcomingEvent[]>(upcomingEventsQuery, { 
  venueId: venue.value?._id || '' 
});

// Une fonction pour formater le nom du département (pour l'affichage)
const departmentName = computed(() => {
  if (!venue.value?.department) return '';
  const departments: Record<string, string> = {
    '22': 'Côtes-d\'Armor',
    '29': 'Finistère',
    '35': 'Ille-et-Vilaine',
    '44': 'Loire-Atlantique',
    '56': 'Morbihan',
  };
  return departments[venue.value.department] || '';
});

// Fonction pour formater la date des événements (même format que dans /evenements/index.vue)
const formatEventDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long', // 'samedi'
    year: 'numeric', // '2025'
    month: 'long',   // 'décembre'
    day: 'numeric',    // '25'
  };
  return new Date(dateString).toLocaleDateString('fr-FR', options);
};

// Variable pour détecter l'environnement de développement
const isDevelopment = process.env.NODE_ENV === 'development';
</script>

<template>
  <div v-if="venue">
    <!-- 1. HEADER : Nom de la salle centré -->
    <header class="bg-gray-800 text-white py-12 md:py-16">
      <div class="container mx-auto px-4 text-center">
        <h1 class="text-2xl md:text-4xl font-extrabold">{{ venue.name }}</h1>
        
        <!-- 2. SOUS-TITRE : Ville et Département -->
        <p v-if="venue.city || departmentName" class="mt-4 text-lg text-gray-300">
          {{ venue.city }}<span v-if="venue.city && departmentName">, </span>{{ departmentName }}
        </p>
      </div>
    </header>

    <!-- 3. IMAGE : Pleine largeur -->
    <div v-if="venue.image" class="w-full mt-8">
      <NuxtImg 
        :src="venue.image.asset._ref"
        provider="sanity"
        class="w-full h-auto object-cover"
        :alt="`Photo de ${venue.name}`"
      />
    </div>

    <!-- Contenu principal centré -->
    <div class="container mx-auto px-4 mt-8 md:mt-12">
      <div class="max-w-4xl mx-auto">

        <!-- 4. DESCRIPTION et SITE WEB -->
        <div v-if="venue.description" class="max-w-none mb-8">
          <CustomSanityContent :blocks="venue.description" />
        </div>

        <div v-if="venue.website" class="mt-6">
          <a :href="venue.website" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors">
            <Icon name="heroicons:link-20-solid" class="h-5 w-5" />
            Visiter le site web
          </a>
        </div>

        <!-- Prochains événements -->
        <div v-if="upcomingEvents && Array.isArray(upcomingEvents) && upcomingEvents.length > 0" class="mt-12">
          <h2 class="text-xl font-bold mb-6">Prochains événements</h2>
          <ul class="space-y-2">
            <li v-for="event in upcomingEvents" :key="event._id">
              <NuxtLink
                :to="`/evenements/${event.slug}`"
                class="flex flex-col sm:flex-row sm:items-center gap-x-6 gap-y-1 p-4 bg-white border border-transparent rounded-lg hover:bg-yellow-50 hover:border-yellow-400 transition-all duration-200"
              >
                <span class="text-sm font-semibold text-yellow-600 uppercase tracking-wider">
                  {{ formatEventDate(event.date) }}
                </span>
                <span class="text-xl font-bold text-gray-900">
                  {{ event.title }}
                </span>
                <div class="flex flex-wrap gap-2 items-center">
                  <span v-if="event.eventType" class="inline-block bg-gray-200 text-center text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                    {{ event.eventType }}
                  </span>
                  <span v-if="event.venue" class="text-sm text-gray-600 flex items-center">
                    <Icon name="heroicons:map-pin" class="h-4 w-4 inline mr-1" />
                    <span v-if="event.venue.venueType === 'reference' && event.venue.venueDetails">
                      {{ event.venue.venueDetails.name }}, {{ event.venue.venueDetails.city }}
                    </span>
                    <span v-else-if="event.venue.venueType === 'text'">
                      {{ event.venue.venueText }}
                    </span>
                  </span>
                </div>
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Articles connexes -->
        <div v-if="relatedPosts && Array.isArray(relatedPosts) && relatedPosts.length > 0" class="mt-12">
          <h2 class="text-xl font-bold mb-6">Live Report</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PostCard 
              v-for="post in relatedPosts" 
              :key="post._id"
              :post="post"
            />
          </div>
        </div>


        <!-- Debug section (temporaire) -->
        <!-- <div v-if="isDevelopment" class="mb-12 p-4 bg-gray-100 rounded-lg">
          <h3 class="font-bold text-lg mb-2">🐛 Debug - Événements</h3>
          <p class="text-sm text-gray-600 mb-2">Venue ID: {{ venue._id }}</p>
          <p class="text-sm text-gray-600 mb-2">Événements pour cette salle: {{ upcomingEvents?.length || 0 }}</p>
          <details v-if="upcomingEvents && upcomingEvents.length > 0" class="mt-2">
            <summary class="text-sm text-green-600 cursor-pointer">Voir les événements</summary>
            <pre class="text-xs mt-2 p-2 bg-white overflow-auto max-h-64">{{ JSON.stringify(upcomingEvents, null, 2) }}</pre>
          </details>
        </div> -->

        <!-- Séparateur -->
        <hr class="my-12">

        <!-- 5. AUTEUR : Bloc réutilisé -->
        <div v-if="venue.author" class="bg-gray-50 p-6 rounded-lg mt-8">
          <div class="flex items-start gap-4">
            <NuxtImg
              v-if="venue.author.image"
              :src="venue.author.image.asset._ref"
              provider="sanity"
              class="h-16 w-16 rounded-full object-cover flex-shrink-0"
            />
            <div>
              <p class="font-semibold">
                Fiche rédigée par 
                <NuxtLink :to="`/auteurs/${venue.author.slug}`" class="text-blue-600 hover:underline">
                  {{ venue.author.name }}
                </NuxtLink>
              </p>
              <p v-if="venue.author.citation" class="text-gray-600 italic mt-2 prose prose-sm">
                {{ venue.author.citation }}
              </p>
            </div>
          </div>
        </div>



      </div>
    </div>
  </div>

  <!-- Message si la salle n'est pas trouvée -->
  <div v-else class="text-center p-16">
    <p>Salle de concert non trouvée...</p>
  </div>
</template>

<style scoped>
/* Pas besoin de CSS complexe ici, Tailwind gère tout. */
/* On peut ajouter des styles spécifiques si nécessaire. */
</style>