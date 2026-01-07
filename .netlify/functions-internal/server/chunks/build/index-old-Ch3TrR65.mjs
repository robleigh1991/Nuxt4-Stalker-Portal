import { c as __nuxt_component_0$1 } from './server.mjs';
import { _ as __nuxt_component_1 } from './Header-CIp_Me-4.mjs';
import { _ as _sfc_main$1 } from './Card-ByYrxPrg.mjs';
import { defineComponent, ref, watch, computed, mergeProps, unref, withCtx, createBlock, createCommentVNode, openBlock, createVNode, toDisplayString, useSSRContext } from 'vue';
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
import './Container-Cb3Pb78c.mjs';
import './Modal-BloHIZZn.mjs';
import 'vaul-vue';
import './Input-OdlgYHLB.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index-old",
  __ssrInlineRender: true,
  setup(__props) {
    const selectedTab = ref("live-tv");
    const stalker = useStalkerStore();
    const selectedCategory = ref(null);
    const selectedItem = ref(null);
    const sourceUrl = ref(null);
    ref(null);
    ref(null);
    watch(
      () => stalker.sourceUrl,
      (newUrl) => {
        sourceUrl.value = newUrl;
        console.log(newUrl);
      }
    );
    function setSelectedItem(item) {
      selectedItem.value = item;
      stalker.setSelectedItem(item);
      if (selectedTab.value === "live-tv") {
        stalker.createLink(item.cmd, "itv");
      }
      if (selectedTab.value === "movies") {
        stalker.createLink(item.cmd, "vod");
      }
      if (selectedTab.value === "series") {
        stalker.getSeriesSeasons(item.id);
      }
    }
    const getMoviesItems = computed(() => {
      if (!selectedCategory.value) return [];
      const key = `${selectedCategory.value.id}_1`;
      const items = stalker.moviesItems[key];
      if (!items || !Array.isArray(items)) {
        console.warn("Movies items not found or not an array:", key, items);
        return [];
      }
      return items;
    });
    const getSeriesItems = computed(() => {
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
      const _component_Header = __nuxt_component_1;
      const _component_UCard = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex flex-row h-screen overflow-hidden" }, _attrs))} data-v-b000da20><div class="sidebar flex flex-col w-64 border-r border-gray-100 dark:border-gray-800 overflow-hidden" data-v-b000da20><div class="sidebar-header shrink-0 border-b border-gray-100 dark:border-gray-800" data-v-b000da20><h1 data-v-b000da20>Sidebar</h1></div><div class="sidebar-content flex-1 overflow-y-auto min-h-0 p-4" data-v-b000da20>`);
      if (unref(selectedTab) === "live-tv") {
        _push(`<div data-v-b000da20><!--[-->`);
        ssrRenderList(unref(stalker).liveCategories, (category) => {
          _push(`<div class="p-2 mb-2 text-sm rounded-md bg-gray-100 dark:bg-gray-800 cursor-pointer hover:bg-gray-200 dark:hover:bg-primary-700" data-v-b000da20><span data-v-b000da20>${ssrInterpolate(category.title)}</span></div>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(selectedTab) === "movies") {
        _push(`<div data-v-b000da20><!--[-->`);
        ssrRenderList(unref(stalker).moviesCategories, (category) => {
          _push(`<div class="p-2 mb-2 text-sm rounded-md bg-gray-100 dark:bg-gray-800 cursor-pointer hover:bg-gray-200 dark:hover:bg-primary-700" data-v-b000da20><span data-v-b000da20>${ssrInterpolate(category.title)}</span></div>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(selectedTab) === "series") {
        _push(`<div data-v-b000da20><!--[-->`);
        ssrRenderList(unref(stalker).seriesCategories, (category) => {
          _push(`<div class="p-2 mb-2 text-sm rounded-md bg-gray-100 dark:bg-gray-800 cursor-pointer hover:bg-gray-200 dark:hover:bg-primary-700" data-v-b000da20><span data-v-b000da20>${ssrInterpolate(category.title)}</span></div>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="sidebar-footer shrink-0 border-t border-gray-100 dark:border-gray-800" data-v-b000da20><div class="sidebar-footer-items flex items-center justify-between p-4" data-v-b000da20><button class="flex flex-col items-center gap-1 cursor-pointer" data-v-b000da20>`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "lucide:tv",
        class: ["w-6 h-6", { "text-primary": unref(selectedTab) === "live-tv" }],
        "aria-hidden": "true"
      }, null, _parent));
      _push(`<span class="${ssrRenderClass([{ "text-primary": unref(selectedTab) === "live-tv" }, "text-xs"])}" data-v-b000da20> Live TV </span></button><button class="flex flex-col items-center gap-1 cursor-pointer" data-v-b000da20>`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "lucide:film",
        class: ["w-6 h-6", { "text-primary": unref(selectedTab) === "movies" }],
        "aria-hidden": "true"
      }, null, _parent));
      _push(`<span class="${ssrRenderClass([{ "text-primary": unref(selectedTab) === "movies" }, "text-xs"])}" data-v-b000da20> Movies </span></button><button class="flex flex-col items-center gap-1 cursor-pointer" data-v-b000da20>`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "lucide:monitor-play",
        class: ["w-6 h-6", { "text-primary": unref(selectedTab) === "series" }],
        "aria-hidden": "true"
      }, null, _parent));
      _push(`<span class="${ssrRenderClass([{ "text-primary": unref(selectedTab) === "series" }, "text-xs"])}" data-v-b000da20> Series </span></button></div></div></div><div class="main w-full h-screen overflow-y-auto" data-v-b000da20>`);
      _push(ssrRenderComponent(_component_Header, null, null, _parent));
      _push(`<div class="main-content flex flex-col p-4" data-v-b000da20><div class="video-holder" data-v-b000da20><video controls crossorigin playsinline data-v-b000da20>`);
      if (unref(sourceUrl)) {
        _push(`<source${ssrRenderAttr("src", unref(sourceUrl))} type="application/x-mpegURL" data-v-b000da20>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</video></div><div class="items-holder w-full max-h-60vh overflow-y-auto" data-v-b000da20>`);
      if (unref(selectedTab) === "live-tv" && unref(selectedCategory) && _ctx.getLiveItems) {
        _push(`<div class="grid grid-cols-7 gap-4 max-h-400px overflow-y-auto" data-v-b000da20><!--[-->`);
        ssrRenderList(_ctx.getLiveItems, (item) => {
          _push(`<div data-v-b000da20>`);
          if (item) {
            _push(ssrRenderComponent(_component_UCard, {
              variant: "subtle",
              class: ["text-center cursor-pointer hover:bg-gray-100 dark:hover:bg-primary-700 rounded-md", {
                "bg-primary-100 dark:bg-primary-900": unref(selectedItem) === item
              }],
              onClick: ($event) => setSelectedItem(item)
            }, {
              footer: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`<span data-v-b000da20${_scopeId}>${ssrInterpolate(item.name)}</span>`);
                } else {
                  return [
                    createVNode("span", null, toDisplayString(item.name), 1)
                  ];
                }
              }),
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  if (item.logo) {
                    _push2(`<img${ssrRenderAttr("src", item.logo)} alt="logo" class="w-full h-full object-cover" data-v-b000da20${_scopeId}>`);
                  } else {
                    _push2(`<!---->`);
                  }
                } else {
                  return [
                    item.logo ? (openBlock(), createBlock("img", {
                      key: 0,
                      src: item.logo,
                      alt: "logo",
                      class: "w-full h-full object-cover"
                    }, null, 8, ["src"])) : createCommentVNode("", true)
                  ];
                }
              }),
              _: 2
            }, _parent));
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(selectedTab) === "movies" && unref(selectedCategory) && unref(getMoviesItems)) {
        _push(`<div class="grid grid-cols-7 gap-4 max-h-400px overflow-y-auto" data-v-b000da20><!--[-->`);
        ssrRenderList(unref(getMoviesItems), (item) => {
          _push(`<div data-v-b000da20>`);
          if (item) {
            _push(ssrRenderComponent(_component_UCard, {
              variant: "subtle",
              class: ["text-center cursor-pointer hover:bg-gray-100 dark:hover:bg-primary-700 rounded-md", {
                "bg-primary-100 dark:bg-primary-900": unref(selectedItem) === item
              }],
              onClick: ($event) => setSelectedItem(item)
            }, {
              footer: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`<span data-v-b000da20${_scopeId}>${ssrInterpolate(item.name)}</span>`);
                } else {
                  return [
                    createVNode("span", null, toDisplayString(item.name), 1)
                  ];
                }
              }),
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  if (item.screenshot_uri) {
                    _push2(`<img${ssrRenderAttr("src", item.screenshot_uri)} alt="logo" class="w-full h-full object-cover" data-v-b000da20${_scopeId}>`);
                  } else {
                    _push2(`<!---->`);
                  }
                } else {
                  return [
                    item.screenshot_uri ? (openBlock(), createBlock("img", {
                      key: 0,
                      src: item.screenshot_uri,
                      alt: "logo",
                      class: "w-full h-full object-cover"
                    }, null, 8, ["src"])) : createCommentVNode("", true)
                  ];
                }
              }),
              _: 2
            }, _parent));
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(selectedTab) === "series" && unref(selectedCategory) && unref(getSeriesItems)) {
        _push(`<div class="grid grid-cols-7 gap-4 max-h-400px overflow-y-auto" data-v-b000da20><!--[-->`);
        ssrRenderList(unref(getSeriesItems), (item) => {
          _push(`<div data-v-b000da20>`);
          if (item) {
            _push(ssrRenderComponent(_component_UCard, {
              variant: "subtle",
              class: ["text-center cursor-pointer hover:bg-gray-100 dark:hover:bg-primary-700 rounded-md", {
                "bg-primary-100 dark:bg-primary-900": unref(selectedItem) === item
              }],
              onClick: ($event) => setSelectedItem(item)
            }, {
              footer: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`<span data-v-b000da20${_scopeId}>${ssrInterpolate(item.name)}</span>`);
                } else {
                  return [
                    createVNode("span", null, toDisplayString(item.name), 1)
                  ];
                }
              }),
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  if (item.screenshot_uri) {
                    _push2(`<img${ssrRenderAttr("src", item.screenshot_uri)} alt="logo" class="w-full h-full object-cover" data-v-b000da20${_scopeId}>`);
                  } else {
                    _push2(`<!---->`);
                  }
                } else {
                  return [
                    item.screenshot_uri ? (openBlock(), createBlock("img", {
                      key: 0,
                      src: item.screenshot_uri,
                      alt: "logo",
                      class: "w-full h-full object-cover"
                    }, null, 8, ["src"])) : createCommentVNode("", true)
                  ];
                }
              }),
              _: 2
            }, _parent));
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index-old.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const indexOld = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-b000da20"]]);

export { indexOld as default };
//# sourceMappingURL=index-old-Ch3TrR65.mjs.map
