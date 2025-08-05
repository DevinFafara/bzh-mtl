<script setup lang="ts">
import { GlobeAltIcon, LinkIcon } from '@heroicons/vue/24/outline'


const route = useRoute();

const query = groq`*[_type == "band" && slug.current == $slug][0] {
  _id,
  name,
  pressPhoto,
  logoImage,
  bio,
  cityOfOrigin,
  departmentOfOrigin,
  "styles": styles[]->{ _id, title, "slug": slug.current },
  links,
  "author": author->{ name, "slug": slug.current, image, bio, citation }
}`;

// Requête séparée pour les articles connexes
const relatedPostsQuery = groq`*[_type == "post" && relatedBand._ref == $bandId] | order(publishedAt desc) [0...6] {
  _id,
  title,
  "slug": slug.current,
  mainImage,
  publishedAt,
  articleType,
  "author": author->name
}`;

// Requête pour les prochains événements où ce groupe est dans le lineup
const upcomingEventsQuery = groq`*[_type == "event" && (
  (dateInfo.eventDuration == "single" && dateInfo.singleDate >= now()) ||
  (dateInfo.eventDuration == "multiple" && dateInfo.endDate >= now()) ||
  date >= now()
) && (
  $bandId in lineup[].band._ref ||
  $bandId in lineup[]._ref
)] | order(
  coalesce(dateInfo.singleDate, dateInfo.startDate, date) asc
) [0...6] {
  _id,
  title,
  "slug": slug.current,
  date, // Pour rétrocompatibilité
  dateInfo,
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

// Requête pour navigation (groupe précédent et suivant par ordre alphabétique)
const navigationQuery = groq`{
  "previous": *[_type == "band" && name < $currentName] | order(name desc) [0] {
    _id,
    name,
    "slug": slug.current,
    pressPhoto,
    "styles": styles[]->{title}
  },
  "next": *[_type == "band" && name > $currentName] | order(name asc) [0] {
    _id,
    name,
    "slug": slug.current,
    pressPhoto,
    "styles": styles[]->{title}
  }
}`;

interface Band {
  _id: string
  name: string
  pressPhoto?: { asset: { _ref: string } }
  logoImage?: { asset: { _ref: string } }
  bio?: any
  cityOfOrigin?: string
  departmentOfOrigin?: string[]
  styles?: Array<{ _id: string; title: string; slug: string }>
  links?: {
    website?: string
    bandcamp?: string
    spotify?: string
    facebook?: string
    soundcloud?: string
    youtube?: string
    linktree?: string
    instagram?: string
  }
  author?: {
    name: string
    slug: string
    image?: { asset: { _ref: string } }
    bio?: any
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
  date?: string // Pour rétrocompatibilité
  dateInfo?: {
    eventDuration: 'single' | 'multiple'
    singleDate?: string
    startDate?: string
    endDate?: string
  }
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

interface NavigationBand {
  _id: string
  name: string
  slug: string
  pressPhoto?: { asset: { _ref: string } }
  styles?: Array<{ title: string }>
}

interface Navigation {
  previous?: NavigationBand
  next?: NavigationBand
}

const { data: band } = await useSanityQuery<Band>(query, { slug: route.params.slug });

// Requête pour les articles connexes (seulement si on a un groupe)
const { data: relatedPosts } = await useSanityQuery<RelatedPost[]>(relatedPostsQuery, { 
  bandId: band.value?._id || '' 
});

// Requête pour les prochains événements où ce groupe est dans le lineup
const { data: upcomingEvents } = await useSanityQuery<UpcomingEvent[]>(upcomingEventsQuery, {
  bandId: band.value?._id || ''
});

// Requête pour la navigation (groupes précédent et suivant)
const { data: navigation } = await useSanityQuery<Navigation>(navigationQuery, {
  currentName: band.value?.name || ''
});

// Fonction pour formater la date des événements (nouvelle structure)
const formatEventDate = (event: UpcomingEvent) => {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long', // 'samedi'
    year: 'numeric', // '2025'
    month: 'long',   // 'décembre'
    day: 'numeric',    // '25'
  };
  
  // Gestion de la nouvelle structure dateInfo
  if (event.dateInfo?.eventDuration === 'single' && event.dateInfo?.singleDate) {
    return new Date(event.dateInfo.singleDate).toLocaleDateString('fr-FR', options);
  } else if (event.dateInfo?.eventDuration === 'multiple' && event.dateInfo?.startDate && event.dateInfo?.endDate) {
    const startDate = new Date(event.dateInfo.startDate).toLocaleDateString('fr-FR', options);
    const endDate = new Date(event.dateInfo.endDate).toLocaleDateString('fr-FR', options);
    return `${startDate} - ${endDate}`;
  }
  
  // Fallback pour l'ancienne structure (rétrocompatibilité)
  if (event.date) {
    return new Date(event.date).toLocaleDateString('fr-FR', options);
  }
  
  return 'Date non définie';
};

// Variable pour détecter l'environnement de développement
const isDevelopment = process.env.NODE_ENV === 'development';

// Fonction pour générer l'URL de recherche YouTube (iframe ne fonctionne plus)
const getYouTubeSearchUrl = (bandName: string) => {
  // YouTube ne permet plus les iframes de recherche, on utilise une approche différente
  const cleanBandName = encodeURIComponent(bandName.replace(/[^a-zA-Z0-9\s]/g, '').trim());
  // Option : afficher la chaîne directement
  return `https://www.youtube.com/embed/channel/UCvotreChannelId`; // À remplacer par votre channel ID
};

