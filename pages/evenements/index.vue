<script setup lang="ts">
// On définit la requête GROQ pour récupérer les événements futurs.
const query = groq`
  *[_type == "event" && date > now()] | order(date asc) {
    _id,
    title,
    date,
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
  date: string;
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
const { data: events, error } = await useSanityQuery<Event[]>(query);

// Fonction pour formater la date en français (ex: "samedi 25 décembre 2025")
// C'est une bonne pratique de mettre ceci dans un composable si vous le réutilisez.
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long', // 'samedi'
    year: 'numeric', // '2025'
    month: 'long',   // 'décembre'
    day: 'numeric',    // '25'
  };
  return new Date(dateString).toLocaleDateString('fr-FR', options);
};
</script>

<template>
  <div class="container mx-auto p-4 md:p-8">
    <h1 class="text-2xl md:text-4xl font-extrabold mb-8 border-b pb-4">Agenda</h1>

    <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
      <strong class="font-bold">Erreur !</strong>
      <span class="block sm:inline"> Impossible de charger les événements.</span>
    </div>

    <!-- NOUVELLE STRUCTURE DE LA LISTE -->
    <ul v-else-if="events && events.length > 0" class="space-y-2 mb-20">
      <!-- On fait une boucle sur chaque événement récupéré -->
      <li v-for="event in events" :key="event._id">
        <NuxtLink
          :to="`/evenements/${event.slug}`"
          class="flex flex-col sm:flex-row sm:items-center gap-x-6 gap-y-1 p-4 bg-white border border-transparent rounded-lg hover:bg-yellow-50 hover:border-yellow-400 transition-all duration-200"
        >
            <span class="text-sm font-semibold text-yellow-600 uppercase tracking-wider">
              {{ formatDate(event.date) }}
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

    <div v-else class="text-center py-16">
      <p class="text-xl text-gray-500">Aucun événement à venir pour le moment.</p>
      <p class="mt-2 text-gray-400">Revenez bientôt !</p>
    </div>
  </div>
</template>