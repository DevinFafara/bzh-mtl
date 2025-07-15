import { defineComponent, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrInterpolate } from 'vue/server-renderer';
import { u as useHead } from './server.mjs';
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

const contactEmail = "breizh.webzine@gmail.com";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "contact",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "Contact - Breizh Metal Magazine",
      meta: [
        { name: "description", content: "Contactez l'\xE9quipe de Breizh Metal Magazine. Envoyez-nous un message, une proposition de chronique ou une suggestion." }
      ]
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "bg-white" }, _attrs))}><div class="container mx-auto px-4 flex items-center justify-center min-h-[70vh]"><div class="max-w-3xl mx-auto text-center py-16"><h1 class="text-3xl md:text-3xl font-extrabold text-gray-900 leading-tight"> Nous Contacter </h1><p class="mt-4 text-xl text-gray-600"> Votre voix est essentielle \xE0 la vitalit\xE9 de la sc\xE8ne locale. </p><div class="prose prose-lg mx-auto mt-10 text-justify border-t border-b border-gray-200 py-8"><p> Avant de nous contacter, sachez que nous lisons attentivement chaque message. Nous sommes une petite \xE9quipe de passionn\xE9s, alors un peu de patience est parfois n\xE9cessaire, mais chaque mail re\xE7oit une r\xE9ponse. </p><p> Que ce soit pour partager une d\xE9couverte, annoncer un concert, sugg\xE9rer une interview ou simplement \xE9changer, n&#39;h\xE9sitez pas. Toutes les contributions sont les bienvenues. </p></div><div class="mt-12"><h3 class="text-lg font-semibold text-gray-500 uppercase tracking-widest"> Nous \xE9crire </h3><a${ssrRenderAttr("href", `mailto:${contactEmail}`)} class="mt-2 inline-block text-2xl md:text-3xl font-bold text-yellow-600 hover:text-yellow-700 transition-colors duration-300 group"><span>${ssrInterpolate(contactEmail)}</span><div class="mt-1 h-0.5 bg-yellow-600 w-0 group-hover:w-full transition-all duration-300"></div></a></div></div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/contact.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=contact--NyI1Vlp.mjs.map
