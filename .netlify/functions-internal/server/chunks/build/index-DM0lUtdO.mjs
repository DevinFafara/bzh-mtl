import { a as __nuxt_component_0, f as __nuxt_component_3 } from './server.mjs';
import { defineComponent, withAsyncContext, mergeProps, unref, withCtx, createVNode, toDisplayString, createBlock, createCommentVNode, openBlock, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
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
  __name: "index",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const query = groq`
  *[_type == "event" && (
    (dateInfo.eventDuration == "single" && dateInfo.singleDate > now()) ||
    (dateInfo.eventDuration == "multiple" && dateInfo.endDate > now()) ||
    date > now()
  )] | order(
    coalesce(dateInfo.singleDate, dateInfo.startDate, date) asc
  ) {
    _id,
    title,
    date, // Pour rétrocompatibilité
    dateInfo,
    "slug": slug.current,
    "eventType": eventType->title,
    venue {
      venueType,
      venueText,
      "venueDetails": venueReference->{
        name,
        city
      }
    }
  }
`;
    const { data: events, error } = ([__temp, __restore] = withAsyncContext(() => useSanityQuery(query)), __temp = await __temp, __restore(), __temp);
    const formatDate = (event) => {
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
      const _component_NuxtLink = __nuxt_component_0;
      const _component_Icon = __nuxt_component_3;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "container mx-auto p-4 md:p-8" }, _attrs))}><h1 class="text-2xl md:text-4xl font-extrabold mb-8 border-b pb-4">Agenda</h1>`);
      if (unref(error)) {
        _push(`<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert"><strong class="font-bold">Erreur !</strong><span class="block sm:inline"> Impossible de charger les \xE9v\xE9nements.</span></div>`);
      } else if (unref(events) && unref(events).length > 0) {
        _push(`<ul class="space-y-2 mb-20"><!--[-->`);
        ssrRenderList(unref(events), (event) => {
          _push(`<li>`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: `/evenements/${event.slug}`,
            class: "flex flex-col sm:flex-row sm:items-center gap-x-6 gap-y-1 p-4 bg-white border border-transparent rounded-lg hover:bg-yellow-50 hover:border-yellow-400 transition-all duration-200"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<span class="text-sm font-semibold text-yellow-600 uppercase tracking-wider"${_scopeId}>${ssrInterpolate(formatDate(event))}</span><span class="text-xl font-bold text-gray-900"${_scopeId}>${ssrInterpolate(event.title)}</span><div class="flex flex-wrap gap-2 items-center"${_scopeId}><span class="inline-block bg-gray-200 text-center text-gray-800 px-3 py-1 rounded-full text-sm font-medium"${_scopeId}>${ssrInterpolate(event.eventType)}</span>`);
                if (event.venue) {
                  _push2(`<span class="text-sm text-gray-600 flex items-center"${_scopeId}>`);
                  _push2(ssrRenderComponent(_component_Icon, {
                    name: "heroicons:map-pin",
                    class: "h-4 w-4 inline mr-1"
                  }, null, _parent2, _scopeId));
                  if (event.venue.venueType === "reference" && event.venue.venueDetails) {
                    _push2(`<span${_scopeId}>${ssrInterpolate(event.venue.venueDetails.name)}, ${ssrInterpolate(event.venue.venueDetails.city)}</span>`);
                  } else if (event.venue.venueType === "text") {
                    _push2(`<span${_scopeId}>${ssrInterpolate(event.venue.venueText)}</span>`);
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
                  createVNode("span", { class: "text-sm font-semibold text-yellow-600 uppercase tracking-wider" }, toDisplayString(formatDate(event)), 1),
                  createVNode("span", { class: "text-xl font-bold text-gray-900" }, toDisplayString(event.title), 1),
                  createVNode("div", { class: "flex flex-wrap gap-2 items-center" }, [
                    createVNode("span", { class: "inline-block bg-gray-200 text-center text-gray-800 px-3 py-1 rounded-full text-sm font-medium" }, toDisplayString(event.eventType), 1),
                    event.venue ? (openBlock(), createBlock("span", {
                      key: 0,
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
        _push(`<!--]--></ul>`);
      } else {
        _push(`<div class="text-center py-16"><p class="text-xl text-gray-500">Aucun \xE9v\xE9nement \xE0 venir pour le moment.</p><p class="mt-2 text-gray-400">Revenez bient\xF4t !</p></div>`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/evenements/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-DM0lUtdO.mjs.map
