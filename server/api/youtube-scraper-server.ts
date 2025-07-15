export default defineEventHandler(async (event) => {
  // Récupérer le paramètre band depuis l'URL
  const query = getQuery(event)
  const bandName = query.band as string

  // Headers CORS
  setHeader(event, 'Access-Control-Allow-Origin', '*')
  setHeader(event, 'Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  setHeader(event, 'Access-Control-Allow-Headers', 'Content-Type')
  setHeader(event, 'Content-Type', 'application/json')

  if (!bandName) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Band name is required'
    })
  }

  try {
    // Log pour debugging
    console.log(`[YouTube Scraper Server] Recherche pour "${bandName}"`)
    
    // Stratégie de recherche YouTube
    const brunoSearchQuery = encodeURIComponent(`"Bruno Guézennec" ${bandName}`)
    const brunoSearchUrl = `https://www.youtube.com/results?search_query=${brunoSearchQuery}`
    
    console.log(`[YouTube Scraper Server] URL: ${brunoSearchUrl}`)
    
    // Timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000)
    
    const response = await $fetch(brunoSearchUrl, {
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
    }) as string

    clearTimeout(timeoutId)
    console.log(`[YouTube Scraper Server] HTML reçu: ${response.length} caractères`)

    // Parser le HTML pour extraire les données JSON
    let videoData
    const scriptRegex = /var ytInitialData = ({.*?});/
    const match = response.match(scriptRegex)
    
    if (!match) {
      // Essayer une regex alternative
      const altRegex = /window\["ytInitialData"\] = ({.*?});/
      const altMatch = response.match(altRegex)
      
      if (!altMatch) {
        console.log('[YouTube Scraper Server] Aucune donnée YouTube trouvée')
        return {
          videos: [],
          totalResults: 0,
          serviceError: true,
          errorType: 'scraping',
          errorMessage: 'Données YouTube non trouvées',
          errorDetails: 'ytInitialData introuvable dans la réponse HTML',
          message: 'YouTube a peut-être changé son format ou bloqué l\'accès'
        }
      }
      
      videoData = JSON.parse(altMatch[1])
    } else {
      videoData = JSON.parse(match[1])
    }

    console.log('[YouTube Scraper Server] Données YouTube extraites')

    // Extraire les vidéos
    let videos = []
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
              // Vérifier si le titre contient le nom du groupe
              const titleLower = title.toLowerCase()
              const bandNameLower = bandName.toLowerCase()
              
              if (titleLower.includes(bandNameLower)) {
                const video = {
                  id: videoId,
                  title: title,
                  thumbnail: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
                  channelTitle: channelName,
                  duration: videoRenderer?.lengthText?.simpleText || '',
                  viewCount: videoRenderer?.viewCountText?.simpleText || ''
                }
                
                videos.push(video)
                console.log(`[YouTube Scraper Server] Vidéo trouvée: ${title}`)
              }
            }
          }
        }
      }
    }

    console.log(`[YouTube Scraper Server] ${videos.length} vidéo(s) trouvée(s) pour "${bandName}"`)

    // Si aucune vidéo trouvée, retourner des vidéos de démo
    if (videos.length === 0) {
      console.log('[YouTube Scraper Server] Aucune vidéo trouvée, retour de vidéos de démo')
      
      return {
        videos: [
          {
            id: "qTsomvebRAA",
            title: "Testament - Electric crown [Live Hellfest 2023 - dimanche 18 juin]",
            thumbnail: "https://img.youtube.com/vi/qTsomvebRAA/mqdefault.jpg",
            channelTitle: "Bruno Guézennec",
            duration: "5:35",
            viewCount: "482 vues"
          }
        ],
        totalResults: 1,
        demo: true,
        message: `Aucune vidéo trouvée pour "${bandName}" sur la chaîne Bruno Guézennec. Vidéo d'exemple affichée.`
      }
    }

    return {
      videos: videos,
      totalResults: videos.length
    }

  } catch (error: any) {
    console.error('[YouTube Scraper Server] Erreur:', error)
    
    let errorType = 'network'
    let errorMessage = 'Erreur réseau'
    let errorDetails = error.message

    if (error.name === 'AbortError') {
      errorType = 'network'
      errorMessage = 'Timeout de connexion'
      errorDetails = 'La requête a pris trop de temps (>10s)'
    } else if (error.message?.includes('fetch')) {
      errorType = 'network'
      errorMessage = 'Erreur de connexion'
      errorDetails = 'Impossible de contacter YouTube'
    }

    return {
      videos: [],
      totalResults: 0,
      serviceError: true,
      errorType: errorType,
      errorMessage: errorMessage,
      errorDetails: errorDetails,
      message: 'Service YouTube temporairement indisponible'
    }
  }
})
