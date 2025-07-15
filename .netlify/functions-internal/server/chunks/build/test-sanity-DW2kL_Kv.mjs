import { a as __nuxt_component_0 } from './server.mjs';
import { withAsyncContext, mergeProps, unref, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderComponent } from 'vue/server-renderer';
import { u as useSanityQuery, g as groq } from './index-D7t3scmh.mjs';
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

const _sfc_main = {
  __name: "test-sanity",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const { data: posts, error } = ([__temp, __restore] = withAsyncContext(() => useSanityQuery(groq`
  *[_type == "post"] | order(_createdAt desc) [0...3] {
    _id,
    title,
    slug,
    _createdAt
  }
`)), __temp = await __temp, __restore(), __temp);
    const { data: bands, error: bandsError } = ([__temp, __restore] = withAsyncContext(() => useSanityQuery(groq`
  *[_type == "band"] | order(_createdAt desc) [0...3] {
    _id,
    name,
    slug,
    _createdAt
  }
`)), __temp = await __temp, __restore(), __temp);
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c, _d;
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "container mx-auto p-4" }, _attrs))}><h1 class="text-2xl font-bold mb-4">Test de connexion Sanity</h1>`);
      if (unref(error)) {
        _push(`<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"><strong>Erreur:</strong> ${ssrInterpolate(unref(error))}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="grid grid-cols-1 md:grid-cols-2 gap-6"><div><h2 class="text-xl font-semibold mb-2">Articles (${ssrInterpolate(((_a = unref(posts)) == null ? void 0 : _a.length) || 0)})</h2>`);
      if ((_b = unref(posts)) == null ? void 0 : _b.length) {
        _push(`<div class="space-y-2"><!--[-->`);
        ssrRenderList(unref(posts), (post) => {
          var _a2;
          _push(`<div class="bg-white p-3 rounded shadow"><h3 class="font-medium">${ssrInterpolate(post.title)}</h3><p class="text-sm text-gray-600">${ssrInterpolate((_a2 = post.slug) == null ? void 0 : _a2.current)}</p><p class="text-xs text-gray-500">${ssrInterpolate(new Date(post._createdAt).toLocaleDateString())}</p></div>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<p class="text-gray-500">Aucun article trouv\xE9</p>`);
      }
      _push(`</div><div><h2 class="text-xl font-semibold mb-2">Groupes (${ssrInterpolate(((_c = unref(bands)) == null ? void 0 : _c.length) || 0)})</h2>`);
      if ((_d = unref(bands)) == null ? void 0 : _d.length) {
        _push(`<div class="space-y-2"><!--[-->`);
        ssrRenderList(unref(bands), (band) => {
          var _a2;
          _push(`<div class="bg-white p-3 rounded shadow"><h3 class="font-medium">${ssrInterpolate(band.name)}</h3><p class="text-sm text-gray-600">${ssrInterpolate((_a2 = band.slug) == null ? void 0 : _a2.current)}</p><p class="text-xs text-gray-500">${ssrInterpolate(new Date(band._createdAt).toLocaleDateString())}</p></div>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<p class="text-gray-500">Aucun groupe trouv\xE9</p>`);
      }
      _push(`</div></div><div class="mt-6">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/recherche?q=test",
        class: "text-blue-600 hover:underline"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` \u2192 Tester la page de recherche `);
          } else {
            return [
              createTextVNode(" \u2192 Tester la page de recherche ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/test-sanity.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=test-sanity-DW2kL_Kv.mjs.map
