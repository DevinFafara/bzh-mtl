import { _ as _sfc_main$1 } from './BandCard-CPyibhNy.mjs';
import { defineComponent, withAsyncContext, ref, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrRenderComponent } from 'vue/server-renderer';
import { g as groq, u as useSanityQuery } from './index-D7t3scmh.mjs';
import './server.mjs';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const query = groq`*[_type == "band"] | order(name asc) {
  _id,
  name,
  "slug": slug.current,
  pressPhoto,
  // On récupère le tableau complet des styles liés
  // et pour chaque style, on prend son titre.
  "styles": styles[]->{title}
}`;
    const { data: bands } = ([__temp, __restore] = withAsyncContext(() => useSanityQuery(query)), __temp = await __temp, __restore(), __temp);
    const alphabetFilters = [
      { label: "Tous", range: "all" },
      { label: "A - C", range: "a-c" },
      { label: "D - H", range: "d-h" },
      { label: "I - P", range: "i-p" },
      { label: "Q - Z", range: "q-z" },
      { label: "0 - 9", range: "0-9" }
    ];
    const currentFilter = ref("all");
    const searchQuery = ref("");
    const matchesFilter = (bandName, filterRange) => {
      if (filterRange === "all") return true;
      const firstChar = bandName.charAt(0).toLowerCase();
      switch (filterRange) {
        case "a-c":
          return firstChar >= "a" && firstChar <= "c";
        case "d-h":
          return firstChar >= "d" && firstChar <= "h";
        case "i-p":
          return firstChar >= "i" && firstChar <= "p";
        case "q-z":
          return firstChar >= "q" && firstChar <= "z";
        case "0-9":
          return /[0-9]/.test(firstChar);
        default:
          return true;
      }
    };
    const matchesSearch = (bandName, query2) => {
      if (!query2.trim()) return true;
      const normalizedBandName = bandName.toLowerCase();
      const normalizedQuery = query2.toLowerCase().trim();
      if (normalizedQuery.length <= 2) {
        return normalizedBandName.startsWith(normalizedQuery);
      }
      return normalizedBandName.includes(normalizedQuery);
    };
    const filteredBands = computed(() => {
      if (!bands.value) return [];
      return bands.value.filter(
        (band) => matchesFilter(band.name, currentFilter.value) && matchesSearch(band.name, searchQuery.value)
      );
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b;
      const _component_BandCard = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "container mx-auto p-4 md:p-8" }, _attrs))}><h1 class="text-2xl md:text-4xl font-bold mb-8">La Sc\xE8ne Bretonne</h1><div class="mb-6"><div class="max-w-md mx-auto sm:mx-0"><div class="relative"><input${ssrRenderAttr("value", unref(searchQuery))} type="text" placeholder="Rechercher un groupe..." class="w-full px-4 py-3 pl-11 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors"><div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg></div>`);
      if (unref(searchQuery)) {
        _push(`<button class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"><svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="mt-2 text-xs text-gray-500">`);
      if (!unref(searchQuery)) {
        _push(`<span> Saisissez au moins 1 lettre pour rechercher un groupe. </span>`);
      } else if (unref(searchQuery).length <= 2) {
        _push(`<span> Recherche des groupes commen\xE7ant par &quot;${ssrInterpolate(unref(searchQuery))}&quot; </span>`);
      } else {
        _push(`<span> Recherche des groupes contenant &quot;${ssrInterpolate(unref(searchQuery))}&quot; </span>`);
      }
      _push(`</div></div></div><div class="mb-8"><div class="flex flex-wrap gap-2 justify-center sm:justify-start"><!--[-->`);
      ssrRenderList(alphabetFilters, (filter) => {
        _push(`<button class="${ssrRenderClass([
          "px-4 py-2 rounded-lg font-medium transition-all duration-200",
          unref(currentFilter) === filter.range ? "bg-yellow-500 text-white shadow-md" : "bg-gray-200 text-gray-700 hover:bg-gray-300 hover:shadow-sm"
        ])}">${ssrInterpolate(filter.label)}</button>`);
      });
      _push(`<!--]--></div><div class="mt-4 text-sm text-gray-600">`);
      if (unref(searchQuery) && unref(currentFilter) === "all") {
        _push(`<span>${ssrInterpolate(unref(filteredBands).length)} groupe${ssrInterpolate(unref(filteredBands).length > 1 ? "s" : "")} trouv\xE9${ssrInterpolate(unref(filteredBands).length > 1 ? "s" : "")}</span>`);
      } else if (unref(searchQuery)) {
        _push(`<span>${ssrInterpolate(unref(filteredBands).length)} groupe${ssrInterpolate(unref(filteredBands).length > 1 ? "s" : "")} trouv\xE9${ssrInterpolate(unref(filteredBands).length > 1 ? "s" : "")} ${ssrInterpolate(unref(currentFilter) === "a-c" ? " (A \xE0 C)" : "")} ${ssrInterpolate(unref(currentFilter) === "d-h" ? " (D \xE0 H)" : "")} ${ssrInterpolate(unref(currentFilter) === "i-p" ? " (I \xE0 P)" : "")} ${ssrInterpolate(unref(currentFilter) === "q-z" ? " (Q \xE0 Z)" : "")} ${ssrInterpolate(unref(currentFilter) === "0-9" ? " (chiffres)" : "")}</span>`);
      } else if (unref(currentFilter) === "all") {
        _push(`<span>${ssrInterpolate(((_a = unref(bands)) == null ? void 0 : _a.length) || 0)} groupe${ssrInterpolate((((_b = unref(bands)) == null ? void 0 : _b.length) || 0) > 1 ? "s" : "")} au total </span>`);
      } else {
        _push(`<span>${ssrInterpolate(unref(filteredBands).length)} groupe${ssrInterpolate(unref(filteredBands).length > 1 ? "s" : "")} ${ssrInterpolate(unref(currentFilter) === "a-c" ? "de A \xE0 C" : "")} ${ssrInterpolate(unref(currentFilter) === "d-h" ? "de D \xE0 H" : "")} ${ssrInterpolate(unref(currentFilter) === "i-p" ? "de I \xE0 P" : "")} ${ssrInterpolate(unref(currentFilter) === "q-z" ? "de Q \xE0 Z" : "")} ${ssrInterpolate(unref(currentFilter) === "0-9" ? "commen\xE7ant par un chiffre" : "")}</span>`);
      }
      _push(`</div></div>`);
      if (unref(filteredBands) && unref(filteredBands).length > 0) {
        _push(`<div class="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"><!--[-->`);
        ssrRenderList(unref(filteredBands), (band) => {
          _push(`<div>`);
          _push(ssrRenderComponent(_component_BandCard, { band }, null, _parent));
          _push(`</div>`);
        });
        _push(`<!--]--></div>`);
      } else if (unref(searchQuery) || unref(currentFilter) !== "all") {
        _push(`<div class="text-center py-12"><p class="text-gray-500 text-lg">`);
        if (unref(searchQuery)) {
          _push(`<span>Aucun groupe trouv\xE9 pour &quot;${ssrInterpolate(unref(searchQuery))}&quot;</span>`);
        } else {
          _push(`<span>Aucun groupe trouv\xE9 pour cette s\xE9lection alphab\xE9tique.</span>`);
        }
        _push(`</p><div class="mt-4 space-x-4">`);
        if (unref(searchQuery)) {
          _push(`<button class="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"> Effacer la recherche </button>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(currentFilter) !== "all") {
          _push(`<button class="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"> Voir tous les groupes </button>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div>`);
      } else {
        _push(`<div class="text-center py-12"><p class="text-gray-500 text-lg">Aucun groupe trouv\xE9. Ajoutez-en dans Sanity !</p></div>`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/groupes/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-Dbv7kima.mjs.map
