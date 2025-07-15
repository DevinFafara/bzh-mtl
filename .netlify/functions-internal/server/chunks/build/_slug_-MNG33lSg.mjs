import { _ as _sfc_main$1 } from './NuxtImg-CHyr0FIh.mjs';
import { _ as __nuxt_component_1 } from './CustomSanityContent-DFtE2pkc.mjs';
import { c as useRoute, a as __nuxt_component_0, f as __nuxt_component_3 } from './server.mjs';
import { defineComponent, withAsyncContext, computed, unref, mergeProps, withCtx, createTextVNode, toDisplayString, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderList, ssrRenderAttr } from 'vue/server-renderer';
import { g as groq, u as useSanityQuery } from './index-D7t3scmh.mjs';
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
  __name: "[slug]",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const route = useRoute();
    const query = groq`*[_type == "event" && slug.current == $slug][0] {
  title,
  description,
  date, // Pour rétrocompatibilité
  dateInfo,
  poster,
  ticketUrl,
  "eventType": eventType->title,
  // On récupère l'objet venue en entier
  venue {
    venueType,
    venueText,
    "venueDetails": venueReference->{
      _id,
      name,
      city,
      "slug": slug.current
    }
  },
  // On récupère le line-up, en gérant les nouveaux types
  lineup[] {
    _key,
    _type,
    // Pour les groupes référencés (nouveau format)
    _type == 'referencedBand' => {
      "band": band->{ _id, name, "slug": slug.current },
      performanceDay,
      performanceTime
    },
    // Pour les groupes externes (nouveau format)
    _type == 'externalBand' => {
      name,
      performanceDay,
      performanceTime
    },
    // Rétrocompatibilité avec l'ancien format
    _type == 'reference' => {
      "isReference": true,
      ...@->{ _id, name, "slug": slug.current }
    }
  }
}`;
    const { data: event, pending, error } = ([__temp, __restore] = withAsyncContext(() => useSanityQuery(query, { slug: route.params.slug })), __temp = await __temp, __restore(), __temp);
    const formattedEventDate = computed(() => {
      var _a, _b, _c, _d, _e;
      if (!event.value) return "";
      if (((_a = event.value.dateInfo) == null ? void 0 : _a.eventDuration) === "single" && ((_b = event.value.dateInfo) == null ? void 0 : _b.singleDate)) {
        return new Date(event.value.dateInfo.singleDate).toLocaleDateString("fr-FR", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric"
        });
      } else if (((_c = event.value.dateInfo) == null ? void 0 : _c.eventDuration) === "multiple" && ((_d = event.value.dateInfo) == null ? void 0 : _d.startDate) && ((_e = event.value.dateInfo) == null ? void 0 : _e.endDate)) {
        const startDate = new Date(event.value.dateInfo.startDate).toLocaleDateString("fr-FR", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric"
        });
        const endDate = new Date(event.value.dateInfo.endDate).toLocaleDateString("fr-FR", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric"
        });
        return `Du ${startDate} au ${endDate}`;
      }
      if (event.value.date) {
        return new Date(event.value.date).toLocaleDateString("fr-FR", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric"
        });
      }
      return "Date non d\xE9finie";
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b;
      const _component_NuxtImg = _sfc_main$1;
      const _component_CustomSanityContent = __nuxt_component_1;
      const _component_NuxtLink = __nuxt_component_0;
      const _component_Icon = __nuxt_component_3;
      if (unref(pending)) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "text-center p-16" }, _attrs))}><p class="text-xl">Chargement de l&#39;\xE9v\xE9nement...</p></div>`);
      } else if (unref(event)) {
        _push(`<article${ssrRenderAttrs(mergeProps({ class: "event-page" }, _attrs))}><header class="relative bg-stone-800 text-white py-20 md:py-32"><div class="container mx-auto px-4 relative text-center">`);
        if (unref(event).eventType) {
          _push(`<span class="text-yellow-400 font-semibold uppercase tracking-widest text-sm">${ssrInterpolate(unref(event).eventType)}</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<h1 class="text-4xl md:text-6xl font-extrabold mt-2">${ssrInterpolate(unref(event).title)}</h1></div></header>`);
        if (unref(event).poster) {
          _push(`<div class="container mx-auto px-4 mt-8 md:mt-12"><div class="max-w-2xl mx-auto">`);
          _push(ssrRenderComponent(_component_NuxtImg, {
            src: unref(event).poster.asset._ref,
            provider: "sanity",
            class: "w-full rounded-lg shadow-2xl",
            alt: `Affiche de ${unref(event).title}`
          }, null, _parent));
          _push(`</div></div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(event).description) {
          _push(`<div class="container mx-auto px-4 mt-8 md:mt-12"><div class="max-w-4xl mx-auto"><div class="bg-white p-6 md:p-8 rounded-lg shadow-lg"><h2 class="text-2xl font-bold mb-6 border-b pb-3">\xC0 propos de cet \xE9v\xE9nement</h2><div class="prose prose-lg max-w-none">`);
          _push(ssrRenderComponent(_component_CustomSanityContent, {
            blocks: unref(event).description
          }, null, _parent));
          _push(`</div></div></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="container mx-auto px-4 mt-8 md:mt-12"><div class="flex flex-col lg:flex-row gap-8 lg:gap-12"><div class="w-full lg:w-2/3">`);
        if (unref(event).lineup && unref(event).lineup.length > 0) {
          _push(`<div class="bg-white p-6 rounded-lg shadow-lg"><h2 class="text-2xl font-bold mb-6 border-b pb-3">Line-up</h2><div class="space-y-4"><!--[-->`);
          ssrRenderList(unref(event).lineup, (band) => {
            _push(`<div class="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"><div class="w-2 h-2 bg-yellow-500 rounded-full flex-shrink-0"></div><div class="flex-1">`);
            if (band._type === "referencedBand" && band.band) {
              _push(`<!--[-->`);
              _push(ssrRenderComponent(_component_NuxtLink, {
                to: `/groupes/${band.band.slug}`,
                class: "text-xl font-semibold text-gray-900 hover:text-yellow-600 transition-colors"
              }, {
                default: withCtx((_, _push2, _parent2, _scopeId) => {
                  if (_push2) {
                    _push2(`${ssrInterpolate(band.band.name)}`);
                  } else {
                    return [
                      createTextVNode(toDisplayString(band.band.name), 1)
                    ];
                  }
                }),
                _: 2
              }, _parent));
              if (band.performanceDay || band.performanceTime) {
                _push(`<div class="text-sm text-gray-600 mt-1">`);
                if (band.performanceDay) {
                  _push(`<span>${ssrInterpolate(new Date(band.performanceDay).toLocaleDateString("fr-FR"))}</span>`);
                } else {
                  _push(`<!---->`);
                }
                if (band.performanceTime) {
                  _push(`<span class="ml-2">${ssrInterpolate(band.performanceTime)}</span>`);
                } else {
                  _push(`<!---->`);
                }
                _push(`</div>`);
              } else {
                _push(`<!---->`);
              }
              _push(`<!--]-->`);
            } else if (band._type === "externalBand") {
              _push(`<!--[--><span class="text-xl font-semibold text-gray-900">${ssrInterpolate(band.name)}</span>`);
              if (band.performanceDay || band.performanceTime) {
                _push(`<div class="text-sm text-gray-600 mt-1">`);
                if (band.performanceDay) {
                  _push(`<span>${ssrInterpolate(new Date(band.performanceDay).toLocaleDateString("fr-FR"))}</span>`);
                } else {
                  _push(`<!---->`);
                }
                if (band.performanceTime) {
                  _push(`<span class="ml-2">${ssrInterpolate(band.performanceTime)}</span>`);
                } else {
                  _push(`<!---->`);
                }
                _push(`</div>`);
              } else {
                _push(`<!---->`);
              }
              _push(`<!--]-->`);
            } else {
              _push(`<!--[-->`);
              if (band.isReference && band.slug) {
                _push(ssrRenderComponent(_component_NuxtLink, {
                  to: `/groupes/${band.slug}`,
                  class: "text-xl font-semibold text-gray-900 hover:text-yellow-600 transition-colors"
                }, {
                  default: withCtx((_, _push2, _parent2, _scopeId) => {
                    if (_push2) {
                      _push2(`${ssrInterpolate(band.name)}`);
                    } else {
                      return [
                        createTextVNode(toDisplayString(band.name), 1)
                      ];
                    }
                  }),
                  _: 2
                }, _parent));
              } else {
                _push(`<span class="text-xl font-semibold text-gray-900">${ssrInterpolate(band.name)}</span>`);
              }
              _push(`<!--]-->`);
            }
            _push(`</div>`);
            if (band._type === "referencedBand" && band.band || band.isReference && band.slug) {
              _push(ssrRenderComponent(_component_Icon, {
                name: "heroicons:arrow-top-right-on-square",
                class: "h-5 w-5 text-gray-400"
              }, null, _parent));
            } else {
              _push(`<!---->`);
            }
            _push(`</div>`);
          });
          _push(`<!--]--></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><aside class="w-full lg:w-1/3 lg:sticky lg:top-28 self-start"><div class="bg-gray-50 p-6 rounded-lg shadow-lg"><h3 class="text-xl font-bold mb-4 border-b pb-3">Informations Pratiques</h3><div class="mb-6"><div class="flex items-start gap-3">`);
        _push(ssrRenderComponent(_component_Icon, {
          name: "heroicons:calendar-days",
          class: "h-6 w-6 text-gray-400 flex-shrink-0 mt-0.5"
        }, null, _parent));
        _push(`<div><h4 class="font-semibold text-gray-700 mb-1">Date</h4><p class="text-lg text-black">${ssrInterpolate(unref(formattedEventDate))}</p></div></div></div><div class="mb-6"><div class="flex items-start gap-3">`);
        _push(ssrRenderComponent(_component_Icon, {
          name: "heroicons:map-pin",
          class: "h-6 w-6 text-gray-400 flex-shrink-0 mt-0.5"
        }, null, _parent));
        _push(`<div><h4 class="font-semibold text-gray-700 mb-1">Lieu</h4>`);
        if (((_a = unref(event).venue) == null ? void 0 : _a.venueType) === "reference" && unref(event).venue.venueDetails) {
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: `/salles/${unref(event).venue.venueDetails.slug}`,
            class: "block group"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<p class="text-lg text-black group-hover:text-yellow-600 transition-colors"${_scopeId}>${ssrInterpolate(unref(event).venue.venueDetails.name)}</p><p class="text-sm text-gray-500"${_scopeId}>${ssrInterpolate(unref(event).venue.venueDetails.city)}</p>`);
              } else {
                return [
                  createVNode("p", { class: "text-lg text-black group-hover:text-yellow-600 transition-colors" }, toDisplayString(unref(event).venue.venueDetails.name), 1),
                  createVNode("p", { class: "text-sm text-gray-500" }, toDisplayString(unref(event).venue.venueDetails.city), 1)
                ];
              }
            }),
            _: 1
          }, _parent));
        } else if (((_b = unref(event).venue) == null ? void 0 : _b.venueType) === "text") {
          _push(`<p class="text-lg text-black">${ssrInterpolate(unref(event).venue.venueText)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div></div>`);
        if (unref(event).ticketUrl) {
          _push(`<div class="mb-6"><a${ssrRenderAttr("href", unref(event).ticketUrl)} target="_blank" rel="noopener noreferrer" class="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-yellow-600 text-white font-semibold rounded-lg hover:bg-yellow-700 transition-colors shadow-lg">`);
          _push(ssrRenderComponent(_component_Icon, {
            name: "heroicons:ticket",
            class: "h-5 w-5"
          }, null, _parent));
          _push(` Billetterie </a></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></aside></div></div></article>`);
      } else if (unref(error)) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "text-center p-16" }, _attrs))}><p class="text-red-500">Une erreur est survenue lors du chargement de l&#39;\xE9v\xE9nement.</p></div>`);
      } else {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "text-center p-16" }, _attrs))}><p>\xC9v\xE9nement non trouv\xE9.</p></div>`);
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/evenements/[slug].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_slug_-MNG33lSg.mjs.map
