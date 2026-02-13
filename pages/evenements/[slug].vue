<script setup lang="ts">
// On récupère la route actuelle pour avoir accès au paramètre 'slug' de l'URL
const route = useRoute();

// Interface pour typer l'événement
interface Event {
  title: string;
  description?: any; // Pour le contenu riche blockContent
  date?: string; // Pour rétrocompatibilité
  dateInfo?: {
    eventDuration: 'single' | 'multiple';
    singleDate?: string;
    startDate?: string;
    endDate?: string;
  };
  poster?: { asset: { _ref: string } };
  ticketUrl?: string;
  eventType?: string;
  festival?: {
    _id: string;
    name: string;
    slug: string;
    description?: any;
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
  };
  venue?: {
    venueType: string;
    venueText?: string;
    venueDetails?: {
      _id: string;
      name: string;
      city: string;
      slug: string;
      description?: any;
      image?: { asset: { _ref: string } };
      capacity?: number;
      address?: string;
    };
  };
  lineup?: Array<{
    _key: string;
    _type: string;
    // Nouveaux champs pour la nouvelle structure
    band?: {
      _id: string;
      name: string;
      slug: string;
    };
    name?: string; // Pour les groupes externes
    performanceDay?: string;
    performanceTime?: string;
    // Anciens champs pour rétrocompatibilité
    isReference?: boolean;
    _id?: string;
    slug?: string;
  }>;
  lineupText?: any; // Nouveau champ pour le line-up en texte riche
  referencedBands?: Array<{
    _id: string;
    name: string;
    slug: string;
    bio?: any;
    pressPhoto?: { asset: { _ref: string } };
    logoImage?: { asset: { _ref: string } };
    styles?: string[];
    cityOfOrigin?: string;
    departmentOfOrigin?: string[];
  }>;
}

interface NavigationEvent {
  _id: string
  title: string
  slug: string
}

interface Navigation {
  previous?: NavigationEvent
  next?: NavigationEvent
}

// La requête GROQ pour UN seul événement, avec toutes ses données liées
const query = groq`*[_type == "event" && slug.current == $slug][0] {
  title,
  description,
  date, // Pour rétrocompatibilité
  dateInfo,
  poster,
  ticketUrl,
  "eventType": eventType->title,
  // Récupération des données du festival
  "festival": festival-> {
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
  },
  // On récupère l'objet venue en entier avec les données complètes
  venue {
    venueType,
    venueText,
    "venueDetails": venueReference->{
      _id,
      name,
      city,
      "slug": slug.current,
      description,
      image,
      capacity,
      address
    }
  },
  // On récupère le line-up, en gérant les nouveaux types
  lineup[] {
    _key,
    _type,
    // Pour les groupes référencés (nouveau format)
    _type == 'referencedBand' => {
      "band": band->{ _id, name, "slug": slug.current },
      performanceDay,
      performanceTime
    },
    // Pour les groupes externes (nouveau format)
    _type == 'externalBand' => {
      name,
      performanceDay,
      performanceTime
    },
    // Rétrocompatibilité avec l'ancien format
    _type == 'reference' => {
      "isReference": true,
      ...@->{ _id, name, "slug": slug.current }
    }
  },
  // Nouveau champ line-up texte
  lineupText,
  // Groupes référencés avec leurs informations complètes
  "referencedBands": referencedBands[]-> {
    _id,
    name,
    "slug": slug.current,
    bio,
    pressPhoto,
    logoImage,
    "styles": styles[]->{title},
    cityOfOrigin,
    departmentOfOrigin
  }
}`;

// Requête pour navigation (événement précédent et suivant par date)
const navigationQuery = groq`{
  "previous": *[_type == "event" && (
    (dateInfo.eventDuration == "single" && dateInfo.singleDate < $currentDate) ||
    (dateInfo.eventDuration == "multiple" && dateInfo.startDate < $currentDate) ||
    date < $currentDate
  )] | order(coalesce(dateInfo.singleDate, dateInfo.startDate, date) desc) [0] {
    _id,
    title,
    "slug": slug.current
  },
  "next": *[_type == "event" && (
    (dateInfo.eventDuration == "single" && dateInfo.singleDate > $currentDate) ||
    (dateInfo.eventDuration == "multiple" && dateInfo.startDate > $currentDate) ||
    date > $currentDate
  )] | order(coalesce(dateInfo.singleDate, dateInfo.startDate, date) asc) [0] {
    _id,
    title,
    "slug": slug.current
  }
}`;

