<script setup lang="ts">
// On récupère la route actuelle pour avoir accès au paramètre 'slug' de l'URL
const route = useRoute();

// Requête pour UN seul festival
const query = groq`*[_type == "festival" && slug.current == $slug][0] {
  _id,
  name,
  description,
  logo,
  mainImage,
  location,
  foundedYear,
  "musicalStyles": musicalStyles[]->{ title, "slug": slug.current },
  capacity,
  duration,
  website,
  socialMedia,
  status,
  ticketInfo,
  campingInfo,
  accessibility,
  "author": author->{ name, "slug": slug.current, image, citation }
}`;

interface Festival {
  _id: string;
  name: string;
  description?: any; // blockContent
  logo?: { asset: { _ref: string } };
  mainImage?: { asset: { _ref: string } };
  location?: {
    city: string;
    department?: string;
    region?: string;
    venue?: string;
    coordinates?: { lat: number; lng: number };
  };
  foundedYear?: number;
  musicalStyles?: Array<{ title: string; slug: string }>;
  capacity?: number;
  duration?: {
    days: number;
    period: string;
  };
  website?: string;
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
  };
  ticketInfo?: {
    ticketPrice?: string;
    ticketWebsite?: string;
    ticketInfo?: string;
  };
  campingInfo?: {
    hasCamping: boolean;
    campingDetails?: string;
  };
  accessibility?: {
    pmrAccess: boolean;
    accessibilityDetails?: string;
  };
  author?: {
    name: string;
    slug: string;
    image?: { asset: { _ref: string } };
    citation?: string;
  };
}

// On passe le slug de l'URL en paramètre à la requête
const { data: festival, pending } = await useSanityQuery<Festival>(query, { slug: route.params.slug });

// Requête pour récupérer les événements qui référencent ce festival
const eventsQuery = groq`*[_type == "event" && festival._ref == $festivalId] | order(dateInfo.singleDate desc, dateInfo.startDate desc) {
  _id,
  title,
  "slug": slug.current,
  dateInfo,
  poster,
  "eventType": eventType->title
}`;

interface FestivalEvent {
  _id: string;
  title: string;
  slug: string;
  dateInfo?: {
    eventDuration: 'single' | 'multiple';
    singleDate?: string;
    startDate?: string;
    endDate?: string;
  };
  poster?: { asset: { _ref: string } };
  eventType?: string;
}

// Récupération des événements liés (seulement si on a le festival)
const { data: festivalEvents } = await useSanityQuery<FestivalEvent[]>(
  eventsQuery, 
  { festivalId: festival.value?._id || '' }
);

// Configuration SEO dynamique
useSeoMeta({
  title: () => festival.value ? `${festival.value.name} - Festivals - Breizh Metal Magazine` : 'Festival - Breizh Metal Magazine',
  description: () => festival.value?.description || 'Découvrez ce festival de metal'
});

// Fonctions utilitaires
const formatLocation = computed(() => {
  if (!festival.value?.location) return '';
  
  const parts = [festival.value.location.city];
  if (festival.value.location.department) parts.push(festival.value.location.department);
  if (festival.value.location.region) parts.push(festival.value.location.region);
  
  return parts.join(', ');
});

const formatDuration = computed(() => {
  if (!festival.value?.duration) return '';
  
  const { days, period } = festival.value.duration;
  let text = `${days} jour${days > 1 ? 's' : ''}`;
  if (period) text += ` en ${period}`;
  
  return text;
});

