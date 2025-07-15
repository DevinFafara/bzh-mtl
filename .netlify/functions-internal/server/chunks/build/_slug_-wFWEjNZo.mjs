import { _ as _sfc_main$1 } from './NuxtImg-CHyr0FIh.mjs';
import { _ as __nuxt_component_1 } from './CustomSanityContent-DFtE2pkc.mjs';
import { defineComponent, withAsyncContext, unref, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { _ as _export_sfc, c as useRoute, e as useAsyncData } from './server.mjs';
import { a as useSanity, g as groq } from './index-D7t3scmh.mjs';
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
    const { client } = useSanity();
    const authorQuery = groq`*[_type == "author" && slug.current == $slug][0] {
  _id, // On récupère l'ID pour la deuxième requête
  name,
  image,
  citation,
  bio
}`;
    const { data: author, pending: pendingAuthor } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      "author-data",
      () => client.fetch(authorQuery, { slug: route.params.slug })
    )), __temp = await __temp, __restore(), __temp);
    const postsQuery = groq`*[_type == "post" && author._ref == $authorId] | order(publishedAt desc) {
  _id,
  title,
  "slug": slug.current,
  mainImage,
  "category": category->title
}`;
    const { data: posts, pending: pendingPosts } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      "author-posts",
      () => client.fetch(postsQuery, { authorId: author.value._id }),
      {
        watch: [author],
        immediate: !!author.value
      }
    )), __temp = await __temp, __restore(), __temp);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtImg = _sfc_main$1;
      const _component_CustomSanityContent = __nuxt_component_1;
      if (unref(author)) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "container mx-auto p-2 md:p-8" }, _attrs))} data-v-d30270fe><div class="max-w-8xl mx-auto" data-v-d30270fe>`);
        if (unref(author)) {
          _push(`<div class="bg-gray-50 p-2 rounded-lg mb-8" data-v-d30270fe><div class="flex items-start gap-4" data-v-d30270fe>`);
          if (unref(author).image) {
            _push(ssrRenderComponent(_component_NuxtImg, {
              src: unref(author).image.asset._ref,
              provider: "sanity",
              class: "h-20 w-20 rounded-full object-cover flex-shrink-0"
            }, null, _parent));
          } else {
            _push(`<!---->`);
          }
          _push(`<div class="flex-1 mt-2" data-v-d30270fe><h2 class="font-semibold text-2xl md:text-3xl" data-v-d30270fe>${ssrInterpolate(unref(author).name)}</h2>`);
          if (unref(author).citation) {
            _push(`<div class="text-gray-600 italic mt-2 prose prose-sm" data-v-d30270fe><p data-v-d30270fe>${ssrInterpolate(unref(author).citation)}</p></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div></div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(author).bio) {
          _push(`<div class="max-w-none mb-12" data-v-d30270fe>`);
          _push(ssrRenderComponent(_component_CustomSanityContent, {
            blocks: unref(author).bio
          }, null, _parent));
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div>`);
      } else {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "text-center p-16" }, _attrs))} data-v-d30270fe><p data-v-d30270fe>Auteur non trouv\xE9...</p></div>`);
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/auteurs/[slug].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _slug_ = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-d30270fe"]]);

export { _slug_ as default };
//# sourceMappingURL=_slug_-wFWEjNZo.mjs.map
