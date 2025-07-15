import { c as useRoute, a as __nuxt_component_0, f as __nuxt_component_3 } from './server.mjs';
import { _ as _sfc_main$1 } from './NuxtImg-CHyr0FIh.mjs';
import { _ as __nuxt_component_1 } from './CustomSanityContent-DFtE2pkc.mjs';
import { defineComponent, withAsyncContext, computed, unref, mergeProps, withCtx, createTextVNode, toDisplayString, createBlock, createCommentVNode, createVNode, openBlock, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent } from 'vue/server-renderer';
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
    const query = groq`*[_type == "post" && slug.current == $slug][0] {
  title,
  publishedAt,
  mainImage,
  body,
  articleType,
  "author": author->{ name, "slug": slug.current, image, citation },
  "relatedBand": relatedBand->{ name, "slug": slug.current, logoImage },
  "relatedVenue": relatedVenue->{ name, "slug": slug.current, city }
}`;
    const { data: post, pending } = ([__temp, __restore] = withAsyncContext(() => useSanityQuery(query, { slug: route.params.slug })), __temp = await __temp, __restore(), __temp);
    const formattedDate = computed(() => {
      var _a;
      if (!((_a = post.value) == null ? void 0 : _a.publishedAt)) return "";
      return new Date(post.value.publishedAt).toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric"
      });
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_NuxtImg = _sfc_main$1;
      const _component_CustomSanityContent = __nuxt_component_1;
      const _component_Icon = __nuxt_component_3;
      if (unref(pending)) {
        _push(`<div${ssrRenderAttrs(_attrs)}><div class="text-center p-16">Chargement de l&#39;article...</div></div>`);
      } else if (unref(post)) {
        _push(`<article${ssrRenderAttrs(mergeProps({ class: "article-page" }, _attrs))}><header class="relative bg-stone-800 text-white py-20 md:py-32"><div class="container mx-auto px-4 relative text-center"><h1 class="text-4xl md:text-6xl font-extrabold">${ssrInterpolate(unref(post).title)}</h1><p class="mt-4 text-lg text-gray-300"> Publi\xE9 le ${ssrInterpolate(unref(formattedDate))} par `);
        if (unref(post).author) {
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: `/auteurs/${unref(post).author.slug}`,
            class: "font-semibold hover:underline"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(unref(post).author.name)}`);
              } else {
                return [
                  createTextVNode(toDisplayString(unref(post).author.name), 1)
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</p></div></header><div class="max-w-120 justify-center mx-auto mt-8">`);
        if (unref(post).mainImage) {
          _push(ssrRenderComponent(_component_NuxtImg, {
            src: unref(post).mainImage.asset._ref,
            provider: "sanity",
            class: ""
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="container mx-auto px-4 mt-8 md:mt-12"><div class="flex flex-col lg:flex-row gap-8 lg:gap-12"><div class="w-full lg:w-2/3">`);
        if (unref(post).body) {
          _push(`<div class="max-w-none text-justify">`);
          _push(ssrRenderComponent(_component_CustomSanityContent, {
            blocks: unref(post).body
          }, null, _parent));
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
        if (unref(post).author) {
          _push(`<div class="bg-gray-50 p-6 rounded-lg"><div class="flex items-start gap-4">`);
          if (unref(post).author.image) {
            _push(ssrRenderComponent(_component_NuxtImg, {
              src: unref(post).author.image.asset._ref,
              provider: "sanity",
              class: "h-16 w-16 rounded-full object-cover flex-shrink-0"
            }, null, _parent));
          } else {
            _push(`<!---->`);
          }
          _push(`<div><p class="font-semibold"> Article r\xE9dig\xE9 par `);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: `/auteurs/${unref(post).author.slug}`,
            class: "text-blue-600 hover:underline"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(unref(post).author.name)}`);
              } else {
                return [
                  createTextVNode(toDisplayString(unref(post).author.name), 1)
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`</p>`);
          if (unref(post).author.citation) {
            _push(`<div class="text-gray-600 italic mt-2 prose prose-sm"><p>${ssrInterpolate(unref(post).author.citation)}</p></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<aside class="w-full lg:w-1/3 lg:sticky lg:top-28 self-start"><div class="bg-gray-50 p-6 rounded-lg"><h3 class="text-xl font-bold mb-4 border-b pb-2">En lien avec cet article</h3>`);
        if (unref(post).relatedBand) {
          _push(`<div class="mb-4"><h4 class="font-semibold text-gray-700">Groupe</h4>`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: `/groupes/${unref(post).relatedBand.slug}`,
            class: "flex items-center gap-3 mt-2 group"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                if (unref(post).relatedBand.logoImage) {
                  _push2(`<div class="h-12 w-12 bg-white rounded-md flex-shrink-0 flex items-center justify-center p-1"${_scopeId}>`);
                  _push2(ssrRenderComponent(_component_NuxtImg, {
                    src: unref(post).relatedBand.logoImage.asset._ref,
                    provider: "sanity",
                    class: "h-full w-full object-contain"
                  }, null, _parent2, _scopeId));
                  _push2(`</div>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`<span class="text-lg text-black group-hover:underline"${_scopeId}>${ssrInterpolate(unref(post).relatedBand.name)}</span>`);
              } else {
                return [
                  unref(post).relatedBand.logoImage ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "h-12 w-12 bg-white rounded-md flex-shrink-0 flex items-center justify-center p-1"
                  }, [
                    createVNode(_component_NuxtImg, {
                      src: unref(post).relatedBand.logoImage.asset._ref,
                      provider: "sanity",
                      class: "h-full w-full object-contain"
                    }, null, 8, ["src"])
                  ])) : createCommentVNode("", true),
                  createVNode("span", { class: "text-lg text-black group-hover:underline" }, toDisplayString(unref(post).relatedBand.name), 1)
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(post).relatedVenue) {
          _push(`<div><h4 class="font-semibold text-gray-700">Lieu</h4>`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: `/salles/${unref(post).relatedVenue.slug}`,
            class: "flex items-center gap-3 mt-2 group"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="h-12 w-12 bg-white rounded-md flex-shrink-0 flex items-center justify-center p-1 text-gray-400"${_scopeId}>`);
                _push2(ssrRenderComponent(_component_Icon, {
                  name: "heroicons:map-pin-20-solid",
                  class: "h-8 w-8"
                }, null, _parent2, _scopeId));
                _push2(`</div><div${_scopeId}><span class="text-lg text-black group-hover:underline"${_scopeId}>${ssrInterpolate(unref(post).relatedVenue.name)}</span><p class="text-sm text-gray-500"${_scopeId}>${ssrInterpolate(unref(post).relatedVenue.city)}</p></div>`);
              } else {
                return [
                  createVNode("div", { class: "h-12 w-12 bg-white rounded-md flex-shrink-0 flex items-center justify-center p-1 text-gray-400" }, [
                    createVNode(_component_Icon, {
                      name: "heroicons:map-pin-20-solid",
                      class: "h-8 w-8"
                    })
                  ]),
                  createVNode("div", null, [
                    createVNode("span", { class: "text-lg text-black group-hover:underline" }, toDisplayString(unref(post).relatedVenue.name), 1),
                    createVNode("p", { class: "text-sm text-gray-500" }, toDisplayString(unref(post).relatedVenue.city), 1)
                  ])
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></aside></div></div></article>`);
      } else {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "text-center p-16" }, _attrs))}><p>Article non trouv\xE9.</p></div>`);
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/articles/[slug].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_slug_-B4Xb0n2A.mjs.map
