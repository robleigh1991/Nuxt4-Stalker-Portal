import { _ as _sfc_main$6 } from './Input-OdlgYHLB.mjs';
import { c as __nuxt_component_0$1, s as _sfc_main$8, b as _sfc_main$9, d as useLocale, e as useAppConfig, f as usePortal, h as useFormField, i as useFieldGroup, j as useComponentIcons, t as tv, k as isArrayOfArray, g as get, l as compare, m as _sfc_main$f, o as _sfc_main$c, p as _sfc_main$d, q as looseToNumber, r as getDisplayValue } from './server.mjs';
import { _ as __nuxt_component_2, a as __nuxt_component_3, b as __nuxt_component_4 } from './Series-DOnYv0ki.mjs';
import { _ as _sfc_main$7 } from './Modal-BloHIZZn.mjs';
import { defineComponent, ref, computed, watch, mergeProps, unref, isRef, withCtx, createVNode, createBlock, createCommentVNode, openBlock, mergeModels, useSlots, useModel, toRef, useTemplateRef, renderSlot, createTextVNode, toDisplayString, Fragment, renderList, withModifiers, toRaw, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderClass, ssrInterpolate, ssrRenderAttr, ssrRenderSlot } from 'vue/server-renderer';
import { u as useStalkerStore } from './stalker-F4Itg4Zv.mjs';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';
import { useFilter, useForwardPropsEmits, ComboboxItem, ComboboxLabel, ComboboxSeparator, ComboboxItemIndicator, ComboboxRoot, ComboboxAnchor, ComboboxTrigger, ComboboxPortal, ComboboxContent, FocusScope, ComboboxInput, ComboboxEmpty, ComboboxVirtualizer, ComboboxGroup, ComboboxArrow } from 'reka-ui';
import { o as defu } from '../_/nitro.mjs';
import { reactivePick, createReusableTemplate } from '@vueuse/core';
import 'pinia';
import 'vue-router';
import 'tailwindcss/colors';
import '@iconify/vue';
import 'tailwind-variants';
import '@iconify/utils/lib/css/icon';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';
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
import './Card-ByYrxPrg.mjs';