// Fonction pour formater les dates des événements
const formatEventDate = (event: FestivalEvent) => {
  if (!event.dateInfo) return 'Date non définie';
  
  if (event.dateInfo.eventDuration === 'single' && event.dateInfo.singleDate) {
    return new Date(event.dateInfo.singleDate).toLocaleDateString('fr-FR', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  } else if (event.dateInfo.eventDuration === 'multiple' && event.dateInfo.startDate && event.dateInfo.endDate) {
    const startDate = new Date(event.dateInfo.startDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
    const endDate = new Date(event.dateInfo.endDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
    return `${startDate} - ${endDate}`;
  }
  
  return 'Date non définie';
};
</script>

<template>
  <div v-if="pending">
    <div class="text-center p-16">Chargement du festival...</div>
  </div>
  
  <article v-else-if="festival" class="festival-page">
    <!-- Header du festival -->
    <header class="relative bg-stone-800 text-white py-20 md:py-32">
      <!-- Image de fond si disponible -->
      <div v-if="festival.mainImage" class="absolute inset-0">
        <NuxtImg 
          :src="festival.mainImage.asset._ref" 
          provider="sanity" 
          class="w-full h-full object-cover opacity-30"
          :alt="`Image de ${festival.name}`"
        />
        <div class="absolute inset-0 bg-black/50"></div>
      </div>
      
      <!-- Contenu du header -->
      <div class="container mx-auto px-4 relative text-center">
        <h1 class="text-4xl md:text-6xl font-extrabold mb-4">{{ festival.name }}</h1>
        
        <div class="flex flex-wrap justify-center gap-6 text-lg text-gray-300">
          <div v-if="formatLocation" class="flex items-center">
            <Icon name="heroicons:map-pin" class="h-5 w-5 mr-2" />
            <span>{{ formatLocation }}</span>
          </div>
          
          <div v-if="formatDuration" class="flex items-center">
            <Icon name="heroicons:calendar-days" class="h-5 w-5 mr-2" />
            <span>{{ formatDuration }}</span>
          </div>
          
          <div v-if="festival.foundedYear" class="flex items-center">
            <Icon name="heroicons:clock" class="h-5 w-5 mr-2" />
            <span>Depuis {{ festival.foundedYear }}</span>
          </div>
          
          <div v-if="festival.capacity" class="flex items-center">
            <Icon name="heroicons:users" class="h-5 w-5 mr-2" />
            <span>{{ festival.capacity.toLocaleString() }} personnes</span>
          </div>
        </div>
      </div>
    </header>

    <!-- Contenu principal -->
    <div class="container mx-auto px-4 mt-8 md:mt-12">
      <div class="flex flex-col lg:flex-row gap-8 lg:gap-12">
        
        <!-- Colonne principale -->
        <div class="w-full lg:w-2/3">
          <!-- Styles musicaux -->
          <div v-if="festival.musicalStyles && festival.musicalStyles.length > 0" class="mb-8">
            <h2 class="text-2xl font-bold mb-4">Styles musicaux</h2>
            <div class="flex flex-wrap gap-2">
              <span 
                v-for="style in festival.musicalStyles" 
                :key="style.slug" 
                class="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm"
              >
                {{ style.title }}
              </span>
            </div>
          </div>

          <!-- Description -->
          <div v-if="festival.description" class="mb-8">
            <h2 class="text-2xl font-bold mb-4">À propos du festival</h2>
            <div class="prose prose-lg max-w-none text-justify">
              <CustomSanityContent :blocks="festival.description" />
            </div>
          </div>

          <!-- Éditions du festival -->
          <div v-if="festivalEvents && festivalEvents.length > 0" class="mb-8">
            <h2 class="text-2xl font-bold mb-4">Éditions</h2>
            <div class="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
              <NuxtLink
                v-for="event in festivalEvents"
                :key="event._id"
                :to="`/evenements/${event.slug}`"
                class="group block bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200"
              >
                <!-- Image/Affiche avec ratio fixe -->
                <div class="relative w-full h-48 bg-gray-100 overflow-hidden">
                  <NuxtImg
                    v-if="event.poster"
                    :src="event.poster.asset._ref"
                    provider="sanity"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    :alt="`Affiche de ${event.title}`"
                  />
                  <div v-else class="w-full h-full flex items-center justify-center bg-gray-200">
                    <Icon name="heroicons:calendar-days" class="w-12 h-12 text-gray-400" />
                  </div>
                </div>

                <!-- Informations -->
                <div class="p-4">
                  <h3 class="font-bold text-lg group-hover:text-yellow-600 transition-colors mb-2">
                    {{ event.title }}
                  </h3>
                  
                  <div class="text-sm text-gray-600 space-y-1">
                    <div class="flex items-center">
                      <Icon name="heroicons:calendar" class="h-4 w-4 mr-2" />
                      <span>{{ formatEventDate(event) }}</span>
                    </div>
                    
                    <div v-if="event.eventType" class="flex items-center">
                      <Icon name="heroicons:tag" class="h-4 w-4 mr-2" />
                      <span>{{ event.eventType }}</span>
                    </div>
                  </div>
                </div>
              </NuxtLink>
            </div>
          </div>

          <!-- Informations pratiques (seulement si il y a du contenu) -->
          <div v-if="festival.campingInfo?.hasCamping || festival.accessibility?.pmrAccess" class="mb-8">
            <h2 class="text-2xl font-bold mb-4">Informations pratiques</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <!-- Camping -->
              <div v-if="festival.campingInfo?.hasCamping" class="bg-gray-50 p-4 rounded-lg">
                <h3 class="font-semibold mb-2 flex items-center">
                  <Icon name="heroicons:home" class="h-5 w-5 mr-2" />
                  Camping disponible
                </h3>
                <p v-if="festival.campingInfo.campingDetails" class="text-sm text-gray-600">
                  {{ festival.campingInfo.campingDetails }}
                </p>
              </div>

              <!-- Accessibilité -->
              <div v-if="festival.accessibility?.pmrAccess" class="bg-gray-50 p-4 rounded-lg">
                <h3 class="font-semibold mb-2 flex items-center">
                  <Icon name="heroicons:heart" class="h-5 w-5 mr-2" />
                  Accessible PMR
                </h3>
                <p v-if="festival.accessibility.accessibilityDetails" class="text-sm text-gray-600">
                  {{ festival.accessibility.accessibilityDetails }}
                </p>
              </div>

            </div>
          </div>
        </div>
        
        <!-- Colonne latérale -->
        <aside class="w-full lg:w-1/3 lg:sticky lg:top-28 self-start">
          <div class="bg-gray-50 p-6 rounded-lg space-y-6">
            
            <!-- Logo -->
            <div v-if="festival.logo" class="text-center">
              <NuxtImg
                :src="festival.logo.asset._ref"
                provider="sanity"
                class="max-w-full h-24 object-contain mx-auto"
                :alt="`Logo de ${festival.name}`"
              />
            </div>

            <!-- Site web -->
            <div v-if="festival.website">
              <h4 class="font-semibold text-gray-700 mb-2">Site officiel</h4>
              <a 
                :href="festival.website" 
                target="_blank" 
                rel="noopener noreferrer"
                class="inline-flex items-center text-yellow-600 hover:text-yellow-700"
              >
                Visiter le site
                <Icon name="heroicons:arrow-top-right-on-square" class="h-4 w-4 ml-1" />
              </a>
            </div>

            <!-- Réseaux sociaux -->
            <div v-if="festival.socialMedia" class="space-y-2">
              <h4 class="font-semibold text-gray-700">Réseaux sociaux</h4>
              <div class="flex gap-3">
                <a v-if="festival.socialMedia.facebook" :href="festival.socialMedia.facebook" target="_blank" rel="noopener noreferrer" class="text-gray-600 hover:text-blue-600">
                  <Icon name="simple-icons:facebook" class="h-6 w-6" />
                </a>
                <a v-if="festival.socialMedia.instagram" :href="festival.socialMedia.instagram" target="_blank" rel="noopener noreferrer" class="text-gray-600 hover:text-pink-600">
                  <Icon name="simple-icons:instagram" class="h-6 w-6" />
                </a>
                <a v-if="festival.socialMedia.twitter" :href="festival.socialMedia.twitter" target="_blank" rel="noopener noreferrer" class="text-gray-600 hover:text-blue-400">
                  <Icon name="simple-icons:twitter" class="h-6 w-6" />
                </a>
                <a v-if="festival.socialMedia.youtube" :href="festival.socialMedia.youtube" target="_blank" rel="noopener noreferrer" class="text-gray-600 hover:text-red-600">
                  <Icon name="simple-icons:youtube" class="h-6 w-6" />
                </a>
              </div>
            </div>

            <!-- Billetterie -->
            <div v-if="festival.ticketInfo">
              <h4 class="font-semibold text-gray-700 mb-2">Billetterie</h4>
              <div class="space-y-2">
                <p v-if="festival.ticketInfo.ticketPrice" class="text-sm text-gray-600">
                  <strong>Prix :</strong> {{ festival.ticketInfo.ticketPrice }}
                </p>
                <a 
                  v-if="festival.ticketInfo.ticketWebsite" 
                  :href="festival.ticketInfo.ticketWebsite" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  class="inline-flex items-center text-yellow-600 hover:text-yellow-700 text-sm"
                >
                  Acheter des billets
                  <Icon name="heroicons:arrow-top-right-on-square" class="h-4 w-4 ml-1" />
                </a>
                <p v-if="festival.ticketInfo.ticketInfo" class="text-sm text-gray-600">
                  {{ festival.ticketInfo.ticketInfo }}
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <!-- Auteur en fin de page -->
      <div class="mt-12">
        <AuthorSection :author="festival.author" />
      </div>
    </div>
  </article>

  <div v-else class="text-center p-16">
    <p>Festival non trouvé.</p>
  </div>
</template>
