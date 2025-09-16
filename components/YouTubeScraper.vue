<script setup lang="ts">
interface YouTubeVideo {
  id: string
  title: string
  thumbnail: string
  channelTitle: string
  duration?: string
  viewCount?: string
  publishedTime?: string
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
  totalVideosFound?: number
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
    // console.error('YouTube Scraper - Erreur HTTP:', {
    //   status: response.status,
    //   statusText: response.statusText,
    //   headers: response.headers,
    //   url: request,
    //   body: response._data,
    //   endpointIndex: currentEndpointIndex.value
    // })
  },
  onRequestError({ request, options, error }) {
    // console.error('YouTube Scraper - Erreur de requête:', {
    //   url: request,
    //   error: error.message,
    //   endpointIndex: currentEndpointIndex.value
    // })
  }
})

// Fonction pour essayer le prochain endpoint
const tryNextEndpoint = async () => {
  if (currentEndpointIndex.value < apiEndpoints.length - 1) {
    currentEndpointIndex.value++
    // console.log(`Tentative avec l'endpoint ${currentEndpointIndex.value + 1}/${apiEndpoints.length}: ${apiEndpoints[currentEndpointIndex.value]}`)
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
    // console.log('Premier endpoint échoué, tentative des alternatives...')
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

// Fonction pour convertir la date de publication en timestamp pour tri
const parsePublishedTime = (publishedTimeString: string): number => {
  if (!publishedTimeString) return 0
  
  const now = Date.now()
  const cleanTime = publishedTimeString.toLowerCase().trim()
  
  // Gérer les formats français comme "il y a 2 semaines"
  if (cleanTime.includes('il y a')) {
    if (cleanTime.includes('minute') || cleanTime.includes('min')) {
      const minutes = parseInt(cleanTime.match(/\d+/)?.[0] || '0')
      return now - (minutes * 60 * 1000)
    } else if (cleanTime.includes('heure') || cleanTime.includes('h ')) {
      const hours = parseInt(cleanTime.match(/\d+/)?.[0] || '0')
      return now - (hours * 60 * 60 * 1000)
    } else if (cleanTime.includes('jour') || cleanTime.includes('day')) {
      const days = parseInt(cleanTime.match(/\d+/)?.[0] || '0')
      return now - (days * 24 * 60 * 60 * 1000)
    } else if (cleanTime.includes('semaine') || cleanTime.includes('week')) {
      const weeks = parseInt(cleanTime.match(/\d+/)?.[0] || '0')
      return now - (weeks * 7 * 24 * 60 * 60 * 1000)
    } else if (cleanTime.includes('mois') || cleanTime.includes('month')) {
      const months = parseInt(cleanTime.match(/\d+/)?.[0] || '0')
      return now - (months * 30 * 24 * 60 * 60 * 1000)
    } else if (cleanTime.includes('an') || cleanTime.includes('year')) {
      const years = parseInt(cleanTime.match(/\d+/)?.[0] || '0')
      return now - (years * 365 * 24 * 60 * 60 * 1000)
    }
  }
  
  // Si on ne peut pas parser, retourner une date très ancienne
  return 0
}
// Fonction pour convertir le nombre de vues en nombre pour tri
const parseViewCount = (viewCountString: string): number => {
  if (!viewCountString) return 0
  
  // Extraire le nombre du string "123 456 vues" ou "1,2M vues" etc.
  const cleanCount = viewCountString.replace(/[^\d.,]/g, '')
  
  if (viewCountString.includes('M') || viewCountString.includes('m')) {
    // Millions
    return parseFloat(cleanCount) * 1000000
  } else if (viewCountString.includes('K') || viewCountString.includes('k')) {
    // Milliers
    return parseFloat(cleanCount) * 1000
  } else {
    // Nombre normal (enlever espaces et virgules)
    return parseInt(cleanCount.replace(/[\s,]/g, '')) || 0
  }
}

// Vidéos organisées : 1 récente + 5 populaires (maximum 6 au total)
const organizedVideos = computed(() => {
  const rawVideos = videoData.value?.videos || []
  if (rawVideos.length === 0) return { recent: null, popular: [] }
  
  // Trouver la vidéo la plus récente
  const sortedByDate = [...rawVideos].sort((a, b) => {
    const timeA = parsePublishedTime(a.publishedTime || '')
    const timeB = parsePublishedTime(b.publishedTime || '')
    return timeB - timeA // Plus récent en premier
  })
  const mostRecent = sortedByDate[0]
  
  // Trier les autres par popularité (excluant la plus récente)
  const others = rawVideos.filter(video => video.id !== mostRecent?.id)
  const sortedByViews = others.sort((a, b) => {
    const viewsA = parseViewCount(a.viewCount || '0')
    const viewsB = parseViewCount(b.viewCount || '0')
    return viewsB - viewsA
  })
  
  // Prendre maximum 5 vidéos populaires
  const popular = sortedByViews.slice(0, 5)
  
  return { recent: mostRecent, popular }
})

// Vidéo la plus récente (pour compatibilité)
const mostRecentVideo = computed(() => organizedVideos.value.recent)

// Toutes les vidéos affichées (récente + populaires)
const videos = computed(() => {
  const { recent, popular } = organizedVideos.value
  return recent ? [recent, ...popular] : popular
})

// Autres vidéos triées par vues (excluant la vidéo actuellement sélectionnée)
const otherVideosSorted = computed(() => {
  if (!selectedVideo.value) return videos.value
  
  return videos.value.filter(video => video.id !== selectedVideo.value?.id)
})

const isDemo = computed(() => videoData.value?.demo || false)
const noVideosMessage = computed(() => videoData.value?.message || '')
const hasServiceError = computed(() => videoData.value?.serviceError || false)
const serviceErrorMessage = computed(() => videoData.value?.errorMessage || 'Service temporairement indisponible')
const serviceErrorDetails = computed(() => videoData.value?.errorDetails || '')
const isNetworkError = computed(() => videoData.value?.errorType === 'network')

// Informations sur les vidéos supplémentaires
const totalVideosFound = computed(() => videoData.value?.totalVideosFound || 0)
const hasMoreVideos = computed(() => totalVideosFound.value > videos.value.length)
const moreVideosCount = computed(() => totalVideosFound.value - videos.value.length)

// URL vers la chaîne YouTube pour voir toutes les vidéos
const channelSearchUrl = computed(() => {
  if (!props.bandName) return ''
  const searchQuery = encodeURIComponent(`${props.bandName}`)
  return `https://www.youtube.com/@ConcertsMetal-BZH/search?query=${searchQuery}`
})

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

// État pour la vidéo sélectionnée (par défaut la plus récente)
const selectedVideo = ref<YouTubeVideo | null>(null)

// Sélectionner la vidéo la plus récente par défaut
watch(mostRecentVideo, (newMostRecent) => {
  if (newMostRecent && !selectedVideo.value) {
    selectedVideo.value = newMostRecent
  }
}, { immediate: true })

// Fonction pour sélectionner une vidéo
const selectVideo = (video: YouTubeVideo) => {
  selectedVideo.value = video
}

// URL d'embed YouTube
const embedUrl = computed(() => {
  if (!selectedVideo.value) return ''
  return `https://www.youtube.com/embed/${selectedVideo.value.id}?autoplay=0&rel=0&modestbranding=1&enablejsapi=0`
})

// Fonction pour rafraîchir les données
const refreshVideos = () => {
  refresh()
}

// Fonction pour gérer les erreurs de chargement d'image
const handleImageError = (event: Event, videoId: string) => {
  const img = event.target as HTMLImageElement
  const currentSrc = img.src
  
  // console.log(`[YouTubeScraper Frontend] Erreur de chargement pour thumbnail: ${currentSrc}`)
  // console.log(`[YouTubeScraper Frontend] Video ID: ${videoId}`)
  // console.log(`[YouTubeScraper Frontend] Event:`, event)
  
  // Essayer différentes résolutions de thumbnail
  if (currentSrc.includes('mqdefault.jpg')) {
    // Essayer avec maxresdefault.jpg
    img.src = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
    // console.log(`[YouTubeScraper Frontend] Tentative avec maxresdefault: ${img.src}`)
  } else if (currentSrc.includes('maxresdefault.jpg')) {
    // Essayer avec hqdefault.jpg
    img.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
    // console.log(`[YouTubeScraper Frontend] Tentative avec hqdefault: ${img.src}`)
  } else if (currentSrc.includes('hqdefault.jpg')) {
    // Essayer avec default.jpg
    img.src = `https://img.youtube.com/vi/${videoId}/default.jpg`
    // console.log(`[YouTubeScraper Frontend] Tentative avec default: ${img.src}`)
  } else {
    // En dernier recours, afficher une image placeholder
    img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjkwIiB2aWV3Qm94PSIwIDAgMTIwIDkwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMTIwIiBoZWlnaHQ9IjkwIiBmaWxsPSIjMzMzIi8+Cjx0ZXh0IHg9IjYwIiB5PSI0NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmaWxsPSIjNjY2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Wm91VHViZTwvdGV4dD4KPHN2Zz4K'
    // console.log(`[YouTubeScraper Frontend] Fallback vers placeholder pour ${videoId}`)
  }
}

// Fonction pour logger le chargement réussi d'une image
const handleImageLoad = (event: Event, videoId: string) => {
  const img = event.target as HTMLImageElement
  // console.log(`[YouTubeScraper Frontend] Image chargée avec succès: ${img.src} pour video ${videoId}`)
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
      <!-- <div class="flex items-center gap-2">
        <Icon name="simple-icons:youtube" class="h-6 w-6 text-red-600" />
        <span class="text-sm text-gray-600">
          {{ isDemo ? 'Mode démo' : `${videos.length} vidéo${videos.length > 1 ? 's' : ''} trouvée${videos.length > 1 ? 's' : ''}` }}
        </span>
      </div> -->
      <button 
        @click="refreshVideos"
        :disabled="pending"
        class="text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50"
      >
        {{ pending ? 'Chargement...' : '' }}
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
          <span v-if="selectedVideo.publishedTime" class="text-gray-600"> {{ selectedVideo.publishedTime }}</span>
          <!-- Badge "Plus récente" si c'est la vidéo la plus récente -->
          <span 
            v-if="selectedVideo.id === mostRecentVideo?.id" 
            class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium"
          >
            🆕 Plus récente
          </span>
        </div>
      </div>
      
      <!-- Liste des autres vidéos (si plus d'une) -->
      <div v-if="videos.length > 1" class="space-y-3">
        <h5 class="font-medium text-gray-900">
          Autres vidéos 
        </h5>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <button
            v-for="video in otherVideosSorted"
            :key="video.id"
            @click="selectVideo(video)"
            class="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left group"
          >
            <!-- Thumbnail avec overlay play -->
            <div style="position: relative; flex-shrink: 0;" class="thumbnail-container">
              <!-- Image thumbnail -->
              <img
                :src="video.thumbnail"
                :alt="video.title"
                style="width: 96px; height: 72px; object-fit: cover; border-radius: 8px; display: block;"
                loading="lazy"
                referrerpolicy="no-referrer"
                @error="handleImageError($event, video.id)"
                @load="handleImageLoad($event, video.id)"
              />
              
              <!-- Overlay play icon -->
              <div class="play-overlay" style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; display: flex; align-items: center; justify-content: center; border-radius: 8px; background-color: rgba(0,0,0,0); transition: background-color 0.3s ease;">
                <svg class="play-icon" style="width: 18px; height: 18px; color: white; opacity: 0; transition: opacity 0.3s ease;" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
              
              <!-- Duration badge -->
              <div v-if="video.duration" style="position: absolute; bottom: 4px; right: 4px; background-color: rgba(0,0,0,0.8); color: white; font-size: 12px; padding: 2px 4px; border-radius: 4px;">
                {{ video.duration }}
              </div>
            </div>
            
            <!-- Infos vidéo -->
            <div class="flex-1 min-w-0 space-y-1">
              <div class="flex items-start gap-2">
                <p class="font-medium text-gray-900 line-clamp-2 text-sm leading-tight flex-1">{{ video.title }}</p>
              </div>
              <p class="text-xs text-gray-600">{{ video.channelTitle }}</p>
              <div class="flex items-center gap-2 text-xs text-gray-500">
                <span v-if="video.viewCount">{{ video.viewCount }}</span>
                <span v-if="video.publishedTime" class="text-gray-500"> {{ video.publishedTime }}</span>
              </div>
            </div>
          </button>
        </div>

        <!-- Lien vers plus de vidéos si disponibles -->
        <div v-if="hasMoreVideos" class="mt-4 pt-4 border-t border-gray-200">
          <a 
            :href="channelSearchUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 hover:underline"
          >
            <Icon name="heroicons:arrow-top-right-on-square" class="h-4 w-4" />
            Voir les autres vidéos de {{ props.bandName }} sur ConcertsMetal-BZH
            <span class="text-gray-500">({{ moreVideosCount }} vidéo{{ moreVideosCount > 1 ? 's' : '' }} supplémentaire{{ moreVideosCount > 1 ? 's' : '' }})</span>
          </a>
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

/* Effet hover pour les thumbnails */
.thumbnail-container:hover .play-overlay {
  background-color: rgba(0, 0, 0, 0.3) !important;
}

.thumbnail-container:hover .play-icon {
  opacity: 1 !important;
}
</style>
