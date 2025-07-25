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
  venue?: {
    venueType: string;
    venueText?: string;
    venueDetails?: {
      _id: string;
      name: string;
      city: string;
      slug: string;
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
  // On récupère l'objet venue en entier
  venue {
    venueType,
    venueText,
    "venueDetails": venueReference->{
      _id,
      name,
      city,
      "slug": slug.current
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
  }
}`;

// On exécute la requête
const { data: event, pending, error } = await useSanityQuery<Event>(query, { slug: route.params.slug });

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

    <!-- 4. CORPS DE LA PAGE (Layout à 2 colonnes) -->
    <div class="container mx-auto px-4 mt-8 md:mt-12">
      <div class="flex flex-col lg:flex-row gap-8 lg:gap-12">
        
        <!-- Colonne Principale (Line-up) -->
        <div class="w-full lg:w-2/3">
          <!-- Line-up -->
          <div v-if="event.lineup && event.lineup.length > 0" class="bg-white p-6 rounded-lg shadow-lg">
            <h2 class="text-2xl font-bold mb-6 border-b pb-3">Line-up</h2>
            <div class="space-y-4">
              <div v-for="band in event.lineup" :key="band._key" class="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div class="w-2 h-2 bg-yellow-500 rounded-full flex-shrink-0"></div>
                <div class="flex-1">
                  <!-- Nouveau format : groupe référencé -->
                  <template v-if="band._type === 'referencedBand' && band.band">
                    <NuxtLink 
                      :to="`/groupes/${band.band.slug}`" 
                      class="text-xl font-semibold text-gray-900 hover:text-yellow-600 transition-colors"
                    >
                      {{ band.band.name }}
                    </NuxtLink>
                    <div v-if="band.performanceDay || band.performanceTime" class="text-sm text-gray-600 mt-1">
                      <span v-if="band.performanceDay">{{ new Date(band.performanceDay).toLocaleDateString('fr-FR') }}</span>
                      <span v-if="band.performanceTime" class="ml-2">{{ band.performanceTime }}</span>
                    </div>
                  </template>
                  
                  <!-- Nouveau format : groupe externe -->
                  <template v-else-if="band._type === 'externalBand'">
                    <span class="text-xl font-semibold text-gray-900">{{ band.name }}</span>
                    <div v-if="band.performanceDay || band.performanceTime" class="text-sm text-gray-600 mt-1">
                      <span v-if="band.performanceDay">{{ new Date(band.performanceDay).toLocaleDateString('fr-FR') }}</span>
                      <span v-if="band.performanceTime" class="ml-2">{{ band.performanceTime }}</span>
                    </div>
                  </template>
                  
                  <!-- Ancien format : rétrocompatibilité -->
                  <template v-else>
                    <NuxtLink 
                      v-if="band.isReference && band.slug" 
                      :to="`/groupes/${band.slug}`" 
                      class="text-xl font-semibold text-gray-900 hover:text-yellow-600 transition-colors"
                    >
                      {{ band.name }}
                    </NuxtLink>
                    <span v-else class="text-xl font-semibold text-gray-900">
                      {{ band.name }}
                    </span>
                  </template>
                </div>
                <Icon 
                  v-if="(band._type === 'referencedBand' && band.band) || (band.isReference && band.slug)" 
                  name="heroicons:arrow-top-right-on-square" 
                  class="h-5 w-5 text-gray-400" 
                />
              </div>
            </div>
          </div>
        </div>
        
        <!-- Colonne Latérale (Infos pratiques) -->
        <aside class="w-full lg:w-1/3 lg:sticky lg:top-28 self-start">
          <div class="bg-gray-50 p-6 rounded-lg shadow-lg">
            <h3 class="text-xl font-bold mb-4 border-b pb-3">Informations Pratiques</h3>
            
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
            <div v-if="event.ticketUrl" class="mb-6">
              <a 
                :href="event.ticketUrl" 
                target="_blank" 
                rel="noopener noreferrer" 
                class="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-yellow-600 text-white font-semibold rounded-lg hover:bg-yellow-700 transition-colors shadow-lg"
              >
                <Icon name="heroicons:ticket" class="h-5 w-5" />
                Billetterie
              </a>
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