import { _ as _sfc_main$1 } from './NuxtImg-CHyr0FIh.mjs';
import { defineComponent, ref, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderComponent, ssrInterpolate, ssrRenderTeleport } from 'vue/server-renderer';
import { _ as _export_sfc } from './server.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "CustomSanityContent",
  __ssrInlineRender: true,
  props: {
    blocks: {}
  },
  setup(__props) {
    const selectedImage = ref(null);
    const openImageModal = (asset, alt, caption) => {
      selectedImage.value = {
        src: asset._ref,
        alt,
        caption
      };
      (void 0).body.style.overflow = "hidden";
    };
    const applyMarks = (text, marks, markDefs) => {
      let result = text;
      if (marks.includes("strong")) {
        result = `<strong>${result}</strong>`;
      }
      if (marks.includes("em")) {
        result = `<em>${result}</em>`;
      }
      marks.forEach((mark) => {
        const markDef = markDefs.find((def) => def._key === mark);
        if (markDef && markDef._type === "link") {
          const href = markDef.href;
          const target = href.startsWith("http") ? ' target="_blank" rel="noopener noreferrer"' : "";
          result = `<a href="${href}"${target} class="text-blue-600 hover:text-blue-800 underline">${result}</a>`;
        }
      });
      return result;
    };
    const processBlocks = (blocks) => {
      var _a, _b;
      const result = [];
      let currentListHtml = "";
      let currentList = null;
      for (const block of blocks) {
        if (block._type === "image") {
          if (currentList) {
            currentListHtml += `</${currentList.type}>`;
            result.push(currentListHtml);
            currentListHtml = "";
            currentList = null;
          }
          if ((_a = block.asset) == null ? void 0 : _a._ref) {
            result.push({
              type: "image",
              asset: block.asset,
              alt: block.alt || "Image",
              caption: block.caption,
              _key: block._key
            });
          }
        } else if (block._type === "block" && block.listItem) {
          const listType = block.listItem === "bullet" ? "ul" : "ol";
          const level = block.level || 1;
          const content = ((_b = block.children) == null ? void 0 : _b.map((child) => applyMarks(child.text, child.marks, block.markDefs || [])).join("")) || "";
          if (!currentList || currentList.type !== listType || currentList.level !== level) {
            if (currentList) {
              currentListHtml += `</${currentList.type}>`;
              result.push(currentListHtml);
              currentListHtml = "";
            }
            const listClass = listType === "ul" ? "list-disc ml-8 mb-4" : "list-decimal ml-8 mb-4";
            currentListHtml = `<${listType} class="${listClass}">`;
            currentList = { type: listType, level };
          }
          currentListHtml += `<li class="mb-1">${content}</li>`;
        } else {
          if (currentList) {
            currentListHtml += `</${currentList.type}>`;
            result.push(currentListHtml);
            currentListHtml = "";
            currentList = null;
          }
          result.push(renderBlock(block));
        }
      }
      if (currentList) {
        currentListHtml += `</${currentList.type}>`;
        result.push(currentListHtml);
      }
      return result;
    };
    const renderBlock = (block) => {
      var _a;
      if (block._type !== "block") return "";
      const content = ((_a = block.children) == null ? void 0 : _a.map((child) => applyMarks(child.text, child.marks, block.markDefs || [])).join("")) || "";
      switch (block.style) {
        case "h1":
          return `<h1>${content}</h1>`;
        case "h2":
          return `<h2>${content}</h2>`;
        case "h3":
          return `<h3>${content}</h3>`;
        case "h4":
          return `<h4>${content}</h4>`;
        case "blockquote":
          return `<blockquote>${content}</blockquote>`;
        case "normal":
        default:
          return `<p>${content}</p>`;
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtImg = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "sanity-content" }, _attrs))} data-v-02ab782f><!--[-->`);
      ssrRenderList(processBlocks(_ctx.blocks), (item, index) => {
        _push(`<!--[-->`);
        if (typeof item === "object" && item.type === "image") {
          _push(`<figure class="my-6" data-v-02ab782f>`);
          _push(ssrRenderComponent(_component_NuxtImg, {
            src: item.asset._ref,
            alt: item.alt,
            provider: "sanity",
            class: "mx-auto max-w-[600px] w-full h-auto rounded-lg shadow-md cursor-pointer transition-transform duration-200 hover:scale-[1.02]",
            loading: "lazy",
            onClick: ($event) => openImageModal(item.asset, item.alt, item.caption)
          }, null, _parent));
          if (item.caption) {
            _push(`<figcaption class="text-sm text-gray-600 italic mt-2 text-center" data-v-02ab782f>${ssrInterpolate(item.caption)}</figcaption>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</figure>`);
        } else {
          _push(`<div data-v-02ab782f>${item != null ? item : ""}</div>`);
        }
        _push(`<!--]-->`);
      });
      _push(`<!--]-->`);
      ssrRenderTeleport(_push, (_push2) => {
        if (unref(selectedImage)) {
          _push2(`<div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 p-4" data-v-02ab782f><div class="relative max-w-[90vw] max-h-[90vh] flex flex-col" data-v-02ab782f><button class="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors z-10" aria-label="Fermer l&#39;image agrandie" data-v-02ab782f><svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-02ab782f><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" data-v-02ab782f></path></svg></button>`);
          _push2(ssrRenderComponent(_component_NuxtImg, {
            src: unref(selectedImage).src,
            alt: unref(selectedImage).alt,
            provider: "sanity",
            class: "max-w-full max-h-full object-contain rounded-lg",
            onClick: () => {
            }
          }, null, _parent));
          if (unref(selectedImage).caption) {
            _push2(`<p class="text-white text-center mt-4 text-sm italic bg-black bg-opacity-50 px-4 py-2 rounded" data-v-02ab782f>${ssrInterpolate(unref(selectedImage).caption)}</p>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/CustomSanityContent.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_1 = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-02ab782f"]]);

export { __nuxt_component_1 as _ };
//# sourceMappingURL=CustomSanityContent-DFtE2pkc.mjs.map