const _sfc_main$5 = /* @__PURE__ */ defineComponent({
  __name: "VideoPlayer",
  __ssrInlineRender: true,
  setup(__props) {
    const stalker = useStalkerStore();
    const sourceUrl = computed(() => stalker.sourceUrl);
    const currentChannel = computed(() => stalker.currentChannel);
    const videoElement = ref(null);
    watch(
      () => stalker.sourceUrl,
      async (newUrl, oldUrl) => {
        if (newUrl === oldUrl || !newUrl) return;
        if (newUrl && true && videoElement.value) {
          const existingSources = videoElement.value.querySelectorAll("source");
          existingSources.forEach((src) => src.remove());
          const newSource = (void 0).createElement("source");
          newSource.src = newUrl;
          newSource.type = "application/x-mpegURL";
          videoElement.value.appendChild(newSource);
          videoElement.value.load();
        }
      }
    );
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "video-section flex-1 flex flex-col relative overflow-hidden" }, _attrs))} data-v-1c0826b7><div class="video-wrapper flex-1 flex items-center justify-center p-4 bg-black" data-v-1c0826b7><div class="video-container w-full h-full max-w-full max-h-full flex items-center justify-center" data-v-1c0826b7><video controls crossorigin playsinline autoplay class="w-full h-full object-contain rounded-lg shadow-2xl" data-v-1c0826b7>`);
      if (unref(sourceUrl)) {
        _push(`<source${ssrRenderAttr("src", unref(sourceUrl))} type="application/x-mpegURL" data-v-1c0826b7>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</video></div></div>`);
      if (_ctx.selectedTab === "live-tv") {
        _push(`<div class="channel-info-bar px-6 py-4 bg-gray-800/90 dark:bg-gray-900/90 border-t border-gray-700" data-v-1c0826b7><div class="flex items-center gap-4" data-v-1c0826b7>`);
        if (unref(currentChannel).logo) {
          _push(`<img${ssrRenderAttr("src", unref(currentChannel).logo)}${ssrRenderAttr("alt", unref(currentChannel).name)} class="w-12 h-12 rounded-lg object-contain bg-gray-700 p-1" onerror="this.onerror=null; this.src=&#39;https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg&#39;" data-v-1c0826b7>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="flex-1" data-v-1c0826b7><h3 class="text-xl font-bold text-white" data-v-1c0826b7>${ssrInterpolate(unref(currentChannel).name)}</h3>`);
        if (unref(currentChannel).description) {
          _push(`<p class="text-sm text-gray-400 mt-1 line-clamp-2" data-v-1c0826b7>${ssrInterpolate(unref(currentChannel).description)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/VideoPlayer.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const __nuxt_component_7 = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$5, [["__scopeId", "data-v-1c0826b7"]]), { __name: "VideoPlayer" });
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "ChannelsSidebar",
  __ssrInlineRender: true,
  setup(__props) {
    const stalker = useStalkerStore();
    const selectedCategory = computed(() => stalker.selectedCategory);
    const currentChannel = computed(() => stalker.currentChannel);
    const availableChannels = computed(() => {
      if (!selectedCategory.value) return [];
      const key = `${selectedCategory.value.id}_1`;
      const channels = stalker.liveItems[key];
      if (!channels || !Array.isArray(channels)) {
        return [];
      }
      return channels;
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UButton = _sfc_main$9;
      const _component_Icon = __nuxt_component_0$1;
      if (unref(availableChannels).length > 0) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "channels-sidebar w-80 bg-gray-800/95 dark:bg-gray-900/95 border-l border-gray-700 flex flex-col overflow-hidden" }, _attrs))} data-v-2b3bc7d3><div class="sidebar-header px-4 py-4 border-b border-gray-700" data-v-2b3bc7d3><div class="flex items-center justify-between" data-v-2b3bc7d3><h2 class="text-lg font-bold text-white" data-v-2b3bc7d3>Channels</h2>`);
        _push(ssrRenderComponent(_component_UButton, {
          icon: "i-lucide-x",
          color: "gray",
          variant: "ghost",
          size: "sm",
          onClick: ($event) => unref(stalker).modalOpen = false
        }, null, _parent));
        _push(`</div>`);
        if (unref(stalker).selectedCategory) {
          _push(`<p class="text-sm text-gray-400 mt-1" data-v-2b3bc7d3>${ssrInterpolate(unref(stalker).selectedCategory.title)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="channels-list flex-1 overflow-y-auto p-4" data-v-2b3bc7d3><!--[-->`);
        ssrRenderList(unref(availableChannels), (channel) => {
          _push(`<div class="${ssrRenderClass([{
            "bg-primary-600/50 dark:bg-primary-700/50 border-primary-500": unref(currentChannel)?.id === channel?.id
          }, "channel-item mb-3 p-3 rounded-lg cursor-pointer transition-all duration-200 bg-gray-700/50 dark:bg-gray-800/50 hover:bg-primary-600/30 dark:hover:bg-primary-700/30 border border-transparent hover:border-primary-500"])}" data-v-2b3bc7d3><div class="flex items-center gap-3" data-v-2b3bc7d3>`);
          if (channel.logo) {
            _push(`<img${ssrRenderAttr("src", channel.logo)}${ssrRenderAttr("alt", channel.name)} class="w-16 h-16 rounded-lg object-contain bg-gray-600 dark:bg-gray-700 p-1 shrink-0" onerror="this.onerror=null; this.src=&#39;https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg&#39;" data-v-2b3bc7d3>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<div class="flex-1 min-w-0" data-v-2b3bc7d3><h4 class="text-sm font-semibold text-white truncate" data-v-2b3bc7d3>${ssrInterpolate(channel.name)}</h4>`);
          if (channel.description) {
            _push(`<p class="text-xs text-gray-400 mt-1 line-clamp-2" data-v-2b3bc7d3>${ssrInterpolate(channel.description)}</p>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
          if (unref(currentChannel)?.id === channel?.id) {
            _push(ssrRenderComponent(_component_Icon, {
              name: "i-lucide-play-circle",
              class: "w-5 h-5 text-primary-400 shrink-0"
            }, null, _parent));
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div>`);
        });
        _push(`<!--]-->`);
        if (unref(availableChannels).length === 0) {
          _push(`<div class="text-center py-8 text-gray-400" data-v-2b3bc7d3>`);
          _push(ssrRenderComponent(_component_Icon, {
            name: "i-lucide-tv",
            class: "w-12 h-12 mx-auto mb-2 opacity-50"
          }, null, _parent));
          _push(`<p data-v-2b3bc7d3>No channels available</p></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ChannelsSidebar.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const __nuxt_component_8 = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$4, [["__scopeId", "data-v-2b3bc7d3"]]), { __name: "ChannelsSidebar" });
function hasDescription(item, descriptionKey) {
  if (typeof item !== "object" || item === null) {
    return false;
  }
  const value = get(item, descriptionKey);
  return value !== void 0 && value !== null && value !== "";
}
function getSize(size, hasDescription2) {
  if (hasDescription2) {
    return {
      xs: 44,
      sm: 48,
      md: 52,
      lg: 56,
      xl: 60
    }[size];
  }
  return {
    xs: 24,
    sm: 28,
    md: 32,
    lg: 36,
    xl: 40
  }[size];
}
function getEstimateSize(items, size, descriptionKey) {
  const anyHasDescription = descriptionKey ? items.some((item) => hasDescription(item, descriptionKey)) : false;
  return getSize(size, anyHasDescription);
}
const theme = {
  "slots": {
    "base": [
      "relative group rounded-md inline-flex items-center focus:outline-none disabled:cursor-not-allowed disabled:opacity-75",
      "transition-colors"
    ],
    "leading": "absolute inset-y-0 start-0 flex items-center",
    "leadingIcon": "shrink-0 text-dimmed",
    "leadingAvatar": "shrink-0",
    "leadingAvatarSize": "",
    "trailing": "absolute inset-y-0 end-0 flex items-center",
    "trailingIcon": "shrink-0 text-dimmed",
    "value": "truncate pointer-events-none",
    "placeholder": "truncate text-dimmed",
    "arrow": "fill-default",
    "content": [
      "max-h-60 w-(--reka-select-trigger-width) bg-default shadow-lg rounded-md ring ring-default overflow-hidden data-[state=open]:animate-[scale-in_100ms_ease-out] data-[state=closed]:animate-[scale-out_100ms_ease-in] origin-(--reka-select-content-transform-origin) pointer-events-auto flex flex-col",
      "origin-(--reka-combobox-content-transform-origin) w-(--reka-combobox-trigger-width)"
    ],
    "viewport": "relative scroll-py-1 overflow-y-auto flex-1",
    "group": "p-1 isolate",
    "empty": "text-center text-muted",
    "label": "font-semibold text-highlighted",
    "separator": "-mx-1 my-1 h-px bg-border",
    "item": [
      "group relative w-full flex items-start select-none outline-none before:absolute before:z-[-1] before:inset-px before:rounded-md data-disabled:cursor-not-allowed data-disabled:opacity-75 text-default data-highlighted:not-data-disabled:text-highlighted data-highlighted:not-data-disabled:before:bg-elevated/50",
      "transition-colors before:transition-colors"
    ],
    "itemLeadingIcon": [
      "shrink-0 text-dimmed group-data-highlighted:not-group-data-disabled:text-default",
      "transition-colors"
    ],
    "itemLeadingAvatar": "shrink-0",
    "itemLeadingAvatarSize": "",
    "itemLeadingChip": "shrink-0",
    "itemLeadingChipSize": "",
    "itemTrailing": "ms-auto inline-flex gap-1.5 items-center",
    "itemTrailingIcon": "shrink-0",
    "itemWrapper": "flex-1 flex flex-col min-w-0",
    "itemLabel": "truncate",
    "itemDescription": "truncate text-muted",
    "input": "border-b border-default",
    "focusScope": "flex flex-col min-h-0"
  },
  "variants": {
    "fieldGroup": {
      "horizontal": "not-only:first:rounded-e-none not-only:last:rounded-s-none not-last:not-first:rounded-none focus-visible:z-[1]",
      "vertical": "not-only:first:rounded-b-none not-only:last:rounded-t-none not-last:not-first:rounded-none focus-visible:z-[1]"
    },
    "size": {
      "xs": {
        "base": "px-2 py-1 text-xs gap-1",
        "leading": "ps-2",
        "trailing": "pe-2",
        "leadingIcon": "size-4",
        "leadingAvatarSize": "3xs",
        "trailingIcon": "size-4",
        "label": "p-1 text-[10px]/3 gap-1",
        "item": "p-1 text-xs gap-1",
        "itemLeadingIcon": "size-4",
        "itemLeadingAvatarSize": "3xs",
        "itemLeadingChip": "size-4",
        "itemLeadingChipSize": "sm",
        "itemTrailingIcon": "size-4",
        "empty": "p-1 text-xs"
      },
      "sm": {
        "base": "px-2.5 py-1.5 text-xs gap-1.5",
        "leading": "ps-2.5",
        "trailing": "pe-2.5",
        "leadingIcon": "size-4",
        "leadingAvatarSize": "3xs",
        "trailingIcon": "size-4",
        "label": "p-1.5 text-[10px]/3 gap-1.5",
        "item": "p-1.5 text-xs gap-1.5",
        "itemLeadingIcon": "size-4",
        "itemLeadingAvatarSize": "3xs",
        "itemLeadingChip": "size-4",
        "itemLeadingChipSize": "sm",
        "itemTrailingIcon": "size-4",
        "empty": "p-1.5 text-xs"
      },
      "md": {
        "base": "px-2.5 py-1.5 text-sm gap-1.5",
        "leading": "ps-2.5",
        "trailing": "pe-2.5",
        "leadingIcon": "size-5",
        "leadingAvatarSize": "2xs",
        "trailingIcon": "size-5",
        "label": "p-1.5 text-xs gap-1.5",
        "item": "p-1.5 text-sm gap-1.5",
        "itemLeadingIcon": "size-5",
        "itemLeadingAvatarSize": "2xs",
        "itemLeadingChip": "size-5",
        "itemLeadingChipSize": "md",
        "itemTrailingIcon": "size-5",
        "empty": "p-1.5 text-sm"
      },
      "lg": {
        "base": "px-3 py-2 text-sm gap-2",
        "leading": "ps-3",
        "trailing": "pe-3",
        "leadingIcon": "size-5",
        "leadingAvatarSize": "2xs",
        "trailingIcon": "size-5",
        "label": "p-2 text-xs gap-2",
        "item": "p-2 text-sm gap-2",
        "itemLeadingIcon": "size-5",
        "itemLeadingAvatarSize": "2xs",
        "itemLeadingChip": "size-5",
        "itemLeadingChipSize": "md",
        "itemTrailingIcon": "size-5",
        "empty": "p-2 text-sm"
      },
      "xl": {
        "base": "px-3 py-2 text-base gap-2",
        "leading": "ps-3",
        "trailing": "pe-3",
        "leadingIcon": "size-6",
        "leadingAvatarSize": "xs",
        "trailingIcon": "size-6",
        "label": "p-2 text-sm gap-2",
        "item": "p-2 text-base gap-2",
        "itemLeadingIcon": "size-6",
        "itemLeadingAvatarSize": "xs",
        "itemLeadingChip": "size-6",
        "itemLeadingChipSize": "lg",
        "itemTrailingIcon": "size-6",
        "empty": "p-2 text-base"
      }
    },
    "variant": {
      "outline": "text-highlighted bg-default ring ring-inset ring-accented",
      "soft": "text-highlighted bg-elevated/50 hover:bg-elevated focus:bg-elevated disabled:bg-elevated/50",
      "subtle": "text-highlighted bg-elevated ring ring-inset ring-accented",
      "ghost": "text-highlighted bg-transparent hover:bg-elevated focus:bg-elevated disabled:bg-transparent dark:disabled:bg-transparent",
      "none": "text-highlighted bg-transparent"
    },
    "color": {
      "primary": "",
      "secondary": "",
      "success": "",
      "info": "",
      "warning": "",
      "error": "",
      "neutral": ""
    },
    "leading": {
      "true": ""
    },
    "trailing": {
      "true": ""
    },
    "loading": {
      "true": ""
    },
    "highlight": {
      "true": ""
    },
    "type": {
      "file": "file:me-1.5 file:font-medium file:text-muted file:outline-none"
    },
    "virtualize": {
      "true": {
        "viewport": "p-1 isolate"
      },
      "false": {
        "viewport": "divide-y divide-default"
      }
    }
  },
  "compoundVariants": [
    {
      "color": "primary",
      "variant": [
        "outline",
        "subtle"
      ],
      "class": "focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
    },
    {
      "color": "secondary",
      "variant": [
        "outline",
        "subtle"
      ],
      "class": "focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-secondary"
    },
    {
      "color": "success",
      "variant": [
        "outline",
        "subtle"
      ],
      "class": "focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-success"
    },
    {
      "color": "info",
      "variant": [
        "outline",
        "subtle"
      ],
      "class": "focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-info"
    },
    {
      "color": "warning",
      "variant": [
        "outline",
        "subtle"
      ],
      "class": "focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-warning"
    },
    {
      "color": "error",
      "variant": [
        "outline",
        "subtle"
      ],
      "class": "focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-error"
    },
    {
      "color": "primary",
      "highlight": true,
      "class": "ring ring-inset ring-primary"
    },
    {
      "color": "secondary",
      "highlight": true,
      "class": "ring ring-inset ring-secondary"
    },
    {
      "color": "success",
      "highlight": true,
      "class": "ring ring-inset ring-success"
    },
    {
      "color": "info",
      "highlight": true,
      "class": "ring ring-inset ring-info"
    },
    {
      "color": "warning",
      "highlight": true,
      "class": "ring ring-inset ring-warning"
    },
    {
      "color": "error",
      "highlight": true,
      "class": "ring ring-inset ring-error"
    },
    {
      "color": "neutral",
      "variant": [
        "outline",
        "subtle"
      ],
      "class": "focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-inverted"
    },
    {
      "color": "neutral",
      "highlight": true,
      "class": "ring ring-inset ring-inverted"
    },
    {
      "leading": true,
      "size": "xs",
      "class": "ps-7"
    },
    {
      "leading": true,
      "size": "sm",
      "class": "ps-8"
    },
    {
      "leading": true,
      "size": "md",
      "class": "ps-9"
    },
    {
      "leading": true,
      "size": "lg",
      "class": "ps-10"
    },
    {
      "leading": true,
      "size": "xl",
      "class": "ps-11"
    },
    {
      "trailing": true,
      "size": "xs",
      "class": "pe-7"
    },
    {
      "trailing": true,
      "size": "sm",
      "class": "pe-8"
    },
    {
      "trailing": true,
      "size": "md",
      "class": "pe-9"
    },
    {
      "trailing": true,
      "size": "lg",
      "class": "pe-10"
    },
    {
      "trailing": true,
      "size": "xl",
      "class": "pe-11"
    },
    {
      "loading": true,
      "leading": true,
      "class": {
        "leadingIcon": "animate-spin"
      }
    },
    {
      "loading": true,
      "leading": false,
      "trailing": true,
      "class": {
        "trailingIcon": "animate-spin"
      }
    }
  ],
  "defaultVariants": {
    "size": "md",
    "color": "primary",
    "variant": "outline"
  }
};
const _sfc_main$3 = /* @__PURE__ */ Object.assign({ inheritAttrs: false }, {
  __name: "USelectMenu",
  __ssrInlineRender: true,
  props: /* @__PURE__ */ mergeModels({
    id: { type: String, required: false },
    placeholder: { type: String, required: false },
    searchInput: { type: [Boolean, Object], required: false, default: true },
    color: { type: null, required: false },
    variant: { type: null, required: false },
    size: { type: null, required: false },
    required: { type: Boolean, required: false },
    trailingIcon: { type: null, required: false },
    selectedIcon: { type: null, required: false },
    content: { type: Object, required: false },
    arrow: { type: [Boolean, Object], required: false },
    portal: { type: [Boolean, String], required: false, skipCheck: true, default: true },
    virtualize: { type: [Boolean, Object], required: false, default: false },
    valueKey: { type: null, required: false },
    labelKey: { type: null, required: false, default: "label" },
    descriptionKey: { type: null, required: false, default: "description" },
    items: { type: null, required: false },
    defaultValue: { type: null, required: false },
    modelValue: { type: null, required: false },
    modelModifiers: { type: Object, required: false },
    multiple: { type: Boolean, required: false },
    highlight: { type: Boolean, required: false },
    createItem: { type: [Boolean, String, Object], required: false },
    filterFields: { type: Array, required: false },
    ignoreFilter: { type: Boolean, required: false },
    autofocus: { type: Boolean, required: false },
    autofocusDelay: { type: Number, required: false, default: 0 },
    class: { type: null, required: false },
    ui: { type: null, required: false },
    open: { type: Boolean, required: false },
    defaultOpen: { type: Boolean, required: false },
    disabled: { type: Boolean, required: false },
    name: { type: String, required: false },
    resetSearchTermOnBlur: { type: Boolean, required: false, default: true },
    resetSearchTermOnSelect: { type: Boolean, required: false, default: true },
    highlightOnHover: { type: Boolean, required: false },
    icon: { type: null, required: false },
    avatar: { type: Object, required: false },
    leading: { type: Boolean, required: false },
    leadingIcon: { type: null, required: false },
    trailing: { type: Boolean, required: false },
    loading: { type: Boolean, required: false },
    loadingIcon: { type: null, required: false }
  }, {
    "searchTerm": { type: String, ...{ default: "" } },
    "searchTermModifiers": {}
  }),
  emits: /* @__PURE__ */ mergeModels(["update:open", "change", "blur", "focus", "create", "highlight", "update:modelValue"], ["update:searchTerm"]),
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const slots = useSlots();
    const searchTerm = useModel(__props, "searchTerm", { type: String, ...{ default: "" } });
    const { t } = useLocale();
    const appConfig = useAppConfig();
    const { contains } = useFilter({ sensitivity: "base" });
    const rootProps = useForwardPropsEmits(reactivePick(props, "modelValue", "defaultValue", "open", "defaultOpen", "required", "multiple", "resetSearchTermOnBlur", "resetSearchTermOnSelect", "highlightOnHover"), emits);
    const portalProps = usePortal(toRef(() => props.portal));
    const contentProps = toRef(() => defu(props.content, { side: "bottom", sideOffset: 8, collisionPadding: 8, position: "popper" }));
    const arrowProps = toRef(() => props.arrow);
    const virtualizerProps = toRef(() => {
      if (!props.virtualize) return false;
      return defu(typeof props.virtualize === "boolean" ? {} : props.virtualize, {
        estimateSize: getEstimateSize(items.value, props.size || "md", props.descriptionKey)
      });
    });
    const searchInputProps = toRef(() => defu(props.searchInput, { placeholder: t("selectMenu.search"), variant: "none" }));
    const { emitFormBlur, emitFormFocus, emitFormInput, emitFormChange, size: formGroupSize, color, id, name, highlight, disabled, ariaAttrs } = useFormField(props);
    const { orientation, size: fieldGroupSize } = useFieldGroup(props);
    const { isLeading, isTrailing, leadingIconName, trailingIconName } = useComponentIcons(toRef(() => defu(props, { trailingIcon: appConfig.ui.icons.chevronDown })));
    const selectSize = computed(() => fieldGroupSize.value || formGroupSize.value);
    const [DefineCreateItemTemplate, ReuseCreateItemTemplate] = createReusableTemplate();
    const [DefineItemTemplate, ReuseItemTemplate] = createReusableTemplate({
      props: {
        item: {
          type: [Object, String, Number, Boolean],
          required: true
        },
        index: {
          type: Number,
          required: false
        }
      }
    });
    const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.selectMenu || {} })({
      color: color.value,
      variant: props.variant,
      size: selectSize?.value,
      loading: props.loading,
      highlight: highlight.value,
      leading: isLeading.value || !!props.avatar || !!slots.leading,
      trailing: isTrailing.value || !!slots.trailing,
      fieldGroup: orientation.value,
      virtualize: !!props.virtualize
    }));
    function displayValue(value) {
      if (props.multiple && Array.isArray(value)) {
        const displayedValues = value.map((item) => getDisplayValue(items.value, item, {
          labelKey: props.labelKey,
          valueKey: props.valueKey
        })).filter((v) => v != null && v !== "");
        return displayedValues.length > 0 ? displayedValues.join(", ") : void 0;
      }
      return getDisplayValue(items.value, value, {
        labelKey: props.labelKey,
        valueKey: props.valueKey
      });
    }
    const groups = computed(
      () => props.items?.length ? isArrayOfArray(props.items) ? props.items : [props.items] : []
    );
    const items = computed(() => groups.value.flatMap((group) => group));
    const filteredGroups = computed(() => {
      if (props.ignoreFilter || !searchTerm.value) {
        return groups.value;
      }
      const fields = Array.isArray(props.filterFields) ? props.filterFields : [props.labelKey];
      return groups.value.map((items2) => items2.filter((item) => {
        if (item === void 0 || item === null) {
          return false;
        }
        if (typeof item !== "object") {
          return contains(String(item), searchTerm.value);
        }
        if (item.type && ["label", "separator"].includes(item.type)) {
          return true;
        }
        return fields.some((field) => {
          const value = get(item, field);
          return value !== void 0 && value !== null && contains(String(value), searchTerm.value);
        });
      })).filter((group) => group.filter(
        (item) => !isSelectItem(item) || (!item.type || !["label", "separator"].includes(item.type))
      ).length > 0);
    });
    const filteredItems = computed(() => filteredGroups.value.flatMap((group) => group));
    const createItem = computed(() => {
      if (!props.createItem || !searchTerm.value) {
        return false;
      }
      const newItem = props.valueKey ? { [props.valueKey]: searchTerm.value } : searchTerm.value;
      if (typeof props.createItem === "object" && props.createItem.when === "always" || props.createItem === "always") {
        return !filteredItems.value.find((item) => compare(item, newItem, props.valueKey));
      }
      return !filteredItems.value.length;
    });
    const createItemPosition = computed(() => typeof props.createItem === "object" ? props.createItem.position : "bottom");
    const triggerRef = useTemplateRef("triggerRef");
    function onUpdate(value) {
      if (toRaw(props.modelValue) === value) {
        return;
      }
      if (props.modelModifiers?.trim) {
        value = value?.trim() ?? null;
      }
      if (props.modelModifiers?.number) {
        value = looseToNumber(value);
      }
      if (props.modelModifiers?.nullable) {
        value ??= null;
      }
      if (props.modelModifiers?.optional) {
        value ??= void 0;
      }
      const event = new Event("change", { target: { value } });
      emits("change", event);
      emitFormChange();
      emitFormInput();
      if (props.resetSearchTermOnSelect) {
        searchTerm.value = "";
      }
    }
    function onUpdateOpen(value) {
      let timeoutId;
      if (!value) {
        const event = new FocusEvent("blur");
        emits("blur", event);
        emitFormBlur();
        if (props.resetSearchTermOnBlur) {
          const STATE_ANIMATION_DELAY_MS = 100;
          timeoutId = setTimeout(() => {
            searchTerm.value = "";
          }, STATE_ANIMATION_DELAY_MS);
        }
      } else {
        const event = new FocusEvent("focus");
        emits("focus", event);
        emitFormFocus();
        clearTimeout(timeoutId);
      }
    }
    function onCreate(e) {
      e.preventDefault();
      e.stopPropagation();
      emits("create", searchTerm.value);
    }
    function onSelect(e, item) {
      if (!isSelectItem(item)) {
        return;
      }
      if (item.disabled) {
        e.preventDefault();
        return;
      }
      item.onSelect?.(e);
    }
    function isSelectItem(item) {
      return typeof item === "object" && item !== null;
    }
    __expose({
      triggerRef: toRef(() => triggerRef.value?.$el)
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(DefineCreateItemTemplate), null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(ComboboxItem), {
              "data-slot": "item",
              class: ui.value.item({ class: props.ui?.item }),
              value: searchTerm.value,
              onSelect: onCreate
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<span data-slot="itemLabel" class="${ssrRenderClass(ui.value.itemLabel({ class: props.ui?.itemLabel }))}"${_scopeId2}>`);
                  ssrRenderSlot(_ctx.$slots, "create-item-label", { item: searchTerm.value }, () => {
                    _push3(`${ssrInterpolate(unref(t)("selectMenu.create", { label: searchTerm.value }))}`);
                  }, _push3, _parent3, _scopeId2);
                  _push3(`</span>`);
                } else {
                  return [
                    createVNode("span", {
                      "data-slot": "itemLabel",
                      class: ui.value.itemLabel({ class: props.ui?.itemLabel })
                    }, [
                      renderSlot(_ctx.$slots, "create-item-label", { item: searchTerm.value }, () => [
                        createTextVNode(toDisplayString(unref(t)("selectMenu.create", { label: searchTerm.value })), 1)
                      ])
                    ], 2)
                  ];
                }
              }),
              _: 3
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(ComboboxItem), {
                "data-slot": "item",
                class: ui.value.item({ class: props.ui?.item }),
                value: searchTerm.value,
                onSelect: onCreate
              }, {
                default: withCtx(() => [
                  createVNode("span", {
                    "data-slot": "itemLabel",
                    class: ui.value.itemLabel({ class: props.ui?.itemLabel })
                  }, [
                    renderSlot(_ctx.$slots, "create-item-label", { item: searchTerm.value }, () => [
                      createTextVNode(toDisplayString(unref(t)("selectMenu.create", { label: searchTerm.value })), 1)
                    ])
                  ], 2)
                ]),
                _: 3
              }, 8, ["class", "value"])
            ];
          }
        }),
        _: 3
      }, _parent));
      _push(ssrRenderComponent(unref(DefineItemTemplate), null, {
        default: withCtx(({ item, index }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (isSelectItem(item) && item.type === "label") {
              _push2(ssrRenderComponent(unref(ComboboxLabel), {
                "data-slot": "label",
                class: ui.value.label({ class: [props.ui?.label, item.ui?.label, item.class] })
              }, {
                default: withCtx((_, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${ssrInterpolate(unref(get)(item, props.labelKey))}`);
                  } else {
                    return [
                      createTextVNode(toDisplayString(unref(get)(item, props.labelKey)), 1)
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            } else if (isSelectItem(item) && item.type === "separator") {
              _push2(ssrRenderComponent(unref(ComboboxSeparator), {
                "data-slot": "separator",
                class: ui.value.separator({ class: [props.ui?.separator, item.ui?.separator, item.class] })
              }, null, _parent2, _scopeId));
            } else {
              _push2(ssrRenderComponent(unref(ComboboxItem), {
                "data-slot": "item",
                class: ui.value.item({ class: [props.ui?.item, isSelectItem(item) && item.ui?.item, isSelectItem(item) && item.class] }),
                disabled: isSelectItem(item) && item.disabled,
                value: props.valueKey && isSelectItem(item) ? unref(get)(item, props.valueKey) : item,
                onSelect: ($event) => onSelect($event, item)
              }, {
                default: withCtx((_, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    ssrRenderSlot(_ctx.$slots, "item", {
                      item,
                      index,
                      ui: ui.value
                    }, () => {
                      ssrRenderSlot(_ctx.$slots, "item-leading", {
                        item,
                        index,
                        ui: ui.value
                      }, () => {
                        if (isSelectItem(item) && item.icon) {
                          _push3(ssrRenderComponent(_sfc_main$f, {
                            name: item.icon,
                            "data-slot": "itemLeadingIcon",
                            class: ui.value.itemLeadingIcon({ class: [props.ui?.itemLeadingIcon, item.ui?.itemLeadingIcon] })
                          }, null, _parent3, _scopeId2));
                        } else if (isSelectItem(item) && item.avatar) {
                          _push3(ssrRenderComponent(_sfc_main$c, mergeProps({
                            size: item.ui?.itemLeadingAvatarSize || props.ui?.itemLeadingAvatarSize || ui.value.itemLeadingAvatarSize()
                          }, item.avatar, {
                            "data-slot": "itemLeadingAvatar",
                            class: ui.value.itemLeadingAvatar({ class: [props.ui?.itemLeadingAvatar, item.ui?.itemLeadingAvatar] })
                          }), null, _parent3, _scopeId2));
                        } else if (isSelectItem(item) && item.chip) {
                          _push3(ssrRenderComponent(_sfc_main$d, mergeProps({
                            size: props.ui?.itemLeadingChipSize || ui.value.itemLeadingChipSize(),
                            inset: "",
                            standalone: ""
                          }, item.chip, {
                            "data-slot": "itemLeadingChip",
                            class: ui.value.itemLeadingChip({ class: [props.ui?.itemLeadingChip, item.ui?.itemLeadingChip] })
                          }), null, _parent3, _scopeId2));
                        } else {
                          _push3(`<!---->`);
                        }
                      }, _push3, _parent3, _scopeId2);
                      _push3(`<span data-slot="itemWrapper" class="${ssrRenderClass(ui.value.itemWrapper({ class: [props.ui?.itemWrapper, isSelectItem(item) && item.ui?.itemWrapper] }))}"${_scopeId2}><span data-slot="itemLabel" class="${ssrRenderClass(ui.value.itemLabel({ class: [props.ui?.itemLabel, isSelectItem(item) && item.ui?.itemLabel] }))}"${_scopeId2}>`);
                      ssrRenderSlot(_ctx.$slots, "item-label", {
                        item,
                        index
                      }, () => {
                        _push3(`${ssrInterpolate(isSelectItem(item) ? unref(get)(item, props.labelKey) : item)}`);
                      }, _push3, _parent3, _scopeId2);
                      _push3(`</span>`);
                      if (isSelectItem(item) && (unref(get)(item, props.descriptionKey) || !!slots["item-description"])) {
                        _push3(`<span data-slot="itemDescription" class="${ssrRenderClass(ui.value.itemDescription({ class: [props.ui?.itemDescription, isSelectItem(item) && item.ui?.itemDescription] }))}"${_scopeId2}>`);
                        ssrRenderSlot(_ctx.$slots, "item-description", {
                          item,
                          index
                        }, () => {
                          _push3(`${ssrInterpolate(unref(get)(item, props.descriptionKey))}`);
                        }, _push3, _parent3, _scopeId2);
                        _push3(`</span>`);
                      } else {
                        _push3(`<!---->`);
                      }
                      _push3(`</span><span data-slot="itemTrailing" class="${ssrRenderClass(ui.value.itemTrailing({ class: [props.ui?.itemTrailing, isSelectItem(item) && item.ui?.itemTrailing] }))}"${_scopeId2}>`);
                      ssrRenderSlot(_ctx.$slots, "item-trailing", {
                        item,
                        index,
                        ui: ui.value
                      }, null, _push3, _parent3, _scopeId2);
                      _push3(ssrRenderComponent(unref(ComboboxItemIndicator), { "as-child": "" }, {
                        default: withCtx((_2, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(ssrRenderComponent(_sfc_main$f, {
                              name: __props.selectedIcon || unref(appConfig).ui.icons.check,
                              "data-slot": "itemTrailingIcon",
                              class: ui.value.itemTrailingIcon({ class: [props.ui?.itemTrailingIcon, isSelectItem(item) && item.ui?.itemTrailingIcon] })
                            }, null, _parent4, _scopeId3));
                          } else {
                            return [
                              createVNode(_sfc_main$f, {
                                name: __props.selectedIcon || unref(appConfig).ui.icons.check,
                                "data-slot": "itemTrailingIcon",
                                class: ui.value.itemTrailingIcon({ class: [props.ui?.itemTrailingIcon, isSelectItem(item) && item.ui?.itemTrailingIcon] })
                              }, null, 8, ["name", "class"])
                            ];
                          }
                        }),
                        _: 2
                      }, _parent3, _scopeId2));
                      _push3(`</span>`);
                    }, _push3, _parent3, _scopeId2);
                  } else {
                    return [
                      renderSlot(_ctx.$slots, "item", {
                        item,
                        index,
                        ui: ui.value
                      }, () => [
                        renderSlot(_ctx.$slots, "item-leading", {
                          item,
                          index,
                          ui: ui.value
                        }, () => [
                          isSelectItem(item) && item.icon ? (openBlock(), createBlock(_sfc_main$f, {
                            key: 0,
                            name: item.icon,
                            "data-slot": "itemLeadingIcon",
                            class: ui.value.itemLeadingIcon({ class: [props.ui?.itemLeadingIcon, item.ui?.itemLeadingIcon] })
                          }, null, 8, ["name", "class"])) : isSelectItem(item) && item.avatar ? (openBlock(), createBlock(_sfc_main$c, mergeProps({
                            key: 1,
                            size: item.ui?.itemLeadingAvatarSize || props.ui?.itemLeadingAvatarSize || ui.value.itemLeadingAvatarSize()
                          }, item.avatar, {
                            "data-slot": "itemLeadingAvatar",
                            class: ui.value.itemLeadingAvatar({ class: [props.ui?.itemLeadingAvatar, item.ui?.itemLeadingAvatar] })
                          }), null, 16, ["size", "class"])) : isSelectItem(item) && item.chip ? (openBlock(), createBlock(_sfc_main$d, mergeProps({
                            key: 2,
                            size: props.ui?.itemLeadingChipSize || ui.value.itemLeadingChipSize(),
                            inset: "",
                            standalone: ""
                          }, item.chip, {
                            "data-slot": "itemLeadingChip",
                            class: ui.value.itemLeadingChip({ class: [props.ui?.itemLeadingChip, item.ui?.itemLeadingChip] })
                          }), null, 16, ["size", "class"])) : createCommentVNode("", true)
                        ]),
                        createVNode("span", {
                          "data-slot": "itemWrapper",
                          class: ui.value.itemWrapper({ class: [props.ui?.itemWrapper, isSelectItem(item) && item.ui?.itemWrapper] })
                        }, [
                          createVNode("span", {
                            "data-slot": "itemLabel",
                            class: ui.value.itemLabel({ class: [props.ui?.itemLabel, isSelectItem(item) && item.ui?.itemLabel] })
                          }, [
                            renderSlot(_ctx.$slots, "item-label", {
                              item,
                              index
                            }, () => [
                              createTextVNode(toDisplayString(isSelectItem(item) ? unref(get)(item, props.labelKey) : item), 1)
                            ])
                          ], 2),
                          isSelectItem(item) && (unref(get)(item, props.descriptionKey) || !!slots["item-description"]) ? (openBlock(), createBlock("span", {
                            key: 0,
                            "data-slot": "itemDescription",
                            class: ui.value.itemDescription({ class: [props.ui?.itemDescription, isSelectItem(item) && item.ui?.itemDescription] })
                          }, [
                            renderSlot(_ctx.$slots, "item-description", {
                              item,
                              index
                            }, () => [
                              createTextVNode(toDisplayString(unref(get)(item, props.descriptionKey)), 1)
                            ])
                          ], 2)) : createCommentVNode("", true)
                        ], 2),
                        createVNode("span", {
                          "data-slot": "itemTrailing",
                          class: ui.value.itemTrailing({ class: [props.ui?.itemTrailing, isSelectItem(item) && item.ui?.itemTrailing] })
                        }, [
                          renderSlot(_ctx.$slots, "item-trailing", {
                            item,
                            index,
                            ui: ui.value
                          }),
                          createVNode(unref(ComboboxItemIndicator), { "as-child": "" }, {
                            default: withCtx(() => [
                              createVNode(_sfc_main$f, {
                                name: __props.selectedIcon || unref(appConfig).ui.icons.check,
                                "data-slot": "itemTrailingIcon",
                                class: ui.value.itemTrailingIcon({ class: [props.ui?.itemTrailingIcon, isSelectItem(item) && item.ui?.itemTrailingIcon] })
                              }, null, 8, ["name", "class"])
                            ]),
                            _: 2
                          }, 1024)
                        ], 2)
                      ])
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            }
          } else {
            return [
              isSelectItem(item) && item.type === "label" ? (openBlock(), createBlock(unref(ComboboxLabel), {
                key: 0,
                "data-slot": "label",
                class: ui.value.label({ class: [props.ui?.label, item.ui?.label, item.class] })
              }, {
                default: withCtx(() => [
                  createTextVNode(toDisplayString(unref(get)(item, props.labelKey)), 1)
                ]),
                _: 2
              }, 1032, ["class"])) : isSelectItem(item) && item.type === "separator" ? (openBlock(), createBlock(unref(ComboboxSeparator), {
                key: 1,
                "data-slot": "separator",
                class: ui.value.separator({ class: [props.ui?.separator, item.ui?.separator, item.class] })
              }, null, 8, ["class"])) : (openBlock(), createBlock(unref(ComboboxItem), {
                key: 2,
                "data-slot": "item",
                class: ui.value.item({ class: [props.ui?.item, isSelectItem(item) && item.ui?.item, isSelectItem(item) && item.class] }),
                disabled: isSelectItem(item) && item.disabled,
                value: props.valueKey && isSelectItem(item) ? unref(get)(item, props.valueKey) : item,
                onSelect: ($event) => onSelect($event, item)
              }, {
                default: withCtx(() => [
                  renderSlot(_ctx.$slots, "item", {
                    item,
                    index,
                    ui: ui.value
                  }, () => [
                    renderSlot(_ctx.$slots, "item-leading", {
                      item,
                      index,
                      ui: ui.value
                    }, () => [
                      isSelectItem(item) && item.icon ? (openBlock(), createBlock(_sfc_main$f, {
                        key: 0,
                        name: item.icon,
                        "data-slot": "itemLeadingIcon",
                        class: ui.value.itemLeadingIcon({ class: [props.ui?.itemLeadingIcon, item.ui?.itemLeadingIcon] })
                      }, null, 8, ["name", "class"])) : isSelectItem(item) && item.avatar ? (openBlock(), createBlock(_sfc_main$c, mergeProps({
                        key: 1,
                        size: item.ui?.itemLeadingAvatarSize || props.ui?.itemLeadingAvatarSize || ui.value.itemLeadingAvatarSize()
                      }, item.avatar, {
                        "data-slot": "itemLeadingAvatar",
                        class: ui.value.itemLeadingAvatar({ class: [props.ui?.itemLeadingAvatar, item.ui?.itemLeadingAvatar] })
                      }), null, 16, ["size", "class"])) : isSelectItem(item) && item.chip ? (openBlock(), createBlock(_sfc_main$d, mergeProps({
                        key: 2,
                        size: props.ui?.itemLeadingChipSize || ui.value.itemLeadingChipSize(),
                        inset: "",
                        standalone: ""
                      }, item.chip, {
                        "data-slot": "itemLeadingChip",
                        class: ui.value.itemLeadingChip({ class: [props.ui?.itemLeadingChip, item.ui?.itemLeadingChip] })
                      }), null, 16, ["size", "class"])) : createCommentVNode("", true)
                    ]),
                    createVNode("span", {
                      "data-slot": "itemWrapper",
                      class: ui.value.itemWrapper({ class: [props.ui?.itemWrapper, isSelectItem(item) && item.ui?.itemWrapper] })
                    }, [
                      createVNode("span", {
                        "data-slot": "itemLabel",
                        class: ui.value.itemLabel({ class: [props.ui?.itemLabel, isSelectItem(item) && item.ui?.itemLabel] })
                      }, [
                        renderSlot(_ctx.$slots, "item-label", {
                          item,
                          index
                        }, () => [
                          createTextVNode(toDisplayString(isSelectItem(item) ? unref(get)(item, props.labelKey) : item), 1)
                        ])
                      ], 2),
                      isSelectItem(item) && (unref(get)(item, props.descriptionKey) || !!slots["item-description"]) ? (openBlock(), createBlock("span", {
                        key: 0,
                        "data-slot": "itemDescription",
                        class: ui.value.itemDescription({ class: [props.ui?.itemDescription, isSelectItem(item) && item.ui?.itemDescription] })
                      }, [
                        renderSlot(_ctx.$slots, "item-description", {
                          item,
                          index
                        }, () => [
                          createTextVNode(toDisplayString(unref(get)(item, props.descriptionKey)), 1)
                        ])
                      ], 2)) : createCommentVNode("", true)
                    ], 2),
                    createVNode("span", {
                      "data-slot": "itemTrailing",
                      class: ui.value.itemTrailing({ class: [props.ui?.itemTrailing, isSelectItem(item) && item.ui?.itemTrailing] })
                    }, [
                      renderSlot(_ctx.$slots, "item-trailing", {
                        item,
                        index,
                        ui: ui.value
                      }),
                      createVNode(unref(ComboboxItemIndicator), { "as-child": "" }, {
                        default: withCtx(() => [
                          createVNode(_sfc_main$f, {
                            name: __props.selectedIcon || unref(appConfig).ui.icons.check,
                            "data-slot": "itemTrailingIcon",
                            class: ui.value.itemTrailingIcon({ class: [props.ui?.itemTrailingIcon, isSelectItem(item) && item.ui?.itemTrailingIcon] })
                          }, null, 8, ["name", "class"])
                        ]),
                        _: 2
                      }, 1024)
                    ], 2)
                  ])
                ]),
                _: 2
              }, 1032, ["class", "disabled", "value", "onSelect"]))
            ];
          }
        }),
        _: 3
      }, _parent));
      _push(ssrRenderComponent(unref(ComboboxRoot), mergeProps({ id: unref(id) }, { ...unref(rootProps), ..._ctx.$attrs, ...unref(ariaAttrs) }, {
        "ignore-filter": "",
        "as-child": "",
        name: unref(name),
        disabled: unref(disabled),
        "onUpdate:modelValue": onUpdate,
        "onUpdate:open": onUpdateOpen
      }), {
        default: withCtx(({ modelValue, open }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(ComboboxAnchor), { "as-child": "" }, {
              default: withCtx((_, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(ComboboxTrigger), {
                    ref_key: "triggerRef",
                    ref: triggerRef,
                    "data-slot": "base",
                    class: ui.value.base({ class: [props.ui?.base, props.class] }),
                    tabindex: "0"
                  }, {
                    default: withCtx((_2, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        if (unref(isLeading) || !!__props.avatar || !!slots.leading) {
                          _push4(`<span data-slot="leading" class="${ssrRenderClass(ui.value.leading({ class: props.ui?.leading }))}"${_scopeId3}>`);
                          ssrRenderSlot(_ctx.$slots, "leading", {
                            modelValue,
                            open,
                            ui: ui.value
                          }, () => {
                            if (unref(isLeading) && unref(leadingIconName)) {
                              _push4(ssrRenderComponent(_sfc_main$f, {
                                name: unref(leadingIconName),
                                "data-slot": "leadingIcon",
                                class: ui.value.leadingIcon({ class: props.ui?.leadingIcon })
                              }, null, _parent4, _scopeId3));
                            } else if (!!__props.avatar) {
                              _push4(ssrRenderComponent(_sfc_main$c, mergeProps({
                                size: props.ui?.itemLeadingAvatarSize || ui.value.itemLeadingAvatarSize()
                              }, __props.avatar, {
                                "data-slot": "itemLeadingAvatar",
                                class: ui.value.itemLeadingAvatar({ class: props.ui?.itemLeadingAvatar })
                              }), null, _parent4, _scopeId3));
                            } else {
                              _push4(`<!---->`);
                            }
                          }, _push4, _parent4, _scopeId3);
                          _push4(`</span>`);
                        } else {
                          _push4(`<!---->`);
                        }
                        ssrRenderSlot(_ctx.$slots, "default", {
                          modelValue,
                          open,
                          ui: ui.value
                        }, () => {
                          _push4(`<!--[-->`);
                          ssrRenderList([displayValue(modelValue)], (displayedModelValue) => {
                            _push4(`<!--[-->`);
                            if (displayedModelValue !== void 0 && displayedModelValue !== null) {
                              _push4(`<span data-slot="value" class="${ssrRenderClass(ui.value.value({ class: props.ui?.value }))}"${_scopeId3}>${ssrInterpolate(displayedModelValue)}</span>`);
                            } else {
                              _push4(`<span data-slot="placeholder" class="${ssrRenderClass(ui.value.placeholder({ class: props.ui?.placeholder }))}"${_scopeId3}>${ssrInterpolate(__props.placeholder ?? " ")}</span>`);
                            }
                            _push4(`<!--]-->`);
                          });
                          _push4(`<!--]-->`);
                        }, _push4, _parent4, _scopeId3);
                        if (unref(isTrailing) || !!slots.trailing) {
                          _push4(`<span data-slot="trailing" class="${ssrRenderClass(ui.value.trailing({ class: props.ui?.trailing }))}"${_scopeId3}>`);
                          ssrRenderSlot(_ctx.$slots, "trailing", {
                            modelValue,
                            open,
                            ui: ui.value
                          }, () => {
                            if (unref(trailingIconName)) {
                              _push4(ssrRenderComponent(_sfc_main$f, {
                                name: unref(trailingIconName),
                                "data-slot": "trailingIcon",
                                class: ui.value.trailingIcon({ class: props.ui?.trailingIcon })
                              }, null, _parent4, _scopeId3));
                            } else {
                              _push4(`<!---->`);
                            }
                          }, _push4, _parent4, _scopeId3);
                          _push4(`</span>`);
                        } else {
                          _push4(`<!---->`);
                        }
                      } else {
                        return [
                          unref(isLeading) || !!__props.avatar || !!slots.leading ? (openBlock(), createBlock("span", {
                            key: 0,
                            "data-slot": "leading",
                            class: ui.value.leading({ class: props.ui?.leading })
                          }, [
                            renderSlot(_ctx.$slots, "leading", {
                              modelValue,
                              open,
                              ui: ui.value
                            }, () => [
                              unref(isLeading) && unref(leadingIconName) ? (openBlock(), createBlock(_sfc_main$f, {
                                key: 0,
                                name: unref(leadingIconName),
                                "data-slot": "leadingIcon",
                                class: ui.value.leadingIcon({ class: props.ui?.leadingIcon })
                              }, null, 8, ["name", "class"])) : !!__props.avatar ? (openBlock(), createBlock(_sfc_main$c, mergeProps({
                                key: 1,
                                size: props.ui?.itemLeadingAvatarSize || ui.value.itemLeadingAvatarSize()
                              }, __props.avatar, {
                                "data-slot": "itemLeadingAvatar",
                                class: ui.value.itemLeadingAvatar({ class: props.ui?.itemLeadingAvatar })
                              }), null, 16, ["size", "class"])) : createCommentVNode("", true)
                            ])
                          ], 2)) : createCommentVNode("", true),
                          renderSlot(_ctx.$slots, "default", {
                            modelValue,
                            open,
                            ui: ui.value
                          }, () => [
                            (openBlock(true), createBlock(Fragment, null, renderList([displayValue(modelValue)], (displayedModelValue) => {
                              return openBlock(), createBlock(Fragment, { key: displayedModelValue }, [
                                displayedModelValue !== void 0 && displayedModelValue !== null ? (openBlock(), createBlock("span", {
                                  key: 0,
                                  "data-slot": "value",
                                  class: ui.value.value({ class: props.ui?.value })
                                }, toDisplayString(displayedModelValue), 3)) : (openBlock(), createBlock("span", {
                                  key: 1,
                                  "data-slot": "placeholder",
                                  class: ui.value.placeholder({ class: props.ui?.placeholder })
                                }, toDisplayString(__props.placeholder ?? " "), 3))
                              ], 64);
                            }), 128))
                          ]),
                          unref(isTrailing) || !!slots.trailing ? (openBlock(), createBlock("span", {
                            key: 1,
                            "data-slot": "trailing",
                            class: ui.value.trailing({ class: props.ui?.trailing })
                          }, [
                            renderSlot(_ctx.$slots, "trailing", {
                              modelValue,
                              open,
                              ui: ui.value
                            }, () => [
                              unref(trailingIconName) ? (openBlock(), createBlock(_sfc_main$f, {
                                key: 0,
                                name: unref(trailingIconName),
                                "data-slot": "trailingIcon",
                                class: ui.value.trailingIcon({ class: props.ui?.trailingIcon })
                              }, null, 8, ["name", "class"])) : createCommentVNode("", true)
                            ])
                          ], 2)) : createCommentVNode("", true)
                        ];
                      }
                    }),
                    _: 2
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(ComboboxTrigger), {
                      ref_key: "triggerRef",
                      ref: triggerRef,
                      "data-slot": "base",
                      class: ui.value.base({ class: [props.ui?.base, props.class] }),
                      tabindex: "0"
                    }, {
                      default: withCtx(() => [
                        unref(isLeading) || !!__props.avatar || !!slots.leading ? (openBlock(), createBlock("span", {
                          key: 0,
                          "data-slot": "leading",
                          class: ui.value.leading({ class: props.ui?.leading })
                        }, [
                          renderSlot(_ctx.$slots, "leading", {
                            modelValue,
                            open,
                            ui: ui.value
                          }, () => [
                            unref(isLeading) && unref(leadingIconName) ? (openBlock(), createBlock(_sfc_main$f, {
                              key: 0,
                              name: unref(leadingIconName),
                              "data-slot": "leadingIcon",
                              class: ui.value.leadingIcon({ class: props.ui?.leadingIcon })
                            }, null, 8, ["name", "class"])) : !!__props.avatar ? (openBlock(), createBlock(_sfc_main$c, mergeProps({
                              key: 1,
                              size: props.ui?.itemLeadingAvatarSize || ui.value.itemLeadingAvatarSize()
                            }, __props.avatar, {
                              "data-slot": "itemLeadingAvatar",
                              class: ui.value.itemLeadingAvatar({ class: props.ui?.itemLeadingAvatar })
                            }), null, 16, ["size", "class"])) : createCommentVNode("", true)
                          ])
                        ], 2)) : createCommentVNode("", true),
                        renderSlot(_ctx.$slots, "default", {
                          modelValue,
                          open,
                          ui: ui.value
                        }, () => [
                          (openBlock(true), createBlock(Fragment, null, renderList([displayValue(modelValue)], (displayedModelValue) => {
                            return openBlock(), createBlock(Fragment, { key: displayedModelValue }, [
                              displayedModelValue !== void 0 && displayedModelValue !== null ? (openBlock(), createBlock("span", {
                                key: 0,
                                "data-slot": "value",
                                class: ui.value.value({ class: props.ui?.value })
                              }, toDisplayString(displayedModelValue), 3)) : (openBlock(), createBlock("span", {
                                key: 1,
                                "data-slot": "placeholder",
                                class: ui.value.placeholder({ class: props.ui?.placeholder })
                              }, toDisplayString(__props.placeholder ?? " "), 3))
                            ], 64);
                          }), 128))
                        ]),
                        unref(isTrailing) || !!slots.trailing ? (openBlock(), createBlock("span", {
                          key: 1,
                          "data-slot": "trailing",
                          class: ui.value.trailing({ class: props.ui?.trailing })
                        }, [
                          renderSlot(_ctx.$slots, "trailing", {
                            modelValue,
                            open,
                            ui: ui.value
                          }, () => [
                            unref(trailingIconName) ? (openBlock(), createBlock(_sfc_main$f, {
                              key: 0,
                              name: unref(trailingIconName),
                              "data-slot": "trailingIcon",
                              class: ui.value.trailingIcon({ class: props.ui?.trailingIcon })
                            }, null, 8, ["name", "class"])) : createCommentVNode("", true)
                          ])
                        ], 2)) : createCommentVNode("", true)
                      ]),
                      _: 2
                    }, 1032, ["class"])
                  ];
                }
              }),
              _: 2
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(ComboboxPortal), unref(portalProps), {
              default: withCtx((_, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(ComboboxContent), mergeProps({
                    "data-slot": "content",
                    class: ui.value.content({ class: props.ui?.content })
                  }, contentProps.value), {
                    default: withCtx((_2, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(FocusScope), {
                          trapped: "",
                          "data-slot": "focusScope",
                          class: ui.value.focusScope({ class: props.ui?.focusScope })
                        }, {
                          default: withCtx((_3, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              ssrRenderSlot(_ctx.$slots, "content-top", {}, null, _push5, _parent5, _scopeId4);
                              if (!!__props.searchInput) {
                                _push5(ssrRenderComponent(unref(ComboboxInput), {
                                  modelValue: searchTerm.value,
                                  "onUpdate:modelValue": ($event) => searchTerm.value = $event,
                                  "display-value": () => searchTerm.value,
                                  "as-child": ""
                                }, {
                                  default: withCtx((_4, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(ssrRenderComponent(_sfc_main$6, mergeProps({
                                        autofocus: "",
                                        autocomplete: "off",
                                        size: __props.size
                                      }, searchInputProps.value, {
                                        "data-slot": "input",
                                        class: ui.value.input({ class: props.ui?.input }),
                                        onChange: () => {
                                        }
                                      }), null, _parent6, _scopeId5));
                                    } else {
                                      return [
                                        createVNode(_sfc_main$6, mergeProps({
                                          autofocus: "",
                                          autocomplete: "off",
                                          size: __props.size
                                        }, searchInputProps.value, {
                                          "data-slot": "input",
                                          class: ui.value.input({ class: props.ui?.input }),
                                          onChange: withModifiers(() => {
                                          }, ["stop"])
                                        }), null, 16, ["size", "class", "onChange"])
                                      ];
                                    }
                                  }),
                                  _: 2
                                }, _parent5, _scopeId4));
                              } else {
                                _push5(`<!---->`);
                              }
                              _push5(ssrRenderComponent(unref(ComboboxEmpty), {
                                "data-slot": "empty",
                                class: ui.value.empty({ class: props.ui?.empty })
                              }, {
                                default: withCtx((_4, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    ssrRenderSlot(_ctx.$slots, "empty", { searchTerm: searchTerm.value }, () => {
                                      _push6(`${ssrInterpolate(searchTerm.value ? unref(t)("selectMenu.noMatch", { searchTerm: searchTerm.value }) : unref(t)("selectMenu.noData"))}`);
                                    }, _push6, _parent6, _scopeId5);
                                  } else {
                                    return [
                                      renderSlot(_ctx.$slots, "empty", { searchTerm: searchTerm.value }, () => [
                                        createTextVNode(toDisplayString(searchTerm.value ? unref(t)("selectMenu.noMatch", { searchTerm: searchTerm.value }) : unref(t)("selectMenu.noData")), 1)
                                      ])
                                    ];
                                  }
                                }),
                                _: 2
                              }, _parent5, _scopeId4));
                              _push5(`<div role="presentation" data-slot="viewport" class="${ssrRenderClass(ui.value.viewport({ class: props.ui?.viewport }))}"${_scopeId4}>`);
                              if (!!__props.virtualize) {
                                _push5(`<!--[-->`);
                                if (createItem.value && createItemPosition.value === "top") {
                                  _push5(ssrRenderComponent(unref(ReuseCreateItemTemplate), null, null, _parent5, _scopeId4));
                                } else {
                                  _push5(`<!---->`);
                                }
                                _push5(ssrRenderComponent(unref(ComboboxVirtualizer), mergeProps({
                                  options: filteredItems.value,
                                  "text-content": (item2) => isSelectItem(item2) ? unref(get)(item2, props.labelKey) : String(item2)
                                }, virtualizerProps.value), {
                                  default: withCtx(({ option: item, virtualItem }, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(ssrRenderComponent(unref(ReuseItemTemplate), {
                                        item,
                                        index: virtualItem.index
                                      }, null, _parent6, _scopeId5));
                                    } else {
                                      return [
                                        createVNode(unref(ReuseItemTemplate), {
                                          item,
                                          index: virtualItem.index
                                        }, null, 8, ["item", "index"])
                                      ];
                                    }
                                  }),
                                  _: 2
                                }, _parent5, _scopeId4));
                                if (createItem.value && createItemPosition.value === "bottom") {
                                  _push5(ssrRenderComponent(unref(ReuseCreateItemTemplate), null, null, _parent5, _scopeId4));
                                } else {
                                  _push5(`<!---->`);
                                }
                                _push5(`<!--]-->`);
                              } else {
                                _push5(`<!--[-->`);
                                if (createItem.value && createItemPosition.value === "top") {
                                  _push5(ssrRenderComponent(unref(ComboboxGroup), {
                                    "data-slot": "group",
                                    class: ui.value.group({ class: props.ui?.group })
                                  }, {
                                    default: withCtx((_4, _push6, _parent6, _scopeId5) => {
                                      if (_push6) {
                                        _push6(ssrRenderComponent(unref(ReuseCreateItemTemplate), null, null, _parent6, _scopeId5));
                                      } else {
                                        return [
                                          createVNode(unref(ReuseCreateItemTemplate))
                                        ];
                                      }
                                    }),
                                    _: 2
                                  }, _parent5, _scopeId4));
                                } else {
                                  _push5(`<!---->`);
                                }
                                _push5(`<!--[-->`);
                                ssrRenderList(filteredGroups.value, (group, groupIndex) => {
                                  _push5(ssrRenderComponent(unref(ComboboxGroup), {
                                    key: `group-${groupIndex}`,
                                    "data-slot": "group",
                                    class: ui.value.group({ class: props.ui?.group })
                                  }, {
                                    default: withCtx((_4, _push6, _parent6, _scopeId5) => {
                                      if (_push6) {
                                        _push6(`<!--[-->`);
                                        ssrRenderList(group, (item, index) => {
                                          _push6(ssrRenderComponent(unref(ReuseItemTemplate), {
                                            key: `group-${groupIndex}-${index}`,
                                            item,
                                            index
                                          }, null, _parent6, _scopeId5));
                                        });
                                        _push6(`<!--]-->`);
                                      } else {
                                        return [
                                          (openBlock(true), createBlock(Fragment, null, renderList(group, (item, index) => {
                                            return openBlock(), createBlock(unref(ReuseItemTemplate), {
                                              key: `group-${groupIndex}-${index}`,
                                              item,
                                              index
                                            }, null, 8, ["item", "index"]);
                                          }), 128))
                                        ];
                                      }
                                    }),
                                    _: 2
                                  }, _parent5, _scopeId4));
                                });
                                _push5(`<!--]-->`);
                                if (createItem.value && createItemPosition.value === "bottom") {
                                  _push5(ssrRenderComponent(unref(ComboboxGroup), {
                                    "data-slot": "group",
                                    class: ui.value.group({ class: props.ui?.group })
                                  }, {
                                    default: withCtx((_4, _push6, _parent6, _scopeId5) => {
                                      if (_push6) {
                                        _push6(ssrRenderComponent(unref(ReuseCreateItemTemplate), null, null, _parent6, _scopeId5));
                                      } else {
                                        return [
                                          createVNode(unref(ReuseCreateItemTemplate))
                                        ];
                                      }
                                    }),
                                    _: 2
                                  }, _parent5, _scopeId4));
                                } else {
                                  _push5(`<!---->`);
                                }
                                _push5(`<!--]-->`);
                              }
                              _push5(`</div>`);
                              ssrRenderSlot(_ctx.$slots, "content-bottom", {}, null, _push5, _parent5, _scopeId4);
                            } else {
                              return [
                                renderSlot(_ctx.$slots, "content-top"),
                                !!__props.searchInput ? (openBlock(), createBlock(unref(ComboboxInput), {
                                  key: 0,
                                  modelValue: searchTerm.value,
                                  "onUpdate:modelValue": ($event) => searchTerm.value = $event,
                                  "display-value": () => searchTerm.value,
                                  "as-child": ""
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_sfc_main$6, mergeProps({
                                      autofocus: "",
                                      autocomplete: "off",
                                      size: __props.size
                                    }, searchInputProps.value, {
                                      "data-slot": "input",
                                      class: ui.value.input({ class: props.ui?.input }),
                                      onChange: withModifiers(() => {
                                      }, ["stop"])
                                    }), null, 16, ["size", "class", "onChange"])
                                  ]),
                                  _: 1
                                }, 8, ["modelValue", "onUpdate:modelValue", "display-value"])) : createCommentVNode("", true),
                                createVNode(unref(ComboboxEmpty), {
                                  "data-slot": "empty",
                                  class: ui.value.empty({ class: props.ui?.empty })
                                }, {
                                  default: withCtx(() => [
                                    renderSlot(_ctx.$slots, "empty", { searchTerm: searchTerm.value }, () => [
                                      createTextVNode(toDisplayString(searchTerm.value ? unref(t)("selectMenu.noMatch", { searchTerm: searchTerm.value }) : unref(t)("selectMenu.noData")), 1)
                                    ])
                                  ]),
                                  _: 3
                                }, 8, ["class"]),
                                createVNode("div", {
                                  role: "presentation",
                                  "data-slot": "viewport",
                                  class: ui.value.viewport({ class: props.ui?.viewport })
                                }, [
                                  !!__props.virtualize ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                                    createItem.value && createItemPosition.value === "top" ? (openBlock(), createBlock(unref(ReuseCreateItemTemplate), { key: 0 })) : createCommentVNode("", true),
                                    createVNode(unref(ComboboxVirtualizer), mergeProps({
                                      options: filteredItems.value,
                                      "text-content": (item2) => isSelectItem(item2) ? unref(get)(item2, props.labelKey) : String(item2)
                                    }, virtualizerProps.value), {
                                      default: withCtx(({ option: item, virtualItem }) => [
                                        createVNode(unref(ReuseItemTemplate), {
                                          item,
                                          index: virtualItem.index
                                        }, null, 8, ["item", "index"])
                                      ]),
                                      _: 1
                                    }, 16, ["options", "text-content"]),
                                    createItem.value && createItemPosition.value === "bottom" ? (openBlock(), createBlock(unref(ReuseCreateItemTemplate), { key: 1 })) : createCommentVNode("", true)
                                  ], 64)) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                                    createItem.value && createItemPosition.value === "top" ? (openBlock(), createBlock(unref(ComboboxGroup), {
                                      key: 0,
                                      "data-slot": "group",
                                      class: ui.value.group({ class: props.ui?.group })
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(unref(ReuseCreateItemTemplate))
                                      ]),
                                      _: 1
                                    }, 8, ["class"])) : createCommentVNode("", true),
                                    (openBlock(true), createBlock(Fragment, null, renderList(filteredGroups.value, (group, groupIndex) => {
                                      return openBlock(), createBlock(unref(ComboboxGroup), {
                                        key: `group-${groupIndex}`,
                                        "data-slot": "group",
                                        class: ui.value.group({ class: props.ui?.group })
                                      }, {
                                        default: withCtx(() => [
                                          (openBlock(true), createBlock(Fragment, null, renderList(group, (item, index) => {
                                            return openBlock(), createBlock(unref(ReuseItemTemplate), {
                                              key: `group-${groupIndex}-${index}`,
                                              item,
                                              index
                                            }, null, 8, ["item", "index"]);
                                          }), 128))
                                        ]),
                                        _: 2
                                      }, 1032, ["class"]);
                                    }), 128)),
                                    createItem.value && createItemPosition.value === "bottom" ? (openBlock(), createBlock(unref(ComboboxGroup), {
                                      key: 1,
                                      "data-slot": "group",
                                      class: ui.value.group({ class: props.ui?.group })
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(unref(ReuseCreateItemTemplate))
                                      ]),
                                      _: 1
                                    }, 8, ["class"])) : createCommentVNode("", true)
                                  ], 64))
                                ], 2),
                                renderSlot(_ctx.$slots, "content-bottom")
                              ];
                            }
                          }),
                          _: 2
                        }, _parent4, _scopeId3));
                        if (!!__props.arrow) {
                          _push4(ssrRenderComponent(unref(ComboboxArrow), mergeProps(arrowProps.value, {
                            "data-slot": "arrow",
                            class: ui.value.arrow({ class: props.ui?.arrow })
                          }), null, _parent4, _scopeId3));
                        } else {
                          _push4(`<!---->`);
                        }
                      } else {
                        return [
                          createVNode(unref(FocusScope), {
                            trapped: "",
                            "data-slot": "focusScope",
                            class: ui.value.focusScope({ class: props.ui?.focusScope })
                          }, {
                            default: withCtx(() => [
                              renderSlot(_ctx.$slots, "content-top"),
                              !!__props.searchInput ? (openBlock(), createBlock(unref(ComboboxInput), {
                                key: 0,
                                modelValue: searchTerm.value,
                                "onUpdate:modelValue": ($event) => searchTerm.value = $event,
                                "display-value": () => searchTerm.value,
                                "as-child": ""
                              }, {
                                default: withCtx(() => [
                                  createVNode(_sfc_main$6, mergeProps({
                                    autofocus: "",
                                    autocomplete: "off",
                                    size: __props.size
                                  }, searchInputProps.value, {
                                    "data-slot": "input",
                                    class: ui.value.input({ class: props.ui?.input }),
                                    onChange: withModifiers(() => {
                                    }, ["stop"])
                                  }), null, 16, ["size", "class", "onChange"])
                                ]),
                                _: 1
                              }, 8, ["modelValue", "onUpdate:modelValue", "display-value"])) : createCommentVNode("", true),
                              createVNode(unref(ComboboxEmpty), {
                                "data-slot": "empty",
                                class: ui.value.empty({ class: props.ui?.empty })
                              }, {
                                default: withCtx(() => [
                                  renderSlot(_ctx.$slots, "empty", { searchTerm: searchTerm.value }, () => [
                                    createTextVNode(toDisplayString(searchTerm.value ? unref(t)("selectMenu.noMatch", { searchTerm: searchTerm.value }) : unref(t)("selectMenu.noData")), 1)
                                  ])
                                ]),
                                _: 3
                              }, 8, ["class"]),
                              createVNode("div", {
                                role: "presentation",
                                "data-slot": "viewport",
                                class: ui.value.viewport({ class: props.ui?.viewport })
                              }, [
                                !!__props.virtualize ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                                  createItem.value && createItemPosition.value === "top" ? (openBlock(), createBlock(unref(ReuseCreateItemTemplate), { key: 0 })) : createCommentVNode("", true),
                                  createVNode(unref(ComboboxVirtualizer), mergeProps({
                                    options: filteredItems.value,
                                    "text-content": (item2) => isSelectItem(item2) ? unref(get)(item2, props.labelKey) : String(item2)
                                  }, virtualizerProps.value), {
                                    default: withCtx(({ option: item, virtualItem }) => [
                                      createVNode(unref(ReuseItemTemplate), {
                                        item,
                                        index: virtualItem.index
                                      }, null, 8, ["item", "index"])
                                    ]),
                                    _: 1
                                  }, 16, ["options", "text-content"]),
                                  createItem.value && createItemPosition.value === "bottom" ? (openBlock(), createBlock(unref(ReuseCreateItemTemplate), { key: 1 })) : createCommentVNode("", true)
                                ], 64)) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                                  createItem.value && createItemPosition.value === "top" ? (openBlock(), createBlock(unref(ComboboxGroup), {
                                    key: 0,
                                    "data-slot": "group",
                                    class: ui.value.group({ class: props.ui?.group })
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(unref(ReuseCreateItemTemplate))
                                    ]),
                                    _: 1
                                  }, 8, ["class"])) : createCommentVNode("", true),
                                  (openBlock(true), createBlock(Fragment, null, renderList(filteredGroups.value, (group, groupIndex) => {
                                    return openBlock(), createBlock(unref(ComboboxGroup), {
                                      key: `group-${groupIndex}`,
                                      "data-slot": "group",
                                      class: ui.value.group({ class: props.ui?.group })
                                    }, {
                                      default: withCtx(() => [
                                        (openBlock(true), createBlock(Fragment, null, renderList(group, (item, index) => {
                                          return openBlock(), createBlock(unref(ReuseItemTemplate), {
                                            key: `group-${groupIndex}-${index}`,
                                            item,
                                            index
                                          }, null, 8, ["item", "index"]);
                                        }), 128))
                                      ]),
                                      _: 2
                                    }, 1032, ["class"]);
                                  }), 128)),
                                  createItem.value && createItemPosition.value === "bottom" ? (openBlock(), createBlock(unref(ComboboxGroup), {
                                    key: 1,
                                    "data-slot": "group",
                                    class: ui.value.group({ class: props.ui?.group })
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(unref(ReuseCreateItemTemplate))
                                    ]),
                                    _: 1
                                  }, 8, ["class"])) : createCommentVNode("", true)
                                ], 64))
                              ], 2),
                              renderSlot(_ctx.$slots, "content-bottom")
                            ]),
                            _: 3
                          }, 8, ["class"]),
                          !!__props.arrow ? (openBlock(), createBlock(unref(ComboboxArrow), mergeProps({ key: 0 }, arrowProps.value, {
                            "data-slot": "arrow",
                            class: ui.value.arrow({ class: props.ui?.arrow })
                          }), null, 16, ["class"])) : createCommentVNode("", true)
                        ];
                      }
                    }),
                    _: 2
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(ComboboxContent), mergeProps({
                      "data-slot": "content",
                      class: ui.value.content({ class: props.ui?.content })
                    }, contentProps.value), {
                      default: withCtx(() => [
                        createVNode(unref(FocusScope), {
                          trapped: "",
                          "data-slot": "focusScope",
                          class: ui.value.focusScope({ class: props.ui?.focusScope })
                        }, {
                          default: withCtx(() => [
                            renderSlot(_ctx.$slots, "content-top"),
                            !!__props.searchInput ? (openBlock(), createBlock(unref(ComboboxInput), {
                              key: 0,
                              modelValue: searchTerm.value,
                              "onUpdate:modelValue": ($event) => searchTerm.value = $event,
                              "display-value": () => searchTerm.value,
                              "as-child": ""
                            }, {
                              default: withCtx(() => [
                                createVNode(_sfc_main$6, mergeProps({
                                  autofocus: "",
                                  autocomplete: "off",
                                  size: __props.size
                                }, searchInputProps.value, {
                                  "data-slot": "input",
                                  class: ui.value.input({ class: props.ui?.input }),
                                  onChange: withModifiers(() => {
                                  }, ["stop"])
                                }), null, 16, ["size", "class", "onChange"])
                              ]),
                              _: 1
                            }, 8, ["modelValue", "onUpdate:modelValue", "display-value"])) : createCommentVNode("", true),
                            createVNode(unref(ComboboxEmpty), {
                              "data-slot": "empty",
                              class: ui.value.empty({ class: props.ui?.empty })
                            }, {
                              default: withCtx(() => [
                                renderSlot(_ctx.$slots, "empty", { searchTerm: searchTerm.value }, () => [
                                  createTextVNode(toDisplayString(searchTerm.value ? unref(t)("selectMenu.noMatch", { searchTerm: searchTerm.value }) : unref(t)("selectMenu.noData")), 1)
                                ])
                              ]),
                              _: 3
                            }, 8, ["class"]),
                            createVNode("div", {
                              role: "presentation",
                              "data-slot": "viewport",
                              class: ui.value.viewport({ class: props.ui?.viewport })
                            }, [
                              !!__props.virtualize ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                                createItem.value && createItemPosition.value === "top" ? (openBlock(), createBlock(unref(ReuseCreateItemTemplate), { key: 0 })) : createCommentVNode("", true),
                                createVNode(unref(ComboboxVirtualizer), mergeProps({
                                  options: filteredItems.value,
                                  "text-content": (item2) => isSelectItem(item2) ? unref(get)(item2, props.labelKey) : String(item2)
                                }, virtualizerProps.value), {
                                  default: withCtx(({ option: item, virtualItem }) => [
                                    createVNode(unref(ReuseItemTemplate), {
                                      item,
                                      index: virtualItem.index
                                    }, null, 8, ["item", "index"])
                                  ]),
                                  _: 1
                                }, 16, ["options", "text-content"]),
                                createItem.value && createItemPosition.value === "bottom" ? (openBlock(), createBlock(unref(ReuseCreateItemTemplate), { key: 1 })) : createCommentVNode("", true)
                              ], 64)) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                                createItem.value && createItemPosition.value === "top" ? (openBlock(), createBlock(unref(ComboboxGroup), {
                                  key: 0,
                                  "data-slot": "group",
                                  class: ui.value.group({ class: props.ui?.group })
                                }, {
                                  default: withCtx(() => [
                                    createVNode(unref(ReuseCreateItemTemplate))
                                  ]),
                                  _: 1
                                }, 8, ["class"])) : createCommentVNode("", true),
                                (openBlock(true), createBlock(Fragment, null, renderList(filteredGroups.value, (group, groupIndex) => {
                                  return openBlock(), createBlock(unref(ComboboxGroup), {
                                    key: `group-${groupIndex}`,
                                    "data-slot": "group",
                                    class: ui.value.group({ class: props.ui?.group })
                                  }, {
                                    default: withCtx(() => [
                                      (openBlock(true), createBlock(Fragment, null, renderList(group, (item, index) => {
                                        return openBlock(), createBlock(unref(ReuseItemTemplate), {
                                          key: `group-${groupIndex}-${index}`,
                                          item,
                                          index
                                        }, null, 8, ["item", "index"]);
                                      }), 128))
                                    ]),
                                    _: 2
                                  }, 1032, ["class"]);
                                }), 128)),
                                createItem.value && createItemPosition.value === "bottom" ? (openBlock(), createBlock(unref(ComboboxGroup), {
                                  key: 1,
                                  "data-slot": "group",
                                  class: ui.value.group({ class: props.ui?.group })
                                }, {
                                  default: withCtx(() => [
                                    createVNode(unref(ReuseCreateItemTemplate))
                                  ]),
                                  _: 1
                                }, 8, ["class"])) : createCommentVNode("", true)
                              ], 64))
                            ], 2),
                            renderSlot(_ctx.$slots, "content-bottom")
                          ]),
                          _: 3
                        }, 8, ["class"]),
                        !!__props.arrow ? (openBlock(), createBlock(unref(ComboboxArrow), mergeProps({ key: 0 }, arrowProps.value, {
                          "data-slot": "arrow",
                          class: ui.value.arrow({ class: props.ui?.arrow })
                        }), null, 16, ["class"])) : createCommentVNode("", true)
                      ]),
                      _: 3
                    }, 16, ["class"])
                  ];
                }
              }),
              _: 2
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(ComboboxAnchor), { "as-child": "" }, {
                default: withCtx(() => [
                  createVNode(unref(ComboboxTrigger), {
                    ref_key: "triggerRef",
                    ref: triggerRef,
                    "data-slot": "base",
                    class: ui.value.base({ class: [props.ui?.base, props.class] }),
                    tabindex: "0"
                  }, {
                    default: withCtx(() => [
                      unref(isLeading) || !!__props.avatar || !!slots.leading ? (openBlock(), createBlock("span", {
                        key: 0,
                        "data-slot": "leading",
                        class: ui.value.leading({ class: props.ui?.leading })
                      }, [
                        renderSlot(_ctx.$slots, "leading", {
                          modelValue,
                          open,
                          ui: ui.value
                        }, () => [
                          unref(isLeading) && unref(leadingIconName) ? (openBlock(), createBlock(_sfc_main$f, {
                            key: 0,
                            name: unref(leadingIconName),
                            "data-slot": "leadingIcon",
                            class: ui.value.leadingIcon({ class: props.ui?.leadingIcon })
                          }, null, 8, ["name", "class"])) : !!__props.avatar ? (openBlock(), createBlock(_sfc_main$c, mergeProps({
                            key: 1,
                            size: props.ui?.itemLeadingAvatarSize || ui.value.itemLeadingAvatarSize()
                          }, __props.avatar, {
                            "data-slot": "itemLeadingAvatar",
                            class: ui.value.itemLeadingAvatar({ class: props.ui?.itemLeadingAvatar })
                          }), null, 16, ["size", "class"])) : createCommentVNode("", true)
                        ])
                      ], 2)) : createCommentVNode("", true),
                      renderSlot(_ctx.$slots, "default", {
                        modelValue,
                        open,
                        ui: ui.value
                      }, () => [
                        (openBlock(true), createBlock(Fragment, null, renderList([displayValue(modelValue)], (displayedModelValue) => {
                          return openBlock(), createBlock(Fragment, { key: displayedModelValue }, [
                            displayedModelValue !== void 0 && displayedModelValue !== null ? (openBlock(), createBlock("span", {
                              key: 0,
                              "data-slot": "value",
                              class: ui.value.value({ class: props.ui?.value })
                            }, toDisplayString(displayedModelValue), 3)) : (openBlock(), createBlock("span", {
                              key: 1,
                              "data-slot": "placeholder",
                              class: ui.value.placeholder({ class: props.ui?.placeholder })
                            }, toDisplayString(__props.placeholder ?? " "), 3))
                          ], 64);
                        }), 128))
                      ]),
                      unref(isTrailing) || !!slots.trailing ? (openBlock(), createBlock("span", {
                        key: 1,
                        "data-slot": "trailing",
                        class: ui.value.trailing({ class: props.ui?.trailing })
                      }, [
                        renderSlot(_ctx.$slots, "trailing", {
                          modelValue,
                          open,
                          ui: ui.value
                        }, () => [
                          unref(trailingIconName) ? (openBlock(), createBlock(_sfc_main$f, {
                            key: 0,
                            name: unref(trailingIconName),
                            "data-slot": "trailingIcon",
                            class: ui.value.trailingIcon({ class: props.ui?.trailingIcon })
                          }, null, 8, ["name", "class"])) : createCommentVNode("", true)
                        ])
                      ], 2)) : createCommentVNode("", true)
                    ]),
                    _: 2
                  }, 1032, ["class"])
                ]),
                _: 2
              }, 1024),
              createVNode(unref(ComboboxPortal), unref(portalProps), {
                default: withCtx(() => [
                  createVNode(unref(ComboboxContent), mergeProps({
                    "data-slot": "content",
                    class: ui.value.content({ class: props.ui?.content })
                  }, contentProps.value), {
                    default: withCtx(() => [
                      createVNode(unref(FocusScope), {
                        trapped: "",
                        "data-slot": "focusScope",
                        class: ui.value.focusScope({ class: props.ui?.focusScope })
                      }, {
                        default: withCtx(() => [
                          renderSlot(_ctx.$slots, "content-top"),
                          !!__props.searchInput ? (openBlock(), createBlock(unref(ComboboxInput), {
                            key: 0,
                            modelValue: searchTerm.value,
                            "onUpdate:modelValue": ($event) => searchTerm.value = $event,
                            "display-value": () => searchTerm.value,
                            "as-child": ""
                          }, {
                            default: withCtx(() => [
                              createVNode(_sfc_main$6, mergeProps({
                                autofocus: "",
                                autocomplete: "off",
                                size: __props.size
                              }, searchInputProps.value, {
                                "data-slot": "input",
                                class: ui.value.input({ class: props.ui?.input }),
                                onChange: withModifiers(() => {
                                }, ["stop"])
                              }), null, 16, ["size", "class", "onChange"])
                            ]),
                            _: 1
                          }, 8, ["modelValue", "onUpdate:modelValue", "display-value"])) : createCommentVNode("", true),
                          createVNode(unref(ComboboxEmpty), {
                            "data-slot": "empty",
                            class: ui.value.empty({ class: props.ui?.empty })
                          }, {
                            default: withCtx(() => [
                              renderSlot(_ctx.$slots, "empty", { searchTerm: searchTerm.value }, () => [
                                createTextVNode(toDisplayString(searchTerm.value ? unref(t)("selectMenu.noMatch", { searchTerm: searchTerm.value }) : unref(t)("selectMenu.noData")), 1)
                              ])
                            ]),
                            _: 3
                          }, 8, ["class"]),
                          createVNode("div", {
                            role: "presentation",
                            "data-slot": "viewport",
                            class: ui.value.viewport({ class: props.ui?.viewport })
                          }, [
                            !!__props.virtualize ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                              createItem.value && createItemPosition.value === "top" ? (openBlock(), createBlock(unref(ReuseCreateItemTemplate), { key: 0 })) : createCommentVNode("", true),
                              createVNode(unref(ComboboxVirtualizer), mergeProps({
                                options: filteredItems.value,
                                "text-content": (item2) => isSelectItem(item2) ? unref(get)(item2, props.labelKey) : String(item2)
                              }, virtualizerProps.value), {
                                default: withCtx(({ option: item, virtualItem }) => [
                                  createVNode(unref(ReuseItemTemplate), {
                                    item,
                                    index: virtualItem.index
                                  }, null, 8, ["item", "index"])
                                ]),
                                _: 1
                              }, 16, ["options", "text-content"]),
                              createItem.value && createItemPosition.value === "bottom" ? (openBlock(), createBlock(unref(ReuseCreateItemTemplate), { key: 1 })) : createCommentVNode("", true)
                            ], 64)) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                              createItem.value && createItemPosition.value === "top" ? (openBlock(), createBlock(unref(ComboboxGroup), {
                                key: 0,
                                "data-slot": "group",
                                class: ui.value.group({ class: props.ui?.group })
                              }, {
                                default: withCtx(() => [
                                  createVNode(unref(ReuseCreateItemTemplate))
                                ]),
                                _: 1
                              }, 8, ["class"])) : createCommentVNode("", true),
                              (openBlock(true), createBlock(Fragment, null, renderList(filteredGroups.value, (group, groupIndex) => {
                                return openBlock(), createBlock(unref(ComboboxGroup), {
                                  key: `group-${groupIndex}`,
                                  "data-slot": "group",
                                  class: ui.value.group({ class: props.ui?.group })
                                }, {
                                  default: withCtx(() => [
                                    (openBlock(true), createBlock(Fragment, null, renderList(group, (item, index) => {
                                      return openBlock(), createBlock(unref(ReuseItemTemplate), {
                                        key: `group-${groupIndex}-${index}`,
                                        item,
                                        index
                                      }, null, 8, ["item", "index"]);
                                    }), 128))
                                  ]),
                                  _: 2
                                }, 1032, ["class"]);
                              }), 128)),
                              createItem.value && createItemPosition.value === "bottom" ? (openBlock(), createBlock(unref(ComboboxGroup), {
                                key: 1,
                                "data-slot": "group",
                                class: ui.value.group({ class: props.ui?.group })
                              }, {
                                default: withCtx(() => [
                                  createVNode(unref(ReuseCreateItemTemplate))
                                ]),
                                _: 1
                              }, 8, ["class"])) : createCommentVNode("", true)
                            ], 64))
                          ], 2),
                          renderSlot(_ctx.$slots, "content-bottom")
                        ]),
                        _: 3
                      }, 8, ["class"]),
                      !!__props.arrow ? (openBlock(), createBlock(unref(ComboboxArrow), mergeProps({ key: 0 }, arrowProps.value, {
                        "data-slot": "arrow",
                        class: ui.value.arrow({ class: props.ui?.arrow })
                      }), null, 16, ["class"])) : createCommentVNode("", true)
                    ]),
                    _: 3
                  }, 16, ["class"])
                ]),
                _: 3
              }, 16)
            ];
          }
        }),
        _: 3
      }, _parent));
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/@nuxt/ui/dist/runtime/components/SelectMenu.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const useSeriesDetails = (selectedTab) => {
  const stalker = useStalkerStore();
  const seriesDetails = ref(null);
  const loadingSeriesDetails = ref(false);
  const seriesDetailsError = ref(null);
  const selectedSeason = ref(null);
  const episodes = ref([]);
  ref(false);
  const availableSeasons = computed(() => {
    const seasons = stalker.seriesSeasons[stalker.currentSeries?.id + "_seasons"] || [];
    return seasons.map((season) => {
      const seasonNumber = Number(season.id.split(":")[1]);
      return {
        label: season.name || `Season ${seasonNumber}`,
        value: seasonNumber,
        seasonNumber,
        iptv: season
        // keep original IPTV season attached
      };
    });
  });
  const seasonItems = computed(() => {
    return availableSeasons.value.map((season) => ({
      label: season.label,
      // what you see in the dropdown
      value: season.value,
      // what gets stored in v-model
      raw: season
      // keep the original data around
    }));
  });
  async function fetchEpisodes() {
    if (!selectedSeason.value) return;
    const season = availableSeasons.value.find(
      (s) => s.value === selectedSeason.value
    );
    if (!season) {
      episodes.value = [];
      return;
    }
    episodes.value = season.iptv.series.map((epNum) => ({
      id: `${season.iptv.id}:${epNum}`,
      episode: epNum,
      name: `Episode ${epNum}`,
      cmd: season.iptv.cmd
    }));
  }
  async function playEpisode(episode) {
    if (!episode?.cmd) return;
    await stalker.createSeriesLink(episode.cmd, "vod", episode.episode);
    stalker.modalOpen = true;
  }
  async function fetchSeriesDetails(series) {
    if (!series) {
      seriesDetails.value = null;
      return;
    }
    let tmdbId = series.tmdb_id || series.tmdbId || series.tmdb || series.id;
    if (!tmdbId && series.name) {
      try {
        loadingSeriesDetails.value = true;
        seriesDetailsError.value = null;
        const searchResults = await $fetch("/api/tmdb/search-tv", {
          method: "POST",
          body: { query: series.name, year: series.year || void 0 }
        });
        if (searchResults.results?.length) {
          tmdbId = searchResults.results[0].id;
        }
      } catch (err) {
        console.error("Error searching TMDB:", err);
      }
    }
    if (tmdbId) {
      try {
        loadingSeriesDetails.value = true;
        seriesDetailsError.value = null;
        const details = await $fetch("/api/tmdb/tv", { query: { tmdbId } });
        if (details) {
          seriesDetails.value = details;
        } else {
          seriesDetails.value = mapFallbackSeries(series);
          seriesDetailsError.value = "Showing local series data";
        }
      } catch (err) {
        console.error("TMDB fetch error:", err);
        seriesDetails.value = mapFallbackSeries(series);
        seriesDetailsError.value = "Failed to load TMDB data, showing local series";
      } finally {
        loadingSeriesDetails.value = false;
      }
    } else {
      seriesDetails.value = mapFallbackSeries(series);
      seriesDetailsError.value = "Showing local series data";
    }
  }
  function mapFallbackSeries(series) {
    console.log(series);
    return {
      name: series.name,
      overview: series.description,
      genres: series.genres_str ? series.genres_str.split(" / ").map((g) => ({ id: g, name: g })) : [],
      first_air_date: series.year,
      last_air_date: series.year_end || null,
      vote_average: series.rating_imdb || null,
      backdrop_path: series.screenshot_uri,
      videos: { results: [] },
      credits: { cast: [], crew: [] },
      images: { backdrops: [], posters: [], logos: [] }
    };
  }
  watch(
    () => [stalker.currentSeries, selectedTab.value],
    async ([series, tab]) => {
      if (tab === "series" && series) {
        await stalker.getSeriesSeasons(series.id);
        await fetchSeriesDetails(series);
      } else {
        selectedSeason.value = null;
        episodes.value = [];
        seriesDetails.value = null;
      }
    },
    { immediate: true }
  );
  watch(
    availableSeasons,
    (seasons) => {
      if (!seasons.length) return;
      if (selectedSeason.value == null) {
        selectedSeason.value = seasons[0].value;
        fetchEpisodes();
      }
    },
    { immediate: true }
  );
  watch(selectedSeason, fetchEpisodes);
  return {
    seriesDetails,
    loadingSeriesDetails,
    seriesDetailsError,
    seasonItems,
    selectedSeason,
    availableSeasons,
    episodes,
    playEpisode
  };
};
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "SeriesSidebar",
  __ssrInlineRender: true,
  props: {
    selectedTab: {}
  },
  setup(__props) {
    const stalker = useStalkerStore();
    const props = __props;
    const selectedTabRef = computed(() => props.selectedTab);
    const {
      seriesDetails,
      loadingSeriesDetails,
      seriesDetailsError,
      seasonItems,
      selectedSeason,
      availableSeasons,
      episodes
    } = useSeriesDetails(selectedTabRef);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Icon = __nuxt_component_0$1;
      const _component_UButton = _sfc_main$9;
      const _component_USelectMenu = _sfc_main$3;
      if (unref(stalker).currentSeries) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "series-sidebar w-96 bg-gray-800/95 dark:bg-gray-900/95 border-l border-gray-700 flex flex-col overflow-hidden" }, _attrs))} data-v-ee46e60c>`);
        if (unref(seriesDetails)) {
          _push(`<div class="series-header relative h-64 overflow-hidden" data-v-ee46e60c>`);
          if (unref(seriesDetails).backdrop_path) {
            _push(`<img${ssrRenderAttr("src", unref(seriesDetails).backdrop_path)}${ssrRenderAttr("alt", unref(seriesDetails).name)} onerror="this.onerror=null; this.src=&#39;https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg&#39;" class="absolute inset-0 w-full h-full object-cover" data-v-ee46e60c>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<div class="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent" data-v-ee46e60c></div><div class="relative z-10 p-4 h-full flex flex-col justify-end" data-v-ee46e60c><h2 class="text-2xl font-bold text-white mb-2" data-v-ee46e60c>${ssrInterpolate(unref(seriesDetails).name)}</h2><div class="flex items-center gap-3 text-sm text-gray-300" data-v-ee46e60c>`);
          if (unref(seriesDetails).first_air_date) {
            _push(`<span data-v-ee46e60c>${ssrInterpolate(new Date(unref(seriesDetails).first_air_date).getFullYear())} ${ssrInterpolate(unref(seriesDetails).last_air_date ? `- ${new Date(unref(seriesDetails).last_air_date).getFullYear()}` : "")}</span>`);
          } else {
            _push(`<!---->`);
          }
          if (unref(seriesDetails).number_of_seasons) {
            _push(`<span data-v-ee46e60c>${ssrInterpolate(unref(seriesDetails).number_of_seasons)} ${ssrInterpolate(unref(seriesDetails).number_of_seasons === 1 ? "Season" : "Seasons")}</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<div class="flex items-center gap-1" data-v-ee46e60c>`);
          _push(ssrRenderComponent(_component_Icon, {
            name: "i-lucide-star",
            class: "w-4 h-4 text-yellow-400"
          }, null, _parent));
          if (unref(seriesDetails).vote_average !== null) {
            _push(`<span data-v-ee46e60c>${ssrInterpolate(unref(seriesDetails).vote_average)}</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div></div>`);
          _push(ssrRenderComponent(_component_UButton, {
            icon: "i-lucide-x",
            color: "gray",
            variant: "ghost",
            size: "sm",
            class: "absolute top-2 right-2 z-20",
            onClick: ($event) => unref(stalker).modalOpen = false
          }, null, _parent));
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="series-content flex-1 overflow-y-auto p-4" data-v-ee46e60c>`);
        if (unref(loadingSeriesDetails)) {
          _push(`<div class="text-center py-8" data-v-ee46e60c>`);
          _push(ssrRenderComponent(_component_Icon, {
            name: "i-lucide-loader-2",
            class: "w-8 h-8 mx-auto mb-2 animate-spin text-primary-400"
          }, null, _parent));
          _push(`<p class="text-gray-400" data-v-ee46e60c>Loading series details...</p></div>`);
        } else if (unref(seriesDetails)) {
          _push(`<div data-v-ee46e60c><div class="mb-4" data-v-ee46e60c><h3 class="text-lg font-semibold text-white mb-2" data-v-ee46e60c>Overview</h3><p class="text-sm text-gray-300 leading-relaxed" data-v-ee46e60c>${ssrInterpolate(unref(seriesDetails).overview)}</p></div>`);
          if (unref(seriesDetails).genres?.length) {
            _push(`<div class="mb-4" data-v-ee46e60c><h3 class="text-lg font-semibold text-white mb-2" data-v-ee46e60c>Genres</h3><div class="flex flex-wrap gap-2" data-v-ee46e60c><!--[-->`);
            ssrRenderList(unref(seriesDetails).genres, (genre) => {
              _push(`<span class="px-2 py-1 text-xs rounded-full bg-primary-600/30 text-primary-200" data-v-ee46e60c>${ssrInterpolate(genre.name)}</span>`);
            });
            _push(`<!--]--></div></div>`);
          } else {
            _push(`<!---->`);
          }
          if (unref(availableSeasons).length > 0) {
            _push(`<div class="mb-4" data-v-ee46e60c><h3 class="text-lg font-semibold text-white mb-2" data-v-ee46e60c>Select Season</h3>`);
            _push(ssrRenderComponent(_component_USelectMenu, {
              modelValue: unref(selectedSeason),
              "onUpdate:modelValue": ($event) => isRef(selectedSeason) ? selectedSeason.value = $event : null,
              items: unref(seasonItems),
              "value-key": "value",
              "label-key": "label",
              placeholder: "Choose a season...",
              class: "w-full"
            }, null, _parent));
            _push(`</div>`);
          } else {
            _push(`<!---->`);
          }
          if (unref(selectedSeason) && unref(episodes).length > 0) {
            _push(`<div class="mb-4" data-v-ee46e60c><h3 class="text-lg font-semibold text-white mb-2" data-v-ee46e60c>Episodes</h3><div class="space-y-2" data-v-ee46e60c><!--[-->`);
            ssrRenderList(unref(episodes), (episode) => {
              _push(`<div class="episode-item p-3 rounded-lg cursor-pointer transition-all duration-200 bg-gray-700/30 hover:bg-gray-700/50 border border-transparent hover:border-primary-500" data-v-ee46e60c><div class="flex items-start gap-3" data-v-ee46e60c>`);
              if (episode.screenshot_uri) {
                _push(`<div class="w-20 h-12 rounded overflow-hidden bg-gray-600 shrink-0" data-v-ee46e60c><img${ssrRenderAttr("src", episode.screenshot_uri)}${ssrRenderAttr("alt", episode.name)} class="w-full h-full object-cover" onerror="this.onerror=null; this.src=&#39;https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg&#39;" data-v-ee46e60c></div>`);
              } else {
                _push(`<!---->`);
              }
              _push(`<div class="flex-1 min-w-0" data-v-ee46e60c><div class="flex items-center gap-2 mb-1" data-v-ee46e60c><span class="text-xs font-semibold text-primary-400" data-v-ee46e60c> E${ssrInterpolate(episode.episode_num || episode.episode)}</span><h4 class="text-sm font-semibold text-white truncate" data-v-ee46e60c>${ssrInterpolate(episode.name)}</h4></div>`);
              if (episode.description) {
                _push(`<p class="text-xs text-gray-400 line-clamp-2" data-v-ee46e60c>${ssrInterpolate(episode.description)}</p>`);
              } else {
                _push(`<!---->`);
              }
              if (episode.air_date) {
                _push(`<p class="text-xs text-gray-500 mt-1" data-v-ee46e60c>${ssrInterpolate(new Date(episode.air_date).toLocaleDateString())}</p>`);
              } else {
                _push(`<!---->`);
              }
              _push(`</div>`);
              _push(ssrRenderComponent(_component_Icon, {
                name: "i-lucide-play-circle",
                class: "w-5 h-5 text-primary-400 shrink-0"
              }, null, _parent));
              _push(`</div></div>`);
            });
            _push(`<!--]--></div></div>`);
          } else {
            _push(`<!---->`);
          }
          if (unref(selectedSeason) && unref(episodes).length === 0) {
            _push(`<div class="text-center py-8 text-gray-400" data-v-ee46e60c>`);
            _push(ssrRenderComponent(_component_Icon, {
              name: "i-lucide-tv",
              class: "w-8 h-8 mx-auto mb-2 opacity-50"
            }, null, _parent));
            _push(`<p data-v-ee46e60c>No episodes available for this season</p></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        } else if (unref(seriesDetailsError)) {
          _push(`<div class="text-center py-8 text-gray-400" data-v-ee46e60c>`);
          _push(ssrRenderComponent(_component_Icon, {
            name: "i-lucide-alert-circle",
            class: "w-8 h-8 mx-auto mb-2 opacity-50"
          }, null, _parent));
          _push(`<p data-v-ee46e60c>${ssrInterpolate(unref(seriesDetailsError))}</p></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/SeriesSidebar.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_9 = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$2, [["__scopeId", "data-v-ee46e60c"]]), { __name: "SeriesSidebar" });
const useMovieDetails = (selectedTab) => {
  const stalker = useStalkerStore();
  const movieDetails = ref(null);
  const loadingMovieDetails = ref(false);
  const movieDetailsError = ref(null);
  const trailerVideo = computed(() => {
    if (!movieDetails.value?.videos?.results) return null;
    return movieDetails.value.videos.results.find(
      (video) => video.type === "Trailer" && video.site === "YouTube"
    ) || movieDetails.value.videos.results[0];
  });
  async function fetchMovieDetails(movie) {
    if (!movie) {
      movieDetails.value = null;
      return;
    }
    let tmdbId = movie.tmdb_id || movie.tmdbId || movie.tmdb || movie.id;
    if (!tmdbId && movie.name) {
      try {
        loadingMovieDetails.value = true;
        movieDetailsError.value = null;
        const searchResults = await $fetch("/api/tmdb/search", {
          method: "POST",
          body: {
            query: movie.name,
            year: movie.year || void 0
          }
        });
        if (searchResults.results && searchResults.results.length > 0) {
          tmdbId = searchResults.results[0].id;
        }
      } catch (err) {
        console.error("Error searching TMDB:", err);
      }
    }
    if (tmdbId) {
      try {
        loadingMovieDetails.value = true;
        movieDetailsError.value = null;
        const details = await $fetch(`/api/tmdb/movie`, {
          query: { tmdbId }
        });
        movieDetails.value = details;
      } catch (err) {
        console.error("Error fetching movie details:", err);
        movieDetailsError.value = err.message || "Failed to load movie details";
        movieDetails.value = null;
      } finally {
        loadingMovieDetails.value = false;
      }
    } else {
      movieDetails.value = null;
      movieDetailsError.value = "TMDB ID not found for this movie";
      loadingMovieDetails.value = false;
    }
  }
  watch(
    () => [stalker.currentMovie, selectedTab.value],
    ([newMovie, tab]) => {
      if (tab === "movies" && newMovie) {
        fetchMovieDetails(newMovie);
      } else {
        movieDetails.value = null;
        movieDetailsError.value = null;
      }
    },
    { immediate: true }
  );
  return {
    movieDetails,
    loadingMovieDetails,
    movieDetailsError,
    trailerVideo,
    fetchMovieDetails
  };
};
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "MovieSidebar",
  __ssrInlineRender: true,
  props: {
    selectedTab: {}
  },
  setup(__props) {
    const stalker = useStalkerStore();
    const props = __props;
    const selectedTabRef = computed(() => props.selectedTab);
    const { movieDetails, loadingMovieDetails, movieDetailsError, trailerVideo } = useMovieDetails(selectedTabRef);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Icon = __nuxt_component_0$1;
      const _component_UButton = _sfc_main$9;
      if (unref(stalker).currentMovie) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "movie-sidebar w-96 bg-gray-800/95 dark:bg-gray-900/95 border-l border-gray-700 flex flex-col overflow-hidden" }, _attrs))} data-v-dd1da8f4>`);
        if (unref(movieDetails)) {
          _push(`<div class="movie-header relative h-64 overflow-hidden" data-v-dd1da8f4>`);
          if (unref(movieDetails).backdrop_path) {
            _push(`<img${ssrRenderAttr("src", `https://image.tmdb.org/t/p/w1280${unref(movieDetails).backdrop_path}`)}${ssrRenderAttr("alt", unref(movieDetails).title)} class="absolute inset-0 w-full h-full object-cover" data-v-dd1da8f4>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<div class="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent" data-v-dd1da8f4></div><div class="relative z-10 p-4 h-full flex flex-col justify-end" data-v-dd1da8f4><h2 class="text-2xl font-bold text-white mb-2" data-v-dd1da8f4>${ssrInterpolate(unref(movieDetails).title)}</h2><div class="flex items-center gap-3 text-sm text-gray-300" data-v-dd1da8f4>`);
          if (unref(movieDetails).release_date) {
            _push(`<span data-v-dd1da8f4>${ssrInterpolate(new Date(unref(movieDetails).release_date).getFullYear())}</span>`);
          } else {
            _push(`<!---->`);
          }
          if (unref(movieDetails).runtime) {
            _push(`<span data-v-dd1da8f4>${ssrInterpolate(Math.floor(unref(movieDetails).runtime / 60))}h ${ssrInterpolate(unref(movieDetails).runtime % 60)}m </span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<div class="flex items-center gap-1" data-v-dd1da8f4>`);
          _push(ssrRenderComponent(_component_Icon, {
            name: "i-lucide-star",
            class: "w-4 h-4 text-yellow-400"
          }, null, _parent));
          _push(`<span data-v-dd1da8f4>${ssrInterpolate(unref(movieDetails).vote_average?.toFixed(1))}</span></div></div></div>`);
          _push(ssrRenderComponent(_component_UButton, {
            icon: "i-lucide-x",
            color: "gray",
            variant: "ghost",
            size: "sm",
            class: "absolute top-2 right-2 z-20",
            onClick: ($event) => unref(stalker).modalOpen = false
          }, null, _parent));
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="movie-content flex-1 overflow-y-auto p-4" data-v-dd1da8f4>`);
        if (unref(loadingMovieDetails)) {
          _push(`<div class="text-center py-8" data-v-dd1da8f4>`);
          _push(ssrRenderComponent(_component_Icon, {
            name: "i-lucide-loader-2",
            class: "w-8 h-8 mx-auto mb-2 animate-spin text-primary-400"
          }, null, _parent));
          _push(`<p class="text-gray-400" data-v-dd1da8f4>Loading movie details...</p></div>`);
        } else if (unref(movieDetails)) {
          _push(`<div data-v-dd1da8f4><div class="mb-4" data-v-dd1da8f4><h3 class="text-lg font-semibold text-white mb-2" data-v-dd1da8f4>Overview</h3><p class="text-sm text-gray-300 leading-relaxed" data-v-dd1da8f4>${ssrInterpolate(unref(movieDetails).overview)}</p></div>`);
          if (unref(movieDetails).genres?.length) {
            _push(`<div class="mb-4" data-v-dd1da8f4><h3 class="text-lg font-semibold text-white mb-2" data-v-dd1da8f4>Genres</h3><div class="flex flex-wrap gap-2" data-v-dd1da8f4><!--[-->`);
            ssrRenderList(unref(movieDetails).genres, (genre) => {
              _push(`<span class="px-2 py-1 text-xs rounded-full bg-primary-600/30 text-primary-200" data-v-dd1da8f4>${ssrInterpolate(genre.name)}</span>`);
            });
            _push(`<!--]--></div></div>`);
          } else {
            _push(`<!---->`);
          }
          if (unref(movieDetails).credits?.cast?.length) {
            _push(`<div class="mb-4" data-v-dd1da8f4><h3 class="text-lg font-semibold text-white mb-2" data-v-dd1da8f4>Cast</h3><div class="space-y-2" data-v-dd1da8f4><!--[-->`);
            ssrRenderList(unref(movieDetails).credits.cast.slice(0, 10), (actor) => {
              _push(`<div class="flex items-center gap-3 p-2 rounded-lg bg-gray-700/30 hover:bg-gray-700/50 transition-colors" data-v-dd1da8f4>`);
              if (actor.profile_path) {
                _push(`<img${ssrRenderAttr("src", `https://image.tmdb.org/t/p/w92${actor.profile_path}`)}${ssrRenderAttr("alt", actor.name)} class="w-12 h-12 rounded-full object-cover" data-v-dd1da8f4>`);
              } else {
                _push(`<!---->`);
              }
              _push(`<div class="flex-1 min-w-0" data-v-dd1da8f4><p class="text-sm font-semibold text-white truncate" data-v-dd1da8f4>${ssrInterpolate(actor.name)}</p><p class="text-xs text-gray-400 truncate" data-v-dd1da8f4>${ssrInterpolate(actor.character)}</p></div></div>`);
            });
            _push(`<!--]--></div></div>`);
          } else {
            _push(`<!---->`);
          }
          if (unref(trailerVideo)) {
            _push(`<div class="mb-4" data-v-dd1da8f4><h3 class="text-lg font-semibold text-white mb-2" data-v-dd1da8f4>Trailer</h3><div class="relative aspect-video rounded-lg overflow-hidden bg-gray-800" data-v-dd1da8f4><iframe${ssrRenderAttr("src", `https://www.youtube.com/embed/${unref(trailerVideo).key}`)} class="absolute inset-0 w-full h-full" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen data-v-dd1da8f4></iframe></div></div>`);
          } else {
            _push(`<!---->`);
          }
          if (unref(movieDetails).production_companies?.length) {
            _push(`<div class="mb-4" data-v-dd1da8f4><h3 class="text-lg font-semibold text-white mb-2" data-v-dd1da8f4>Production</h3><div class="flex flex-wrap gap-3" data-v-dd1da8f4><!--[-->`);
            ssrRenderList(unref(movieDetails).production_companies.slice(0, 5), (company) => {
              _push(`<div class="flex items-center gap-2" data-v-dd1da8f4>`);
              if (company.logo_path) {
                _push(`<img${ssrRenderAttr("src", `https://image.tmdb.org/t/p/w92${company.logo_path}`)}${ssrRenderAttr("alt", company.name)} class="h-8 object-contain bg-white rounded p-1" data-v-dd1da8f4>`);
              } else {
                _push(`<!---->`);
              }
              _push(`<span class="text-xs text-gray-400" data-v-dd1da8f4>${ssrInterpolate(company.name)}</span></div>`);
            });
            _push(`<!--]--></div></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        } else if (unref(movieDetailsError)) {
          _push(`<div class="text-center py-8 text-gray-400" data-v-dd1da8f4>`);
          _push(ssrRenderComponent(_component_Icon, {
            name: "i-lucide-alert-circle",
            class: "w-8 h-8 mx-auto mb-2 opacity-50"
          }, null, _parent));
          _push(`<p data-v-dd1da8f4>${ssrInterpolate(unref(movieDetailsError))}</p></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/MovieSidebar.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_10 = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$1, [["__scopeId", "data-v-dd1da8f4"]]), { __name: "MovieSidebar" });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "dashboard",
  __ssrInlineRender: true,
  setup(__props) {
    const stalker = useStalkerStore();
    const selectedTab = ref("live-tv");
    const selectedCategory = ref(null);
    ref(null);
    const search = ref("");
    const filteredLiveCategories = computed(() => {
      if (!stalker.liveCategories || !Array.isArray(stalker.liveCategories)) {
        return [];
      }
      if (!search.value.trim()) {
        return stalker.liveCategories;
      }
      const searchTerm = search.value.toLowerCase().trim();
      return stalker.liveCategories.filter(
        (category) => category.title?.toLowerCase().includes(searchTerm)
      );
    });
    const filteredMoviesCategories = computed(() => {
      if (!stalker.moviesCategories || !Array.isArray(stalker.moviesCategories)) {
        return [];
      }
      if (!search.value.trim()) {
        return stalker.moviesCategories;
      }
      const searchTerm = search.value.toLowerCase().trim();
      return stalker.moviesCategories.filter(
        (category) => category.title?.toLowerCase().includes(searchTerm)
      );
    });
    const filteredSeriesCategories = computed(() => {
      if (!stalker.seriesCategories || !Array.isArray(stalker.seriesCategories)) {
        return [];
      }
      if (!search.value.trim()) {
        return stalker.seriesCategories;
      }
      const searchTerm = search.value.toLowerCase().trim();
      return stalker.seriesCategories.filter(
        (category) => category.title?.toLowerCase().includes(searchTerm)
      );
    });
    watch(
      () => stalker.selectedCategory,
      () => {
        if (stalker.modalOpen) {
          stalker.currentChannel = null;
        }
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
      const _component_UInput = _sfc_main$6;
      const _component_Icon = __nuxt_component_0$1;
      const _component_UProgress = _sfc_main$8;
      const _component_Live = __nuxt_component_2;
      const _component_Movies = __nuxt_component_3;
      const _component_Series = __nuxt_component_4;
      const _component_UModal = _sfc_main$7;
      const _component_VideoPlayer = __nuxt_component_7;
      const _component_ChannelsSidebar = __nuxt_component_8;
      const _component_SeriesSidebar = __nuxt_component_9;
      const _component_MovieSidebar = __nuxt_component_10;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex flex-row h-screen" }, _attrs))} data-v-ff3c17bb><div class="sidebar gap-4 border-r border-gray-500 border-solid w-[20%] flex flex-col h-full" data-v-ff3c17bb><div class="sidebar-header mt-3 flex items-center align-middle justify-center" data-v-ff3c17bb><h1 class="text-2xl text-center font-bold text-white-800 text-shadow-black text-shadow-2xs" data-v-ff3c17bb> STREAMFLIX </h1></div><div class="sidecats h-full overflow-auto" data-v-ff3c17bb><div class="search-container w-full px-2 pt-2" data-v-ff3c17bb>`);
      _push(ssrRenderComponent(_component_UInput, {
        modelValue: unref(search),
        "onUpdate:modelValue": ($event) => isRef(search) ? search.value = $event : null,
        placeholder: "Search categories...",
        icon: "i-lucide-search",
        size: "sm",
        class: "mb-2",
        clearable: ""
      }, null, _parent));
      _push(`</div><div class="categories-list px-2" data-v-ff3c17bb>`);
      if (unref(selectedTab) === "live-tv") {
        _push(`<div data-v-ff3c17bb><!--[-->`);
        ssrRenderList(unref(filteredLiveCategories), (category) => {
          _push(`<div class="${ssrRenderClass([{
            "bg-primary-200 dark:bg-primary-800 border-2 border-primary-500": unref(stalker).selectedCategory?.id === category.id
          }, "p-2 mb-2 text-sm rounded-md bg-gray-100 dark:bg-gray-800 cursor-pointer hover:bg-gray-200 dark:hover:bg-primary-700 transition-colors"])}" data-v-ff3c17bb><span data-v-ff3c17bb>${ssrInterpolate(category.title)}</span></div>`);
        });
        _push(`<!--]-->`);
        if (unref(filteredLiveCategories).length === 0 && unref(search)) {
          _push(`<div class="text-center py-4 text-gray-400 text-sm" data-v-ff3c17bb>`);
          _push(ssrRenderComponent(_component_Icon, {
            name: "i-lucide-search-x",
            class: "w-8 h-8 mx-auto mb-2 opacity-50"
          }, null, _parent));
          _push(`<p data-v-ff3c17bb>No categories found</p></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(selectedTab) === "movies") {
        _push(`<div data-v-ff3c17bb><!--[-->`);
        ssrRenderList(unref(filteredMoviesCategories), (category) => {
          _push(`<div class="${ssrRenderClass([{
            "bg-primary-200 dark:bg-primary-800 border-2 border-primary-500": unref(stalker).selectedCategory?.id === category.id
          }, "p-2 mb-2 text-sm rounded-md bg-gray-100 dark:bg-gray-800 cursor-pointer hover:bg-gray-200 dark:hover:bg-primary-700 transition-colors"])}" data-v-ff3c17bb><span data-v-ff3c17bb>${ssrInterpolate(category.title)}</span></div>`);
        });
        _push(`<!--]-->`);
        if (unref(filteredMoviesCategories).length === 0 && unref(search)) {
          _push(`<div class="text-center py-4 text-gray-400 text-sm" data-v-ff3c17bb>`);
          _push(ssrRenderComponent(_component_Icon, {
            name: "i-lucide-search-x",
            class: "w-8 h-8 mx-auto mb-2 opacity-50"
          }, null, _parent));
          _push(`<p data-v-ff3c17bb>No categories found</p></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(selectedTab) === "series") {
        _push(`<div data-v-ff3c17bb><!--[-->`);
        ssrRenderList(unref(filteredSeriesCategories), (category) => {
          _push(`<div class="${ssrRenderClass([{
            "bg-primary-200 dark:bg-primary-800 border-2 border-primary-500": unref(stalker).selectedCategory?.id === category.id
          }, "p-2 mb-2 text-sm rounded-md bg-gray-100 dark:bg-gray-800 cursor-pointer hover:bg-gray-200 dark:hover:bg-primary-700 transition-colors"])}" data-v-ff3c17bb><span data-v-ff3c17bb>${ssrInterpolate(category.title)}</span></div>`);
        });
        _push(`<!--]-->`);
        if (unref(filteredSeriesCategories).length === 0 && unref(search)) {
          _push(`<div class="text-center py-4 text-gray-400 text-sm" data-v-ff3c17bb>`);
          _push(ssrRenderComponent(_component_Icon, {
            name: "i-lucide-search-x",
            class: "w-8 h-8 mx-auto mb-2 opacity-50"
          }, null, _parent));
          _push(`<p data-v-ff3c17bb>No categories found</p></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div><div class="sidenav mb-2 flex flex-row w-full justify-around" data-v-ff3c17bb><button class="flex flex-col items-center gap-1 cursor-pointer" data-v-ff3c17bb>`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "lucide:tv",
        class: ["w-6 h-6", { "text-primary": unref(selectedTab) === "live-tv" }],
        "aria-hidden": "true"
      }, null, _parent));
      _push(`<span class="${ssrRenderClass([{ "text-primary": unref(selectedTab) === "live-tv" }, "text-xs"])}" data-v-ff3c17bb> Live TV </span></button><button class="flex flex-col items-center gap-1 cursor-pointer" data-v-ff3c17bb>`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "lucide:film",
        class: ["w-6 h-6", { "text-primary": unref(selectedTab) === "movies" }],
        "aria-hidden": "true"
      }, null, _parent));
      _push(`<span class="${ssrRenderClass([{ "text-primary": unref(selectedTab) === "movies" }, "text-xs"])}" data-v-ff3c17bb> Movies </span></button><button class="flex flex-col items-center gap-1 cursor-pointer" data-v-ff3c17bb>`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "lucide:monitor-play",
        class: ["w-6 h-6", { "text-primary": unref(selectedTab) === "series" }],
        "aria-hidden": "true"
      }, null, _parent));
      _push(`<span class="${ssrRenderClass([{ "text-primary": unref(selectedTab) === "series" }, "text-xs"])}" data-v-ff3c17bb> Series </span></button></div></div><div class="maincontent w-full h-screen overflow-auto p-10" data-v-ff3c17bb>`);
      if (unref(stalker).progress > 0 && unref(stalker).progress < 100) {
        _push(ssrRenderComponent(_component_UProgress, {
          modelValue: unref(stalker).progress,
          "onUpdate:modelValue": ($event) => unref(stalker).progress = $event
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      if (unref(selectedTab) == "live-tv") {
        _push(`<div data-v-ff3c17bb>`);
        _push(ssrRenderComponent(_component_Live, null, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(selectedTab) == "movies") {
        _push(`<div data-v-ff3c17bb>`);
        _push(ssrRenderComponent(_component_Movies, null, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(selectedTab) == "series") {
        _push(`<div data-v-ff3c17bb>`);
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
            _push2(`<div class="modal-container flex flex-row h-full w-full bg-gray-900 dark:bg-gray-950" data-v-ff3c17bb${_scopeId}>`);
            _push2(ssrRenderComponent(_component_VideoPlayer, null, null, _parent2, _scopeId));
            if (unref(selectedTab) === "live-tv") {
              _push2(ssrRenderComponent(_component_ChannelsSidebar, null, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            if (unref(selectedTab) === "series") {
              _push2(ssrRenderComponent(_component_SeriesSidebar, { "selected-tab": unref(selectedTab) }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            if (unref(selectedTab) === "movies") {
              _push2(ssrRenderComponent(_component_MovieSidebar, { "selected-tab": unref(selectedTab) }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "modal-container flex flex-row h-full w-full bg-gray-900 dark:bg-gray-950" }, [
                createVNode(_component_VideoPlayer),
                unref(selectedTab) === "live-tv" ? (openBlock(), createBlock(_component_ChannelsSidebar, { key: 0 })) : createCommentVNode("", true),
                unref(selectedTab) === "series" ? (openBlock(), createBlock(_component_SeriesSidebar, {
                  key: 1,
                  "selected-tab": unref(selectedTab)
                }, null, 8, ["selected-tab"])) : createCommentVNode("", true),
                unref(selectedTab) === "movies" ? (openBlock(), createBlock(_component_MovieSidebar, {
                  key: 2,
                  "selected-tab": unref(selectedTab)
                }, null, 8, ["selected-tab"])) : createCommentVNode("", true)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const dashboard = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-ff3c17bb"]]);

export { dashboard as default };
//# sourceMappingURL=dashboard-YopleOmW.mjs.map
