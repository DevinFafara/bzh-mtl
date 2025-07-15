import { _ as _sfc_main$2, u as useRequestFetch } from './NuxtImg-CHyr0FIh.mjs';
import { _ as _export_sfc, c as useRoute, a as __nuxt_component_0, f as __nuxt_component_3, g as fetchDefaults, e as useAsyncData } from './server.mjs';
import { _ as __nuxt_component_1 } from './CustomSanityContent-DFtE2pkc.mjs';
import { defineComponent, withAsyncContext, unref, withCtx, createTextVNode, toDisplayString, createVNode, createBlock, createCommentVNode, openBlock, mergeProps, computed, ref, watch, toValue, reactive, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderAttr, ssrIncludeBooleanAttr, ssrRenderStyle } from 'vue/server-renderer';
import { r as hash } from '../nitro/nitro.mjs';
import { isPlainObject } from '@vue/shared';
import { _ as __nuxt_component_0$1 } from './PostCard-Bjtf_EtO.mjs';
import { GlobeAltIcon } from '@heroicons/vue/24/outline';
import { g as groq, u as useSanityQuery } from './index-D7t3scmh.mjs';
import 'vue-router';
import '@iconify/vue';
import '@iconify/utils/lib/css/icon';
import 'perfect-debounce';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
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
import '@sanity/client';

