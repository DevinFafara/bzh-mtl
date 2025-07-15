import { _ as _export_sfc, a as __nuxt_component_0$1, f as __nuxt_component_3 } from './server.mjs';
import { _ as _sfc_main$1 } from './NuxtImg-CHyr0FIh.mjs';
import { defineComponent, computed, mergeProps, withCtx, unref, createVNode, createBlock, createCommentVNode, openBlock, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrInterpolate, ssrRenderAttr } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "PostCard",
  __ssrInlineRender: true,
  props: {
    post: {
      type: Object,
      required: true
    }
  },
  setup(__props) {
    const props = __props;
    const formattedDate = computed(() => {
      var _a;
      if (!((_a = props.post) == null ? void 0 : _a.publishedAt)) return "";
      return new Date(props.post.publishedAt).toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric"
      });
    });
    const formattedArticleType = computed(() => {
      var _a, _b;
      const typeLabels = {
        "album-review": "Chronique d'album",
        "interview": "Interview",
        "live-report": "Live Report",
        "news": "News"
      };
      const articleType = (_a = props.post) == null ? void 0 : _a.articleType;
      return articleType && typeLabels[articleType] || ((_b = props.post) == null ? void 0 : _b.articleType) || "";
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$1;
      const _component_NuxtImg = _sfc_main$1;
      const _component_Icon = __nuxt_component_3;
      _push(ssrRenderComponent(_component_NuxtLink, mergeProps({
        to: `/articles/${__props.post.slug}`,
        class: "group flex bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="relative w-48 h-32 flex-shrink-0 overflow-hidden" data-v-ca51ad31${_scopeId}>`);
            if (__props.post.mainImage) {
              _push2(ssrRenderComponent(_component_NuxtImg, {
                src: __props.post.mainImage.asset._ref,
                provider: "sanity",
                class: "w-full h-full object-cover group-hover:scale-110 transition-transform duration-500",
                alt: `Image pour l'article ${__props.post.title}`
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200" data-v-ca51ad31${_scopeId}>`);
              _push2(ssrRenderComponent(_component_Icon, {
                name: "heroicons:photo",
                class: "h-8 w-8 text-gray-400"
              }, null, _parent2, _scopeId));
              _push2(`</div>`);
            }
            _push2(`<div class="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" data-v-ca51ad31${_scopeId}></div>`);
            if (__props.post.articleType) {
              _push2(`<div class="absolute top-2 left-2" data-v-ca51ad31${_scopeId}><span class="bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg" data-v-ca51ad31${_scopeId}>${ssrInterpolate(unref(formattedArticleType))}</span></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="flex-1 p-4 flex flex-col justify-between" data-v-ca51ad31${_scopeId}><h3 class="text-lg font-bold text-gray-900 group-hover:text-yellow-600 transition-colors mb-2 line-clamp-2 leading-tight" data-v-ca51ad31${_scopeId}>${ssrInterpolate(__props.post.title)}</h3><div class="space-y-2" data-v-ca51ad31${_scopeId}><div class="flex items-center gap-4 text-sm text-gray-500" data-v-ca51ad31${_scopeId}>`);
            if (__props.post.author) {
              _push2(`<div class="flex items-center gap-1" data-v-ca51ad31${_scopeId}>`);
              _push2(ssrRenderComponent(_component_Icon, {
                name: "heroicons:user",
                class: "h-3 w-3"
              }, null, _parent2, _scopeId));
              _push2(`<span class="font-medium" data-v-ca51ad31${_scopeId}>${ssrInterpolate(__props.post.author)}</span></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.post.publishedAt) {
              _push2(`<time${ssrRenderAttr("datetime", __props.post.publishedAt)} class="flex items-center gap-1" data-v-ca51ad31${_scopeId}>`);
              _push2(ssrRenderComponent(_component_Icon, {
                name: "heroicons:calendar-days",
                class: "h-3 w-3"
              }, null, _parent2, _scopeId));
              _push2(`<span data-v-ca51ad31${_scopeId}>${ssrInterpolate(unref(formattedDate))}</span></time>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="flex items-center justify-between pt-2 border-t border-gray-100" data-v-ca51ad31${_scopeId}><span class="text-sm text-gray-400" data-v-ca51ad31${_scopeId}>Lire l&#39;article</span>`);
            _push2(ssrRenderComponent(_component_Icon, {
              name: "heroicons:arrow-right",
              class: "h-4 w-4 text-gray-400 group-hover:text-yellow-500 group-hover:translate-x-1 transition-all duration-300"
            }, null, _parent2, _scopeId));
            _push2(`</div></div></div>`);
          } else {
            return [
              createVNode("div", { class: "relative w-48 h-32 flex-shrink-0 overflow-hidden" }, [
                __props.post.mainImage ? (openBlock(), createBlock(_component_NuxtImg, {
                  key: 0,
                  src: __props.post.mainImage.asset._ref,
                  provider: "sanity",
                  class: "w-full h-full object-cover group-hover:scale-110 transition-transform duration-500",
                  alt: `Image pour l'article ${__props.post.title}`
                }, null, 8, ["src", "alt"])) : (openBlock(), createBlock("div", {
                  key: 1,
                  class: "w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200"
                }, [
                  createVNode(_component_Icon, {
                    name: "heroicons:photo",
                    class: "h-8 w-8 text-gray-400"
                  })
                ])),
                createVNode("div", { class: "absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" }),
                __props.post.articleType ? (openBlock(), createBlock("div", {
                  key: 2,
                  class: "absolute top-2 left-2"
                }, [
                  createVNode("span", { class: "bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg" }, toDisplayString(unref(formattedArticleType)), 1)
                ])) : createCommentVNode("", true)
              ]),
              createVNode("div", { class: "flex-1 p-4 flex flex-col justify-between" }, [
                createVNode("h3", { class: "text-lg font-bold text-gray-900 group-hover:text-yellow-600 transition-colors mb-2 line-clamp-2 leading-tight" }, toDisplayString(__props.post.title), 1),
                createVNode("div", { class: "space-y-2" }, [
                  createVNode("div", { class: "flex items-center gap-4 text-sm text-gray-500" }, [
                    __props.post.author ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "flex items-center gap-1"
                    }, [
                      createVNode(_component_Icon, {
                        name: "heroicons:user",
                        class: "h-3 w-3"
                      }),
                      createVNode("span", { class: "font-medium" }, toDisplayString(__props.post.author), 1)
                    ])) : createCommentVNode("", true),
                    __props.post.publishedAt ? (openBlock(), createBlock("time", {
                      key: 1,
                      datetime: __props.post.publishedAt,
                      class: "flex items-center gap-1"
                    }, [
                      createVNode(_component_Icon, {
                        name: "heroicons:calendar-days",
                        class: "h-3 w-3"
                      }),
                      createVNode("span", null, toDisplayString(unref(formattedDate)), 1)
                    ], 8, ["datetime"])) : createCommentVNode("", true)
                  ]),
                  createVNode("div", { class: "flex items-center justify-between pt-2 border-t border-gray-100" }, [
                    createVNode("span", { class: "text-sm text-gray-400" }, "Lire l'article"),
                    createVNode(_component_Icon, {
                      name: "heroicons:arrow-right",
                      class: "h-4 w-4 text-gray-400 group-hover:text-yellow-500 group-hover:translate-x-1 transition-all duration-300"
                    })
                  ])
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/PostCard.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_0 = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-ca51ad31"]]);

export { __nuxt_component_0 as _ };
//# sourceMappingURL=PostCard-Bjtf_EtO.mjs.map
