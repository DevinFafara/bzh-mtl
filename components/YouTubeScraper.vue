<script setup lang="ts">
interface YouTubeVideo {
  id: string
  title: string
  thumbnail: string
  channelTitle: string
  duration?: string
  viewCount?: string
}

interface Props {
  bandName: string
}

const props = defineProps<Props>()

// URLs d'API à tester en cascade
const apiEndpoints = [
  '/api/youtube-scraper',  // API route Nuxt originale (fonctionne en local)
  '/api/youtube-scraper-server',  // Nouvelle API route côté serveur (fonctionne en local)
  '/api/test',  // Test simple pour voir si les redirections fonctionnent
  '/api/youtube-netlify',  // API avec redirection vers notre fonction
  '/.netlify/functions/youtube-scraper',  // Fonction Netlify native
  '/.netlify/functions/test'  // Fonction test pour diagnostiquer si Netlify fonctionne
]

// État pour les vidéos et le chargement
const currentEndpointIndex = ref(0)
const { data: videoData, pending, error, refresh: originalRefresh } = await useLazyFetch<{ 
  videos: YouTubeVideo[]
  totalResults: number
  demo?: boolean
  message?: string
  serviceError?: boolean
  errorType?: 'network' | 'scraping'
  errorMessage?: string
  errorDetails?: string
}>(() => apiEndpoints[currentEndpointIndex.value], {  
  query: { band: props.bandName },
  server: false,
  onResponseError({ request, response, options }) {
    console.error('YouTube Scraper - Erreur HTTP:', {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      url: request,
      body: response._data,
      endpointIndex: currentEndpointIndex.value
    })
  },
  onRequestError({ request, options, error }) {
    console.error('YouTube Scraper - Erreur de requête:', {
      url: request,
      error: error.message,
      endpointIndex: currentEndpointIndex.value
    })
  }
})

// Fonction pour essayer le prochain endpoint
const tryNextEndpoint = async () => {
  if (currentEndpointIndex.value < apiEndpoints.length - 1) {
    currentEndpointIndex.value++
    console.log(`Tentative avec l'endpoint ${currentEndpointIndex.value + 1}/${apiEndpoints.length}: ${apiEndpoints[currentEndpointIndex.value]}`)
    await originalRefresh()
    return true
  }
  return false
}

// Fonction pour rafraîchir avec fallback automatique
const refresh = async () => {
  // Réinitialiser au premier endpoint
  currentEndpointIndex.value = 0
  await originalRefresh()
  
  // Si erreur et qu'il y a d'autres endpoints à tester
  if (error.value && currentEndpointIndex.value < apiEndpoints.length - 1) {
    console.log('Premier endpoint échoué, tentative des alternatives...')
    let success = false
    while (!success && currentEndpointIndex.value < apiEndpoints.length - 1) {
      success = await tryNextEndpoint()
      if (error.value && !success) {
        // Continuer à essayer
        continue
      } else {
        break
      }
    }
  }
}

const videos = computed(() => videoData.value?.videos || [])
const isDemo = computed(() => videoData.value?.demo || false)
const noVideosMessage = computed(() => videoData.value?.message || '')
const hasServiceError = computed(() => videoData.value?.serviceError || false)
const serviceErrorMessage = computed(() => videoData.value?.errorMessage || 'Service temporairement indisponible')
const serviceErrorDetails = computed(() => videoData.value?.errorDetails || '')
const isNetworkError = computed(() => videoData.value?.errorType === 'network')

// Informations détaillées sur l'erreur pour debugging
const errorDetails = computed(() => {
  if (!error.value) return null
  
  let details: {
    message: string
    statusCode: string | number
    statusMessage: string
    data: any
    diagnosis?: string
    currentEndpoint?: string
    testedEndpoints?: string[]
  } = {
    message: error.value.message || 'Erreur inconnue',
    statusCode: error.value.statusCode || 'non défini',
    statusMessage: error.value.statusMessage || 'non défini',
    data: error.value.data || 'aucune donnée',
    currentEndpoint: apiEndpoints[currentEndpointIndex.value],
    testedEndpoints: apiEndpoints.slice(0, currentEndpointIndex.value + 1)
  }
  
  // Si c'est une erreur 404, c'est probablement que l'API route n'existe pas
  if (error.value.statusCode === 404) {
    details.diagnosis = 'API route non trouvée - vérifier la configuration Netlify'
  }
  // Si c'est du HTML en réponse, c'est que Netlify sert la page d'erreur au lieu de l'API
  else if (typeof error.value.data === 'string' && error.value.data.includes('<html>')) {
    details.diagnosis = 'Netlify sert du HTML au lieu de l\'API - configuration incorrecte'
  }
  
  return details
})

