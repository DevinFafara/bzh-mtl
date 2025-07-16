// Fonction Netlify directe pour remplacer l'API route Nuxt (CommonJS)
exports.handler = async (event, context) => {
  // Gérer CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  }

  // Répondre aux requêtes OPTIONS pour CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    }
  }

  const bandName = event.queryStringParameters?.band

  if (!bandName) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Band name is required' })
    }
  }

  try {
    let videoData = []
    
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
        'DNT': '1',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Cache-Control': 'max-age=0',
      }
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      console.error(`[YouTube Scraper] Erreur HTTP: ${response.status} ${response.statusText}`)
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          videos: [],
          totalResults: 0,
          serviceError: true,
          errorType: 'network',
          errorMessage: `Erreur HTTP ${response.status}`,
          errorDetails: `${response.status} ${response.statusText}`,
          message: 'Impossible d\'accéder à YouTube depuis les serveurs Netlify'
        })
      }
    }

    const html = await response.text()
    console.log(`[YouTube Scraper] HTML reçu: ${html.length} caractères`)

    // Rechercher les données JSON dans le HTML
    const scriptRegex = /var ytInitialData = ({.*?});/
    const match = html.match(scriptRegex)
    
    if (!match) {
      console.log('[YouTube Scraper] ytInitialData non trouvé, recherche alternative...')
      
      // Essayer une regex alternative
      const altRegex = /window\["ytInitialData"\] = ({.*?});/
      const altMatch = html.match(altRegex)
      
      if (!altMatch) {
        console.log('[YouTube Scraper] Aucune donnée YouTube trouvée')
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            videos: [],
            totalResults: 0,
            serviceError: true,
            errorType: 'scraping',
            errorMessage: 'Données YouTube non trouvées',
            errorDetails: 'ytInitialData introuvable dans la réponse HTML',
            message: 'YouTube a peut-être changé son format ou bloqué l\'accès'
          })
        }
      }
      
      videoData = JSON.parse(altMatch[1])
    } else {
      videoData = JSON.parse(match[1])
    }

    console.log('[YouTube Scraper] Données YouTube extraites')

    // Extraire les vidéos des résultats de recherche
    let videos = []
    try {
      const contents = videoData?.contents?.twoColumnSearchResultsRenderer?.primaryContents?.sectionListRenderer?.contents || []
      
      for (const section of contents) {
        const items = section?.itemSectionRenderer?.contents || []
        
        for (const item of items) {
          const videoRenderer = item?.videoRenderer
          if (videoRenderer) {
            const channelName = videoRenderer?.ownerText?.runs?.[0]?.text || 
                              videoRenderer?.longBylineText?.runs?.[0]?.text || ''
            
            // Filtrer par chaîne Bruno Guézennec
            if (channelName.toLowerCase().includes('bruno') && channelName.toLowerCase().includes('guézennec')) {
              const title = videoRenderer?.title?.runs?.[0]?.text || ''
              const videoId = videoRenderer?.videoId
              
              if (videoId && title) {
                // Vérifier si le titre contient le nom du groupe (insensible à la casse)
                const titleLower = title.toLowerCase()
                const bandNameLower = bandName.toLowerCase()
                
                if (titleLower.includes(bandNameLower)) {
                  const video = {
                    id: videoId,
                    title: title,
                    thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
                    channelTitle: channelName,
                    duration: videoRenderer?.lengthText?.simpleText || '',
                    viewCount: videoRenderer?.viewCountText?.simpleText || '',
                    publishedTime: videoRenderer?.publishedTimeText?.simpleText || ''
                  }
                  
                  videos.push(video)
                  console.log(`[YouTube Scraper] Vidéo trouvée: ${title}`)
                  console.log(`[YouTube Scraper] - ID: ${videoId}`)
                  console.log(`[YouTube Scraper] - Thumbnail URL: ${video.thumbnail}`)
                  console.log(`[YouTube Scraper] - Channel: ${channelName}`)
                  console.log(`[YouTube Scraper] - Duration: ${video.duration}`)
                  console.log(`[YouTube Scraper] - Views: ${video.viewCount}`)
                  console.log(`[YouTube Scraper] - Published: ${video.publishedTime}`)
                }
              }
            }
          }
        }
      }
    } catch (parseError) {
      console.error('[YouTube Scraper] Erreur lors du parsing des vidéos:', parseError)
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          videos: [],
          totalResults: 0,
          serviceError: true,
          errorType: 'scraping',
          errorMessage: 'Erreur de parsing',
          errorDetails: parseError.message,
          message: 'Erreur lors de l\'analyse des données YouTube'
        })
      }
    }

    console.log(`[YouTube Scraper] ${videos.length} vidéo(s) trouvée(s) pour "${bandName}"`)
    const totalVideosFound = videos.length

    // Limiter à 6 vidéos pour l'affichage
    const limitedVideos = videos.slice(0, 6)

    // Si aucune vidéo trouvée, retourner des vidéos de démo
    if (limitedVideos.length === 0) {
      console.log('[YouTube Scraper] Aucune vidéo trouvée, retour de vidéos de démo')
      
      const demoVideo = {
        id: "qTsomvebRAA",
        title: "Testament - Electric crown [Live Hellfest 2023 - dimanche 18 juin]",
        thumbnail: "https://img.youtube.com/vi/qTsomvebRAA/hqdefault.jpg",
        channelTitle: "Bruno Guézennec",
        duration: "5:35",
        viewCount: "482 vues"
      }
      
      console.log(`[YouTube Scraper] Vidéo de démo retournée:`)
      console.log(`[YouTube Scraper] - ID: ${demoVideo.id}`)
      console.log(`[YouTube Scraper] - Thumbnail URL: ${demoVideo.thumbnail}`)
      console.log(`[YouTube Scraper] - Channel: ${demoVideo.channelTitle}`)
      console.log(`[YouTube Scraper] - Duration: ${demoVideo.duration}`)
      console.log(`[YouTube Scraper] - Views: ${demoVideo.viewCount}`)
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          videos: [demoVideo],
          totalResults: 1,
          totalVideosFound: 0,
          demo: true,
          message: `Aucune vidéo trouvée pour "${bandName}" sur la chaîne Bruno Guézennec. Vidéo d'exemple affichée.`
        })
      }
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        videos: limitedVideos,
        totalResults: limitedVideos.length,
        totalVideosFound: totalVideosFound
      })
    }

  } catch (error) {
    console.error('[YouTube Scraper] Erreur:', error)
    
    // Déterminer le type d'erreur
    let errorType = 'network'
    let errorMessage = 'Erreur réseau'
    let errorDetails = error.message

    if (error.name === 'AbortError') {
      errorType = 'network'
      errorMessage = 'Timeout de connexion'
      errorDetails = 'La requête a pris trop de temps (>10s)'
    } else if (error.message.includes('fetch')) {
      errorType = 'network'
      errorMessage = 'Erreur de connexion'
      errorDetails = 'Impossible de contacter YouTube'
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        videos: [],
        totalResults: 0,
        serviceError: true,
        errorType: errorType,
        errorMessage: errorMessage,
        errorDetails: errorDetails,
        message: 'Service YouTube temporairement indisponible'
      })
    }
  }
}
