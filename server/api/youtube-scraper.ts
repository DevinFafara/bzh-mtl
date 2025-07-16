export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const bandName = query.band as string
  
  if (!bandName) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Band name is required'
    })
  }

  try {
    let videoData: any[] = []
    
    // Stratégie 1: Recherche avec le nom exact de la chaîne
    const brunoSearchQuery = encodeURIComponent(`"Bruno Guézennec" ${bandName}`)
    const brunoSearchUrl = `https://www.youtube.com/results?search_query=${brunoSearchQuery}`
    
    console.log(`[YouTube Scraper] Recherche pour "${bandName}"`)
    console.log(`[YouTube Scraper] URL: ${brunoSearchUrl}`)
    
    // Timeout avec AbortController
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 secondes
    
    let response = await fetch(brunoSearchUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'fr-FR,fr;q=0.9,en;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    })
    
    clearTimeout(timeoutId)
    
    console.log(`[YouTube Scraper] Status: ${response.status}`)
    console.log(`[YouTube Scraper] Headers:`, Object.fromEntries(response.headers.entries()))
    
    if (response.ok) {
      const html = await response.text()
      console.log(`[YouTube Scraper] HTML reçu: ${html.length} caractères`)
      videoData = extractVideoDataFromHTML(html)
      console.log(`[YouTube Scraper] Vidéos extraites: ${videoData.length}`)
    } else {
      console.error(`[YouTube Scraper] Erreur HTTP: ${response.status} ${response.statusText}`)
    }
    
    // Stratégie 2: Si pas de résultats, recherche avec ConcertsMetal-BZH
    if (videoData.length === 0) {
      console.log(`[YouTube Scraper] Tentative avec ConcertsMetal-BZH`)
      const concertsMetalQuery = encodeURIComponent(`"ConcertsMetal-BZH" ${bandName}`)
      const concertsMetalUrl = `https://www.youtube.com/results?search_query=${concertsMetalQuery}`
      
      const controller2 = new AbortController()
      const timeoutId2 = setTimeout(() => controller2.abort(), 10000)
      
      response = await fetch(concertsMetalUrl, {
        signal: controller2.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'fr-FR,fr;q=0.9,en;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      })
      
      clearTimeout(timeoutId2)
      
      if (response.ok) {
        const html = await response.text()
        videoData = extractVideoDataFromHTML(html)
        console.log(`[YouTube Scraper] Vidéos ConcertsMetal-BZH: ${videoData.length}`)
      }
    }
    
    // Stratégie 3: Si toujours pas de résultats, recherche générale avec filtre strict
    if (videoData.length === 0) {
      console.log(`[YouTube Scraper] Tentative recherche générale`)
      const generalSearchQuery = encodeURIComponent(`${bandName} ConcertsMetal-BZH`)
      const generalSearchUrl = `https://www.youtube.com/results?search_query=${generalSearchQuery}`
      
      const controller3 = new AbortController()
      const timeoutId3 = setTimeout(() => controller3.abort(), 10000)
      
      response = await fetch(generalSearchUrl, {
        signal: controller3.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'fr-FR,fr;q=0.9,en;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      })
      
      clearTimeout(timeoutId3)
      
      if (response.ok) {
        const html = await response.text()
        videoData = extractVideoDataFromHTML(html)
        console.log(`[YouTube Scraper] Vidéos générales: ${videoData.length}`)
      }
    }
    
    // Filtrer uniquement les vidéos de la chaîne "Bruno Guézennec" qui contiennent le nom du groupe
    const brunoVideos = videoData
      .filter((video: any) => {
        if (!video.videoId || !video.title) return false
        
        // Vérifier si la vidéo provient de la chaîne "Bruno Guézennec"
        const isBruno = isBrunoGuezennecChannel(video.channelName)
        if (!isBruno) return false
        
        // Vérifier si le titre contient le nom du groupe
        return video.title.toLowerCase().includes(bandName.toLowerCase())
      })
      .slice(0, 6) // Limiter à 6 vidéos
      .map((video: any) => ({
        id: video.videoId,
        title: cleanTitle(video.title),
        thumbnail: `https://img.youtube.com/vi/${video.videoId}/mqdefault.jpg`,
        channelTitle: video.channelName || 'Bruno Guézennec',
        duration: video.duration || '',
        viewCount: video.viewCount || '',
        publishedTime: video.publishedTime || ''
      }))

    // Ajouter des logs détaillés pour chaque vidéo trouvée
    brunoVideos.forEach((video, index) => {
      console.log(`[YouTube Scraper] Vidéo ${index + 1} trouvée: ${video.title}`)
      console.log(`[YouTube Scraper] - ID: ${video.id}`)
      console.log(`[YouTube Scraper] - Thumbnail URL: ${video.thumbnail}`)
      console.log(`[YouTube Scraper] - Channel: ${video.channelTitle}`)
      console.log(`[YouTube Scraper] - Duration: ${video.duration}`)
      console.log(`[YouTube Scraper] - Views: ${video.viewCount}`)
      console.log(`[YouTube Scraper] - Published: ${video.publishedTime}`)
    })

    // Si aucune vidéo de Bruno n'est trouvée, retourner un message d'info
    if (brunoVideos.length === 0) {
      return {
        videos: [],
        totalResults: 0,
        message: `Aucune vidéo de la chaîne "Bruno Guézennec" trouvée pour ${bandName}`
      }
    }

    const videos = brunoVideos
    
    return { videos, totalResults: videos.length }
    
  } catch (error: any) {
    console.error('[YouTube Scraper] Erreur complète:', error)
    
    // Analyser le type d'erreur pour donner un message plus spécifique
    let errorMessage = 'Erreur lors du chargement des vidéos'
    let errorDetails = ''
    let isNetworkError = false
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      errorMessage = 'Service YouTube temporairement indisponible'
      errorDetails = 'Le scraping YouTube est bloqué en production (Netlify)'
      isNetworkError = true
    } else if (error.name === 'AbortError') {
      errorMessage = 'Timeout de la requête'
      errorDetails = 'La requête YouTube a pris trop de temps'
      isNetworkError = true
    } else if (error instanceof Error) {
      errorDetails = error.message
      if (error.message.includes('ENOTFOUND') || error.message.includes('ECONNREFUSED')) {
        isNetworkError = true
        errorMessage = 'Connexion YouTube bloquée'
        errorDetails = 'Les requêtes vers YouTube sont bloquées sur ce serveur'
      }
    }
    
    console.error(`[YouTube Scraper] ${errorMessage}: ${errorDetails}`)
    
    // Retourner une réponse avec statut de service indisponible mais pas d'erreur HTTP
    // Cela permettra au front d'afficher un message approprié plutôt qu'une erreur générique
    return {
      videos: [],
      totalResults: 0,
      serviceError: true,
      errorType: isNetworkError ? 'network' : 'scraping',
      errorMessage: errorMessage,
      errorDetails: errorDetails,
      message: isNetworkError 
        ? `Service vidéo temporairement indisponible pour ${bandName} (restrictions réseau en production)`
        : `Impossible de récupérer les vidéos de ${bandName} actuellement`
    }
  }
})

// Fonction pour extraire les données vidéo du HTML YouTube
function extractVideoDataFromHTML(html: string) {
  const videos: any[] = []
  
  try {
    // Rechercher le script contenant les données initiales
    const scriptMatch = html.match(/var ytInitialData = ({.*?});/)
    if (!scriptMatch) {
      console.warn('No ytInitialData found in HTML')
      return videos
    }
    
    const data = JSON.parse(scriptMatch[1])
    
    // Naviguer dans la structure complexe de YouTube
    const contents = data?.contents?.twoColumnSearchResultsRenderer?.primaryContents?.sectionListRenderer?.contents
    
    if (!contents) {
      console.warn('No video contents found in YouTube data')
      return videos
    }
    
    // Extraire les vidéos
    contents.forEach((section: any) => {
      const items = section?.itemSectionRenderer?.contents || []
      
      items.forEach((item: any) => {
        const videoRenderer = item?.videoRenderer
        if (videoRenderer) {
          // Extraire le nom de la chaîne de différentes sources possibles
          let channelName = ''
          if (videoRenderer.ownerText?.runs?.[0]?.text) {
            channelName = videoRenderer.ownerText.runs[0].text
          } else if (videoRenderer.longBylineText?.runs?.[0]?.text) {
            channelName = videoRenderer.longBylineText.runs[0].text
          } else if (videoRenderer.shortBylineText?.runs?.[0]?.text) {
            channelName = videoRenderer.shortBylineText.runs[0].text
          }
          
          const video = {
            videoId: videoRenderer.videoId,
            title: videoRenderer.title?.runs?.[0]?.text || videoRenderer.title?.simpleText || '',
            channelName: channelName,
            duration: videoRenderer.lengthText?.simpleText || '',
            viewCount: videoRenderer.viewCountText?.simpleText || '',
            publishedTime: videoRenderer.publishedTimeText?.simpleText || ''
          }
          
          if (video.videoId && video.title) {
            videos.push(video)
          }
        }
      })
    })
    
  } catch (parseError) {
    console.error('Error parsing YouTube data:', parseError)
  }
  
  return videos
}

// Fonction pour vérifier si une vidéo provient de la chaîne Bruno Guézennec
function isBrunoGuezennecChannel(channelName: string): boolean {
  if (!channelName) return false
  
  const normalizedChannelName = channelName.toLowerCase()
    .replace(/[àáâäç]/g, 'a')
    .replace(/[èéêë]/g, 'e')
    .replace(/[ùúûü]/g, 'u')
    .replace(/[^a-z0-9\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  
  // Mots-clés pour identifier la chaîne de Bruno Guézennec
  const exactMatches = [
    'bruno guezennec',
    'bruno guézennec',
    'concertsmetal-bzh',
    'concertsmetal bzh',
    'concerts metal bzh'
  ]
  
  // Vérification exacte d'abord
  const isExactMatch = exactMatches.some(keyword => normalizedChannelName === keyword)
  
  // Vérification contenant les mots-clés
  const containsKeywords = exactMatches.some(keyword => normalizedChannelName.includes(keyword))
  
  // Vérifications supplémentaires pour les variantes
  const containsBruno = normalizedChannelName.includes('bruno') && 
                       (normalizedChannelName.includes('guezennec') || normalizedChannelName.includes('guezennec'))
  
  const containsConcertsMetal = normalizedChannelName.includes('concertsmetal') || 
                               (normalizedChannelName.includes('concerts') && normalizedChannelName.includes('metal'))
  
  return isExactMatch || containsKeywords || containsBruno || containsConcertsMetal
}

// Fonction pour nettoyer les titres des vidéos
function cleanTitle(title: string): string {
  return title
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .trim()
}
