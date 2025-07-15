import { d as defineEventHandler, g as getQuery, c as createError } from '../../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import '@iconify/utils';
import 'consola';
import 'node:url';
import 'ipx';

const youtubeScraper = defineEventHandler(async (event) => {
  const query = getQuery(event);
  const bandName = query.band;
  if (!bandName) {
    throw createError({
      statusCode: 400,
      statusMessage: "Band name is required"
    });
  }
  try {
    let videoData = [];
    const brunoSearchQuery = encodeURIComponent(`"Bruno Gu\xE9zennec" ${bandName}`);
    const brunoSearchUrl = `https://www.youtube.com/results?search_query=${brunoSearchQuery}`;
    console.log(`[YouTube Scraper] Recherche pour "${bandName}"`);
    console.log(`[YouTube Scraper] URL: ${brunoSearchUrl}`);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1e4);
    let response = await fetch(brunoSearchUrl, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "fr-FR,fr;q=0.9,en;q=0.8",
        "Accept-Encoding": "gzip, deflate, br",
        "Cache-Control": "no-cache",
        "Pragma": "no-cache"
      }
    });
    clearTimeout(timeoutId);
    console.log(`[YouTube Scraper] Status: ${response.status}`);
    console.log(`[YouTube Scraper] Headers:`, Object.fromEntries(response.headers.entries()));
    if (response.ok) {
      const html = await response.text();
      console.log(`[YouTube Scraper] HTML re\xE7u: ${html.length} caract\xE8res`);
      videoData = extractVideoDataFromHTML(html);
      console.log(`[YouTube Scraper] Vid\xE9os extraites: ${videoData.length}`);
    } else {
      console.error(`[YouTube Scraper] Erreur HTTP: ${response.status} ${response.statusText}`);
    }
    if (videoData.length === 0) {
      console.log(`[YouTube Scraper] Tentative avec ConcertsMetal-BZH`);
      const concertsMetalQuery = encodeURIComponent(`"ConcertsMetal-BZH" ${bandName}`);
      const concertsMetalUrl = `https://www.youtube.com/results?search_query=${concertsMetalQuery}`;
      const controller2 = new AbortController();
      const timeoutId2 = setTimeout(() => controller2.abort(), 1e4);
      response = await fetch(concertsMetalUrl, {
        signal: controller2.signal,
        headers: {
          "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
          "Accept-Language": "fr-FR,fr;q=0.9,en;q=0.8",
          "Accept-Encoding": "gzip, deflate, br",
          "Cache-Control": "no-cache",
          "Pragma": "no-cache"
        }
      });
      clearTimeout(timeoutId2);
      if (response.ok) {
        const html = await response.text();
        videoData = extractVideoDataFromHTML(html);
        console.log(`[YouTube Scraper] Vid\xE9os ConcertsMetal-BZH: ${videoData.length}`);
      }
    }
    if (videoData.length === 0) {
      console.log(`[YouTube Scraper] Tentative recherche g\xE9n\xE9rale`);
      const generalSearchQuery = encodeURIComponent(`${bandName} ConcertsMetal-BZH`);
      const generalSearchUrl = `https://www.youtube.com/results?search_query=${generalSearchQuery}`;
      const controller3 = new AbortController();
      const timeoutId3 = setTimeout(() => controller3.abort(), 1e4);
      response = await fetch(generalSearchUrl, {
        signal: controller3.signal,
        headers: {
          "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
          "Accept-Language": "fr-FR,fr;q=0.9,en;q=0.8",
          "Accept-Encoding": "gzip, deflate, br",
          "Cache-Control": "no-cache",
          "Pragma": "no-cache"
        }
      });
      clearTimeout(timeoutId3);
      if (response.ok) {
        const html = await response.text();
        videoData = extractVideoDataFromHTML(html);
        console.log(`[YouTube Scraper] Vid\xE9os g\xE9n\xE9rales: ${videoData.length}`);
      }
    }
    const brunoVideos = videoData.filter((video) => {
      if (!video.videoId || !video.title) return false;
      const isBruno = isBrunoGuezennecChannel(video.channelName);
      if (!isBruno) return false;
      return video.title.toLowerCase().includes(bandName.toLowerCase());
    }).slice(0, 6).map((video) => ({
      id: video.videoId,
      title: cleanTitle(video.title),
      thumbnail: `https://img.youtube.com/vi/${video.videoId}/mqdefault.jpg`,
      channelTitle: video.channelName || "Bruno Gu\xE9zennec",
      duration: video.duration || "",
      viewCount: video.viewCount || ""
    }));
    if (brunoVideos.length === 0) {
      return {
        videos: [],
        totalResults: 0,
        message: `Aucune vid\xE9o de la cha\xEEne "Bruno Gu\xE9zennec" trouv\xE9e pour ${bandName}`
      };
    }
    const videos = brunoVideos;
    return { videos, totalResults: videos.length };
  } catch (error) {
    console.error("[YouTube Scraper] Erreur compl\xE8te:", error);
    let errorMessage = "Erreur lors du chargement des vid\xE9os";
    let errorDetails = "";
    let isNetworkError = false;
    if (error instanceof TypeError && error.message.includes("fetch")) {
      errorMessage = "Service YouTube temporairement indisponible";
      errorDetails = "Le scraping YouTube est bloqu\xE9 en production (Netlify)";
      isNetworkError = true;
    } else if (error.name === "AbortError") {
      errorMessage = "Timeout de la requ\xEAte";
      errorDetails = "La requ\xEAte YouTube a pris trop de temps";
      isNetworkError = true;
    } else if (error instanceof Error) {
      errorDetails = error.message;
      if (error.message.includes("ENOTFOUND") || error.message.includes("ECONNREFUSED")) {
        isNetworkError = true;
        errorMessage = "Connexion YouTube bloqu\xE9e";
        errorDetails = "Les requ\xEAtes vers YouTube sont bloqu\xE9es sur ce serveur";
      }
    }
    console.error(`[YouTube Scraper] ${errorMessage}: ${errorDetails}`);
    return {
      videos: [],
      totalResults: 0,
      serviceError: true,
      errorType: isNetworkError ? "network" : "scraping",
      errorMessage,
      errorDetails,
      message: isNetworkError ? `Service vid\xE9o temporairement indisponible pour ${bandName} (restrictions r\xE9seau en production)` : `Impossible de r\xE9cup\xE9rer les vid\xE9os de ${bandName} actuellement`
    };
  }
});
function extractVideoDataFromHTML(html) {
  var _a, _b, _c, _d;
  const videos = [];
  try {
    const scriptMatch = html.match(/var ytInitialData = ({.*?});/);
    if (!scriptMatch) {
      console.warn("No ytInitialData found in HTML");
      return videos;
    }
    const data = JSON.parse(scriptMatch[1]);
    const contents = (_d = (_c = (_b = (_a = data == null ? void 0 : data.contents) == null ? void 0 : _a.twoColumnSearchResultsRenderer) == null ? void 0 : _b.primaryContents) == null ? void 0 : _c.sectionListRenderer) == null ? void 0 : _d.contents;
    if (!contents) {
      console.warn("No video contents found in YouTube data");
      return videos;
    }
    contents.forEach((section) => {
      var _a2;
      const items = ((_a2 = section == null ? void 0 : section.itemSectionRenderer) == null ? void 0 : _a2.contents) || [];
      items.forEach((item) => {
        var _a3, _b2, _c2, _d2, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o;
        const videoRenderer = item == null ? void 0 : item.videoRenderer;
        if (videoRenderer) {
          let channelName = "";
          if ((_c2 = (_b2 = (_a3 = videoRenderer.ownerText) == null ? void 0 : _a3.runs) == null ? void 0 : _b2[0]) == null ? void 0 : _c2.text) {
            channelName = videoRenderer.ownerText.runs[0].text;
          } else if ((_f = (_e = (_d2 = videoRenderer.longBylineText) == null ? void 0 : _d2.runs) == null ? void 0 : _e[0]) == null ? void 0 : _f.text) {
            channelName = videoRenderer.longBylineText.runs[0].text;
          } else if ((_i = (_h = (_g = videoRenderer.shortBylineText) == null ? void 0 : _g.runs) == null ? void 0 : _h[0]) == null ? void 0 : _i.text) {
            channelName = videoRenderer.shortBylineText.runs[0].text;
          }
          const video = {
            videoId: videoRenderer.videoId,
            title: ((_l = (_k = (_j = videoRenderer.title) == null ? void 0 : _j.runs) == null ? void 0 : _k[0]) == null ? void 0 : _l.text) || ((_m = videoRenderer.title) == null ? void 0 : _m.simpleText) || "",
            channelName,
            duration: ((_n = videoRenderer.lengthText) == null ? void 0 : _n.simpleText) || "",
            viewCount: ((_o = videoRenderer.viewCountText) == null ? void 0 : _o.simpleText) || ""
          };
          if (video.videoId && video.title) {
            videos.push(video);
          }
        }
      });
    });
  } catch (parseError) {
    console.error("Error parsing YouTube data:", parseError);
  }
  return videos;
}
function isBrunoGuezennecChannel(channelName) {
  if (!channelName) return false;
  const normalizedChannelName = channelName.toLowerCase().replace(/[àáâäç]/g, "a").replace(/[èéêë]/g, "e").replace(/[ùúûü]/g, "u").replace(/[^a-z0-9\s-]/g, " ").replace(/\s+/g, " ").trim();
  const exactMatches = [
    "bruno guezennec",
    "bruno gu\xE9zennec",
    "concertsmetal-bzh",
    "concertsmetal bzh",
    "concerts metal bzh"
  ];
  const isExactMatch = exactMatches.some((keyword) => normalizedChannelName === keyword);
  const containsKeywords = exactMatches.some((keyword) => normalizedChannelName.includes(keyword));
  const containsBruno = normalizedChannelName.includes("bruno") && (normalizedChannelName.includes("guezennec") || normalizedChannelName.includes("guezennec"));
  const containsConcertsMetal = normalizedChannelName.includes("concertsmetal") || normalizedChannelName.includes("concerts") && normalizedChannelName.includes("metal");
  return isExactMatch || containsKeywords || containsBruno || containsConcertsMetal;
}
function cleanTitle(title) {
  return title.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").trim();
}

export { youtubeScraper as default };
//# sourceMappingURL=youtube-scraper.mjs.map