// On exécute la requête
const { data: event, pending, error } = await useSanityQuery<Event>(query, { slug: route.params.slug });

// Requête pour la navigation (événements précédent et suivant)
const { data: navigation } = await useSanityQuery<Navigation>(navigationQuery, {
  currentDate: event.value?.dateInfo?.singleDate || event.value?.dateInfo?.startDate || event.value?.date || ''
});

// Propriété calculée pour formater la date (nouvelle structure)
const formattedEventDate = computed(() => {
  if (!event.value) return '';
  
  // Gestion de la nouvelle structure dateInfo
  if (event.value.dateInfo?.eventDuration === 'single' && event.value.dateInfo?.singleDate) {
    return new Date(event.value.dateInfo.singleDate).toLocaleDateString('fr-FR', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
  } else if (event.value.dateInfo?.eventDuration === 'multiple' && event.value.dateInfo?.startDate && event.value.dateInfo?.endDate) {
    const startDate = new Date(event.value.dateInfo.startDate).toLocaleDateString('fr-FR', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
    const endDate = new Date(event.value.dateInfo.endDate).toLocaleDateString('fr-FR', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
    return `Du ${startDate} au ${endDate}`;
  }
  
  // Fallback pour l'ancienne structure (rétrocompatibilité)
  if (event.value.date) {
    return new Date(event.value.date).toLocaleDateString('fr-FR', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
  }
  
  return 'Date non définie';
});

// Google Maps embed URL basée sur les infos du lieu
const mapQuery = computed(() => {
  if (!event.value?.venue) return '';
  
  if (event.value.venue.venueType === 'reference' && event.value.venue.venueDetails) {
    const v = event.value.venue.venueDetails;
    // On combine nom + adresse + ville pour une recherche précise
    const parts = [v.name, v.address, v.city].filter(Boolean);
    return parts.join(', ');
  }
  
  if (event.value.venue.venueType === 'text' && event.value.venue.venueText) {
    return event.value.venue.venueText;
  }
  
  return '';
});

const mapEmbedUrl = computed(() => {
  if (!mapQuery.value) return '';
  return `https://maps.google.com/maps?q=${encodeURIComponent(mapQuery.value)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
});

// Configuration SEO dynamique pour l'événement
const extractEventDescription = (description: any[]): string => {
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
  title: () => event.value ? `${event.value.title} - Événements - Breizh Metal` : 'Événement - Breizh Metal',
  description: () => {
    if (event.value) {
      // Essayer d'extraire la description du contenu
      const eventDesc = event.value.description ? extractEventDescription(event.value.description) : '';
      if (eventDesc) {
        return eventDesc;
      }
      
      // Générer une description basée sur les informations disponibles
      const date = formattedEventDate.value;
      const venue = event.value.venue?.venueDetails?.name || event.value.venue?.venueText || '';
      const city = event.value.venue?.venueDetails?.city || '';
      const festival = event.value.festival?.name || '';
      const eventType = event.value.eventType || 'événement';
      
      let description = `${event.value.title} - ${eventType}`;
      if (date !== 'Date non définie') description += ` le ${date}`;
      if (venue) description += ` à ${venue}`;
      if (city && venue !== city) description += ` (${city})`;
      if (festival) description += ` - ${festival}`;
      
      return `${description}. Découvrez les détails sur Breizh Metal.`;
    }
    return 'Découvrez cet événement metal sur Breizh Metal';
  },
  ogTitle: () => event.value?.title || 'Événement - Breizh Metal',
  ogDescription: () => {
    if (event.value) {
      const eventDesc = event.value.description ? extractEventDescription(event.value.description) : '';
      if (eventDesc) return eventDesc;
      
      const date = formattedEventDate.value;
      const venue = event.value.venue?.venueDetails?.name || event.value.venue?.venueText || '';
      return `${event.value.title} - ${date !== 'Date non définie' ? date : 'Événement metal'} ${venue ? `à ${venue}` : ''}`;
    }
    return 'Événement metal sur Breizh Metal';
  },
  ogImage: () => {
    if (event.value?.poster?.asset?._ref) {
      return event.value.poster.asset._ref;
    }
    if (event.value?.festival?.mainImage?.asset?._ref) {
      return event.value.festival.mainImage.asset._ref;
    }
    return 'https://breizhmetal.bzh/BM-logo-large.png';
  },
  ogUrl: () => `https://breizhmetal.bzh/evenements/${route.params.slug}`,
  twitterCard: 'summary_large_image'
});
</script>

<template>
  <div v-if="pending" class="text-center p-16">
    <p class="text-xl">Chargement de l'événement...</p>
  </div>
  
  <article v-else-if="event" class="event-page">
    <!-- 1. HEADER DE L'ÉVÉNEMENT -->
    <header class="relative bg-stone-800 text-white py-20 md:py-32">
      <div class="container mx-auto px-4 relative text-center">
        <span v-if="event.eventType" class="text-yellow-400 font-semibold uppercase tracking-widest text-sm">{{ event.eventType }}</span>
        <h1 class="text-4xl md:text-6xl font-extrabold mt-2">{{ event.title }}</h1>
      </div>
    </header>

    <!-- 2. AFFICHE EN VEDETTE (si elle existe) -->
    <div v-if="event.poster" class="container mx-auto px-4 mt-8 md:mt-12">
      <div class="max-w-2xl mx-auto">
        <NuxtImg
          :src="event.poster.asset._ref"
          provider="sanity"
          class="w-full rounded-lg shadow-2xl"
          :alt="`Affiche de ${event.title}`"
        />
      </div>
    </div>

    <!-- 3. DESCRIPTION DE L'ÉVÉNEMENT (si elle existe) -->
    <div v-if="event.description" class="container mx-auto px-4 mt-8 md:mt-12">
      <div class="max-w-4xl mx-auto">
        <div class="bg-white p-6 md:p-8 rounded-lg shadow-lg">
          <h2 class="text-2xl font-bold mb-6 border-b pb-3">À propos de cet événement</h2>
          <div class="prose prose-lg max-w-none">
            <CustomSanityContent :blocks="event.description" />
          </div>
        </div>
      </div>
    </div>

    <!-- 4. INFORMATIONS PRATIQUES (pleine largeur pour permettre 2 colonnes) -->
    <div class="container mx-auto px-4 mt-8 md:mt-12">
      <div class="bg-gray-50 p-6 rounded-lg shadow-lg">
        <h3 class="text-xl font-bold mb-4 border-b pb-3">Informations Pratiques</h3>
        
        <div class="flex flex-col md:flex-row md:gap-8">
          <!-- Colonne gauche : infos textuelles -->
          <div class="flex-1">
            <!-- Date de l'événement -->
            <div class="mb-6">
              <div class="flex items-start gap-3">
                <Icon name="heroicons:calendar-days" class="h-6 w-6 text-gray-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 class="font-semibold text-gray-700 mb-1">Date</h4>
                  <p class="text-lg text-black">{{ formattedEventDate }}</p>
                </div>
              </div>
            </div>

            <!-- Lieu de l'événement -->
            <div class="mb-6">
              <div class="flex items-start gap-3">
                <Icon name="heroicons:map-pin" class="h-6 w-6 text-gray-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 class="font-semibold text-gray-700 mb-1">Lieu</h4>
                  <!-- Cas 1 : Lieu référencé -->
                  <NuxtLink 
                    v-if="event.venue?.venueType === 'reference' && event.venue.venueDetails" 
                    :to="`/salles/${event.venue.venueDetails.slug}`" 
                    class="block group"
                  >
                    <p class="text-lg text-black group-hover:text-yellow-600 transition-colors">{{ event.venue.venueDetails.name }}</p>
                    <p class="text-sm text-gray-500">{{ event.venue.venueDetails.city }}</p>
                  </NuxtLink>
                  <!-- Cas 2 : Lieu en texte simple -->
                  <p v-else-if="event.venue?.venueType === 'text'" class="text-lg text-black">
                    {{ event.venue.venueText }}
                  </p>
                </div>
              </div>
            </div>
            
            <!-- Billetterie -->
            <div v-if="event.ticketUrl">
              <a 
                :href="event.ticketUrl" 
                target="_blank" 
                rel="noopener noreferrer" 
                class="inline-flex items-center justify-center gap-2 px-6 py-3 bg-yellow-600 text-white font-semibold rounded-lg hover:bg-yellow-700 transition-colors shadow-lg"
              >
                <Icon name="heroicons:ticket" class="h-5 w-5" />
                Billetterie
              </a>
            </div>
          </div>

          <!-- Colonne droite : carte Google Maps -->
          <div v-if="mapEmbedUrl" class="flex-1 mt-6 md:mt-0">
            <h4 class="font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Icon name="heroicons:map" class="h-5 w-5 text-gray-400" />
              Localisation
            </h4>
            <iframe
              :src="mapEmbedUrl"
              width="100%"
              height="280"
              style="border:0; border-radius: 8px;"
              allowfullscreen
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </div>

    <!-- 5. CORPS DE LA PAGE (Layout à 2 colonnes) -->
    <div class="container mx-auto px-4 mt-8 md:mt-12">
      <div class="flex flex-col lg:flex-row gap-8 lg:gap-12">
        
        <!-- Colonne Principale (Line-up) -->
        <div class="w-full lg:w-2/3">
          
          <!-- Nouveau Line-up en texte riche -->
          <div v-if="event.lineupText" class="bg-white p-6 rounded-lg shadow-lg mt-6">
            <h2 class="text-2xl font-bold mb-6 border-b pb-3">Line-up</h2>
            <div class="prose prose-lg max-w-none">
              <CustomSanityContent :blocks="event.lineupText" />
            </div>
          </div>
        </div>
        
        <!-- Colonne Latérale -->
        <aside class="w-full lg:w-1/3 lg:sticky lg:top-28 self-start">
          <div class="space-y-16">

            <!-- Section Festival -->
            <div v-if="event.festival" class="">
              <h3 class="text-xl font-bold mb-4 pb-3">Fiche de présentation du festival</h3>
              <div class="flex">
                <div class="w-full max-w-[300px]">
                  <FestivalCard :festival="event.festival" />
                </div>
              </div>
            </div>

            <!-- Section Lieu -->
            <div v-if="event.venue?.venueType === 'reference' && event.venue.venueDetails" class="">
              <h3 class="text-xl font-bold mb-4 pb-3">Le lieu</h3>
              <div class="flex">
                <div class="w-full max-w-[300px]">
                  <VenueCard :venue="event.venue.venueDetails" />
                </div>
              </div>
            </div>

            <!-- Section Groupes Référencés -->
            <div v-if="event.referencedBands && event.referencedBands.length > 0" class="">
              <h3 class="text-xl font-bold mb-4 pb-3">Groupes à l'affiche</h3>
              <div class="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                <div v-for="band in event.referencedBands" :key="band._id">
                  <BandCard :band="band" />
                </div>
              </div>
            </div>
          </div>

      <!-- Navigation entre événements -->
      <div v-if="navigation?.previous || navigation?.next" class="mt-12 py-8 border-t border-gray-200">
        <div class="grid grid-cols-2 w-full border border-gray-300 rounded-lg overflow-hidden shadow-sm">
          <!-- Moitié gauche : Événement précédent -->
          <NuxtLink 
            v-if="navigation.previous" 
            :to="`/evenements/${navigation.previous.slug}`"
            class="flex flex-col items-center justify-center p-6 bg-white hover:bg-gray-50 transition-colors border-r border-gray-300 text-center group"
          >
            <div class="flex items-center mb-2">
              <Icon name="heroicons:chevron-left" class="h-5 w-5 text-gray-400 mr-2 group-hover:text-yellow-600 transition-colors" />
              <span class="text-gray-500 text-sm font-medium uppercase tracking-wider">Événement précédent</span>
            </div>
            <span class="text-gray-900 font-bold text-lg px-2">{{ navigation.previous.title }}</span>
          </NuxtLink>
          <div v-else class="flex flex-col items-center justify-center p-6 bg-gray-50 border-r border-gray-300 text-center">
            <span class="text-gray-400 font-medium">Pas d'événement précédent</span>
          </div>
          
          <!-- Moitié droite : Événement suivant -->
          <NuxtLink 
            v-if="navigation.next" 
            :to="`/evenements/${navigation.next.slug}`"
            class="flex flex-col items-center justify-center p-6 bg-white hover:bg-gray-50 transition-colors text-center group"
          >
            <div class="flex items-center mb-2">
              <span class="text-gray-500 text-sm font-medium uppercase tracking-wider">Événement suivant</span>
              <Icon name="heroicons:chevron-right" class="h-5 w-5 text-gray-400 ml-2 group-hover:text-yellow-600 transition-colors" />
            </div>
            <span class="text-gray-900 font-bold text-lg px-2">{{ navigation.next.title }}</span>
          </NuxtLink>
          <div v-else class="flex flex-col items-center justify-center p-6 bg-gray-50 text-center">
            <span class="text-gray-400 font-medium">Pas d'événement suivant</span>
          </div>
        </div>
      </div>
        </aside>

      </div>
    </div>
  </article>

  <div v-else-if="error" class="text-center p-16">
    <p class="text-red-500">Une erreur est survenue lors du chargement de l'événement.</p>
  </div>

  <div v-else class="text-center p-16">
    <p>Événement non trouvé.</p>
  </div>
</template>