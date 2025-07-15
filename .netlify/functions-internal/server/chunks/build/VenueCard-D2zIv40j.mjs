import { a as __nuxt_component_0 } from './server.mjs';
import { _ as _sfc_main$1 } from './NuxtImg-CHyr0FIh.mjs';
import { defineComponent, mergeProps, withCtx, createVNode, createBlock, openBlock, createCommentVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "VenueCard",
  __ssrInlineRender: true,
  props: {
    venue: {
      type: Object,
      required: true
    }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_NuxtImg = _sfc_main$1;
      _push(ssrRenderComponent(_component_NuxtLink, mergeProps({
        to: `/salles/${__props.venue.slug}`,
        class: "block group border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300"
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="aspect-w-1 aspect-h-1 bg-gray-100"${_scopeId}>`);
            if (__props.venue.image) {
              _push2(ssrRenderComponent(_component_NuxtImg, {
                src: __props.venue.image.asset._ref,
                provider: "sanity",
                class: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-300",
                alt: `Photo de ${__props.venue.name}`
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<div class="w-full h-full flex items-center justify-center bg-gray-200"${_scopeId}><svg class="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l-1.586-1.586a2 2 0 010-2.828L14 8"${_scopeId}></path></svg></div>`);
            }
            _push2(`</div><div class="p-4 bg-white"${_scopeId}><h3 class="font-bold text-lg truncate"${_scopeId}>${ssrInterpolate(__props.venue.name)}</h3>`);
            if (__props.venue.city && __props.venue.city.length > 0) {
              _push2(`<div class="flex flex-wrap gap-1 mt-2"${_scopeId}><span class="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs"${_scopeId}>${ssrInterpolate(__props.venue.city)}</span></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "aspect-w-1 aspect-h-1 bg-gray-100" }, [
                __props.venue.image ? (openBlock(), createBlock(_component_NuxtImg, {
                  key: 0,
                  src: __props.venue.image.asset._ref,
                  provider: "sanity",
                  class: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-300",
                  alt: `Photo de ${__props.venue.name}`
                }, null, 8, ["src", "alt"])) : (openBlock(), createBlock("div", {
                  key: 1,
                  class: "w-full h-full flex items-center justify-center bg-gray-200"
                }, [
                  (openBlock(), createBlock("svg", {
                    class: "w-12 h-12 text-gray-400",
                    fill: "none",
                    viewBox: "0 0 24 24",
                    stroke: "currentColor"
                  }, [
                    createVNode("path", {
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round",
                      "stroke-width": "2",
                      d: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l-1.586-1.586a2 2 0 010-2.828L14 8"
                    })
                  ]))
                ]))
              ]),
              createVNode("div", { class: "p-4 bg-white" }, [
                createVNode("h3", { class: "font-bold text-lg truncate" }, toDisplayString(__props.venue.name), 1),
                __props.venue.city && __props.venue.city.length > 0 ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "flex flex-wrap gap-1 mt-2"
                }, [
                  createVNode("span", { class: "bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs" }, toDisplayString(__props.venue.city), 1)
                ])) : createCommentVNode("", true)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/VenueCard.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
//# sourceMappingURL=VenueCard-D2zIv40j.mjs.map
