import { _ as _sfc_main$1 } from './BandCard-CPyibhNy.mjs';
import { defineComponent, withAsyncContext, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderComponent } from 'vue/server-renderer';
import { _ as _export_sfc, c as useRoute } from './server.mjs';
import { g as groq, u as useSanityQuery } from './index-D7t3scmh.mjs';
import './NuxtImg-CHyr0FIh.mjs';
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
    var _a, _b;
    let __temp, __restore;
    const route = useRoute();
    const styleSlug = route.params.slug;
    const query = groq`{
  // Première partie : on récupère les détails du style actuel (pour afficher son nom, sa description...)
  "style": *[_type == "style" && slug.current == $slug][0] {
    title,
    description
  },
  // Deuxième partie : on récupère TOUS les groupes qui ont une référence à ce style
  "bands": *[_type == "band" && references(*[_type=="style" && slug.current == $slug][0]._id)] | order(name asc) {
    _id,
    name,
    "slug": slug.current,
    pressPhoto,
    "styles": styles[]->{title} // On récupère aussi les styles pour nos vignettes
  }
}`;
    const { data } = ([__temp, __restore] = withAsyncContext(() => useSanityQuery(query, { slug: styleSlug })), __temp = await __temp, __restore(), __temp);
    const styleDetails = (_a = data.value) == null ? void 0 : _a.style;
    const bands = (_b = data.value) == null ? void 0 : _b.bands;
    return (_ctx, _push, _parent, _attrs) => {
      const _component_BandCard = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "container mx-auto p-4 md:p-8" }, _attrs))} data-v-0381cf5c>`);
      if (unref(styleDetails)) {
        _push(`<div data-v-0381cf5c><h1 class="text-2xl md:text-4xl font-bold mb-2" data-v-0381cf5c>Groupes de ${ssrInterpolate(unref(styleDetails).title)}</h1>`);
        if (unref(styleDetails).description) {
          _push(`<p class="text-lg text-gray-600 mb-8" data-v-0381cf5c>${ssrInterpolate(unref(styleDetails).description)}</p>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(bands) && unref(bands).length > 0) {
          _push(`<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mobile-single-col" data-v-0381cf5c><!--[-->`);
          ssrRenderList(unref(bands), (band) => {
            _push(`<div data-v-0381cf5c>`);
            _push(ssrRenderComponent(_component_BandCard, { band }, null, _parent));
            _push(`</div>`);
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<div data-v-0381cf5c><p data-v-0381cf5c>Aucun groupe trouv\xE9 pour ce style pour le moment.</p></div>`);
        }
        _push(`</div>`);
      } else {
        _push(`<div class="text-center p-16" data-v-0381cf5c><p data-v-0381cf5c>Style musical non trouv\xE9.</p></div>`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/styles/[slug].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _slug_ = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-0381cf5c"]]);

export { _slug_ as default };
//# sourceMappingURL=_slug_-BhloHsXM.mjs.map
