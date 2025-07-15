import { _ as __nuxt_component_0 } from './PostCard-Bjtf_EtO.mjs';
import { defineComponent, withAsyncContext, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderComponent } from 'vue/server-renderer';
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
  __name: "news",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const query = groq`*[_type == "post" && articleType == "news"] | order(publishedAt desc) {
  _id,
  title,
  "slug": slug.current,
  articleType,
  mainImage,
  publishedAt,
  "author": author->name
}`;
    const { data } = ([__temp, __restore] = withAsyncContext(() => useSanityQuery(query)), __temp = await __temp, __restore(), __temp);
    const posts = computed(() => Array.isArray(data.value) ? data.value : []);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_PostCard = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "container mx-auto p-4 md:p-8" }, _attrs))}><h1 class="text-2xl md:text-4xl font-bold mb-8">News</h1><p class="text-lg text-gray-600 mb-12">Derni\xE8res nouvelles de la sc\xE8ne metal.</p>`);
      if (unref(posts) && unref(posts).length > 0) {
        _push(`<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"><!--[-->`);
        ssrRenderList(unref(posts), (post) => {
          _push(`<div>`);
          _push(ssrRenderComponent(_component_PostCard, { post }, null, _parent));
          _push(`</div>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<div class="text-center py-16 bg-gray-50 rounded-lg"><p class="text-lg text-gray-700">Aucune news trouv\xE9e pour le moment.</p><p class="text-gray-500 mt-2">Revenez bient\xF4t !</p></div>`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/chroniques/news.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=news-Bkv9bYUN.mjs.map
