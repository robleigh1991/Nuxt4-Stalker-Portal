import { c as __nuxt_component_0$1 } from './server.mjs';
import { _ as __nuxt_component_1 } from './Header-CIp_Me-4.mjs';
import { defineComponent, ref, watch, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderClass, ssrRenderAttr, ssrRenderComponent, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
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
  __name: "index-new",
  __ssrInlineRender: true,
  setup(__props) {
    const selectedTab = ref("live-tv");
    const stalker = useStalkerStore();
    const selectedCategory = ref(null);
    const selectedItem = ref(null);
    const sourceUrl = ref(null);
    const searchQuery = ref("");
    const showSidebar = ref(true);
    const isLoadingCategories = ref(false);
    const isLoadingItems = ref(false);
    const isLoadingSeasons = ref(false);
    const isVideoLoading = ref(false);
    const error = ref(null);
    const showSeriesModal = ref(false);
    const selectedSeriesItem = ref(null);
    const seriesSeasons = ref([]);
    ref(null);
    watch(
      () => stalker.sourceUrl,
      (newUrl) => {
        sourceUrl.value = newUrl;
      }
    );
    const filteredCategories = computed(() => {
      let categories = [];
      if (selectedTab.value === "live-tv") {
        categories = stalker.liveCategories || [];
      } else if (selectedTab.value === "movies") {
        categories = stalker.moviesCategories || [];
      } else if (selectedTab.value === "series") {
        categories = stalker.seriesCategories || [];
      }
      if (!searchQuery.value) return categories;
      return categories.filter(
        (cat) => cat.title.toLowerCase().includes(searchQuery.value.toLowerCase())
      );
    });
    const getLiveItems = computed(() => {
      if (!selectedCategory.value) return [];
      const key = `${selectedCategory.value.id}_1`;
      return stalker.liveItems[key] || [];
    });
    const getMoviesItems = computed(() => {
      if (!selectedCategory.value) return [];
      const key = `${selectedCategory.value.id}_1`;
      return stalker.moviesItems[key] || [];
    });
    const getSeriesItems = computed(() => {
      if (!selectedCategory.value) return [];
      const key = `${selectedCategory.value.id}_1`;
      return stalker.seriesItems[key] || [];
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Icon = __nuxt_component_0$1;
      const _component_Header = __nuxt_component_1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex flex-row h-screen overflow-hidden bg-black" }, _attrs))} data-v-65ba17e0><div class="${ssrRenderClass([{ "-translate-x-full md:translate-x-0": !unref(showSidebar) }, "sidebar flex flex-col w-64 bg-black border-r border-gray-900 overflow-hidden transition-all duration-300"])}" data-v-65ba17e0><div class="sidebar-header shrink-0 border-b border-gray-900 p-6" data-v-65ba17e0><h1 class="text-red-600 text-2xl font-bold tracking-tight" data-v-65ba17e0> STREAMFLIX </h1></div><div class="p-4 border-b border-gray-900" data-v-65ba17e0><div class="relative" data-v-65ba17e0><input${ssrRenderAttr("value", unref(searchQuery))} type="text" placeholder="Search..." class="w-full px-4 py-2 bg-gray-900 text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 transition-all" data-v-65ba17e0>`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "lucide:search",
        class: "absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500"
      }, null, _parent));
      _push(`</div></div><div class="sidebar-content flex-1 overflow-y-auto min-h-0 p-4 scrollbar-thin" data-v-65ba17e0>`);
      if (unref(isLoadingCategories)) {
        _push(`<div class="space-y-2" data-v-65ba17e0><!--[-->`);
        ssrRenderList(5, (i) => {
          _push(`<div class="h-10 bg-gray-900 rounded-lg animate-pulse" data-v-65ba17e0></div>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<div data-v-65ba17e0>`);
        if (unref(selectedTab) === "live-tv") {
          _push(`<div data-v-65ba17e0><!--[-->`);
          ssrRenderList(unref(filteredCategories), (category) => {
            _push(`<div class="${ssrRenderClass([{
              "bg-red-900 text-white": unref(selectedCategory)?.id === category.id
            }, "p-3 mb-2 text-sm rounded-lg bg-gray-900 cursor-pointer hover:bg-gray-800 transition-all duration-200 text-gray-300 hover:text-white"])}" data-v-65ba17e0><span data-v-65ba17e0>${ssrInterpolate(category.title)}</span></div>`);
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(selectedTab) === "movies") {
          _push(`<div data-v-65ba17e0><!--[-->`);
          ssrRenderList(unref(filteredCategories), (category) => {
            _push(`<div class="${ssrRenderClass([{
              "bg-red-900 text-white": unref(selectedCategory)?.id === category.id
            }, "p-3 mb-2 text-sm rounded-lg bg-gray-900 cursor-pointer hover:bg-gray-800 transition-all duration-200 text-gray-300 hover:text-white"])}" data-v-65ba17e0><span data-v-65ba17e0>${ssrInterpolate(category.title)}</span></div>`);
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(selectedTab) === "series") {
          _push(`<div data-v-65ba17e0><!--[-->`);
          ssrRenderList(unref(filteredCategories), (category) => {
            _push(`<div class="${ssrRenderClass([{
              "bg-red-900 text-white": unref(selectedCategory)?.id === category.id
            }, "p-3 mb-2 text-sm rounded-lg bg-gray-900 cursor-pointer hover:bg-gray-800 transition-all duration-200 text-gray-300 hover:text-white"])}" data-v-65ba17e0><span data-v-65ba17e0>${ssrInterpolate(category.title)}</span></div>`);
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      }
      _push(`</div><div class="sidebar-footer shrink-0 border-t border-gray-900 bg-black" data-v-65ba17e0><div class="sidebar-footer-items flex items-center justify-between p-4" data-v-65ba17e0><button class="flex flex-col items-center gap-1 cursor-pointer transition-all duration-200" data-v-65ba17e0>`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "lucide:tv",
        class: [
          "w-6 h-6",
          unref(selectedTab) === "live-tv" ? "text-red-600" : "text-gray-500 hover:text-gray-300"
        ]
      }, null, _parent));
      _push(`<span class="${ssrRenderClass([
        unref(selectedTab) === "live-tv" ? "text-red-600" : "text-gray-500 hover:text-gray-300",
        "text-xs font-medium"
      ])}" data-v-65ba17e0> Live TV </span></button><button class="flex flex-col items-center gap-1 cursor-pointer transition-all duration-200" data-v-65ba17e0>`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "lucide:film",
        class: [
          "w-6 h-6",
          unref(selectedTab) === "movies" ? "text-red-600" : "text-gray-500 hover:text-gray-300"
        ]
      }, null, _parent));
      _push(`<span class="${ssrRenderClass([
        unref(selectedTab) === "movies" ? "text-red-600" : "text-gray-500 hover:text-gray-300",
        "text-xs font-medium"
      ])}" data-v-65ba17e0> Movies </span></button><button class="flex flex-col items-center gap-1 cursor-pointer transition-all duration-200" data-v-65ba17e0>`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "lucide:monitor-play",
        class: [
          "w-6 h-6",
          unref(selectedTab) === "series" ? "text-red-600" : "text-gray-500 hover:text-gray-300"
        ]
      }, null, _parent));
      _push(`<span class="${ssrRenderClass([
        unref(selectedTab) === "series" ? "text-red-600" : "text-gray-500 hover:text-gray-300",
        "text-xs font-medium"
      ])}" data-v-65ba17e0> Series </span></button></div></div></div><div class="main flex-1 h-screen overflow-y-auto bg-black" data-v-65ba17e0>`);
      _push(ssrRenderComponent(_component_Header, null, null, _parent));
      _push(`<button class="md:hidden fixed top-4 left-4 z-50 p-2 bg-gray-900 rounded-lg" data-v-65ba17e0>`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "lucide:menu",
        class: "w-6 h-6 text-white"
      }, null, _parent));
      _push(`</button><div class="main-content flex flex-col p-4 md:p-6" data-v-65ba17e0>`);
      if (unref(sourceUrl)) {
        _push(`<div class="video-section mb-6 rounded-xl overflow-hidden bg-gray-900 relative" data-v-65ba17e0>`);
        if (unref(isVideoLoading)) {
          _push(`<div class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75 z-10" data-v-65ba17e0><div class="flex flex-col items-center gap-3" data-v-65ba17e0><div class="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin" data-v-65ba17e0></div><p class="text-white text-sm" data-v-65ba17e0>Loading stream...</p></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="relative" data-v-65ba17e0><video controls playsinline class="w-full bg-black" data-v-65ba17e0> Your browser does not support video playback. </video>`);
        if (unref(selectedItem)) {
          _push(`<div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6" data-v-65ba17e0><h2 class="text-2xl font-bold text-white mb-2" data-v-65ba17e0>${ssrInterpolate(unref(selectedItem).name)}</h2><div class="flex items-center gap-4 text-sm text-gray-300" data-v-65ba17e0>`);
          if (unref(selectedItem).year) {
            _push(`<span data-v-65ba17e0>${ssrInterpolate(unref(selectedItem).year)}</span>`);
          } else {
            _push(`<!---->`);
          }
          if (unref(selectedItem).rating) {
            _push(`<span data-v-65ba17e0>⭐ ${ssrInterpolate(unref(selectedItem).rating)}</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(selectedCategory)) {
        _push(`<div class="mb-6" data-v-65ba17e0><h2 class="text-2xl font-bold text-white" data-v-65ba17e0>${ssrInterpolate(unref(selectedCategory).title)}</h2></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="items-holder w-full" data-v-65ba17e0>`);
      if (unref(isLoadingItems)) {
        _push(`<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3" data-v-65ba17e0><!--[-->`);
        ssrRenderList(12, (i) => {
          _push(`<div class="space-y-2" data-v-65ba17e0><div class="aspect-[2/3] bg-gray-900 rounded-lg animate-pulse" data-v-65ba17e0></div><div class="h-4 bg-gray-900 rounded animate-pulse" data-v-65ba17e0></div></div>`);
        });
        _push(`<!--]--></div>`);
      } else if (unref(error)) {
        _push(`<div class="flex flex-col items-center justify-center py-20" data-v-65ba17e0>`);
        _push(ssrRenderComponent(_component_Icon, {
          name: "lucide:alert-circle",
          class: "w-16 h-16 text-red-600 mb-4"
        }, null, _parent));
        _push(`<h3 class="text-xl font-semibold text-white mb-2" data-v-65ba17e0> Oops! Something went wrong </h3><p class="text-gray-400 mb-4" data-v-65ba17e0>${ssrInterpolate(unref(error))}</p><button class="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors" data-v-65ba17e0> Try Again </button></div>`);
      } else if (!unref(selectedCategory)) {
        _push(`<div class="flex flex-col items-center justify-center py-20" data-v-65ba17e0>`);
        _push(ssrRenderComponent(_component_Icon, {
          name: "lucide:film",
          class: "w-16 h-16 text-gray-600 mb-4"
        }, null, _parent));
        _push(`<h3 class="text-xl font-semibold text-white mb-2" data-v-65ba17e0> Select a category </h3><p class="text-gray-400" data-v-65ba17e0> Choose a category from the sidebar to get started </p></div>`);
      } else if (unref(selectedTab) === "live-tv" && unref(getLiveItems).length > 0) {
        _push(`<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3" data-v-65ba17e0><!--[-->`);
        ssrRenderList(unref(getLiveItems), (item) => {
          _push(`<div data-v-65ba17e0>`);
          if (item) {
            _push(`<div class="${ssrRenderClass([{
              "ring-2 ring-red-600": unref(selectedItem) === item
            }, "group relative cursor-pointer transition-all duration-300 hover:scale-105"])}" data-v-65ba17e0><div class="aspect-video bg-gray-900 rounded-lg overflow-hidden relative" data-v-65ba17e0>`);
            if (item.logo) {
              _push(`<img${ssrRenderAttr("src", item.logo)}${ssrRenderAttr("alt", item.name)} class="w-full h-full object-cover" loading="lazy" data-v-65ba17e0>`);
            } else {
              _push(`<!---->`);
            }
            _push(`<div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all flex items-center justify-center" data-v-65ba17e0>`);
            _push(ssrRenderComponent(_component_Icon, {
              name: "lucide:play-circle",
              class: "w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity"
            }, null, _parent));
            _push(`</div></div><div class="mt-2" data-v-65ba17e0><span class="text-sm text-gray-300 group-hover:text-white line-clamp-2" data-v-65ba17e0>${ssrInterpolate(item.name)}</span></div></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        });
        _push(`<!--]--></div>`);
      } else if (unref(selectedTab) === "movies" && unref(getMoviesItems).length > 0) {
        _push(`<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3" data-v-65ba17e0><!--[-->`);
        ssrRenderList(unref(getMoviesItems), (item) => {
          _push(`<div data-v-65ba17e0>`);
          if (item) {
            _push(`<div class="${ssrRenderClass([{
              "ring-2 ring-red-600": unref(selectedItem) === item
            }, "group relative cursor-pointer transition-all duration-300 hover:scale-105"])}" data-v-65ba17e0><div class="aspect-[2/3] bg-gray-900 rounded-lg overflow-hidden relative" data-v-65ba17e0>`);
            if (item.screenshot_uri) {
              _push(`<img${ssrRenderAttr("src", item.screenshot_uri)}${ssrRenderAttr("alt", item.name)} class="w-full h-full object-cover" loading="lazy" data-v-65ba17e0>`);
            } else {
              _push(`<!---->`);
            }
            _push(`<div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all flex items-center justify-center" data-v-65ba17e0>`);
            _push(ssrRenderComponent(_component_Icon, {
              name: "lucide:play-circle",
              class: "w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity"
            }, null, _parent));
            _push(`</div>`);
            if (item.rating) {
              _push(`<div class="absolute top-2 right-2 bg-black bg-opacity-75 px-2 py-1 rounded text-xs text-white" data-v-65ba17e0> ⭐ ${ssrInterpolate(item.rating)}</div>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div><div class="mt-2" data-v-65ba17e0><span class="text-sm text-gray-300 group-hover:text-white line-clamp-2" data-v-65ba17e0>${ssrInterpolate(item.name)}</span>`);
            if (item.year) {
              _push(`<span class="block text-xs text-gray-500" data-v-65ba17e0>${ssrInterpolate(item.year)}</span>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        });
        _push(`<!--]--></div>`);
      } else if (unref(selectedTab) === "series" && unref(getSeriesItems).length > 0) {
        _push(`<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3" data-v-65ba17e0><!--[-->`);
        ssrRenderList(unref(getSeriesItems), (item) => {
          _push(`<div data-v-65ba17e0>`);
          if (item) {
            _push(`<div class="group relative cursor-pointer transition-all duration-300 hover:scale-105" data-v-65ba17e0><div class="aspect-[2/3] bg-gray-900 rounded-lg overflow-hidden relative" data-v-65ba17e0>`);
            if (item.screenshot_uri) {
              _push(`<img${ssrRenderAttr("src", item.screenshot_uri)}${ssrRenderAttr("alt", item.name)} class="w-full h-full object-cover" loading="lazy" data-v-65ba17e0>`);
            } else {
              _push(`<!---->`);
            }
            _push(`<div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all flex items-center justify-center" data-v-65ba17e0>`);
            _push(ssrRenderComponent(_component_Icon, {
              name: "lucide:list",
              class: "w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity"
            }, null, _parent));
            _push(`</div></div><div class="mt-2" data-v-65ba17e0><span class="text-sm text-gray-300 group-hover:text-white line-clamp-2" data-v-65ba17e0>${ssrInterpolate(item.name)}</span></div></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div>`);
      if (unref(showSeriesModal)) {
        _push(`<div class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" data-v-65ba17e0><div class="bg-gray-900 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden" data-v-65ba17e0><div class="p-6 border-b border-gray-800 flex justify-between items-center" data-v-65ba17e0><div data-v-65ba17e0><h2 class="text-2xl font-bold text-white" data-v-65ba17e0>${ssrInterpolate(unref(selectedSeriesItem)?.name)}</h2><p class="text-gray-400 mt-1" data-v-65ba17e0>Select Season &amp; Episode</p></div><button class="text-gray-400 hover:text-white" data-v-65ba17e0>`);
        _push(ssrRenderComponent(_component_Icon, {
          name: "lucide:x",
          class: "w-6 h-6"
        }, null, _parent));
        _push(`</button></div><div class="p-6 overflow-y-auto max-h-[calc(90vh-120px)]" data-v-65ba17e0>`);
        if (unref(isLoadingSeasons)) {
          _push(`<div class="space-y-3" data-v-65ba17e0><!--[-->`);
          ssrRenderList(3, (i) => {
            _push(`<div class="h-12 bg-gray-800 rounded-lg animate-pulse" data-v-65ba17e0></div>`);
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<div class="space-y-4" data-v-65ba17e0><!--[-->`);
          ssrRenderList(unref(seriesSeasons), (season) => {
            _push(`<div class="bg-gray-800 rounded-lg p-4 hover:bg-gray-750 transition-colors cursor-pointer" data-v-65ba17e0><div class="flex items-center justify-between" data-v-65ba17e0><div data-v-65ba17e0><h3 class="text-lg font-semibold text-white" data-v-65ba17e0>${ssrInterpolate(season.name)}</h3><p class="text-sm text-gray-400 mt-1" data-v-65ba17e0>${ssrInterpolate(season.series_count || 0)} episodes </p></div>`);
            _push(ssrRenderComponent(_component_Icon, {
              name: "lucide:chevron-right",
              class: "w-6 h-6 text-gray-400"
            }, null, _parent));
            _push(`</div></div>`);
          });
          _push(`<!--]--></div>`);
        }
        _push(`</div></div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index-new.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const indexNew = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-65ba17e0"]]);

export { indexNew as default };
//# sourceMappingURL=index-new-DaDB0AqC.mjs.map