function useFetch(request, arg1, arg2) {
  const [opts = {}, autoKey] = typeof arg1 === "string" ? [{}, arg1] : [arg1, arg2];
  const _request = computed(() => toValue(request));
  const key = computed(() => toValue(opts.key) || "$f" + hash([autoKey, typeof _request.value === "string" ? _request.value : "", ...generateOptionSegments(opts)]));
  if (!opts.baseURL && typeof _request.value === "string" && (_request.value[0] === "/" && _request.value[1] === "/")) {
    throw new Error('[nuxt] [useFetch] the request URL must not start with "//".');
  }
  const {
    server,
    lazy,
    default: defaultFn,
    transform,
    pick,
    watch: watchSources,
    immediate,
    getCachedData,
    deep,
    dedupe,
    ...fetchOptions
  } = opts;
  const _fetchOptions = reactive({
    ...fetchDefaults,
    ...fetchOptions,
    cache: typeof opts.cache === "boolean" ? void 0 : opts.cache
  });
  const _asyncDataOptions = {
    server,
    lazy,
    default: defaultFn,
    transform,
    pick,
    immediate,
    getCachedData,
    deep,
    dedupe,
    watch: watchSources === false ? [] : [...watchSources || [], _fetchOptions]
  };
  if (!immediate) {
    let setImmediate = function() {
      _asyncDataOptions.immediate = true;
    };
    watch(key, setImmediate, { flush: "sync", once: true });
    watch([...watchSources || [], _fetchOptions], setImmediate, { flush: "sync", once: true });
  }
  let controller;
  const asyncData = useAsyncData(watchSources === false ? key.value : key, () => {
    var _a;
    (_a = controller == null ? void 0 : controller.abort) == null ? void 0 : _a.call(controller, new DOMException("Request aborted as another request to the same endpoint was initiated.", "AbortError"));
    controller = typeof AbortController !== "undefined" ? new AbortController() : {};
    const timeoutLength = toValue(opts.timeout);
    let timeoutId;
    if (timeoutLength) {
      timeoutId = setTimeout(() => controller.abort(new DOMException("Request aborted due to timeout.", "AbortError")), timeoutLength);
      controller.signal.onabort = () => clearTimeout(timeoutId);
    }
    let _$fetch = opts.$fetch || globalThis.$fetch;
    if (!opts.$fetch) {
      const isLocalFetch = typeof _request.value === "string" && _request.value[0] === "/" && (!toValue(opts.baseURL) || toValue(opts.baseURL)[0] === "/");
      if (isLocalFetch) {
        _$fetch = useRequestFetch();
      }
    }
    return _$fetch(_request.value, { signal: controller.signal, ..._fetchOptions }).finally(() => {
      clearTimeout(timeoutId);
    });
  }, _asyncDataOptions);
  return asyncData;
}
function useLazyFetch(request, arg1, arg2) {
  const [opts = {}, autoKey] = typeof arg1 === "string" ? [{}, arg1] : [arg1, arg2];
  return useFetch(
    request,
    {
      ...opts,
      lazy: true
    },
    // @ts-expect-error we pass an extra argument with the resolved auto-key to prevent another from being injected
    autoKey
  );
}
function generateOptionSegments(opts) {
  var _a;
  const segments = [
    ((_a = toValue(opts.method)) == null ? void 0 : _a.toUpperCase()) || "GET",
    toValue(opts.baseURL)
  ];
  for (const _obj of [opts.params || opts.query]) {
    const obj = toValue(_obj);
    if (!obj) {
      continue;
    }
    const unwrapped = {};
    for (const [key, value] of Object.entries(obj)) {
      unwrapped[toValue(key)] = toValue(value);
    }
    segments.push(unwrapped);
  }
  if (opts.body) {
    const value = toValue(opts.body);
    if (!value) {
      segments.push(hash(value));
    } else if (value instanceof ArrayBuffer) {
      segments.push(hash(Object.fromEntries([...new Uint8Array(value).entries()].map(([k, v]) => [k, v.toString()]))));
    } else if (value instanceof FormData) {
      const obj = {};
      for (const entry of value.entries()) {
        const [key, val] = entry;
        obj[key] = val instanceof File ? val.name : val;
      }
      segments.push(hash(obj));
    } else if (isPlainObject(value)) {
      segments.push(hash(reactive(value)));
    } else {
      try {
        segments.push(hash(value));
      } catch {
        console.warn("[useFetch] Failed to hash body", value);
      }
    }
  }
  return segments;
}
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "YouTubeScraper",
  __ssrInlineRender: true,
  props: {
    bandName: {}
  },
  async setup(__props) {
    let __temp, __restore;
    const props = __props;
    const { data: videoData, pending, error, refresh } = ([__temp, __restore] = withAsyncContext(() => useLazyFetch("/api/youtube-scraper", {
      query: { band: props.bandName },
      server: false
    }, "$D58a1-hpCg")), __temp = await __temp, __restore(), __temp);
    const videos = computed(() => {
      var _a;
      return ((_a = videoData.value) == null ? void 0 : _a.videos) || [];
    });
    const isDemo = computed(() => {
      var _a;
      return ((_a = videoData.value) == null ? void 0 : _a.demo) || false;
    });
    const noVideosMessage = computed(() => {
      var _a;
      return ((_a = videoData.value) == null ? void 0 : _a.message) || "";
    });
    const hasServiceError = computed(() => {
      var _a;
      return ((_a = videoData.value) == null ? void 0 : _a.serviceError) || false;
    });
    const serviceErrorMessage = computed(() => {
      var _a;
      return ((_a = videoData.value) == null ? void 0 : _a.errorMessage) || "Service temporairement indisponible";
    });
    const serviceErrorDetails = computed(() => {
      var _a;
      return ((_a = videoData.value) == null ? void 0 : _a.errorDetails) || "";
    });
    const isNetworkError = computed(() => {
      var _a;
      return ((_a = videoData.value) == null ? void 0 : _a.errorType) === "network";
    });
    const selectedVideo = ref(null);
    watch(videos, (newVideos) => {
      if (newVideos.length > 0 && !selectedVideo.value) {
        selectedVideo.value = newVideos[0];
      }
    }, { immediate: true });
    const embedUrl = computed(() => {
      if (!selectedVideo.value) return "";
      return `https://www.youtube.com/embed/${selectedVideo.value.id}?autoplay=0&rel=0`;
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Icon = __nuxt_component_3;
      if (unref(pending) || unref(error) || unref(videos).length > 0 || unref(hasServiceError)) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "youtube-scraper" }, _attrs))} data-v-3d34ea05>`);
        if (unref(videos).length > 0) {
          _push(`<div class="flex items-center justify-between mb-6" data-v-3d34ea05><h2 class="font-bold text-xl" data-v-3d34ea05>Vid\xE9os Live de ${ssrInterpolate(props.bandName)} sur ConcertsMetal-BZH</h2></div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(videos).length > 0) {
          _push(`<div class="flex items-center justify-between mb-4" data-v-3d34ea05><div class="flex items-center gap-2" data-v-3d34ea05>`);
          _push(ssrRenderComponent(_component_Icon, {
            name: "simple-icons:youtube",
            class: "h-6 w-6 text-red-600"
          }, null, _parent));
          _push(`<span class="text-sm text-gray-600" data-v-3d34ea05>${ssrInterpolate(unref(isDemo) ? "Mode d\xE9mo" : `${unref(videos).length} vid\xE9o${unref(videos).length > 1 ? "s" : ""} trouv\xE9e${unref(videos).length > 1 ? "s" : ""}`)}</span></div><button${ssrIncludeBooleanAttr(unref(pending)) ? " disabled" : ""} class="text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50" data-v-3d34ea05>${ssrInterpolate(unref(pending) ? "Chargement..." : "Actualiser")}</button></div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(pending)) {
          _push(`<div class="text-center py-12" data-v-3d34ea05><div class="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto" data-v-3d34ea05></div><p class="mt-4 text-gray-600" data-v-3d34ea05>Recherche des vid\xE9os...</p></div>`);
        } else if (unref(error)) {
          _push(`<div class="text-center py-12" data-v-3d34ea05><div class="text-red-600 mb-4" data-v-3d34ea05>`);
          _push(ssrRenderComponent(_component_Icon, {
            name: "heroicons:exclamation-triangle",
            class: "h-12 w-12 mx-auto mb-2"
          }, null, _parent));
          _push(`<p data-v-3d34ea05>Erreur lors du chargement des vid\xE9os</p></div><button class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700" data-v-3d34ea05> R\xE9essayer </button></div>`);
        } else if (unref(hasServiceError) && unref(videos).length === 0) {
          _push(`<div class="py-8" data-v-3d34ea05><div class="bg-amber-50 border border-amber-200 rounded-lg p-6" data-v-3d34ea05><div class="flex items-start gap-3" data-v-3d34ea05>`);
          _push(ssrRenderComponent(_component_Icon, {
            name: unref(isNetworkError) ? "heroicons:wifi-slash" : "heroicons:exclamation-triangle",
            class: "h-6 w-6 text-amber-600 flex-shrink-0 mt-0.5"
          }, null, _parent));
          _push(`<div class="flex-1" data-v-3d34ea05><h3 class="font-medium text-amber-800 mb-1" data-v-3d34ea05>${ssrInterpolate(unref(serviceErrorMessage))}</h3><p class="text-sm text-amber-700 mb-3" data-v-3d34ea05>${ssrInterpolate(unref(noVideosMessage))}</p><details class="text-xs text-amber-600" data-v-3d34ea05><summary class="cursor-pointer hover:text-amber-800" data-v-3d34ea05>D\xE9tails techniques</summary><p class="mt-1 font-mono" data-v-3d34ea05>${ssrInterpolate(unref(serviceErrorDetails))}</p></details><div class="flex items-center gap-3 mt-4" data-v-3d34ea05><button${ssrIncludeBooleanAttr(unref(pending)) ? " disabled" : ""} class="text-sm px-3 py-1 bg-amber-600 text-white rounded hover:bg-amber-700 disabled:opacity-50" data-v-3d34ea05>${ssrInterpolate(unref(pending) ? "Chargement..." : "R\xE9essayer")}</button>`);
          if (unref(isNetworkError)) {
            _push(`<p class="text-xs text-amber-600" data-v-3d34ea05> \u2139\uFE0F Ce service fonctionne localement mais est bloqu\xE9 en production </p>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div></div></div></div>`);
        } else if (unref(videos).length > 0) {
          _push(`<div class="space-y-6" data-v-3d34ea05>`);
          if (unref(isDemo)) {
            _push(`<div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4" data-v-3d34ea05><div class="flex items-center gap-2" data-v-3d34ea05>`);
            _push(ssrRenderComponent(_component_Icon, {
              name: "heroicons:information-circle",
              class: "h-5 w-5 text-yellow-600"
            }, null, _parent));
            _push(`<span class="text-sm text-yellow-800" data-v-3d34ea05> Mode d\xE9mo activ\xE9 - Vid\xE9os d&#39;exemple affich\xE9es </span></div></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<div class="relative w-full bg-gray-900 rounded-lg overflow-hidden" style="${ssrRenderStyle({ "padding-bottom": "56.25%", "height": "0" })}" data-v-3d34ea05>`);
          if (unref(selectedVideo)) {
            _push(`<iframe${ssrRenderAttr("src", unref(embedUrl))} class="absolute top-0 left-0 w-full h-full" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy" data-v-3d34ea05></iframe>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
          if (unref(selectedVideo)) {
            _push(`<div class="space-y-2" data-v-3d34ea05><h4 class="font-semibold text-lg text-gray-900" data-v-3d34ea05>${ssrInterpolate(unref(selectedVideo).title)}</h4><div class="flex items-center gap-4 text-sm text-gray-600" data-v-3d34ea05><span data-v-3d34ea05>${ssrInterpolate(unref(selectedVideo).channelTitle)}</span>`);
            if (unref(selectedVideo).duration) {
              _push(`<span data-v-3d34ea05>${ssrInterpolate(unref(selectedVideo).duration)}</span>`);
            } else {
              _push(`<!---->`);
            }
            if (unref(selectedVideo).viewCount) {
              _push(`<span data-v-3d34ea05>${ssrInterpolate(unref(selectedVideo).viewCount)}</span>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div></div>`);
          } else {
            _push(`<!---->`);
          }
          if (unref(videos).length > 1) {
            _push(`<div class="space-y-3" data-v-3d34ea05><h5 class="font-medium text-gray-900" data-v-3d34ea05>Autres vid\xE9os :</h5><div class="grid grid-cols-1 lg:grid-cols-2 gap-3" data-v-3d34ea05><!--[-->`);
            ssrRenderList(unref(videos).filter((v) => {
              var _a;
              return v.id !== ((_a = unref(selectedVideo)) == null ? void 0 : _a.id);
            }), (video) => {
              _push(`<button class="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left group" data-v-3d34ea05><div class="relative flex-shrink-0" data-v-3d34ea05><img${ssrRenderAttr("src", video.thumbnail)}${ssrRenderAttr("alt", video.title)} class="w-24 h-18 object-cover rounded" loading="lazy" data-v-3d34ea05><div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center rounded" data-v-3d34ea05>`);
              _push(ssrRenderComponent(_component_Icon, {
                name: "heroicons:play",
                class: "h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity"
              }, null, _parent));
              _push(`</div>`);
              if (video.duration) {
                _push(`<div class="absolute bottom-1 right-1 bg-black bg-opacity-80 text-white text-xs px-1 rounded" data-v-3d34ea05>${ssrInterpolate(video.duration)}</div>`);
              } else {
                _push(`<!---->`);
              }
              _push(`</div><div class="flex-1 min-w-0 space-y-1" data-v-3d34ea05><p class="font-medium text-gray-900 line-clamp-2 text-sm leading-tight" data-v-3d34ea05>${ssrInterpolate(video.title)}</p><p class="text-xs text-gray-600" data-v-3d34ea05>${ssrInterpolate(video.channelTitle)}</p>`);
              if (video.viewCount) {
                _push(`<p class="text-xs text-gray-500" data-v-3d34ea05>${ssrInterpolate(video.viewCount)}</p>`);
              } else {
                _push(`<!---->`);
              }
              _push(`</div></button>`);
            });
            _push(`<!--]--></div></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/YouTubeScraper.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_4 = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-3d34ea05"]]);
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[slug]",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const route = useRoute();
    const query = groq`*[_type == "band" && slug.current == $slug][0] {
  _id,
  name,
  pressPhoto,
  logoImage,
  bio,
  cityOfOrigin,
  departmentOfOrigin,
  "styles": styles[]->{ _id, title, "slug": slug.current },
  links,
  "author": author->{ name, "slug": slug.current, image, bio, citation }
}`;
    const relatedPostsQuery = groq`*[_type == "post" && relatedBand._ref == $bandId] | order(publishedAt desc) [0...6] {
  _id,
  title,
  "slug": slug.current,
  mainImage,
  publishedAt,
  articleType,
  "author": author->name
}`;
    const upcomingEventsQuery = groq`*[_type == "event" && (
  (dateInfo.eventDuration == "single" && dateInfo.singleDate >= now()) ||
  (dateInfo.eventDuration == "multiple" && dateInfo.endDate >= now()) ||
  date >= now()
) && (
  $bandId in lineup[].band._ref ||
  $bandId in lineup[]._ref
)] | order(
  coalesce(dateInfo.singleDate, dateInfo.startDate, date) asc
) [0...6] {
  _id,
  title,
  "slug": slug.current,
  date, // Pour rétrocompatibilité
  dateInfo,
  poster,
  status,
  "eventType": eventType->title,
  venue {
    venueType,
    venueText,
    "venueDetails": venueReference->{
      name,
      city
    }
  }
}`;
    const { data: band } = ([__temp, __restore] = withAsyncContext(() => useSanityQuery(query, { slug: route.params.slug })), __temp = await __temp, __restore(), __temp);
    const { data: relatedPosts } = ([__temp, __restore] = withAsyncContext(() => {
      var _a;
      return useSanityQuery(relatedPostsQuery, {
        bandId: ((_a = band.value) == null ? void 0 : _a._id) || ""
      });
    }), __temp = await __temp, __restore(), __temp);
    const { data: upcomingEvents } = ([__temp, __restore] = withAsyncContext(() => {
      var _a;
      return useSanityQuery(upcomingEventsQuery, {
        bandId: ((_a = band.value) == null ? void 0 : _a._id) || ""
      });
    }), __temp = await __temp, __restore(), __temp);
    const formatEventDate = (event) => {
      var _a, _b, _c, _d, _e;
      const options = {
        weekday: "long",
        // 'samedi'
        year: "numeric",
        // '2025'
        month: "long",
        // 'décembre'
        day: "numeric"
        // '25'
      };
      if (((_a = event.dateInfo) == null ? void 0 : _a.eventDuration) === "single" && ((_b = event.dateInfo) == null ? void 0 : _b.singleDate)) {
        return new Date(event.dateInfo.singleDate).toLocaleDateString("fr-FR", options);
      } else if (((_c = event.dateInfo) == null ? void 0 : _c.eventDuration) === "multiple" && ((_d = event.dateInfo) == null ? void 0 : _d.startDate) && ((_e = event.dateInfo) == null ? void 0 : _e.endDate)) {
        const startDate = new Date(event.dateInfo.startDate).toLocaleDateString("fr-FR", options);
        const endDate = new Date(event.dateInfo.endDate).toLocaleDateString("fr-FR", options);
        return `${startDate} - ${endDate}`;
      }
      if (event.date) {
        return new Date(event.date).toLocaleDateString("fr-FR", options);
      }
      return "Date non d\xE9finie";
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtImg = _sfc_main$2;
      const _component_NuxtLink = __nuxt_component_0;
      const _component_Icon = __nuxt_component_3;
      const _component_CustomSanityContent = __nuxt_component_1;
      const _component_YouTubeScraper = __nuxt_component_4;
      const _component_PostCard = __nuxt_component_0$1;
      if (unref(band)) {
        _push(`<div${ssrRenderAttrs(_attrs)} data-v-8adb0082>`);
        if (unref(band).pressPhoto) {
          _push(`<div class="h-64 md:h-96 w-full relative" data-v-8adb0082>`);
          _push(ssrRenderComponent(_component_NuxtImg, {
            src: unref(band).pressPhoto.asset._ref,
            provider: "sanity",
            class: "w-full h-full object-cover",
            alt: `Photo de presse de ${unref(band).name}`
          }, null, _parent));
          _push(`<div class="absolute inset-0 bg-transparent bg-opacity-30 flex items-end p-4 md:p-8" data-v-8adb0082><h1 class="text-white text-4xl md:text-6xl font-extrabold drop-shadow-lg bg-stone-900/60" data-v-8adb0082>${ssrInterpolate(unref(band).name)}</h1></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="container mx-auto p-4 md:p-8" data-v-8adb0082><div class="sidebar-content" data-v-8adb0082>`);
        if (unref(band).logoImage) {
          _push(`<div class="logo-section mb-6" data-v-8adb0082>`);
          _push(ssrRenderComponent(_component_NuxtImg, {
            src: unref(band).logoImage.asset._ref,
            provider: "sanity",
            class: "w-full h-auto max-h-48 object-contain",
            alt: `Logo de ${unref(band).name}`
          }, null, _parent));
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="infos-section mb-6" data-v-8adb0082>`);
        if (unref(band).styles) {
          _push(`<div class="mb-4" data-v-8adb0082><h3 class="font-bold text-lg mb-2" data-v-8adb0082>Styles</h3><div class="flex flex-wrap gap-2" data-v-8adb0082><!--[-->`);
          ssrRenderList(unref(band).styles, (style) => {
            _push(ssrRenderComponent(_component_NuxtLink, {
              key: style._id,
              to: `/styles/${style.slug}`,
              class: "bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm hover:bg-gray-300 transition-colors"
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`${ssrInterpolate(style.title)}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(style.title), 1)
                  ];
                }
              }),
              _: 2
            }, _parent));
          });
          _push(`<!--]--></div></div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(band).departmentOfOrigin && unref(band).departmentOfOrigin.length > 0) {
          _push(`<div class="mb-4" data-v-8adb0082><p data-v-8adb0082><span class="font-bold" data-v-8adb0082>D\xE9partement${ssrInterpolate(unref(band).departmentOfOrigin.length > 1 ? "s" : "")} d&#39;origine :</span> ${ssrInterpolate(unref(band).departmentOfOrigin.join(", "))}</p></div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(band).cityOfOrigin) {
          _push(`<div class="mb-4" data-v-8adb0082><p data-v-8adb0082><span class="font-bold" data-v-8adb0082>Ville d&#39;origine :</span> ${ssrInterpolate(unref(band).cityOfOrigin)}</p></div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(band).links) {
          _push(`<div data-v-8adb0082><h3 class="font-bold text-lg mb-2" data-v-8adb0082>Liens</h3><div class="flex items-center gap-4" data-v-8adb0082>`);
          if (unref(band).links.website) {
            _push(`<a${ssrRenderAttr("href", unref(band).links.website)} target="_blank" rel="noopener noreferrer" class="text-gray-600 hover:text-black" data-v-8adb0082>`);
            _push(ssrRenderComponent(unref(GlobeAltIcon), { class: "h-6 w-6" }, null, _parent));
            _push(`</a>`);
          } else {
            _push(`<!---->`);
          }
          if (unref(band).links.bandcamp) {
            _push(`<a${ssrRenderAttr("href", unref(band).links.bandcamp)} target="_blank" rel="noopener noreferrer" class="text-gray-600 hover:text-black" data-v-8adb0082>`);
            _push(ssrRenderComponent(_component_Icon, {
              name: "simple-icons:bandcamp",
              class: "h-6 w-6"
            }, null, _parent));
            _push(`</a>`);
          } else {
            _push(`<!---->`);
          }
          if (unref(band).links.spotify) {
            _push(`<a${ssrRenderAttr("href", unref(band).links.spotify)} target="_blank" rel="noopener noreferrer" class="text-gray-600 hover:text-black" data-v-8adb0082>`);
            _push(ssrRenderComponent(_component_Icon, {
              name: "simple-icons:spotify",
              class: "h-6 w-6"
            }, null, _parent));
            _push(`</a>`);
          } else {
            _push(`<!---->`);
          }
          if (unref(band).links.facebook) {
            _push(`<a${ssrRenderAttr("href", unref(band).links.facebook)} target="_blank" rel="noopener noreferrer" class="text-gray-600 hover:text-black" data-v-8adb0082>`);
            _push(ssrRenderComponent(_component_Icon, {
              name: "simple-icons:facebook",
              class: "h-6 w-6"
            }, null, _parent));
            _push(`</a>`);
          } else {
            _push(`<!---->`);
          }
          if (unref(band).links.instagram) {
            _push(`<a${ssrRenderAttr("href", unref(band).links.instagram)} target="_blank" rel="noopener noreferrer" class="text-gray-600 hover:text-black" data-v-8adb0082>`);
            _push(ssrRenderComponent(_component_Icon, {
              name: "simple-icons:instagram",
              class: "h-6 w-6"
            }, null, _parent));
            _push(`</a>`);
          } else {
            _push(`<!---->`);
          }
          if (unref(band).links.youtube) {
            _push(`<a${ssrRenderAttr("href", unref(band).links.youtube)} target="_blank" rel="noopener noreferrer" class="text-gray-600 hover:text-black" data-v-8adb0082>`);
            _push(ssrRenderComponent(_component_Icon, {
              name: "simple-icons:youtube",
              class: "h-6 w-6"
            }, null, _parent));
            _push(`</a>`);
          } else {
            _push(`<!---->`);
          }
          if (unref(band).links.linktree) {
            _push(`<a${ssrRenderAttr("href", unref(band).links.linktree)} target="_blank" rel="noopener noreferrer" class="text-gray-600 hover:text-black" data-v-8adb0082>`);
            _push(ssrRenderComponent(_component_Icon, {
              name: "simple-icons:linktree",
              class: "h-6 w-6"
            }, null, _parent));
            _push(`</a>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div><div class="bio-section mb-12" data-v-8adb0082>`);
        if (unref(band).bio) {
          _push(`<div class="max-w-none" data-v-8adb0082><h2 class="font-bold text-2xl mb-4" data-v-8adb0082>Biographie</h2>`);
          _push(ssrRenderComponent(_component_CustomSanityContent, {
            blocks: unref(band).bio
          }, null, _parent));
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
        if (unref(upcomingEvents) && unref(upcomingEvents).length > 0) {
          _push(`<div class="upcoming-events-section mb-12" data-v-8adb0082><h2 class="font-bold text-xl mb-6" data-v-8adb0082>Prochains concerts de ${ssrInterpolate(unref(band).name)}</h2><ul class="space-y-2" data-v-8adb0082><!--[-->`);
          ssrRenderList(unref(upcomingEvents), (event) => {
            _push(`<li data-v-8adb0082>`);
            _push(ssrRenderComponent(_component_NuxtLink, {
              to: `/evenements/${event.slug}`,
              class: "flex flex-col sm:flex-row sm:items-center gap-x-6 gap-y-1 p-4 bg-white border border-transparent rounded-lg hover:bg-yellow-50 hover:border-yellow-400 transition-all duration-200"
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`<span class="text-sm font-semibold text-yellow-600 uppercase tracking-wider" data-v-8adb0082${_scopeId}>${ssrInterpolate(formatEventDate(event))}</span><span class="text-xl font-bold text-gray-900" data-v-8adb0082${_scopeId}>${ssrInterpolate(event.title)}</span><div class="flex flex-wrap gap-2 items-center" data-v-8adb0082${_scopeId}>`);
                  if (event.eventType) {
                    _push2(`<span class="inline-block bg-gray-200 text-center text-gray-800 px-3 py-1 rounded-full text-sm font-medium" data-v-8adb0082${_scopeId}>${ssrInterpolate(event.eventType)}</span>`);
                  } else {
                    _push2(`<!---->`);
                  }
                  if (event.venue) {
                    _push2(`<span class="text-sm text-gray-600 flex items-center" data-v-8adb0082${_scopeId}>`);
                    _push2(ssrRenderComponent(_component_Icon, {
                      name: "heroicons:map-pin",
                      class: "h-4 w-4 inline mr-1"
                    }, null, _parent2, _scopeId));
                    if (event.venue.venueType === "reference" && event.venue.venueDetails) {
                      _push2(`<span data-v-8adb0082${_scopeId}>${ssrInterpolate(event.venue.venueDetails.name)}, ${ssrInterpolate(event.venue.venueDetails.city)}</span>`);
                    } else if (event.venue.venueType === "text") {
                      _push2(`<span data-v-8adb0082${_scopeId}>${ssrInterpolate(event.venue.venueText)}</span>`);
                    } else {
                      _push2(`<!---->`);
                    }
                    _push2(`</span>`);
                  } else {
                    _push2(`<!---->`);
                  }
                  _push2(`</div>`);
                } else {
                  return [
                    createVNode("span", { class: "text-sm font-semibold text-yellow-600 uppercase tracking-wider" }, toDisplayString(formatEventDate(event)), 1),
                    createVNode("span", { class: "text-xl font-bold text-gray-900" }, toDisplayString(event.title), 1),
                    createVNode("div", { class: "flex flex-wrap gap-2 items-center" }, [
                      event.eventType ? (openBlock(), createBlock("span", {
                        key: 0,
                        class: "inline-block bg-gray-200 text-center text-gray-800 px-3 py-1 rounded-full text-sm font-medium"
                      }, toDisplayString(event.eventType), 1)) : createCommentVNode("", true),
                      event.venue ? (openBlock(), createBlock("span", {
                        key: 1,
                        class: "text-sm text-gray-600 flex items-center"
                      }, [
                        createVNode(_component_Icon, {
                          name: "heroicons:map-pin",
                          class: "h-4 w-4 inline mr-1"
                        }),
                        event.venue.venueType === "reference" && event.venue.venueDetails ? (openBlock(), createBlock("span", { key: 0 }, toDisplayString(event.venue.venueDetails.name) + ", " + toDisplayString(event.venue.venueDetails.city), 1)) : event.venue.venueType === "text" ? (openBlock(), createBlock("span", { key: 1 }, toDisplayString(event.venue.venueText), 1)) : createCommentVNode("", true)
                      ])) : createCommentVNode("", true)
                    ])
                  ];
                }
              }),
              _: 2
            }, _parent));
            _push(`</li>`);
          });
          _push(`<!--]--></ul></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="youtube-section mb-12" data-v-8adb0082>`);
        _push(ssrRenderComponent(_component_YouTubeScraper, {
          "band-name": unref(band).name
        }, null, _parent));
        _push(`</div>`);
        if (unref(relatedPosts) && Array.isArray(unref(relatedPosts)) && unref(relatedPosts).length > 0) {
          _push(`<div class="related-posts-section mb-12" data-v-8adb0082><h2 class="font-bold text-xl mb-6" data-v-8adb0082>Articles en lien avec ${ssrInterpolate(unref(band).name)}</h2><div class="grid grid-cols-1 md:grid-cols-2 gap-6" data-v-8adb0082><!--[-->`);
          ssrRenderList(unref(relatedPosts), (post) => {
            _push(ssrRenderComponent(_component_PostCard, {
              key: post._id,
              post
            }, null, _parent));
          });
          _push(`<!--]--></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="author-section" data-v-8adb0082>`);
        if (unref(band).author) {
          _push(`<div class="bg-gray-50 p-6 rounded-lg" data-v-8adb0082><div class="flex items-start gap-4" data-v-8adb0082>`);
          if (unref(band).author.image) {
            _push(ssrRenderComponent(_component_NuxtImg, {
              src: unref(band).author.image.asset._ref,
              provider: "sanity",
              class: "h-16 w-16 rounded-full object-cover flex-shrink-0"
            }, null, _parent));
          } else {
            _push(`<!---->`);
          }
          _push(`<div data-v-8adb0082><p class="font-semibold" data-v-8adb0082> Fiche r\xE9dig\xE9e par `);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: `/auteurs/${unref(band).author.slug}`,
            class: "text-blue-600 hover:underline"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(unref(band).author.name)}`);
              } else {
                return [
                  createTextVNode(toDisplayString(unref(band).author.name), 1)
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`</p>`);
          if (unref(band).author.citation) {
            _push(`<div class="text-gray-600 italic mt-2 prose prose-sm" data-v-8adb0082><p data-v-8adb0082>${ssrInterpolate(unref(band).author.citation)}</p></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div></div>`);
      } else {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "text-center p-16" }, _attrs))} data-v-8adb0082><p data-v-8adb0082>Groupe non trouv\xE9...</p></div>`);
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/groupes/[slug].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _slug_ = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-8adb0082"]]);

export { _slug_ as default };
//# sourceMappingURL=_slug_-Cyu9MgUF.mjs.map
