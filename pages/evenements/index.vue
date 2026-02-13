<script setup lang="ts">
// Configuration SEO pour la page des événements
useSeoMeta({
  title: 'Événements - Breizh Metal',
  description: 'Découvrez tous les événements metal en Bretagne : concerts, festivals, soirées et spectacles. Agenda de la scène metal bretonne.',
  ogTitle: 'Événements Metal - Breizh Metal',
  ogDescription: 'Agenda des événements metal en Bretagne. Concerts, festivals et soirées metal.',
  ogImage: 'https://breizhmetal.bzh/BM-logo-large.png',
  ogUrl: 'https://breizhmetal.bzh/evenements',
  twitterCard: 'summary_large_image'
})

// Date du jour au format YYYY-MM-DD pour comparaison (les événements du jour restent affichés)
const today = new Date().toISOString().split('T')[0];

// On définit la requête GROQ pour récupérer les événements futurs.
const query = groq`
  *[_type == "event" && (
    (dateInfo.eventDuration == "single" && dateInfo.singleDate >= $today) ||
    (dateInfo.eventDuration == "multiple" && dateInfo.endDate >= $today) ||
    date >= $today
  )] | order(
    coalesce(dateInfo.singleDate, dateInfo.startDate, date) asc
  ) {
    _id,
    title,
    date, // Pour rétrocompatibilité
    dateInfo,
    "slug": slug.current,
    "eventType": eventType->title,
    venue {
      venueType,
      venueText,
      "venueDetails": venueReference->{
        name,
        city
      }
    }
  }
`;

// On exécute la requête avec useSanityQuery.
type Event = {
  _id: string;
  title: string;
  date?: string; // Pour rétrocompatibilité
  dateInfo?: {
    eventDuration: 'single' | 'multiple';
    singleDate?: string;
    startDate?: string;
    endDate?: string;
  };
  slug: string;
  eventType: string;
  venue?: {
    venueType: string;
    venueText?: string;
    venueDetails?: {
      name: string;
      city: string;
    };
  };
};
const { data: events, error } = await useSanityQuery<Event[]>(query, { today });

// Configuration du filtrage par département
const departmentFilters = [
  { label: 'Tous', value: 'all', locationLabel: 'en Bretagne' },
  { label: 'Côtes-d\'Armor (22)', value: '22', locationLabel: 'en Côtes-d\'Armor' },
  { label: 'Finistère (29)', value: '29', locationLabel: 'dans le Finistère' },
  { label: 'Ille-et-Vilaine (35)', value: '35', locationLabel: 'en Ille-et-Vilaine' },
  { label: 'Loire-Atlantique (44)', value: '44', locationLabel: 'en Loire-Atlantique' },
  { label: 'Morbihan (56)', value: '56', locationLabel: 'dans le Morbihan' },
];

const currentDepartment = ref('all');

// Extraire le code département depuis le titre de l'événement (ex: "Mass Hysteria à Rennes (35)")
const extractDepartment = (title: string): string | null => {
  const match = title.match(/\((22|29|35|44|56)\)/);
  return match ? match[1] : null;
};

// Libellé de localisation dynamique
const locationLabel = computed(() => {
  const filter = departmentFilters.find(f => f.value === currentDepartment.value);
  return filter?.locationLabel ?? 'en Bretagne';
});

// Filtrer les événements par département
const filteredEvents = computed(() => {
  if (!events.value) return [];
  if (currentDepartment.value === 'all') return events.value;
  return events.value.filter(e => extractDepartment(e.title) === currentDepartment.value);
});

// Fonction pour formater la date en français (nouvelle structure)
const formatDate = (event: Event) => {
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

// Fonction pour grouper les événements par mois
const groupEventsByMonth = (events: Event[]) => {
  const grouped: { [key: string]: Event[] } = {};
  
  events.forEach(event => {
    let eventDate: Date;
    
    // Déterminer la date de l'événement
    if (event.dateInfo?.eventDuration === 'single' && event.dateInfo?.singleDate) {
      eventDate = new Date(event.dateInfo.singleDate);
    } else if (event.dateInfo?.eventDuration === 'multiple' && event.dateInfo?.startDate) {
      eventDate = new Date(event.dateInfo.startDate);
    } else if (event.date) {
      eventDate = new Date(event.date);
    } else {
      eventDate = new Date(); // Fallback
    }
    
    // Créer la clé du mois (format: "2024-12" pour décembre 2024)
    const monthKey = `${eventDate.getFullYear()}-${String(eventDate.getMonth() + 1).padStart(2, '0')}`;
    
    if (!grouped[monthKey]) {
      grouped[monthKey] = [];
    }
    
    grouped[monthKey].push(event);
  });
  
  return grouped;
};

// Fonction pour formater le nom du mois et année
const formatMonthYear = (monthKey: string) => {
  const [year, month] = monthKey.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1, 1);
  
  return date.toLocaleDateString('fr-FR', {
    month: 'long',
    year: 'numeric'
  });
};