// Alternative : URL de recherche classique (ouvre dans un nouvel onglet)
const getYouTubeSearchLink = (bandName: string) => {
  const cleanBandName = encodeURIComponent(bandName);
  return `https://www.youtube.com/@ConcertsMetal-BZH/search?query=${cleanBandName}`;
};

// Meilleure approche : recherche YouTube générale
const getYouTubeGeneralSearchLink = (bandName: string) => {
  const cleanBandName = encodeURIComponent(`${bandName} ConcertsMetal-BZH`);
  return `https://www.youtube.com/results?search_query=${cleanBandName}`;
};
</script>

<template>
  <div v-if="band">
    <!-- 1. Bannière avec la photo de presse -->
    <div v-if="band.pressPhoto" class="h-64 md:h-96 w-full relative">
      <NuxtImg 
        :src="band.pressPhoto.asset._ref" 
        provider="sanity" 
        class="w-full h-full object-cover"
        :alt="`Photo de presse de ${band.name}`"
      />
      <div class="absolute inset-0 bg-transparent bg-opacity-30 flex items-end p-4 md:p-8">
        <h1 class="text-white text-4xl md:text-6xl font-extrabold drop-shadow-lg bg-stone-900/60">{{ band.name }}</h1>
      </div>
    </div>
    

    <div class="container mx-auto p-4 md:p-8">
      
      <!-- Conteneur pour logo et infos (sera traité comme une seule unité) -->
      <div class="sidebar-content">
        <!-- 1. Logo du groupe -->
        <div v-if="band.logoImage" class="logo-section mb-6">
          <NuxtImg 
            :src="band.logoImage.asset._ref"
            provider="sanity"
            class="w-full h-auto max-h-48 object-contain"
            :alt="`Logo de ${band.name}`"
          />
        </div>

        <!-- 2. Infos (styles et liens) -->
        <div class="infos-section mb-6">
          <!-- Styles musicaux -->
          <div v-if="band.styles" class="mb-4">
            <h3 class="font-bold text-lg mb-2">Styles</h3>
            <div class="flex flex-wrap gap-2">
              <NuxtLink 
                v-for="style in band.styles" 
                :key="style._id" 
                :to="`/styles/${style.slug}`"
                class="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm hover:bg-gray-300 transition-colors"
              >
                {{ style.title }}
              </NuxtLink>
            </div>
          </div>
          <!-- Origines -->
          <div v-if="band.departmentOfOrigin && band.departmentOfOrigin.length > 0" class="mb-4">
            <p><span class="font-bold">Département{{ band.departmentOfOrigin.length > 1 ? 's' : '' }} d'origine :</span> {{ band.departmentOfOrigin.join(', ') }}</p>
          </div>
          <div v-if="band.cityOfOrigin" class="mb-4">
            <p><span class="font-bold">Ville d'origine :</span> {{ band.cityOfOrigin }}</p>
          </div>
          
          
          <!-- Liens externes -->
          <div v-if="band.links">
            <h3 class="font-bold text-lg mb-2">Liens</h3>
            <div class="flex items-center gap-4">
              <a v-if="band.links.website" :href="band.links.website" target="_blank" rel="noopener noreferrer" class="text-gray-600 hover:text-black">
                <GlobeAltIcon class="h-6 w-6" />
              </a>
              <a v-if="band.links.bandcamp" :href="band.links.bandcamp" target="_blank" rel="noopener noreferrer" class="text-gray-600 hover:text-black">
                <Icon name="simple-icons:bandcamp" class="h-6 w-6" />
              </a>
              <a v-if="band.links.spotify" :href="band.links.spotify" target="_blank" rel="noopener noreferrer" class="text-gray-600 hover:text-black">
                <Icon name="simple-icons:spotify" class="h-6 w-6" />
              </a>
              <a v-if="band.links.facebook" :href="band.links.facebook" target="_blank" rel="noopener noreferrer" class="text-gray-600 hover:text-black">
                <Icon name="simple-icons:facebook" class="h-6 w-6" />
              </a>
              <a v-if="band.links.soundcloud" :href="band.links.soundcloud" target="_blank" rel="noopener noreferrer" class="text-gray-600 hover:text-black">
                <Icon name="simple-icons:soundcloud" class="h-6 w-6" />
              </a>
              <a v-if="band.links.instagram" :href="band.links.instagram" target="_blank" rel="noopener noreferrer" class="text-gray-600 hover:text-black">
                <Icon name="simple-icons:instagram" class="h-6 w-6" />
              </a>
              <a v-if="band.links.youtube" :href="band.links.youtube" target="_blank" rel="noopener noreferrer" class="text-gray-600 hover:text-black">
                <Icon name="simple-icons:youtube" class="h-6 w-6" />
              </a>
              <a v-if="band.links.linktree" :href="band.links.linktree" target="_blank" rel="noopener noreferrer" class="text-gray-600 hover:text-black">
                <Icon name="simple-icons:linktree" class="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- 3. Biographie -->
      <div class="bio-section mb-12">
        <div v-if="band.bio" class="max-w-none">
          <h2 class="font-bold text-2xl mb-4">Biographie</h2>
          <CustomSanityContent :blocks="band.bio"/>
        </div>
      </div>
      <!-- 7. Auteur (toujours en pleine largeur en bas) -->
      <div class="author-section">
        <AuthorSection :author="band.author" />
      </div>

      <!-- 4. Prochains événements -->
      <div v-if="upcomingEvents && upcomingEvents.length > 0" class="upcoming-events-section mb-12">
        <h2 class="font-bold text-xl mb-6">Prochains concerts de {{ band.name }}</h2>
        <ul class="space-y-2">
          <li v-for="event in upcomingEvents" :key="event._id">
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

      <!-- 5. Section Vidéos YouTube -->
      <div class="youtube-section mb-12">
        <!-- Scraper YouTube intégré (n'affiche rien si aucune vidéo trouvée) -->
        <YouTubeScraper :band-name="band.name" />
      </div>

      <!-- 6. Articles connexes -->
      <div v-if="relatedPosts && Array.isArray(relatedPosts) && relatedPosts.length > 0" class="related-posts-section mb-12">
        <h2 class="font-bold text-xl mb-6">Articles en lien avec {{ band.name }}</h2>
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
        <p class="text-sm text-gray-600 mb-2">Band ID: {{ band._id }}</p>
        <p class="text-sm text-gray-600 mb-2">Événements pour ce groupe: {{ upcomingEvents?.length || 0 }}</p>
        <details v-if="upcomingEvents && upcomingEvents.length > 0" class="mt-2">
          <summary class="text-sm text-green-600 cursor-pointer">Voir les événements</summary>
          <pre class="text-xs mt-2 p-2 bg-white overflow-auto max-h-64">{{ JSON.stringify(upcomingEvents, null, 2) }}</pre>
        </details>
      </div> -->
      

      <!-- 8. Navigation entre groupes -->
      <div v-if="navigation?.previous || navigation?.next" class="navigation-section mt-12">
        <div class="grid grid-cols-2 w-full border border-gray-300 rounded-lg overflow-hidden">
          <!-- Moitié gauche : Groupe précédent -->
          <NuxtLink 
            v-if="navigation.previous" 
            :to="`/groupes/${navigation.previous.slug}`"
            class="flex flex-col items-center justify-center p-4 bg-white hover:bg-gray-50 transition-colors border-r border-gray-300 text-center"
          >
            <div class="flex items-center mb-1">
              <Icon name="heroicons:chevron-left" class="h-5 w-5 text-gray-600 mr-2" />
              <span class="text-gray-800 font-medium">Groupe précédent</span>
            </div>
            <span class="text-gray-800 font-semibold bg-blue-100 px-3 py-1 rounded-lg w-full text-center">{{ navigation.previous.name }}</span>
          </NuxtLink>
          <div v-else class="flex items-center justify-center p-4 bg-gray-100 border-r border-gray-300 text-center">
            <span class="text-gray-400">Pas de groupe précédent</span>
          </div>
          
          <!-- Moitié droite : Groupe suivant -->
          <NuxtLink 
            v-if="navigation.next" 
            :to="`/groupes/${navigation.next.slug}`"
            class="flex flex-col items-center justify-center p-4 bg-white hover:bg-gray-50 transition-colors text-center"
          >
            <div class="flex items-center mb-1">
              <span class="text-gray-800 font-medium">Groupe suivant</span>
              <Icon name="heroicons:chevron-right" class="h-5 w-5 text-gray-600 ml-2" />
            </div>
            <span class="text-gray-800 font-semibold bg-blue-100 px-3 py-1 rounded-lg w-full text-center">{{ navigation.next.name }}</span>
          </NuxtLink>
          <div v-else class="flex items-center justify-center p-4 bg-gray-100 text-center">
            <span class="text-gray-400">Pas de groupe suivant</span>
          </div>
        </div>
      </div>
      

      
    </div>
  </div>

  <div v-else class="text-center p-16">
    <p>Groupe non trouvé...</p>
  </div>
</template>

<style scoped>
/* Layout par défaut : mobile/petit écran */
/* 1) logo, 2) infos, 3) bio, 4) auteur en colonne */

/* Rendre les iframes YouTube responsives dans la bio */
.bio-section :deep(iframe) {
  max-width: 100%;
  height: auto;
  aspect-ratio: 16 / 9;
}

/* Conteneur responsive pour les iframes YouTube */
.bio-section :deep(iframe[src*="youtube.com"]),
.bio-section :deep(iframe[src*="youtu.be"]) {
  width: 100%;
  max-width: 100%;
  height: auto;
  aspect-ratio: 16 / 9;
}

/* Écran moyen : logo + infos côte à côte, bio en pleine largeur dessous */
@media (min-width: 640px) and (max-width: 1023px) {
  .container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-areas: 
      "logo infos"
      "bio bio"
      "author author"
      "events events"
      "youtube youtube"
      "related related"
      "navigation navigation";
    gap: 1.5rem;
  }
  
  .sidebar-content {
    display: contents; /* Les enfants se comportent comme s'ils étaient des enfants directs du container */
  }
  
  .logo-section { grid-area: logo; }
  .infos-section { grid-area: infos; }
  .bio-section { grid-area: bio; }
  .youtube-section { grid-area: youtube; }
  .related-posts-section { grid-area: related; }
  .upcoming-events-section { grid-area: events; }
  .author-section { grid-area: author; }
  .navigation-section { grid-area: navigation; }
}

/* Grand écran : logo + infos dans colonne gauche (33%), bio à droite (67%) */
@media (min-width: 1024px) {
  .container {
    display: grid;
    grid-template-columns: 1fr 2fr;
    grid-template-areas: 
      "sidebar bio"
      "author author"
      "events events"
      "youtube youtube"
      "related related"
      "navigation navigation";
    gap: 2rem;
  }
  
  .sidebar-content { 
    grid-area: sidebar;
    display: flex;
    flex-direction: column;
  }
  
  .bio-section { 
    grid-area: bio; 
    margin-bottom: 0;
  }
  
  .youtube-section { 
    grid-area: youtube; 
    margin-bottom: 0;
  }
  
  .related-posts-section { 
    grid-area: related; 
    margin-bottom: 0;
  }
  
  .upcoming-events-section { 
    grid-area: events; 
    margin-bottom: 0;
  }
  
  .author-section { 
    grid-area: author; 
    margin-top: 2rem;
  }
  
  .navigation-section { 
    grid-area: navigation; 
    margin-top: 0;
  }
}
</style>