import { _ as _sfc_main$1 } from './BandCard-CPyibhNy.mjs';
import { _ as _sfc_main$2 } from './VenueCard-D2zIv40j.mjs';
import { _ as __nuxt_component_0 } from './PostCard-Bjtf_EtO.mjs';
import { c as useRoute, d as useRouter, e as useAsyncData, a as __nuxt_component_0$1, f as __nuxt_component_3 } from './server.mjs';
import { _ as _sfc_main$3 } from './NuxtImg-CHyr0FIh.mjs';
import { defineComponent, ref, withAsyncContext, watch, computed, mergeProps, unref, withCtx, createVNode, createBlock, openBlock, createCommentVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderComponent } from 'vue/server-renderer';
import { g as groq, a as useSanity } from './index-D7t3scmh.mjs';
import '../nitro/nitro.mjs';
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
import '@sanity/client';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "recherche",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const route = useRoute();
    useRouter();
    const debugInfo = ref({});
    const errorDetails = ref(null);
    const searchTerm = ref(route.query.q || "");
    const query = groq`
  *[_type in ["post", "band", "event", "venue"] && (
    title match "*" + $term + "*" || 
    name match "*" + $term + "*"
  )] | order(_createdAt desc) [0...20] {
    _type,
    _id,
    "title": coalesce(title, name),
    "slug": slug.current,
    "image": coalesce(mainImage, pressPhoto, logoImage),
    "date": coalesce(publishedAt, date, _createdAt),
    // Champs spécifiques pour les groupes (bands)
    _type == "band" => {
      name,
      pressPhoto,
      "styles": styles[]->{title}
    },
    // Champs spécifiques pour les articles (posts)
    _type == "post" => {
      title,
      mainImage,
      publishedAt,
      articleType,
      "author": author->name
    },
    // Champs spécifiques pour les salles (venues)
    _type == "venue" => {
      name,
      "image": coalesce(image, mainImage),
      city
    },
    // Champs spécifiques pour les événements (events)
    _type == "event" => {
      title,
      date,
      "image": coalesce(image, mainImage),
      "venue": venue->{name}
    },
    // Debug info
    "rawTitle": title,
    "rawName": name
  }
`;
    const performSearch = async () => {
      try {
        debugInfo.value = {
          searchTerm: searchTerm.value,
          queryExecuted: query,
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        };
        if (!searchTerm.value || searchTerm.value.trim().length < 2) {
          return [];
        }
        const sanity = useSanity();
        const results2 = await sanity.fetch(query, { term: searchTerm.value.trim() });
        debugInfo.value = {
          ...debugInfo.value,
          resultsCount: (results2 == null ? void 0 : results2.length) || 0,
          rawResults: results2
        };
        return results2 || [];
      } catch (err) {
        console.error("Erreur de recherche:", err);
        errorDetails.value = {
          message: (err == null ? void 0 : err.message) || "Erreur inconnue",
          stack: err == null ? void 0 : err.stack,
          query,
          searchTerm: searchTerm.value
        };
        return [];
      }
    };
    const { data: results, pending, error, refresh } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      `search-${searchTerm.value}`,
      performSearch,
      {
        watch: [searchTerm],
        default: () => []
      }
    )), __temp = await __temp, __restore(), __temp);
    watch(() => route.query.q, (newQuery) => {
      searchTerm.value = newQuery || "";
      errorDetails.value = null;
    });
    const getPathForType = (type) => {
      switch (type) {
        case "post":
          return "/articles";
        case "band":
          return "/groupes";
        case "event":
          return "/evenements";
        case "venue":
          return "/salles";
        default:
          return "/";
      }
    };
    const getReadableType = (type) => {
      switch (type) {
        case "post":
          return "Article";
        case "band":
          return "Groupe";
        case "event":
          return "\xC9v\xE9nement";
        case "venue":
          return "Salle";
        default:
          return type;
      }
    };
    const formatDate = (dateString) => {
      try {
        return new Date(dateString).toLocaleDateString("fr-FR", {
          year: "numeric",
          month: "long",
          day: "numeric"
        });
      } catch {
        return "Date inconnue";
      }
    };
    const bandsFound = computed(() => {
      var _a;
      return ((_a = results.value) == null ? void 0 : _a.filter((item) => item._type === "band")) || [];
    });
    const postsFound = computed(() => {
      var _a;
      return ((_a = results.value) == null ? void 0 : _a.filter((item) => item._type === "post")) || [];
    });
    const venuesFound = computed(() => {
      var _a;
      return ((_a = results.value) == null ? void 0 : _a.filter((item) => item._type === "venue")) || [];
    });
    const eventsFound = computed(() => {
      var _a;
      return ((_a = results.value) == null ? void 0 : _a.filter((item) => item._type === "event")) || [];
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_BandCard = _sfc_main$1;
      const _component_VenueCard = _sfc_main$2;
      const _component_PostCard = __nuxt_component_0;
      const _component_NuxtLink = __nuxt_component_0$1;
      const _component_NuxtImg = _sfc_main$3;
      const _component_Icon = __nuxt_component_3;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "container mx-auto p-4 md:p-8" }, _attrs))}><h1 class="text-2xl md:text-4xl font-bold mb-2"> R\xE9sultats de recherche </h1><p class="text-lg text-gray-600 mb-8"> Pour le terme : <span class="font-semibold text-yellow-600">&quot;${ssrInterpolate(unref(searchTerm))}&quot;</span></p>`);
      if (unref(pending)) {
        _push(`<div class="text-center py-16"><div class="animate-spin inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mb-4"></div><p>Recherche en cours...</p></div>`);
      } else if (unref(error)) {
        _push(`<div class="text-center py-16 text-red-500"><p class="text-xl font-semibold">Une erreur est survenue lors de la recherche.</p><p class="text-sm mt-2">${ssrInterpolate(unref(error))}</p></div>`);
      } else if (unref(results) && Array.isArray(unref(results)) && unref(results).length > 0) {
        _push(`<div class="space-y-12"><p class="text-gray-500 font-bold mb-6">${ssrInterpolate(unref(results).length)} r\xE9sultat(s) trouv\xE9(s)</p>`);
        if (unref(bandsFound).length > 0) {
          _push(`<div class="space-y-6 mb-12"><h2 class="text-gray-800">Groupes trouv\xE9s (${ssrInterpolate(unref(bandsFound).length)})</h2><div class="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"><!--[-->`);
          ssrRenderList(unref(bandsFound), (band) => {
            _push(`<div>`);
            _push(ssrRenderComponent(_component_BandCard, { band }, null, _parent));
            _push(`</div>`);
          });
          _push(`<!--]--></div></div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(venuesFound).length > 0) {
          _push(`<div class="space-y-6 mb-12"><h2 class="text-gray-800">Salles trouv\xE9es (${ssrInterpolate(unref(venuesFound).length)})</h2><div class="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"><!--[-->`);
          ssrRenderList(unref(venuesFound), (venue) => {
            _push(ssrRenderComponent(_component_VenueCard, {
              key: venue._id,
              venue
            }, null, _parent));
          });
          _push(`<!--]--></div></div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(postsFound).length > 0) {
          _push(`<div class="space-y-6 mb-12"><h2 class="text-gray-800">Articles trouv\xE9s (${ssrInterpolate(unref(postsFound).length)})</h2><div class="space-y-4"><!--[-->`);
          ssrRenderList(unref(postsFound), (post) => {
            _push(ssrRenderComponent(_component_PostCard, {
              key: post._id,
              post
            }, null, _parent));
          });
          _push(`<!--]--></div></div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(eventsFound).length > 0) {
          _push(`<div class="space-y-6 mb-12"><h2 class="text-gray-800">\xC9v\xE9nements trouv\xE9s (${ssrInterpolate(unref(eventsFound).length)})</h2><div class="space-y-4"><!--[-->`);
          ssrRenderList(unref(eventsFound), (event) => {
            _push(ssrRenderComponent(_component_NuxtLink, {
              key: event._id,
              to: `${getPathForType(event._type)}/${event.slug}`,
              class: "group flex bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 w-full"
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                var _a, _b, _c, _d;
                if (_push2) {
                  _push2(`<div class="w-32 h-24 flex-shrink-0 bg-gray-100"${_scopeId}>`);
                  if ((_b = (_a = event.image) == null ? void 0 : _a.asset) == null ? void 0 : _b._ref) {
                    _push2(ssrRenderComponent(_component_NuxtImg, {
                      src: event.image.asset._ref,
                      provider: "sanity",
                      class: "w-full h-full object-cover",
                      alt: `Image pour ${event.title}`
                    }, null, _parent2, _scopeId));
                  } else {
                    _push2(`<div class="h-full flex items-center justify-center"${_scopeId}>`);
                    _push2(ssrRenderComponent(_component_Icon, {
                      name: "heroicons:calendar-days",
                      class: "h-8 w-8 text-gray-300"
                    }, null, _parent2, _scopeId));
                    _push2(`</div>`);
                  }
                  _push2(`</div><div class="flex-1 p-4 flex flex-col justify-between"${_scopeId}><div${_scopeId}><span class="text-sm font-medium text-blue-600 uppercase tracking-wide"${_scopeId}>${ssrInterpolate(getReadableType(event._type))}</span><h3 class="text-lg font-bold mt-1 group-hover:text-blue-600 transition-colors"${_scopeId}>${ssrInterpolate(event.title || "Titre manquant")}</h3></div>`);
                  if (event.date) {
                    _push2(`<p class="text-xs text-gray-500 mt-2"${_scopeId}>${ssrInterpolate(formatDate(event.date))}</p>`);
                  } else {
                    _push2(`<!---->`);
                  }
                  _push2(`</div>`);
                } else {
                  return [
                    createVNode("div", { class: "w-32 h-24 flex-shrink-0 bg-gray-100" }, [
                      ((_d = (_c = event.image) == null ? void 0 : _c.asset) == null ? void 0 : _d._ref) ? (openBlock(), createBlock(_component_NuxtImg, {
                        key: 0,
                        src: event.image.asset._ref,
                        provider: "sanity",
                        class: "w-full h-full object-cover",
                        alt: `Image pour ${event.title}`
                      }, null, 8, ["src", "alt"])) : (openBlock(), createBlock("div", {
                        key: 1,
                        class: "h-full flex items-center justify-center"
                      }, [
                        createVNode(_component_Icon, {
                          name: "heroicons:calendar-days",
                          class: "h-8 w-8 text-gray-300"
                        })
                      ]))
                    ]),
                    createVNode("div", { class: "flex-1 p-4 flex flex-col justify-between" }, [
                      createVNode("div", null, [
                        createVNode("span", { class: "text-sm font-medium text-blue-600 uppercase tracking-wide" }, toDisplayString(getReadableType(event._type)), 1),
                        createVNode("h3", { class: "text-lg font-bold mt-1 group-hover:text-blue-600 transition-colors" }, toDisplayString(event.title || "Titre manquant"), 1)
                      ]),
                      event.date ? (openBlock(), createBlock("p", {
                        key: 0,
                        class: "text-xs text-gray-500 mt-2"
                      }, toDisplayString(formatDate(event.date)), 1)) : createCommentVNode("", true)
                    ])
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
        _push(`</div>`);
      } else if (unref(searchTerm) && unref(searchTerm).length < 2) {
        _push(`<div class="text-center py-16"><p class="text-xl font-semibold text-gray-700">Terme de recherche trop court</p><p class="text-gray-500 mt-2">Veuillez entrer au moins 2 caract\xE8res pour effectuer une recherche.</p></div>`);
      } else if (unref(searchTerm)) {
        _push(`<div class="text-center py-16"><p class="text-xl font-semibold text-gray-700">Aucun r\xE9sultat trouv\xE9.</p><p class="text-gray-500 mt-2">Essayez avec d&#39;autres mots-cl\xE9s.</p></div>`);
      } else {
        _push(`<div class="text-center py-16"><p class="text-xl font-semibold text-gray-700">Effectuez une recherche</p><p class="text-gray-500 mt-2">Utilisez la barre de recherche pour trouver des articles, groupes ou \xE9v\xE9nements.</p></div>`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/recherche.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=recherche-DosNBPsq.mjs.map
