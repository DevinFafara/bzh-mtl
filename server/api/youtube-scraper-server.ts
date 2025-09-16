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
    // console.log(`[YouTube Scraper Server] Recherche pour "${bandName}"`)
    
    // Stratégie de recherche YouTube
    const brunoSearchQuery = encodeURIComponent(`"Bruno Guézennec" ${bandName}`)
    const brunoSearchUrl = `https://www.youtube.com/results?search_query=${brunoSearchQuery}`
    
    // console.log(`[YouTube Scraper Server] URL: ${brunoSearchUrl}`)
    
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
    // console.log(`[YouTube Scraper Server] HTML reçu: ${response.length} caractères`)

    // Parser le HTML pour extraire les données JSON
    let videoData
    const scriptRegex = /var ytInitialData = ({.*?});/
    const match = response.match(scriptRegex)
    
    if (!match) {
      // Essayer une regex alternative
      const altRegex = /window\["ytInitialData"\] = ({.*?});/
      const altMatch = response.match(altRegex)
      
      if (!altMatch) {
        // console.log('[YouTube Scraper Server] Aucune donnée YouTube trouvée')
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

    // console.log('[YouTube Scraper Server] Données YouTube extraites')

    // Extraire les vidéos
    let videos = []
    const contents = videoData?.contents?.twoColumnSearchResultsRenderer?.primaryContents?.sectionListRenderer?.contents || []
    
    // console.log(`[YouTube Scraper Server] Nombre de sections trouvées: ${contents.length}`)
    
    let totalVideosFound = 0
    let brunoVideosFound = 0
    
    for (const section of contents) {
      const items = section?.itemSectionRenderer?.contents || []
      // console.log(`[YouTube Scraper Server] Nombre d'items dans cette section: ${items.length}`)
      
      for (const item of items) {
        const videoRenderer = item?.videoRenderer
        if (videoRenderer) {
          totalVideosFound++
          const channelName = videoRenderer?.ownerText?.runs?.[0]?.text || 
                            videoRenderer?.longBylineText?.runs?.[0]?.text || ''
          const title = videoRenderer?.title?.runs?.[0]?.text || ''
          const videoId = videoRenderer?.videoId
          
          // console.log(`[YouTube Scraper Server] Vidéo ${totalVideosFound}: "${title}" - Chaîne: "${channelName}"`)
          
          // Filtrer par chaîne Bruno Guézennec
          const isBrunoChannel = channelName.toLowerCase().includes('bruno') && channelName.toLowerCase().includes('guézennec')
          
          if (isBrunoChannel) {
            brunoVideosFound++
            // console.log(`[YouTube Scraper Server] ✓ Vidéo de Bruno trouvée: "${title}"`)
            
            if (videoId && title) {
              // Vérifier si le titre contient le nom du groupe (avec variantes tiret/espace)
              const titleLower = title.toLowerCase()
              const bandNameLower = bandName.toLowerCase()
              
              // console.log(`[YouTube Scraper Server] Comparaison:`)
              // console.log(`[YouTube Scraper Server] - Titre: "${titleLower}"`)
              // console.log(`[YouTube Scraper Server] - Groupe recherché: "${bandNameLower}"`)
              
              // Fonction pour vérifier si le nom du groupe est suivi d'un séparateur valide
              const isValidMatch = (title: string, bandName: string) => {
                const regex = new RegExp(`\\b${bandName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s+[-:()]`, 'i')
                return regex.test(title)
              }
              
              // Recherche avec le nom original
              let matches = isValidMatch(titleLower, bandNameLower)
              // console.log(`[YouTube Scraper Server] - Match direct: ${matches}`)
              
              // Si pas de match et que le nom contient un tiret, essayer avec des espaces
              if (!matches && bandNameLower.includes('-')) {
                const bandWithSpaces = bandNameLower.replace(/-/g, ' ')
                matches = isValidMatch(titleLower, bandWithSpaces)
                // console.log(`[YouTube Scraper Server] - Essai avec espaces "${bandWithSpaces}": ${matches}`)
              }
              
              // Si pas de match et que le nom contient des espaces, essayer avec des tirets
              if (!matches && bandNameLower.includes(' ')) {
                const bandWithDashes = bandNameLower.replace(/\s+/g, '-')
                matches = isValidMatch(titleLower, bandWithDashes)
                // console.log(`[YouTube Scraper Server] - Essai avec tirets "${bandWithDashes}": ${matches}`)
              }
              
              if (matches) {
                const video = {
                  id: videoId,
                  title: title,
                  thumbnail: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
                  channelTitle: channelName,
                  duration: videoRenderer?.lengthText?.simpleText || '',
                  viewCount: videoRenderer?.viewCountText?.simpleText || '',
                  publishedTime: videoRenderer?.publishedTimeText?.simpleText || ''
                }
                
                videos.push(video)
                // console.log(`[YouTube Scraper Server] 🎯 VIDÉO MATCHÉE: ${title}`)
                // console.log(`[YouTube Scraper Server] - ID: ${videoId}`)
                // console.log(`[YouTube Scraper Server] - Thumbnail URL: ${video.thumbnail}`)
                // console.log(`[YouTube Scraper Server] - Channel: ${channelName}`)
                // console.log(`[YouTube Scraper Server] - Duration: ${video.duration}`)
                // console.log(`[YouTube Scraper Server] - Views: ${video.viewCount}`)
                // console.log(`[YouTube Scraper Server] - Published: ${video.publishedTime}`)
              } else {
                // console.log(`[YouTube Scraper Server] ❌ Pas de match pour: "${title}"`)
              }
            }
          } else {
            // console.log(`[YouTube Scraper Server] ✗ Pas une vidéo de Bruno: "${channelName}"`)
          }
        }
      }
    }

    // console.log(`[YouTube Scraper Server] ${videos.length} vidéo(s) trouvée(s) pour "${bandName}"`)
    const totalVideosProcessed = videos.length

    // Debug spécial pour comprendre le problème Coupe-Gorge
    if (bandName.toLowerCase().includes('coupe')) {
      // console.log(`[YouTube Scraper Server] === DEBUG COUPE-GORGE ===`)
      // console.log(`[YouTube Scraper Server] Recherche pour: "${bandName}"`)
      // console.log(`[YouTube Scraper Server] URL de recherche: ${brunoSearchUrl}`)
      // console.log(`[YouTube Scraper Server] Vidéos totales trouvées: ${totalVideosFound}`)
      // console.log(`[YouTube Scraper Server] Vidéos de Bruno trouvées: ${brunoVideosFound}`)
      // console.log(`[YouTube Scraper Server] Vidéos matchées: ${totalVideosProcessed}`)
      
      // Parcourir toutes les vidéos trouvées pour debug
      let debugVideoCount = 0
      for (const section of contents) {
        const items = section?.itemSectionRenderer?.contents || []
        for (const item of items) {
          const videoRenderer = item?.videoRenderer
          if (videoRenderer) {
            debugVideoCount++
            const title = videoRenderer?.title?.runs?.[0]?.text || ''
            const channelName = videoRenderer?.ownerText?.runs?.[0]?.text || 
                              videoRenderer?.longBylineText?.runs?.[0]?.text || ''
            
            // console.log(`[YouTube Scraper Server] Vidéo ${debugVideoCount}: "${title}"`)
            // console.log(`[YouTube Scraper Server] - Channel: "${channelName}"`)
            // console.log(`[YouTube Scraper Server] - Is Bruno channel: ${channelName.toLowerCase().includes('bruno') && channelName.toLowerCase().includes('guézennec')}`)
            
            if (channelName.toLowerCase().includes('bruno') && channelName.toLowerCase().includes('guézennec')) {
              const titleLower = title.toLowerCase()
              const bandNameLower = bandName.toLowerCase()
              
              // console.log(`[YouTube Scraper Server] - Title lower: "${titleLower}"`)
              // console.log(`[YouTube Scraper Server] - Band lower: "${bandNameLower}"`)
              // console.log(`[YouTube Scraper Server] - Direct match: ${titleLower.includes(bandNameLower)}`)
              
              if (bandNameLower.includes('-')) {
                const bandWithSpaces = bandNameLower.replace(/-/g, ' ')
                // console.log(`[YouTube Scraper Server] - Band with spaces: "${bandWithSpaces}"`)
                // console.log(`[YouTube Scraper Server] - Space match: ${titleLower.includes(bandWithSpaces)}`)
              }
            }
          }
        }
      }
      // console.log(`[YouTube Scraper Server] Total vidéos trouvées dans la page: ${debugVideoCount}`)
      // console.log(`[YouTube Scraper Server] === FIN DEBUG ===`)
    }

    // Limiter à 6 vidéos pour l'affichage
    const limitedVideos = videos.slice(0, 6)

    // Si aucune vidéo trouvée, retourner des vidéos de démo
    if (limitedVideos.length === 0) {
      // console.log('[YouTube Scraper Server] Aucune vidéo trouvée, retour de vidéos de démo')
      
      const demoVideo = {
        id: "qTsomvebRAA",
        title: "Testament - Electric crown [Live Hellfest 2023 - dimanche 18 juin]",
        thumbnail: "https://img.youtube.com/vi/qTsomvebRAA/mqdefault.jpg",
        channelTitle: "Bruno Guézennec",
        duration: "5:35",
        viewCount: "482 vues"
      }
      
      // console.log(`[YouTube Scraper Server] Vidéo de démo retournée:`)
      // console.log(`[YouTube Scraper Server] - ID: ${demoVideo.id}`)
      // console.log(`[YouTube Scraper Server] - Thumbnail URL: ${demoVideo.thumbnail}`)
      // console.log(`[YouTube Scraper Server] - Channel: ${demoVideo.channelTitle}`)
      // console.log(`[YouTube Scraper Server] - Duration: ${demoVideo.duration}`)
      // console.log(`[YouTube Scraper Server] - Views: ${demoVideo.viewCount}`)
      
      return {
        videos: [demoVideo],
        totalResults: 1,
        totalVideosFound: 0,
        demo: true,
        message: `Aucune vidéo trouvée pour "${bandName}" sur la chaîne Bruno Guézennec. Vidéo d'exemple affichée.`
      }
    }

    return {
      videos: limitedVideos,
      totalResults: limitedVideos.length,
      totalVideosFound: totalVideosFound
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
