import { _ as _sfc_main$1 } from './Container-Cb3Pb78c.mjs';
import { _ as _sfc_main$2 } from './Input-OdlgYHLB.mjs';
import { a as useToast, b as _sfc_main$9, n as navigateTo } from './server.mjs';
import { defineComponent, useSSRContext, ref, mergeProps, withCtx, unref, isRef, createTextVNode, createVNode } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
import { u as useStalkerStore } from './stalker-F4Itg4Zv.mjs';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';
import 'reka-ui';
import '@vueuse/core';
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
import 'tailwind-variants';
import '@iconify/utils/lib/css/icon';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const stalker = useStalkerStore();
    const portal = ref("http://globaltv1.net:8080/c");
    const mac = ref("00:1A:79:14:DF:0A");
    const toast = useToast();
    async function checkMac() {
      let valid = await stalker.makeHandshake(portal.value, mac.value);
      if (valid?.success) {
        toast.add({
          title: "Crendtials are valid!",
          description: "Logging you in now"
        });
        await stalker.getAllInfo();
        navigateTo("/dashboard");
      } else {
        toast.add({
          title: "Crendtials are failed!",
          description: "Logging you failed please try different credentials"
        });
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UContainer = _sfc_main$1;
      const _component_UInput = _sfc_main$2;
      const _component_UButton = _sfc_main$9;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex flex-row h-screen justify-center items-center" }, _attrs))} data-v-56b5abef>`);
      _push(ssrRenderComponent(_component_UContainer, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex flex-col m-auto max-w-1/2 gap-4" data-v-56b5abef${_scopeId}><h1 class="text-2xl text-center font-bold text-red-800 text-shadow-black text-shadow-2xs" data-v-56b5abef${_scopeId}> STREAMFLIX LOGIN </h1>`);
            _push2(ssrRenderComponent(_component_UInput, {
              size: "xl",
              placeholder: "Enter your stalker portal url",
              modelValue: unref(portal),
              "onUpdate:modelValue": ($event) => isRef(portal) ? portal.value = $event : null
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UInput, {
              size: "xl",
              placeholder: "Enter your mac address",
              modelValue: unref(mac),
              "onUpdate:modelValue": ($event) => isRef(mac) ? mac.value = $event : null
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UButton, {
              leadingIcon: "i-lucide-rocket",
              size: "xl",
              color: "primary",
              activeColor: "success",
              variant: "solid",
              autofocus: "",
              "loading-auto": "",
              onClick: checkMac
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Sign in to portal`);
                } else {
                  return [
                    createTextVNode("Sign in to portal")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "flex flex-col m-auto max-w-1/2 gap-4" }, [
                createVNode("h1", { class: "text-2xl text-center font-bold text-red-800 text-shadow-black text-shadow-2xs" }, " STREAMFLIX LOGIN "),
                createVNode(_component_UInput, {
                  size: "xl",
                  placeholder: "Enter your stalker portal url",
                  modelValue: unref(portal),
                  "onUpdate:modelValue": ($event) => isRef(portal) ? portal.value = $event : null
                }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                createVNode(_component_UInput, {
                  size: "xl",
                  placeholder: "Enter your mac address",
                  modelValue: unref(mac),
                  "onUpdate:modelValue": ($event) => isRef(mac) ? mac.value = $event : null
                }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                createVNode(_component_UButton, {
                  leadingIcon: "i-lucide-rocket",
                  size: "xl",
                  color: "primary",
                  activeColor: "success",
                  variant: "solid",
                  autofocus: "",
                  "loading-auto": "",
                  onClick: checkMac
                }, {
                  default: withCtx(() => [
                    createTextVNode("Sign in to portal")
                  ]),
                  _: 1
                })
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-56b5abef"]]);

export { index as default };
//# sourceMappingURL=index-CjpFXmly.mjs.map
