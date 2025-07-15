import { _ as _sfc_main$1 } from './VenueCard-D2zIv40j.mjs';
import { defineComponent, withAsyncContext, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrInterpolate, ssrRenderComponent } from 'vue/server-renderer';
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
    const query = groq`*[_type == "venue"] | order(name asc) {
  _id,
  name,
  "slug": slug.current,
  image,
  city,
  department // ON AJOUTE LE DÉPARTEMENT
}`;
    const { data: venues } = ([__temp, __restore] = withAsyncContext(() => useSanityQuery(query)), __temp = await __temp, __restore(), __temp);
    const departmentOrder = [
      { value: "29", title: "Finist\xE8re (29)" },
      { value: "22", title: "C\xF4tes-d'Armor (22)" },
      { value: "56", title: "Morbihan (56)" },
      { value: "35", title: "Ille-et-Vilaine (35)" },
      { value: "44", title: "Loire-Atlantique (44)" }
    ];
    const groupedVenues = computed(() => {
      const venuesArray = Array.isArray(venues.value) ? venues.value : [];
      const groups = venuesArray.reduce((acc, venue) => {
        const department = venue.department;
        if (!acc[department]) {
          acc[department] = [];
        }
        acc[department].push(venue);
        return acc;
      }, {});
      return groups;
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_VenueCard = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "container mx-auto p-4 md:p-8" }, _attrs))}><h1 class="text-2xl md:text-4xl font-bold mb-8">Les Salles de Concert</h1><!--[-->`);
      ssrRenderList(departmentOrder, (dept) => {
        _push(`<div>`);
        if (unref(groupedVenues)[dept.value] && unref(groupedVenues)[dept.value].length > 0) {
          _push(`<div><h2 class="text-xl font-semibold border-b-2 border-gray-300 pb-2 mt-12 mb-6">${ssrInterpolate(dept.title)}</h2><div class="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12"><!--[-->`);
          ssrRenderList(unref(groupedVenues)[dept.value], (venue) => {
            _push(`<div>`);
            _push(ssrRenderComponent(_component_VenueCard, { venue }, null, _parent));
            _push(`</div>`);
          });
          _push(`<!--]--></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      });
      _push(`<!--]-->`);
      if (!unref(venues) || unref(venues).length === 0) {
        _push(`<div class="text-center py-12"><p>Aucune salle trouv\xE9e. Ajoutez-en dans Sanity !</p></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/salles/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-B_MjN1eS.mjs.map
