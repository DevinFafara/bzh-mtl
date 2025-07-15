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
    
    let response = await fetch(brunoSearchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    })
    
    if (response.ok) {
      const html = await response.text()
      videoData = extractVideoDataFromHTML(html)
    }
    
    // Stratégie 2: Si pas de résultats, recherche avec ConcertsMetal-BZH
    if (videoData.length === 0) {
      const concertsMetalQuery = encodeURIComponent(`"ConcertsMetal-BZH" ${bandName}`)
      const concertsMetalUrl = `https://www.youtube.com/results?search_query=${concertsMetalQuery}`
      
      response = await fetch(concertsMetalUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      })
      
      if (response.ok) {
        const html = await response.text()
        videoData = extractVideoDataFromHTML(html)
      }
    }
    
    // Stratégie 3: Si toujours pas de résultats, recherche générale avec filtre strict
    if (videoData.length === 0) {
      const generalSearchQuery = encodeURIComponent(`${bandName} ConcertsMetal-BZH`)
      const generalSearchUrl = `https://www.youtube.com/results?search_query=${generalSearchQuery}`
      
      response = await fetch(generalSearchUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      })
      
      if (response.ok) {
        const html = await response.text()
        videoData = extractVideoDataFromHTML(html)
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
        viewCount: video.viewCount || ''
      }))

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
    
  } catch (error) {
    console.error('YouTube scraping error:', error)
    
    // Retourner des données de démo en cas d'erreur
    return {
      videos: [
        {
          id: 'dQw4w9WgXcQ',
          title: `${bandName} - Performance Live (Démo)`,
          thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg',
          channelTitle: 'ConcertsMetal-BZH',
          duration: '4:32',
          viewCount: '1.2M vues'
        },
        {
          id: 'LmuIXxmUagQ',
          title: `${bandName} - Interview Backstage (Démo)`,
          thumbnail: 'https://img.youtube.com/vi/LmuIXxmUagQ/mqdefault.jpg',
          channelTitle: 'ConcertsMetal-BZH',
          duration: '8:15',
          viewCount: '850K vues'
        }
      ],
      totalResults: 2,
      demo: true
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
            viewCount: videoRenderer.viewCountText?.simpleText || ''
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
