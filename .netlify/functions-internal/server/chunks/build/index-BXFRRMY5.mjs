import { b as _imports_0, a as __nuxt_component_0 } from './server.mjs';
import { _ as __nuxt_component_0$1 } from './PostCard-Bjtf_EtO.mjs';
import { defineComponent, withAsyncContext, ref, mergeProps, withCtx, createTextVNode, unref, createVNode, toDisplayString, createBlock, createCommentVNode, openBlock, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderComponent, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
import { _ as _sfc_main$2 } from './BandCard-CPyibhNy.mjs';
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
import './NuxtImg-CHyr0FIh.mjs';
import '@sanity/client';

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "EventCard",
  __ssrInlineRender: true,
  props: {
    event: {
      type: Object,
      required: true
    }
  },
  setup(__props) {
    const formatDate = (event) => {
      var _a, _b, _c, _d, _e;
      const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
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
    const formatVenue = (venue) => {
      if (!venue) return "";
      if (venue.venueType === "reference" && venue.venueDetails) {
        return `${venue.venueDetails.name}, ${venue.venueDetails.city}`;
      } else if (venue.venueType === "text" && venue.venueText) {
        return venue.venueText;
      }
      return "";
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(ssrRenderComponent(_component_NuxtLink, mergeProps({
        to: `/evenements/${__props.event.slug}`,
        class: "flex flex-col sm:flex-row sm:items-center gap-x-6 gap-y-1 p-4 bg-white border border-transparent rounded-lg hover:bg-yellow-50 hover:border-yellow-400 transition-all duration-200"
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="text-sm font-semibold text-yellow-600 uppercase tracking-wider"${_scopeId}>${ssrInterpolate(formatDate(__props.event))}</span><span class="text-xl font-bold text-gray-900"${_scopeId}>${ssrInterpolate(__props.event.title)}</span><div class="flex flex-wrap gap-2 items-center"${_scopeId}>`);
            if (__props.event.eventType) {
              _push2(`<span class="inline-block bg-gray-200 text-center text-gray-800 px-3 py-1 rounded-full text-sm font-medium"${_scopeId}>${ssrInterpolate(__props.event.eventType)}</span>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.event.venue) {
              _push2(`<span class="text-sm text-gray-600 flex items-center"${_scopeId}><svg class="h-4 w-4 inline mr-1" fill="currentColor" viewBox="0 0 20 20"${_scopeId}><path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"${_scopeId}></path></svg> ${ssrInterpolate(formatVenue(__props.event.venue))}</span>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
          } else {
            return [
              createVNode("span", { class: "text-sm font-semibold text-yellow-600 uppercase tracking-wider" }, toDisplayString(formatDate(__props.event)), 1),
              createVNode("span", { class: "text-xl font-bold text-gray-900" }, toDisplayString(__props.event.title), 1),
              createVNode("div", { class: "flex flex-wrap gap-2 items-center" }, [
                __props.event.eventType ? (openBlock(), createBlock("span", {
                  key: 0,
                  class: "inline-block bg-gray-200 text-center text-gray-800 px-3 py-1 rounded-full text-sm font-medium"
                }, toDisplayString(__props.event.eventType), 1)) : createCommentVNode("", true),
                __props.event.venue ? (openBlock(), createBlock("span", {
                  key: 1,
                  class: "text-sm text-gray-600 flex items-center"
                }, [
                  (openBlock(), createBlock("svg", {
                    class: "h-4 w-4 inline mr-1",
                    fill: "currentColor",
                    viewBox: "0 0 20 20"
                  }, [
                    createVNode("path", {
                      "fill-rule": "evenodd",
                      d: "M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z",
                      "clip-rule": "evenodd"
                    })
                  ])),
                  createTextVNode(" " + toDisplayString(formatVenue(__props.event.venue)), 1)
                ])) : createCommentVNode("", true)
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/EventCard.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const chroniquesQuery = groq`*[_type == "post"] | order(publishedAt desc) [0...3] {
  _id,
  title,
  "slug": slug.current,
  articleType,
  "author": author->name,
  publishedAt,
  mainImage
}`;
    const eventsQuery = groq`*[_type == "event" && (
  (dateInfo.eventDuration == "single" && dateInfo.singleDate >= now()) ||
  (dateInfo.eventDuration == "multiple" && dateInfo.endDate >= now()) ||
  date >= now()
)] | order(
  coalesce(dateInfo.singleDate, dateInfo.startDate, date) asc
) [0...3] {
  _id,
  title,
  "slug": slug.current,
  date, // Pour rétrocompatibilité
  dateInfo,
  poster,
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
    const bandsQuery = groq`*[_type == "band"] | order(_createdAt desc) [0...6] {
  _id,
  name,
  "slug": slug.current,
  pressPhoto,
  "styles": styles[]->{title}
}`;
    const { data: chroniques } = ([__temp, __restore] = withAsyncContext(() => useSanityQuery(chroniquesQuery)), __temp = await __temp, __restore(), __temp);
    const { data: events } = ([__temp, __restore] = withAsyncContext(() => useSanityQuery(eventsQuery)), __temp = await __temp, __restore(), __temp);
    const { data: allBands } = ([__temp, __restore] = withAsyncContext(() => useSanityQuery(bandsQuery)), __temp = await __temp, __restore(), __temp);
    const randomBands = ref([]);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_PostCard = __nuxt_component_0$1;
      const _component_EventCard = _sfc_main$1;
      const _component_BandCard = _sfc_main$2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gray-50" }, _attrs))}><section class="relative bg-stone-900 text-white"><div class="container mx-auto px-4 py-12 md:py-16"><div class="flex flex-col md:flex-row items-center justify-between"><div class="flex items-center space-x-4 mb-6 md:mb-0"><img${ssrRenderAttr("src", _imports_0)} alt="BZH-MTL Logo" class="h-16 w-16 md:h-20 md:w-20 rounded-full shadow-lg"><div><h1 class="text-3xl md:text-4xl font-bold tracking-tight"> Breizh Metal Magazine </h1></div></div><div class="text-center md:text-right"><p class="text-sm md:text-base text-stone-300"> Sc\xE8ne bretonne \u2022 Chroniques \u2022 Concerts </p></div></div></div></section><main class="container mx-auto px-4 py-8 md:py-12"><section class="mb-12"><div class="flex items-center justify-between mb-8"><h2 class="text-2xl md:text-2xl font-bold text-gray-900"> Derniers Articles </h2>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/articles",
        class: "text-purple-600 hover:text-purple-700 font-medium transition-colors"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Voir tous \u2192 `);
          } else {
            return [
              createTextVNode(" Voir tous \u2192 ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"><!--[-->`);
      ssrRenderList(unref(chroniques) || [], (chronique) => {
        _push(`<div>`);
        _push(ssrRenderComponent(_component_PostCard, { post: chronique }, null, _parent));
        _push(`</div>`);
      });
      _push(`<!--]--></div>`);
      if (!unref(chroniques) || unref(chroniques).length === 0) {
        _push(`<div class="text-center py-8 text-gray-500"><p>Aucun article disponible pour le moment.</p></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</section><section class="mb-12"><div class="flex items-center justify-between mb-8"><h2 class="text-2xl md:text-2xl font-bold text-gray-900"> Prochains \xC9v\xE9nements </h2>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/evenements",
        class: "text-purple-600 hover:text-purple-700 font-medium transition-colors"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Voir l&#39;agenda \u2192 `);
          } else {
            return [
              createTextVNode(" Voir l'agenda \u2192 ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      if (unref(events) && unref(events).length > 0) {
        _push(`<ul class="space-y-2"><!--[-->`);
        ssrRenderList(unref(events) || [], (event) => {
          _push(`<li>`);
          _push(ssrRenderComponent(_component_EventCard, { event }, null, _parent));
          _push(`</li>`);
        });
        _push(`<!--]--></ul>`);
      } else {
        _push(`<div class="text-center py-8 text-gray-500"><p>Aucun \xE9v\xE9nement \xE0 venir pour le moment.</p></div>`);
      }
      _push(`</section><section class="mb-12"><div class="flex items-center justify-between mb-8"><h2 class="text-2xl md:text-2xl font-bold text-gray-900"> Groupes \xE0 D\xE9couvrir </h2>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/groupes",
        class: "text-purple-600 hover:text-purple-700 font-medium transition-colors"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Voir tous \u2192 `);
          } else {
            return [
              createTextVNode(" Voir tous \u2192 ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      if (unref(randomBands) && unref(randomBands).length > 0) {
        _push(`<div class="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"><!--[-->`);
        ssrRenderList(unref(randomBands), (band) => {
          _push(`<div>`);
          _push(ssrRenderComponent(_component_BandCard, { band }, null, _parent));
          _push(`</div>`);
        });
        _push(`<!--]--></div>`);
      } else if (unref(allBands) && unref(allBands).length > 0) {
        _push(`<div class="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"><!--[-->`);
        ssrRenderList(3, (n) => {
          _push(`<div class="animate-pulse"><div class="bg-gray-200 rounded-lg h-64"></div></div>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<div class="text-center py-8 text-gray-500"><p>Aucun groupe disponible pour le moment.</p></div>`);
      }
      _push(`</section></main></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-BXFRRMY5.mjs.map