// État pour la vidéo sélectionnée (par défaut la première)
const selectedVideo = ref<YouTubeVideo | null>(null)

// Sélectionner la première vidéo par défaut
watch(videos, (newVideos) => {
  if (newVideos.length > 0 && !selectedVideo.value) {
    selectedVideo.value = newVideos[0]
  }
}, { immediate: true })

// Fonction pour sélectionner une vidéo
const selectVideo = (video: YouTubeVideo) => {
  selectedVideo.value = video
}

// URL d'embed YouTube
const embedUrl = computed(() => {
  if (!selectedVideo.value) return ''
  return `https://www.youtube.com/embed/${selectedVideo.value.id}?autoplay=0&rel=0`
})

// Fonction pour rafraîchir les données
const refreshVideos = () => {
  refresh()
}
</script>

<template>
  <!-- N'afficher le composant que s'il y a des vidéos trouvées, une erreur de service ou en cas d'erreur/chargement -->
  <div v-if="pending || error || videos.length > 0 || hasServiceError" class="youtube-scraper">
    <!-- Titre de la section (seulement si des vidéos sont trouvées) -->
    <div v-if="videos.length > 0" class="flex items-center justify-between mb-6">
      <h2 class="font-bold text-xl">Vidéos Live de {{ props.bandName }} sur ConcertsMetal-BZH</h2>
    </div>
    
    <!-- En-tête avec compteur et bouton refresh (seulement si des vidéos sont trouvées) -->
    <div v-if="videos.length > 0" class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-2">
        <Icon name="simple-icons:youtube" class="h-6 w-6 text-red-600" />
        <span class="text-sm text-gray-600">
          {{ isDemo ? 'Mode démo' : `${videos.length} vidéo${videos.length > 1 ? 's' : ''} trouvée${videos.length > 1 ? 's' : ''}` }}
        </span>
      </div>
      <button 
        @click="refreshVideos"
        :disabled="pending"
        class="text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50"
      >
        {{ pending ? 'Chargement...' : 'Actualiser' }}
      </button>
    </div>
    
    <!-- Loader -->
    <div v-if="pending" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
      <p class="mt-4 text-gray-600">Recherche des vidéos...</p>
    </div>
    
    <!-- Erreur HTTP (véritable erreur de connexion) -->
    <div v-else-if="error" class="py-8">
      <div class="bg-red-50 border border-red-200 rounded-lg p-6">
        <div class="flex items-start gap-3">
          <Icon name="heroicons:exclamation-triangle" class="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
          <div class="flex-1">
            <h3 class="font-medium text-red-800 mb-1">Erreur lors du chargement des vidéos</h3>
            
            <div v-if="errorDetails?.diagnosis" class="mb-3">
              <p class="text-sm font-medium text-red-700">Diagnostic :</p>
              <p class="text-sm text-red-600">{{ errorDetails.diagnosis }}</p>
            </div>
            
            <details class="text-xs text-red-600 mb-4">
              <summary class="cursor-pointer hover:text-red-800 mb-2">Détails techniques</summary>
              <div class="space-y-1 font-mono bg-red-100 p-2 rounded">
                <p><strong>Message :</strong> {{ errorDetails?.message }}</p>
                <p><strong>Code :</strong> {{ errorDetails?.statusCode }}</p>
                <p><strong>Status :</strong> {{ errorDetails?.statusMessage }}</p>
                <p><strong>Endpoint actuel :</strong> {{ errorDetails?.currentEndpoint }}</p>
                <p v-if="errorDetails?.testedEndpoints && errorDetails.testedEndpoints.length > 1">
                  <strong>Endpoints testés :</strong> {{ errorDetails.testedEndpoints.join(', ') }}
                </p>
                <p v-if="errorDetails?.data && typeof errorDetails.data === 'string'">
                  <strong>Réponse :</strong> {{ errorDetails.data.substring(0, 200) }}{{ errorDetails.data.length > 200 ? '...' : '' }}
                </p>
              </div>
            </details>
            
            <div class="flex items-center gap-3">
              <button 
                @click="refreshVideos"
                :disabled="pending"
                class="text-sm px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
              >
                {{ pending ? 'Chargement...' : 'Réessayer' }}
              </button>
              
              <p v-if="errorDetails?.statusCode === 404" class="text-xs text-red-600">
                ℹ️ L'API n'est pas accessible en production
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Erreur de service (YouTube bloqué, mais service fonctionne) -->
    <div v-else-if="hasServiceError && videos.length === 0" class="py-8">
      <div class="bg-amber-50 border border-amber-200 rounded-lg p-6">
        <div class="flex items-start gap-3">
          <Icon 
            :name="isNetworkError ? 'heroicons:wifi-slash' : 'heroicons:exclamation-triangle'" 
            class="h-6 w-6 text-amber-600 flex-shrink-0 mt-0.5" 
          />
          <div class="flex-1">
            <h3 class="font-medium text-amber-800 mb-1">{{ serviceErrorMessage }}</h3>
            <p class="text-sm text-amber-700 mb-3">{{ noVideosMessage }}</p>
            
            <details class="text-xs text-amber-600">
              <summary class="cursor-pointer hover:text-amber-800">Détails techniques</summary>
              <p class="mt-1 font-mono">{{ serviceErrorDetails }}</p>
            </details>
            
            <div class="flex items-center gap-3 mt-4">
              <button 
                @click="refreshVideos"
                :disabled="pending"
                class="text-sm px-3 py-1 bg-amber-600 text-white rounded hover:bg-amber-700 disabled:opacity-50"
              >
                {{ pending ? 'Chargement...' : 'Réessayer' }}
              </button>
              
              <p v-if="isNetworkError" class="text-xs text-amber-600">
                ℹ️ Ce service fonctionne localement mais est bloqué en production
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Lecteur vidéo + liste (seulement si des vidéos sont trouvées) -->
    <div v-else-if="videos.length > 0" class="space-y-6">
      <!-- Alertes -->
      <div v-if="isDemo" class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div class="flex items-center gap-2">
          <Icon name="heroicons:information-circle" class="h-5 w-5 text-yellow-600" />
          <span class="text-sm text-yellow-800">
            Mode démo activé - Vidéos d'exemple affichées
          </span>
        </div>
      </div>
      
      <!-- Lecteur principal -->
      <div class="relative w-full bg-gray-900 rounded-lg overflow-hidden" style="padding-bottom: 56.25%; height: 0;">
        <iframe
          v-if="selectedVideo"
          :src="embedUrl"
          class="absolute top-0 left-0 w-full h-full"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
          loading="lazy"
        ></iframe>
      </div>
      
      <!-- Infos de la vidéo actuelle -->
      <div v-if="selectedVideo" class="space-y-2">
        <h4 class="font-semibold text-lg text-gray-900">{{ selectedVideo.title }}</h4>
        <div class="flex items-center gap-4 text-sm text-gray-600">
          <span>{{ selectedVideo.channelTitle }}</span>
          <span v-if="selectedVideo.duration">{{ selectedVideo.duration }}</span>
          <span v-if="selectedVideo.viewCount">{{ selectedVideo.viewCount }}</span>
        </div>
      </div>
      
      <!-- Liste des autres vidéos (si plus d'une) -->
      <div v-if="videos.length > 1" class="space-y-3">
        <h5 class="font-medium text-gray-900">Autres vidéos :</h5>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <button
            v-for="video in videos.filter((v: YouTubeVideo) => v.id !== selectedVideo?.id)"
            :key="video.id"
            @click="selectVideo(video)"
            class="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left group"
          >
            <!-- Thumbnail avec overlay play -->
            <div class="relative flex-shrink-0">
              <img
                :src="video.thumbnail"
                :alt="video.title"
                class="w-24 h-18 object-cover rounded"
                loading="lazy"
              />
              <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center rounded">
                <Icon name="heroicons:play" class="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div v-if="video.duration" class="absolute bottom-1 right-1 bg-black bg-opacity-80 text-white text-xs px-1 rounded">
                {{ video.duration }}
              </div>
            </div>
            
            <!-- Infos vidéo -->
            <div class="flex-1 min-w-0 space-y-1">
              <p class="font-medium text-gray-900 line-clamp-2 text-sm leading-tight">{{ video.title }}</p>
              <p class="text-xs text-gray-600">{{ video.channelTitle }}</p>
              <p v-if="video.viewCount" class="text-xs text-gray-500">{{ video.viewCount }}</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
