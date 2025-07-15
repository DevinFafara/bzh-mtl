import { _ as _sfc_main$1 } from './NuxtImg-CHyr0FIh.mjs';
import { _ as __nuxt_component_1 } from './CustomSanityContent-DFtE2pkc.mjs';
import { _ as _export_sfc, c as useRoute, f as __nuxt_component_3, a as __nuxt_component_0 } from './server.mjs';
import { _ as __nuxt_component_0$1 } from './PostCard-Bjtf_EtO.mjs';
import { defineComponent, withAsyncContext, computed, unref, withCtx, createVNode, toDisplayString, createBlock, createCommentVNode, openBlock, createTextVNode, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderAttr, ssrRenderList } from 'vue/server-renderer';
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
    const query = groq`*[_type == "venue" && slug.current == $slug][0] {
  _id,
  name,
  image,
  description,
  city,
  department,
  website,
  "author": author->{ name, "slug": slug.current, image, citation }
}`;
    const relatedPostsQuery = groq`*[_type == "post" && relatedVenue._ref == $venueId] | order(publishedAt desc) [0...6] {
  _id,
  title,
  "slug": slug.current,
  mainImage,
  publishedAt,
  articleType,
  "author": author->name
}`;
    const upcomingEventsQuery = groq`*[_type == "event" && venue.venueReference._ref == $venueId && date >= now()] | order(date asc) [0...6] {
  _id,
  title,
  "slug": slug.current,
  date,
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
    const { data: venue } = ([__temp, __restore] = withAsyncContext(() => useSanityQuery(query, { slug: route.params.slug })), __temp = await __temp, __restore(), __temp);
    const { data: relatedPosts } = ([__temp, __restore] = withAsyncContext(() => {
      var _a;
      return useSanityQuery(relatedPostsQuery, {
        venueId: ((_a = venue.value) == null ? void 0 : _a._id) || ""
      });
    }), __temp = await __temp, __restore(), __temp);
    const { data: upcomingEvents } = ([__temp, __restore] = withAsyncContext(() => {
      var _a;
      return useSanityQuery(upcomingEventsQuery, {
        venueId: ((_a = venue.value) == null ? void 0 : _a._id) || ""
      });
    }), __temp = await __temp, __restore(), __temp);
    const departmentName = computed(() => {
      var _a;
      if (!((_a = venue.value) == null ? void 0 : _a.department)) return "";
      const departments = {
        "22": "C\xF4tes-d'Armor",
        "29": "Finist\xE8re",
        "35": "Ille-et-Vilaine",
        "44": "Loire-Atlantique",
        "56": "Morbihan"
      };
      return departments[venue.value.department] || "";
    });
    const formatEventDate = (dateString) => {
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
      return new Date(dateString).toLocaleDateString("fr-FR", options);
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtImg = _sfc_main$1;
      const _component_CustomSanityContent = __nuxt_component_1;
      const _component_Icon = __nuxt_component_3;
      const _component_NuxtLink = __nuxt_component_0;
      const _component_PostCard = __nuxt_component_0$1;
      if (unref(venue)) {
        _push(`<div${ssrRenderAttrs(_attrs)} data-v-c26b2d27><header class="bg-gray-800 text-white py-12 md:py-16" data-v-c26b2d27><div class="container mx-auto px-4 text-center" data-v-c26b2d27><h1 class="text-2xl md:text-4xl font-extrabold" data-v-c26b2d27>${ssrInterpolate(unref(venue).name)}</h1>`);
        if (unref(venue).city || unref(departmentName)) {
          _push(`<p class="mt-4 text-lg text-gray-300" data-v-c26b2d27>${ssrInterpolate(unref(venue).city)}`);
          if (unref(venue).city && unref(departmentName)) {
            _push(`<span data-v-c26b2d27>, </span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`${ssrInterpolate(unref(departmentName))}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></header>`);
        if (unref(venue).image) {
          _push(`<div class="w-full mt-8" data-v-c26b2d27>`);
          _push(ssrRenderComponent(_component_NuxtImg, {
            src: unref(venue).image.asset._ref,
            provider: "sanity",
            class: "w-full h-auto object-cover",
            alt: `Photo de ${unref(venue).name}`
          }, null, _parent));
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="container mx-auto px-4 mt-8 md:mt-12" data-v-c26b2d27><div class="max-w-4xl mx-auto" data-v-c26b2d27>`);
        if (unref(venue).description) {
          _push(`<div class="max-w-none mb-8" data-v-c26b2d27>`);
          _push(ssrRenderComponent(_component_CustomSanityContent, {
            blocks: unref(venue).description
          }, null, _parent));
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(venue).website) {
          _push(`<div class="mt-6" data-v-c26b2d27><a${ssrRenderAttr("href", unref(venue).website)} target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors" data-v-c26b2d27>`);
          _push(ssrRenderComponent(_component_Icon, {
            name: "heroicons:link-20-solid",
            class: "h-5 w-5"
          }, null, _parent));
          _push(` Visiter le site web </a></div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(upcomingEvents) && Array.isArray(unref(upcomingEvents)) && unref(upcomingEvents).length > 0) {
          _push(`<div class="mt-12" data-v-c26b2d27><h2 class="text-xl font-bold mb-6" data-v-c26b2d27>Prochains \xE9v\xE9nements</h2><ul class="space-y-2" data-v-c26b2d27><!--[-->`);
          ssrRenderList(unref(upcomingEvents), (event) => {
            _push(`<li data-v-c26b2d27>`);
            _push(ssrRenderComponent(_component_NuxtLink, {
              to: `/evenements/${event.slug}`,
              class: "flex flex-col sm:flex-row sm:items-center gap-x-6 gap-y-1 p-4 bg-white border border-transparent rounded-lg hover:bg-yellow-50 hover:border-yellow-400 transition-all duration-200"
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`<span class="text-sm font-semibold text-yellow-600 uppercase tracking-wider" data-v-c26b2d27${_scopeId}>${ssrInterpolate(formatEventDate(event.date))}</span><span class="text-xl font-bold text-gray-900" data-v-c26b2d27${_scopeId}>${ssrInterpolate(event.title)}</span><div class="flex flex-wrap gap-2 items-center" data-v-c26b2d27${_scopeId}>`);
                  if (event.eventType) {
                    _push2(`<span class="inline-block bg-gray-200 text-center text-gray-800 px-3 py-1 rounded-full text-sm font-medium" data-v-c26b2d27${_scopeId}>${ssrInterpolate(event.eventType)}</span>`);
                  } else {
                    _push2(`<!---->`);
                  }
                  if (event.venue) {
                    _push2(`<span class="text-sm text-gray-600 flex items-center" data-v-c26b2d27${_scopeId}>`);
                    _push2(ssrRenderComponent(_component_Icon, {
                      name: "heroicons:map-pin",
                      class: "h-4 w-4 inline mr-1"
                    }, null, _parent2, _scopeId));
                    if (event.venue.venueType === "reference" && event.venue.venueDetails) {
                      _push2(`<span data-v-c26b2d27${_scopeId}>${ssrInterpolate(event.venue.venueDetails.name)}, ${ssrInterpolate(event.venue.venueDetails.city)}</span>`);
                    } else if (event.venue.venueType === "text") {
                      _push2(`<span data-v-c26b2d27${_scopeId}>${ssrInterpolate(event.venue.venueText)}</span>`);
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
                    createVNode("span", { class: "text-sm font-semibold text-yellow-600 uppercase tracking-wider" }, toDisplayString(formatEventDate(event.date)), 1),
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
        if (unref(relatedPosts) && Array.isArray(unref(relatedPosts)) && unref(relatedPosts).length > 0) {
          _push(`<div class="mt-12" data-v-c26b2d27><h2 class="text-xl font-bold mb-6" data-v-c26b2d27>Live Report</h2><div class="grid grid-cols-1 md:grid-cols-2 gap-6" data-v-c26b2d27><!--[-->`);
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
        _push(`<hr class="my-12" data-v-c26b2d27>`);
        if (unref(venue).author) {
          _push(`<div class="bg-gray-50 p-6 rounded-lg mt-8" data-v-c26b2d27><div class="flex items-start gap-4" data-v-c26b2d27>`);
          if (unref(venue).author.image) {
            _push(ssrRenderComponent(_component_NuxtImg, {
              src: unref(venue).author.image.asset._ref,
              provider: "sanity",
              class: "h-16 w-16 rounded-full object-cover flex-shrink-0"
            }, null, _parent));
          } else {
            _push(`<!---->`);
          }
          _push(`<div data-v-c26b2d27><p class="font-semibold" data-v-c26b2d27> Fiche r\xE9dig\xE9e par `);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: `/auteurs/${unref(venue).author.slug}`,
            class: "text-blue-600 hover:underline"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(unref(venue).author.name)}`);
              } else {
                return [
                  createTextVNode(toDisplayString(unref(venue).author.name), 1)
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`</p>`);
          if (unref(venue).author.citation) {
            _push(`<p class="text-gray-600 italic mt-2 prose prose-sm" data-v-c26b2d27>${ssrInterpolate(unref(venue).author.citation)}</p>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div></div>`);
      } else {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "text-center p-16" }, _attrs))} data-v-c26b2d27><p data-v-c26b2d27>Salle de concert non trouv\xE9e...</p></div>`);
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/salles/[slug].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _slug_ = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-c26b2d27"]]);

export { _slug_ as default };
//# sourceMappingURL=_slug_--wH4tiI1.mjs.map
