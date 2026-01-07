import { c as __nuxt_component_0$1, s as _sfc_main$8 } from './server.mjs';
import { _ as __nuxt_component_2, a as __nuxt_component_3, b as __nuxt_component_4 } from './Series-DOnYv0ki.mjs';
import { _ as _sfc_main$1 } from './Modal-BloHIZZn.mjs';
import { defineComponent, ref, watch, computed, mergeProps, unref, withCtx, createVNode, createBlock, createCommentVNode, openBlock, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrInterpolate, ssrRenderComponent, ssrRenderClass, ssrRenderAttr } from 'vue/server-renderer';
import { u as useStalkerStore } from './stalker-F4Itg4Zv.mjs';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import '@iconify/utils';
import 'node:crypto';
import 'consola';
import 'node:url';
import 'ipx';
import 'node:fs';
import 'node:path';
import 'pinia';
import 'vue-router';
import 'tailwindcss/colors';
import '@iconify/vue';
import 'reka-ui';
import '@vueuse/core';
import 'tailwind-variants';
import '@iconify/utils/lib/css/icon';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';
import './Card-ByYrxPrg.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "dashboard copy",
  __ssrInlineRender: true,
  setup(__props) {
    const stalker = useStalkerStore();
    const selectedTab = ref("live-tv");
    const selectedCategory = ref(null);
    ref(null);
    const sourceUrl = ref(null);
    ref(0);
    const videoElement = ref(null);
    ref(null);
    ref(false);
    watch(
      () => stalker.sourceUrl,
      (newUrl) => {
        sourceUrl.value = newUrl;
      }
    );
    computed(() => {
      if (!selectedCategory.value) return [];
      const key = `${selectedCategory.value.id}_1`;
      const items = stalker.liveItems[key];
      if (!items || !Array.isArray(items)) {
        console.warn("Live items not found or not an array:", key, items);
        return [];
      }
      return items;
    });
    computed(() => {
      if (!selectedCategory.value) return [];
      const key = `${selectedCategory.value.id}_1`;
      const items = stalker.moviesItems[key];
      if (!items || !Array.isArray(items)) {
        console.warn("Movies items not found or not an array:", key, items);
        return [];
      }
      return items;
    });
    computed(() => {
      if (!selectedCategory.value) return [];
      const key = `${selectedCategory.value.id}_1`;
      const items = stalker.seriesItems[key];
      if (!items || !Array.isArray(items)) {
        console.warn("Series items not found or not an array:", key, items);
        return [];
      }
      return items;
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Icon = __nuxt_component_0$1;
      const _component_UProgress = _sfc_main$8;
      const _component_Live = __nuxt_component_2;
      const _component_Movies = __nuxt_component_3;
      const _component_Series = __nuxt_component_4;
      const _component_UModal = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex flex-row h-screen" }, _attrs))} data-v-38dfcf89><div class="sidebar gap-4 border-r border-gray-500 border-solid w-[20%] flex flex-col h-full" data-v-38dfcf89><div class="sidebar-header mt-3 flex items-center align-middle justify-center" data-v-38dfcf89><h1 class="text-2xl text-center font-bold text-white-800 text-shadow-black text-shadow-2xs" data-v-38dfcf89> STREAMFLIX </h1></div><div class="sidecats h-full overflow-auto" data-v-38dfcf89>`);
      if (unref(selectedTab) === "live-tv") {
        _push(`<div data-v-38dfcf89><!--[-->`);
        ssrRenderList(unref(stalker).liveCategories, (category) => {
          _push(`<div class="p-2 mb-2 text-sm rounded-md bg-gray-100 dark:bg-gray-800 cursor-pointer hover:bg-gray-200 dark:hover:bg-primary-700" data-v-38dfcf89><span data-v-38dfcf89>${ssrInterpolate(category.title)}</span></div>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(selectedTab) === "movies") {
        _push(`<div data-v-38dfcf89><!--[-->`);
        ssrRenderList(unref(stalker).moviesCategories, (category) => {
          _push(`<div class="p-2 mb-2 text-sm rounded-md bg-gray-100 dark:bg-gray-800 cursor-pointer hover:bg-gray-200 dark:hover:bg-primary-700" data-v-38dfcf89><span data-v-38dfcf89>${ssrInterpolate(category.title)}</span></div>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(selectedTab) === "series") {
        _push(`<div data-v-38dfcf89><!--[-->`);
        ssrRenderList(unref(stalker).seriesCategories, (category) => {
          _push(`<div class="p-2 mb-2 text-sm rounded-md bg-gray-100 dark:bg-gray-800 cursor-pointer hover:bg-gray-200 dark:hover:bg-primary-700" data-v-38dfcf89><span data-v-38dfcf89>${ssrInterpolate(category.title)}</span></div>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="sidenav mb-2 flex flex-row w-full justify-around" data-v-38dfcf89><button class="flex flex-col items-center gap-1 cursor-pointer" data-v-38dfcf89>`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "lucide:tv",
        class: ["w-6 h-6", { "text-primary": unref(selectedTab) === "live-tv" }],
        "aria-hidden": "true"
      }, null, _parent));
      _push(`<span class="${ssrRenderClass([{ "text-primary": unref(selectedTab) === "live-tv" }, "text-xs"])}" data-v-38dfcf89> Live TV </span></button><button class="flex flex-col items-center gap-1 cursor-pointer" data-v-38dfcf89>`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "lucide:film",
        class: ["w-6 h-6", { "text-primary": unref(selectedTab) === "movies" }],
        "aria-hidden": "true"
      }, null, _parent));
      _push(`<span class="${ssrRenderClass([{ "text-primary": unref(selectedTab) === "movies" }, "text-xs"])}" data-v-38dfcf89> Movies </span></button><button class="flex flex-col items-center gap-1 cursor-pointer" data-v-38dfcf89>`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "lucide:monitor-play",
        class: ["w-6 h-6", { "text-primary": unref(selectedTab) === "series" }],
        "aria-hidden": "true"
      }, null, _parent));
      _push(`<span class="${ssrRenderClass([{ "text-primary": unref(selectedTab) === "series" }, "text-xs"])}" data-v-38dfcf89> Series </span></button></div></div><div class="maincontent w-full h-screen overflow-auto p-10" data-v-38dfcf89>`);
      if (unref(stalker).progress > 0 && unref(stalker).progress < 100) {
        _push(ssrRenderComponent(_component_UProgress, {
          modelValue: unref(stalker).progress,
          "onUpdate:modelValue": ($event) => unref(stalker).progress = $event
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      if (unref(selectedTab) == "live-tv") {
        _push(`<div data-v-38dfcf89>`);
        _push(ssrRenderComponent(_component_Live, null, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(selectedTab) == "movies") {
        _push(`<div data-v-38dfcf89>`);
        _push(ssrRenderComponent(_component_Movies, null, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(selectedTab) == "series") {
        _push(`<div data-v-38dfcf89>`);
        _push(ssrRenderComponent(_component_Series, null, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(_component_UModal, {
        class: "m-10",
        fullscreen: "",
        open: unref(stalker).modalOpen,
        "onUpdate:open": ($event) => unref(stalker).modalOpen = $event
      }, {
        content: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="plyrcontent flex flex-col justify-center items-center w-full h-full" data-v-38dfcf89${_scopeId}><div class="video-holder m-auto p-10 w-full h-full" data-v-38dfcf89${_scopeId}><video controls crossorigin playsinline autoplay class="w-full h-full" data-v-38dfcf89${_scopeId}>`);
            if (unref(sourceUrl)) {
              _push2(`<source${ssrRenderAttr("src", unref(sourceUrl))} type="application/x-mpegURL" data-v-38dfcf89${_scopeId}>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</video></div></div>`);
          } else {
            return [
              createVNode("div", { class: "plyrcontent flex flex-col justify-center items-center w-full h-full" }, [
                createVNode("div", { class: "video-holder m-auto p-10 w-full h-full" }, [
                  createVNode("video", {
                    ref_key: "videoElement",
                    ref: videoElement,
                    controls: "",
                    crossorigin: "",
                    playsinline: "",
                    autoplay: "",
                    class: "w-full h-full"
                  }, [
                    unref(sourceUrl) ? (openBlock(), createBlock("source", {
                      key: 0,
                      src: unref(sourceUrl),
                      type: "application/x-mpegURL"
                    }, null, 8, ["src"])) : createCommentVNode("", true)
                  ], 512)
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard copy.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const dashboard_copy = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-38dfcf89"]]);

export { dashboard_copy as default };
//# sourceMappingURL=dashboard copy-CV0-YObR.mjs.map
