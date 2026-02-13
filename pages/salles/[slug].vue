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

interface VenueEvent {
  _id: string
  title: string
  slug: string
  date?: string
  dateInfo?: {
    eventDuration: 'single' | 'multiple'
    singleDate?: string
    startDate?: string
    endDate?: string
  }
  poster?: { asset: { _ref: string } }
  status?: string
  eventType?: string
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

// Requête unique pour tous les événements dans cette salle (avec support dateInfo)
const venueEventsQuery = groq`*[_type == "event" && venue.venueReference._ref == $venueId] | order(coalesce(dateInfo.singleDate, dateInfo.startDate, date) asc) {
  _id,
  title,
  "slug": slug.current,
  date,
  dateInfo,
  poster,
  status,
  "eventType": eventType->title
}`;

const { data: venue } = await useSanityQuery<Venue>(query, { slug: route.params.slug });

// Requête pour les articles connexes (seulement si on a une salle)
const { data: relatedPosts } = await useSanityQuery<RelatedPost[]>(relatedPostsQuery, { 
  venueId: venue.value?._id || '' 
});

// Requête pour tous les événements dans cette salle
const { data: venueEvents } = await useSanityQuery<VenueEvent[]>(venueEventsQuery, { 
  venueId: venue.value?._id || '' 
});

// Date du jour pour séparer futurs / passés
const today = new Date().toISOString().split('T')[0];

// Helper : extraire la date comparable d'un événement
const getEventDate = (event: VenueEvent): string => {
  if (event.dateInfo?.eventDuration === 'single' && event.dateInfo?.singleDate) {
    return event.dateInfo.singleDate.split('T')[0];
  }
  if (event.dateInfo?.eventDuration === 'multiple' && event.dateInfo?.endDate) {
    return event.dateInfo.endDate;
  }
  if (event.date) {
    return event.date.split('T')[0];
  }
  return '';
};

// Événements à venir (date >= aujourd'hui)
const upcomingEvents = computed(() => {
  if (!venueEvents.value) return [];
  return venueEvents.value.filter(e => getEventDate(e) >= today);
});

// Événements passés (date < aujourd'hui), du plus récent au plus ancien
const pastEvents = computed(() => {
  if (!venueEvents.value) return [];
  return venueEvents.value.filter(e => getEventDate(e) < today).reverse();
});

// Toggle pour afficher passé / futur
const showPastEvents = ref(false);

// Liste affichée selon le toggle
const displayedEvents = computed(() => {
  return showPastEvents.value ? pastEvents.value : upcomingEvents.value;
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

// Fonction pour formater la date des événements (gère dateInfo + ancien format)
const formatEventDate = (event: VenueEvent) => {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  
  if (event.dateInfo?.eventDuration === 'single' && event.dateInfo?.singleDate) {
    return new Date(event.dateInfo.singleDate).toLocaleDateString('fr-FR', options);
  }
  if (event.dateInfo?.eventDuration === 'multiple' && event.dateInfo?.startDate && event.dateInfo?.endDate) {
    const start = new Date(event.dateInfo.startDate).toLocaleDateString('fr-FR', options);
    const end = new Date(event.dateInfo.endDate).toLocaleDateString('fr-FR', options);
    return `${start} - ${end}`;
  }
  if (event.date) {
    return new Date(event.date).toLocaleDateString('fr-FR', options);
  }
  return 'Date non définie';
};

// Variable pour détecter l'environnement de développement
const isDevelopment = process.env.NODE_ENV === 'development';

// Configuration SEO dynamique pour la salle
const extractVenueDescription = (description: any[]): string => {
  if (!description || !Array.isArray(description)) return '';
  
  const textBlock = description.find(block => block._type === 'block' && block.children);
  if (textBlock && textBlock.children) {
    const text = textBlock.children
      .filter((child: any) => child._type === 'span' && child.text)
      .map((child: any) => child.text)
      .join(' ');
    
    return text.length > 155 ? text.substring(0, 155) + '...' : text;
  }
  
  return '';
};

useSeoMeta({
  title: () => venue.value ? `${venue.value.name} - Salles - Breizh Metal` : 'Salle - Breizh Metal',
  description: () => {
    if (venue.value) {
      const venueDesc = venue.value.description ? extractVenueDescription(venue.value.description) : '';
      if (venueDesc) {
        return venueDesc;
      }
      
      // Générer une description basée sur les informations disponibles
      const location = venue.value.city ? ` à ${venue.value.city}` : '';
      const department = departmentName.value ? ` (${departmentName.value})` : '';
      
      return `${venue.value.name}, salle de concert${location}${department}. Découvrez les événements, concerts et actualités sur Breizh Metal.`;
    }
    return 'Découvrez cette salle de concert sur Breizh Metal';
  },
  ogTitle: () => venue.value?.name || 'Salle - Breizh Metal',
  ogDescription: () => {
    if (venue.value) {
      const venueDesc = venue.value.description ? extractVenueDescription(venue.value.description) : '';
      if (venueDesc) return venueDesc;
      
      const location = venue.value.city ? ` à ${venue.value.city}` : '';
      return `${venue.value.name}, salle de concert${location} - Breizh Metal`;
    }
    return 'Salle de concert sur Breizh Metal';
  },
  ogImage: () => {
    if (venue.value?.image?.asset?._ref) {
      return venue.value.image.asset._ref;
    }
    return 'https://breizhmetal.bzh/BM-logo-large.png';
  },
  ogUrl: () => `https://breizhmetal.bzh/salles/${route.params.slug}`,
  twitterCard: 'summary_large_image'
});
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

        <!-- Événements de cette salle -->
        <div v-if="venueEvents && venueEvents.length > 0" class="mt-12">
          <!-- Titre + Toggle -->
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h2 class="text-xl font-bold">
              {{ showPastEvents ? 'Événements passés' : 'Prochains événements' }}
            </h2>
            <div class="flex gap-2">
              <button
                @click="showPastEvents = false"
                :class="[
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                  !showPastEvents
                    ? 'bg-yellow-500 text-white shadow-md'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                ]"
              >
                À venir ({{ upcomingEvents.length }})
              </button>
              <button
                @click="showPastEvents = true"
                :class="[
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                  showPastEvents
                    ? 'bg-yellow-500 text-white shadow-md'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                ]"
              >
                Passés ({{ pastEvents.length }})
              </button>
            </div>
          </div>

          <!-- Liste des événements -->
          <ul v-if="displayedEvents.length > 0" class="space-y-2">
            <li v-for="event in displayedEvents" :key="event._id">
              <NuxtLink
                :to="`/evenements/${event.slug}`"
                class="flex flex-col sm:flex-row sm:items-center gap-x-6 gap-y-1 p-4 bg-white border border-transparent rounded-lg hover:bg-yellow-50 hover:border-yellow-400 transition-all duration-200"
              >
                <span class="text-sm font-semibold text-yellow-600 uppercase tracking-wider">
                  {{ formatEventDate(event) }}
                </span>
                <span class="text-xl font-bold text-gray-900">
                  {{ event.title }}
                </span>
                <div class="flex flex-wrap gap-2 items-center">
                  <span v-if="event.eventType" class="inline-block bg-gray-200 text-center text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                    {{ event.eventType }}
                  </span>
                </div>
              </NuxtLink>
            </li>
          </ul>
          <p v-else class="text-gray-500 py-4">
            {{ showPastEvents ? 'Aucun événement passé.' : 'Aucun événement à venir pour le moment.' }}
          </p>
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


        <!-- 5. AUTEUR : Bloc réutilisé -->
        <AuthorSection :author="venue.author" class="mt-8" />







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