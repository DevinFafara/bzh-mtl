<script setup lang="ts">
// On définit que ce composant attend une "prop" appelée "event"
defineProps({
  event: {
    type: Object,
    required: true
  }
});

// Fonction pour formater la date en français (nouvelle structure)
const formatDate = (event: any) => {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
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

// Fonction pour formater le lieu d'un événement
const formatVenue = (venue: any) => {
  if (!venue) return '';
  
  if (venue.venueType === 'reference' && venue.venueDetails) {
    return `${venue.venueDetails.name}, ${venue.venueDetails.city}`;
  } else if (venue.venueType === 'text' && venue.venueText) {
    return venue.venueText;
  }
  
  return '';
};
</script>

<template>
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
      <span 
        v-if="event.eventType"
        class="inline-block bg-gray-200 text-center text-gray-800 px-3 py-1 rounded-full text-sm font-medium"
      >
        {{ event.eventType }}
      </span>
      <span v-if="event.venue" class="text-sm text-gray-600 flex items-center">
        <svg class="h-4 w-4 inline mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
        </svg>
        {{ formatVenue(event.venue) }}
      </span>
    </div>
  </NuxtLink>
</template>