// Grouper les événements filtrés par mois
const eventsByMonth = computed(() => {
  if (!filteredEvents.value) return {};
  return groupEventsByMonth(filteredEvents.value);
});

// Obtenir les mois dans l'ordre chronologique
const sortedMonths = computed(() => {
  return Object.keys(eventsByMonth.value).sort();
});
</script>

<template>
  <div class="container mx-auto p-4 md:p-8">
    <h1 class="text-2xl md:text-4xl font-extrabold border-b pb-4">Agenda</h1>
    <p v-if="filteredEvents && filteredEvents.length > 0" class="mt-2 mb-4 text-gray-500">
      {{ filteredEvents.length }} événement{{ filteredEvents.length > 1 ? 's' : '' }} à venir {{ locationLabel }}
    </p>
    <div v-else class="mb-4"></div>

    <!-- Filtres par département -->
    <div v-if="events && events.length > 0" class="flex flex-wrap gap-2 mb-8">
      <button
        v-for="filter in departmentFilters"
        :key="filter.value"
        @click="currentDepartment = filter.value"
        :class="[
          'px-3 py-1.5 rounded-full text-sm font-medium transition-colors duration-200 cursor-pointer',
          currentDepartment === filter.value
            ? 'bg-yellow-500 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        ]"
      >
        {{ filter.label }}
      </button>
    </div>

    <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
      <strong class="font-bold">Erreur !</strong>
      <span class="block sm:inline"> Impossible de charger les événements.</span>
    </div>

    <!-- STRUCTURE GROUPÉE PAR MOIS -->
    <div v-else-if="filteredEvents && filteredEvents.length > 0" class="space-y-8 mb-20">
      <!-- Boucle sur chaque mois -->
      <section v-for="monthKey in sortedMonths" :key="monthKey" class="space-y-4">
        <!-- Séparateur avec titre du mois intégré -->
        <div class="relative flex items-center justify-center my-8">
          <div class="flex-grow border-t border-gray-300"></div>
          <span class="px-4 py-2 bg-white text-lg font-semibold text-gray-700 uppercase tracking-wider">
            {{ formatMonthYear(monthKey) }}
          </span>
          <div class="flex-grow border-t border-gray-300"></div>
        </div>
        
        <!-- Liste des événements du mois -->
        <ul class="space-y-2">
          <li v-for="event in eventsByMonth[monthKey]" :key="event._id">
            <NuxtLink
              :to="`/evenements/${event.slug}`"
              class="flex flex-col sm:flex-row sm:items-center gap-x-6 gap-y-1 p-4 bg-white border border-transparent rounded-lg hover:bg-yellow-50 hover:border-yellow-400 transition-all duration-200"
            >
              <span class="text-sm font-semibold text-yellow-600 uppercase tracking-wider">
                {{ formatDate(event) }}
              </span>
              <span class="text-xl font-bold text-gray-900">
                {{ event.title }}
              </span>
              <div class="flex flex-wrap gap-2 items-center">
                <span class="inline-block bg-gray-200 text-center text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
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
      </section>
    </div>

    <div v-else-if="currentDepartment !== 'all'" class="text-center py-16">
      <p class="text-xl text-gray-500">Aucun événement à venir dans ce département.</p>
      <button @click="currentDepartment = 'all'" class="mt-4 text-yellow-600 hover:text-yellow-700 font-medium cursor-pointer">
        ← Voir tous les événements
      </button>
    </div>
    <div v-else class="text-center py-16">
      <p class="text-xl text-gray-500">Aucun événement à venir pour le moment.</p>
      <p class="mt-2 text-gray-400">Revenez bientôt !</p>
    </div>
  </div>
</template>