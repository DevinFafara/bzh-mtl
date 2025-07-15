import { u as useHead, a as __nuxt_component_0 } from './server.mjs';
import { _ as _sfc_main$1 } from './NuxtImg-CHyr0FIh.mjs';
import { _ as __nuxt_component_1 } from './CustomSanityContent-DFtE2pkc.mjs';
import { defineComponent, withAsyncContext, mergeProps, unref, withCtx, createBlock, createCommentVNode, createVNode, openBlock, toDisplayString, useSSRContext } from 'vue';
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
  __name: "a-propos",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const query = groq`*[_type == "author"] | order(name desc) {
  _id,
  name,
  "slug": slug.current,
  image,
  citation,
  bio
}`;
    const { data: authors, pending, error } = ([__temp, __restore] = withAsyncContext(() => useSanityQuery(query)), __temp = await __temp, __restore(), __temp);
    useHead({
      title: "\xC0 Propos - Breizh Metal Magazine",
      meta: [
        { name: "description", content: "D\xE9couvrez l'histoire et l'\xE9quipe derri\xE8re Breizh Metal Magazine, le portail de la sc\xE8ne metal en Bretagne." }
      ]
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_NuxtImg = _sfc_main$1;
      const _component_CustomSanityContent = __nuxt_component_1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "bg-white" }, _attrs))}><div class="container mx-auto px-4 py-16 md:py-24"><div class="max-w-3xl mx-auto text-center"><h1 class="text-4xl md:text-6xl font-extrabold text-gray-900">Notre Histoire</h1><p class="mt-4 text-xl text-gray-600"> Forger le lien entre les fans et la sc\xE8ne metal bretonne. </p></div><div class="prose lg:prose-xl mx-auto mt-12 text-justify"><p> Breizh Metal Magazine est n\xE9 d&#39;une id\xE9e simple : cr\xE9er un espace d\xE9di\xE9 \xE0 la richesse et \xE0 la diversit\xE9 de la sc\xE8ne metal en Bretagne. Des c\xF4tes du Finist\xE8re aux terres d&#39;Ille-et-Vilaine, notre r\xE9gion regorge de talents, de salles mythiques et de festivals qui m\xE9ritent d&#39;\xEAtre mis en lumi\xE8re. </p><blockquote> Notre mission : \xEAtre votre boussole dans le Maelstr\xF6m du metal breton. </blockquote><p> Ce projet est port\xE9 par des passionn\xE9s, pour des passionn\xE9s. Chaque ligne de code, chaque chronique et chaque photo est le fruit de notre d\xE9votion \xE0 cette musique qui nous anime. </p></div></div><div class="bg-gray-50"><div class="container mx-auto px-4 py-16 md:py-24"><div class="text-center mb-12"><h2 class="text-3xl md:text-4xl font-bold text-gray-900">L&#39;\xC9quipe</h2><p class="mt-2 text-lg text-gray-500">Ceux qui font tourner la machine.</p></div>`);
      if (unref(pending)) {
        _push(`<div class="text-center">Chargement de l&#39;\xE9quipe...</div>`);
      } else if (unref(error)) {
        _push(`<div class="text-center text-red-500">Erreur lors du chargement de l&#39;\xE9quipe.</div>`);
      } else if (unref(authors) && unref(authors).length > 0) {
        _push(`<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto"><!--[-->`);
        ssrRenderList(unref(authors), (author) => {
          _push(ssrRenderComponent(_component_NuxtLink, {
            key: author._id,
            to: `/auteurs/${author.slug}`,
            class: "group text-center bg-white p-6 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                if (author.image) {
                  _push2(ssrRenderComponent(_component_NuxtImg, {
                    src: author.image.asset._ref,
                    provider: "sanity",
                    class: "h-24 w-24 rounded-full object-cover mx-auto mb-4 border-4 border-white group-hover:border-yellow-400 transition-colors shadow-lg",
                    alt: `Photo de ${author.name}`
                  }, null, _parent2, _scopeId));
                } else {
                  _push2(`<!---->`);
                }
                _push2(`<h3 class="text-xl font-bold text-gray-900"${_scopeId}>${ssrInterpolate(author.name)}</h3>`);
                if (author.citation) {
                  _push2(`<p class="text-yellow-600 font-semibold text-sm italic"${_scopeId}>${ssrInterpolate(author.citation)}</p>`);
                } else {
                  _push2(`<!---->`);
                }
                if (author.bio) {
                  _push2(`<div class="text-gray-500 mt-2 text-sm"${_scopeId}>`);
                  _push2(ssrRenderComponent(_component_CustomSanityContent, {
                    blocks: author.bio.slice(0, 1)
                  }, null, _parent2, _scopeId));
                  _push2(`</div>`);
                } else {
                  _push2(`<!---->`);
                }
              } else {
                return [
                  author.image ? (openBlock(), createBlock(_component_NuxtImg, {
                    key: 0,
                    src: author.image.asset._ref,
                    provider: "sanity",
                    class: "h-24 w-24 rounded-full object-cover mx-auto mb-4 border-4 border-white group-hover:border-yellow-400 transition-colors shadow-lg",
                    alt: `Photo de ${author.name}`
                  }, null, 8, ["src", "alt"])) : createCommentVNode("", true),
                  createVNode("h3", { class: "text-xl font-bold text-gray-900" }, toDisplayString(author.name), 1),
                  author.citation ? (openBlock(), createBlock("p", {
                    key: 1,
                    class: "text-yellow-600 font-semibold text-sm italic"
                  }, toDisplayString(author.citation), 1)) : createCommentVNode("", true),
                  author.bio ? (openBlock(), createBlock("div", {
                    key: 2,
                    class: "text-gray-500 mt-2 text-sm"
                  }, [
                    createVNode(_component_CustomSanityContent, {
                      blocks: author.bio.slice(0, 1)
                    }, null, 8, ["blocks"])
                  ])) : createCommentVNode("", true)
                ];
              }
            }),
            _: 2
          }, _parent));
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/a-propos.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=a-propos-COojjgb1.mjs.map
