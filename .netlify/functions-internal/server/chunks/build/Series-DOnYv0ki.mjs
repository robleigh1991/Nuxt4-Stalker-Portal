import { defineComponent, ref, watch, mergeProps, unref, withCtx, createBlock, openBlock, createVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderComponent, ssrRenderAttr, ssrInterpolate } from 'vue/server-renderer';
import { u as useStalkerStore } from './stalker-F4Itg4Zv.mjs';
import { _ as _sfc_main$4 } from './Card-ByYrxPrg.mjs';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';

const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "Card",
  __ssrInlineRender: true,
  props: {
    item: {},
    selectedItem: {},
    name: {},
    image: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UCard = _sfc_main$4;
      if (__props.item) {
        _push(ssrRenderComponent(_component_UCard, mergeProps({
          variant: "subtle",
          class: ["text-center cursor-pointer hover:bg-gray-100 dark:hover:bg-primary-700 rounded-md", {
            "bg-primary-100 dark:bg-primary-900": __props.selectedItem === __props.item
          }]
        }, _attrs), {
          footer: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<span class="item-name" data-v-1d6ef506${_scopeId}>${ssrInterpolate(__props.name)}</span>`);
            } else {
              return [
                createVNode("span", { class: "item-name" }, toDisplayString(__props.name), 1)
              ];
            }
          }),
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (__props.image) {
                _push2(`<img${ssrRenderAttr("src", __props.image)} alt="logo" class="w-full h-full object-cover" onerror="this.onerror=null; this.src=&#39;https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg&#39;" data-v-1d6ef506${_scopeId}>`);
              } else {
                _push2(`<img src="https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg" alt="logo" class="w-full h-full object-cover" data-v-1d6ef506${_scopeId}>`);
              }
            } else {
              return [
                __props.image ? (openBlock(), createBlock("img", {
                  key: 0,
                  src: __props.image,
                  alt: "logo",
                  class: "w-full h-full object-cover",
                  onerror: "this.onerror=null; this.src='https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg'"
                }, null, 8, ["src"])) : (openBlock(), createBlock("img", {
                  key: 1,
                  src: "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg",
                  alt: "logo",
                  class: "w-full h-full object-cover"
                }))
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Card.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const __nuxt_component_0 = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$3, [["__scopeId", "data-v-1d6ef506"]]), { __name: "Card" });
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "Live",
  __ssrInlineRender: true,
  setup(__props) {
    const stalker = useStalkerStore();
    let selectedItem = ref("");
    let liveItems = ref([]);
    async function setSelectedLive(item) {
      selectedItem.value = item;
      stalker.currentChannel = item;
      await stalker.createLink(item.cmd, "itv");
      if (!stalker.modalOpen) {
        stalker.modalOpen = true;
      }
    }
    watch(
      () => stalker.selectedCategory,
      (newIems) => {
        liveItems.value = stalker.liveItems[stalker.selectedCategory.id + "_1"];
      }
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Card = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4" }, _attrs))}><!--[-->`);
      ssrRenderList(unref(liveItems), (item) => {
        _push(`<div>`);
        _push(ssrRenderComponent(_component_Card, {
          item,
          selectedItem: unref(selectedItem),
          name: item.name,
          image: item.logo,
          onClick: ($event) => setSelectedLive(item)
        }, null, _parent));
        _push(`</div>`);
      });
      _push(`<!--]--></div>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Live.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_2 = Object.assign(_sfc_main$2, { __name: "Live" });
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "Movies",
  __ssrInlineRender: true,
  setup(__props) {
    const stalker = useStalkerStore();
    let selectedItem = ref("");
    let moviesItems = ref([]);
    async function setSelectedMovie(item) {
      selectedItem.value = item;
      stalker.currentMovie = item;
      await stalker.createLink(item.cmd, "vod");
      if (!stalker.modalOpen) {
        stalker.modalOpen = true;
      }
    }
    watch(
      () => stalker.selectedCategory,
      (newIems) => {
        moviesItems.value = stalker.moviesItems[stalker.selectedCategory.id + "_1"];
      }
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Card = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4" }, _attrs))}><!--[-->`);
      ssrRenderList(unref(moviesItems), (item) => {
        _push(`<div>`);
        _push(ssrRenderComponent(_component_Card, {
          item,
          selectedItem: unref(selectedItem),
          name: item.name,
          image: item.screenshot_uri,
          onClick: ($event) => setSelectedMovie(item)
        }, null, _parent));
        _push(`</div>`);
      });
      _push(`<!--]--></div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Movies.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_3 = Object.assign(_sfc_main$1, { __name: "Movies" });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Series",
  __ssrInlineRender: true,
  setup(__props) {
    const stalker = useStalkerStore();
    let selectedItem = ref("");
    let seriesItems = ref([]);
    async function setSelectedSeries(item) {
      selectedItem.value = item;
      stalker.currentSeries = item;
      if (item.id) {
        await stalker.getSeriesSeasons(item.id);
      }
      if (!stalker.modalOpen) {
        stalker.modalOpen = true;
      }
    }
    watch(
      () => stalker.selectedCategory,
      (newIems) => {
        seriesItems.value = stalker.seriesItems[stalker.selectedCategory.id + "_1"];
      }
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Card = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4" }, _attrs))}><!--[-->`);
      ssrRenderList(unref(seriesItems), (item) => {
        _push(`<div>`);
        _push(ssrRenderComponent(_component_Card, {
          item,
          selectedItem: unref(selectedItem),
          name: item.name,
          image: item.screenshot_uri,
          onClick: ($event) => setSelectedSeries(item)
        }, null, _parent));
        _push(`</div>`);
      });
      _push(`<!--]--></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Series.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_4 = Object.assign(_sfc_main, { __name: "Series" });

export { __nuxt_component_2 as _, __nuxt_component_3 as a, __nuxt_component_4 as b };
//# sourceMappingURL=Series-DOnYv0ki.mjs.map
