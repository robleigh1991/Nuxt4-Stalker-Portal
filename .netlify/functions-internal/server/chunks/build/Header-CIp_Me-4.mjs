import { defineComponent, ref, withCtx, unref, isRef, createTextVNode, createVNode, mergeModels, useSlots, useModel, computed, watch, toRef, mergeProps, renderSlot, createBlock, createCommentVNode, openBlock, toDisplayString, resolveDynamicComponent, toHandlers, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderSlot, ssrRenderClass, ssrInterpolate, ssrRenderVNode, ssrRenderAttrs } from 'vue/server-renderer';
import { Primitive, useForwardProps, useForwardPropsEmits, VisuallyHidden, DialogRoot, DialogTrigger, DialogPortal, DialogOverlay, DialogContent, DialogTitle, DialogDescription, DialogClose } from 'reka-ui';
import { o as defu } from '../_/nitro.mjs';
import { createReusableTemplate, reactiveOmit, reactivePick } from '@vueuse/core';
import { b as _sfc_main$9, _ as __nuxt_component_0$2, v as useRoute, d as useLocale, e as useAppConfig, w as getSlotChildrenText, t as tv, x as _sfc_main$a, m as _sfc_main$f, f as usePortal, y as useState } from './server.mjs';
import { _ as _sfc_main$8 } from './Container-Cb3Pb78c.mjs';
import { _ as _sfc_main$7 } from './Modal-BloHIZZn.mjs';
import { DrawerRootNested, DrawerRoot, DrawerTrigger, DrawerPortal, DrawerOverlay, DrawerContent, DrawerHandle, DrawerTitle, DrawerDescription } from 'vaul-vue';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';
import { _ as _sfc_main$6 } from './Input-OdlgYHLB.mjs';
import { u as useStalkerStore } from './stalker-F4Itg4Zv.mjs';

const theme$2 = {
  "slots": {
    "overlay": "fixed inset-0 bg-elevated/75",
    "content": "fixed bg-default divide-y divide-default sm:ring ring-default sm:shadow-lg flex flex-col focus:outline-none",
    "header": "flex items-center gap-1.5 p-4 sm:px-6 min-h-16",
    "wrapper": "",
    "body": "flex-1 overflow-y-auto p-4 sm:p-6",
    "footer": "flex items-center gap-1.5 p-4 sm:px-6",
    "title": "text-highlighted font-semibold",
    "description": "mt-1 text-muted text-sm",
    "close": "absolute top-4 end-4"
  },
  "variants": {
    "side": {
      "top": {
        "content": ""
      },
      "right": {
        "content": "max-w-md"
      },
      "bottom": {
        "content": ""
      },
      "left": {
        "content": "max-w-md"
      }
    },
    "inset": {
      "true": {
        "content": "rounded-lg"
      }
    },
    "transition": {
      "true": {
        "overlay": "data-[state=open]:animate-[fade-in_200ms_ease-out] data-[state=closed]:animate-[fade-out_200ms_ease-in]"
      }
    }
  },
  "compoundVariants": [
    {
      "side": "top",
      "inset": true,
      "class": {
        "content": "max-h-[calc(100%-2rem)] inset-x-4 top-4"
      }
    },
    {
      "side": "top",
      "inset": false,
      "class": {
        "content": "max-h-full inset-x-0 top-0"
      }
    },
    {
      "side": "right",
      "inset": true,
      "class": {
        "content": "w-[calc(100%-2rem)] inset-y-4 right-4"
      }
    },
    {
      "side": "right",
      "inset": false,
      "class": {
        "content": "w-full inset-y-0 right-0"
      }
    },
    {
      "side": "bottom",
      "inset": true,
      "class": {
        "content": "max-h-[calc(100%-2rem)] inset-x-4 bottom-4"
      }
    },
    {
      "side": "bottom",
      "inset": false,
      "class": {
        "content": "max-h-full inset-x-0 bottom-0"
      }
    },
    {
      "side": "left",
      "inset": true,
      "class": {
        "content": "w-[calc(100%-2rem)] inset-y-4 left-4"
      }
    },
    {
      "side": "left",
      "inset": false,
      "class": {
        "content": "w-full inset-y-0 left-0"
      }
    },
    {
      "transition": true,
      "side": "top",
      "class": {
        "content": "data-[state=open]:animate-[slide-in-from-top_200ms_ease-in-out] data-[state=closed]:animate-[slide-out-to-top_200ms_ease-in-out]"
      }
    },
    {
      "transition": true,
      "side": "right",
      "class": {
        "content": "data-[state=open]:animate-[slide-in-from-right_200ms_ease-in-out] data-[state=closed]:animate-[slide-out-to-right_200ms_ease-in-out]"
      }
    },
    {
      "transition": true,
      "side": "bottom",
      "class": {
        "content": "data-[state=open]:animate-[slide-in-from-bottom_200ms_ease-in-out] data-[state=closed]:animate-[slide-out-to-bottom_200ms_ease-in-out]"
      }
    },
    {
      "transition": true,
      "side": "left",
      "class": {
        "content": "data-[state=open]:animate-[slide-in-from-left_200ms_ease-in-out] data-[state=closed]:animate-[slide-out-to-left_200ms_ease-in-out]"
      }
    }
  ]
};
const _sfc_main$5 = {
  __name: "USlideover",
  __ssrInlineRender: true,
  props: {
    title: { type: String, required: false },
    description: { type: String, required: false },
    content: { type: Object, required: false },
    overlay: { type: Boolean, required: false, default: true },
    transition: { type: Boolean, required: false, default: true },
    side: { type: null, required: false, default: "right" },
    inset: { type: Boolean, required: false },
    portal: { type: [Boolean, String], required: false, skipCheck: true, default: true },
    close: { type: [Boolean, Object], required: false, default: true },
    closeIcon: { type: null, required: false },
    dismissible: { type: Boolean, required: false, default: true },
    class: { type: null, required: false },
    ui: { type: null, required: false },
    open: { type: Boolean, required: false },
    defaultOpen: { type: Boolean, required: false },
    modal: { type: Boolean, required: false, default: true }
  },
  emits: ["after:leave", "after:enter", "close:prevent", "update:open"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const slots = useSlots();
    const { t } = useLocale();
    const appConfig = useAppConfig();
    const rootProps = useForwardPropsEmits(reactivePick(props, "open", "defaultOpen", "modal"), emits);
    const portalProps = usePortal(toRef(() => props.portal));
    const contentProps = toRef(() => props.content);
    const contentEvents = computed(() => {
      if (!props.dismissible) {
        const events = ["pointerDownOutside", "interactOutside", "escapeKeyDown"];
        return events.reduce((acc, curr) => {
          acc[curr] = (e) => {
            e.preventDefault();
            emits("close:prevent");
          };
          return acc;
        }, {});
      }
      return {};
    });
    const ui = computed(() => tv({ extend: tv(theme$2), ...appConfig.ui?.slideover || {} })({
      transition: props.transition,
      side: props.side,
      inset: props.inset
    }));
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(DialogRoot), mergeProps(unref(rootProps), _attrs), {
        default: withCtx(({ open, close }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (!!slots.default) {
              _push2(ssrRenderComponent(unref(DialogTrigger), {
                "as-child": "",
                class: props.class
              }, {
                default: withCtx((_, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    ssrRenderSlot(_ctx.$slots, "default", { open }, null, _push3, _parent3, _scopeId2);
                  } else {
                    return [
                      renderSlot(_ctx.$slots, "default", { open })
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(ssrRenderComponent(unref(DialogPortal), unref(portalProps), {
              default: withCtx((_, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  if (__props.overlay) {
                    _push3(ssrRenderComponent(unref(DialogOverlay), {
                      "data-slot": "overlay",
                      class: ui.value.overlay({ class: props.ui?.overlay })
                    }, null, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(ssrRenderComponent(unref(DialogContent), mergeProps({
                    "data-side": __props.side,
                    "data-slot": "content",
                    class: ui.value.content({ class: [!slots.default && props.class, props.ui?.content] })
                  }, contentProps.value, {
                    onAfterEnter: ($event) => emits("after:enter"),
                    onAfterLeave: ($event) => emits("after:leave")
                  }, toHandlers(contentEvents.value)), {
                    default: withCtx((_2, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        if (!!slots.content && (__props.title || !!slots.title || (__props.description || !!slots.description))) {
                          _push4(ssrRenderComponent(unref(VisuallyHidden), null, {
                            default: withCtx((_3, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                if (__props.title || !!slots.title) {
                                  _push5(ssrRenderComponent(unref(DialogTitle), null, {
                                    default: withCtx((_4, _push6, _parent6, _scopeId5) => {
                                      if (_push6) {
                                        ssrRenderSlot(_ctx.$slots, "title", {}, () => {
                                          _push6(`${ssrInterpolate(__props.title)}`);
                                        }, _push6, _parent6, _scopeId5);
                                      } else {
                                        return [
                                          renderSlot(_ctx.$slots, "title", {}, () => [
                                            createTextVNode(toDisplayString(__props.title), 1)
                                          ])
                                        ];
                                      }
                                    }),
                                    _: 2
                                  }, _parent5, _scopeId4));
                                } else {
                                  _push5(`<!---->`);
                                }
                                if (__props.description || !!slots.description) {
                                  _push5(ssrRenderComponent(unref(DialogDescription), null, {
                                    default: withCtx((_4, _push6, _parent6, _scopeId5) => {
                                      if (_push6) {
                                        ssrRenderSlot(_ctx.$slots, "description", {}, () => {
                                          _push6(`${ssrInterpolate(__props.description)}`);
                                        }, _push6, _parent6, _scopeId5);
                                      } else {
                                        return [
                                          renderSlot(_ctx.$slots, "description", {}, () => [
                                            createTextVNode(toDisplayString(__props.description), 1)
                                          ])
                                        ];
                                      }
                                    }),
                                    _: 2
                                  }, _parent5, _scopeId4));
                                } else {
                                  _push5(`<!---->`);
                                }
                              } else {
                                return [
                                  __props.title || !!slots.title ? (openBlock(), createBlock(unref(DialogTitle), { key: 0 }, {
                                    default: withCtx(() => [
                                      renderSlot(_ctx.$slots, "title", {}, () => [
                                        createTextVNode(toDisplayString(__props.title), 1)
                                      ])
                                    ]),
                                    _: 3
                                  })) : createCommentVNode("", true),
                                  __props.description || !!slots.description ? (openBlock(), createBlock(unref(DialogDescription), { key: 1 }, {
                                    default: withCtx(() => [
                                      renderSlot(_ctx.$slots, "description", {}, () => [
                                        createTextVNode(toDisplayString(__props.description), 1)
                                      ])
                                    ]),
                                    _: 3
                                  })) : createCommentVNode("", true)
                                ];
                              }
                            }),
                            _: 2
                          }, _parent4, _scopeId3));
                        } else {
                          _push4(`<!---->`);
                        }
                        ssrRenderSlot(_ctx.$slots, "content", { close }, () => {
                          if (!!slots.header || (__props.title || !!slots.title) || (__props.description || !!slots.description) || (props.close || !!slots.close)) {
                            _push4(`<div data-slot="header" class="${ssrRenderClass(ui.value.header({ class: props.ui?.header }))}"${_scopeId3}>`);
                            ssrRenderSlot(_ctx.$slots, "header", { close }, () => {
                              _push4(`<div data-slot="wrapper" class="${ssrRenderClass(ui.value.wrapper({ class: props.ui?.wrapper }))}"${_scopeId3}>`);
                              if (__props.title || !!slots.title) {
                                _push4(ssrRenderComponent(unref(DialogTitle), {
                                  "data-slot": "title",
                                  class: ui.value.title({ class: props.ui?.title })
                                }, {
                                  default: withCtx((_3, _push5, _parent5, _scopeId4) => {
                                    if (_push5) {
                                      ssrRenderSlot(_ctx.$slots, "title", {}, () => {
                                        _push5(`${ssrInterpolate(__props.title)}`);
                                      }, _push5, _parent5, _scopeId4);
                                    } else {
                                      return [
                                        renderSlot(_ctx.$slots, "title", {}, () => [
                                          createTextVNode(toDisplayString(__props.title), 1)
                                        ])
                                      ];
                                    }
                                  }),
                                  _: 2
                                }, _parent4, _scopeId3));
                              } else {
                                _push4(`<!---->`);
                              }
                              if (__props.description || !!slots.description) {
                                _push4(ssrRenderComponent(unref(DialogDescription), {
                                  "data-slot": "description",
                                  class: ui.value.description({ class: props.ui?.description })
                                }, {
                                  default: withCtx((_3, _push5, _parent5, _scopeId4) => {
                                    if (_push5) {
                                      ssrRenderSlot(_ctx.$slots, "description", {}, () => {
                                        _push5(`${ssrInterpolate(__props.description)}`);
                                      }, _push5, _parent5, _scopeId4);
                                    } else {
                                      return [
                                        renderSlot(_ctx.$slots, "description", {}, () => [
                                          createTextVNode(toDisplayString(__props.description), 1)
                                        ])
                                      ];
                                    }
                                  }),
                                  _: 2
                                }, _parent4, _scopeId3));
                              } else {
                                _push4(`<!---->`);
                              }
                              _push4(`</div>`);
                              ssrRenderSlot(_ctx.$slots, "actions", {}, null, _push4, _parent4, _scopeId3);
                              if (props.close || !!slots.close) {
                                _push4(ssrRenderComponent(unref(DialogClose), { "as-child": "" }, {
                                  default: withCtx((_3, _push5, _parent5, _scopeId4) => {
                                    if (_push5) {
                                      ssrRenderSlot(_ctx.$slots, "close", { ui: ui.value }, () => {
                                        if (props.close) {
                                          _push5(ssrRenderComponent(_sfc_main$9, mergeProps({
                                            icon: __props.closeIcon || unref(appConfig).ui.icons.close,
                                            color: "neutral",
                                            variant: "ghost",
                                            "aria-label": unref(t)("slideover.close")
                                          }, typeof props.close === "object" ? props.close : {}, {
                                            "data-slot": "close",
                                            class: ui.value.close({ class: props.ui?.close })
                                          }), null, _parent5, _scopeId4));
                                        } else {
                                          _push5(`<!---->`);
                                        }
                                      }, _push5, _parent5, _scopeId4);
                                    } else {
                                      return [
                                        renderSlot(_ctx.$slots, "close", { ui: ui.value }, () => [
                                          props.close ? (openBlock(), createBlock(_sfc_main$9, mergeProps({
                                            key: 0,
                                            icon: __props.closeIcon || unref(appConfig).ui.icons.close,
                                            color: "neutral",
                                            variant: "ghost",
                                            "aria-label": unref(t)("slideover.close")
                                          }, typeof props.close === "object" ? props.close : {}, {
                                            "data-slot": "close",
                                            class: ui.value.close({ class: props.ui?.close })
                                          }), null, 16, ["icon", "aria-label", "class"])) : createCommentVNode("", true)
                                        ])
                                      ];
                                    }
                                  }),
                                  _: 2
                                }, _parent4, _scopeId3));
                              } else {
                                _push4(`<!---->`);
                              }
                            }, _push4, _parent4, _scopeId3);
                            _push4(`</div>`);
                          } else {
                            _push4(`<!---->`);
                          }
                          _push4(`<div data-slot="body" class="${ssrRenderClass(ui.value.body({ class: props.ui?.body }))}"${_scopeId3}>`);
                          ssrRenderSlot(_ctx.$slots, "body", { close }, null, _push4, _parent4, _scopeId3);
                          _push4(`</div>`);
                          if (!!slots.footer) {
                            _push4(`<div data-slot="footer" class="${ssrRenderClass(ui.value.footer({ class: props.ui?.footer }))}"${_scopeId3}>`);
                            ssrRenderSlot(_ctx.$slots, "footer", { close }, null, _push4, _parent4, _scopeId3);
                            _push4(`</div>`);
                          } else {
                            _push4(`<!---->`);
                          }
                        }, _push4, _parent4, _scopeId3);
                      } else {
                        return [
                          !!slots.content && (__props.title || !!slots.title || (__props.description || !!slots.description)) ? (openBlock(), createBlock(unref(VisuallyHidden), { key: 0 }, {
                            default: withCtx(() => [
                              __props.title || !!slots.title ? (openBlock(), createBlock(unref(DialogTitle), { key: 0 }, {
                                default: withCtx(() => [
                                  renderSlot(_ctx.$slots, "title", {}, () => [
                                    createTextVNode(toDisplayString(__props.title), 1)
                                  ])
                                ]),
                                _: 3
                              })) : createCommentVNode("", true),
                              __props.description || !!slots.description ? (openBlock(), createBlock(unref(DialogDescription), { key: 1 }, {
                                default: withCtx(() => [
                                  renderSlot(_ctx.$slots, "description", {}, () => [
                                    createTextVNode(toDisplayString(__props.description), 1)
                                  ])
                                ]),
                                _: 3
                              })) : createCommentVNode("", true)
                            ]),
                            _: 3
                          })) : createCommentVNode("", true),
                          renderSlot(_ctx.$slots, "content", { close }, () => [
                            !!slots.header || (__props.title || !!slots.title) || (__props.description || !!slots.description) || (props.close || !!slots.close) ? (openBlock(), createBlock("div", {
                              key: 0,
                              "data-slot": "header",
                              class: ui.value.header({ class: props.ui?.header })
                            }, [
                              renderSlot(_ctx.$slots, "header", { close }, () => [
                                createVNode("div", {
                                  "data-slot": "wrapper",
                                  class: ui.value.wrapper({ class: props.ui?.wrapper })
                                }, [
                                  __props.title || !!slots.title ? (openBlock(), createBlock(unref(DialogTitle), {
                                    key: 0,
                                    "data-slot": "title",
                                    class: ui.value.title({ class: props.ui?.title })
                                  }, {
                                    default: withCtx(() => [
                                      renderSlot(_ctx.$slots, "title", {}, () => [
                                        createTextVNode(toDisplayString(__props.title), 1)
                                      ])
                                    ]),
                                    _: 3
                                  }, 8, ["class"])) : createCommentVNode("", true),
                                  __props.description || !!slots.description ? (openBlock(), createBlock(unref(DialogDescription), {
                                    key: 1,
                                    "data-slot": "description",
                                    class: ui.value.description({ class: props.ui?.description })
                                  }, {
                                    default: withCtx(() => [
                                      renderSlot(_ctx.$slots, "description", {}, () => [
                                        createTextVNode(toDisplayString(__props.description), 1)
                                      ])
                                    ]),
                                    _: 3
                                  }, 8, ["class"])) : createCommentVNode("", true)
                                ], 2),
                                renderSlot(_ctx.$slots, "actions"),
                                props.close || !!slots.close ? (openBlock(), createBlock(unref(DialogClose), {
                                  key: 0,
                                  "as-child": ""
                                }, {
                                  default: withCtx(() => [
                                    renderSlot(_ctx.$slots, "close", { ui: ui.value }, () => [
                                      props.close ? (openBlock(), createBlock(_sfc_main$9, mergeProps({
                                        key: 0,
                                        icon: __props.closeIcon || unref(appConfig).ui.icons.close,
                                        color: "neutral",
                                        variant: "ghost",
                                        "aria-label": unref(t)("slideover.close")
                                      }, typeof props.close === "object" ? props.close : {}, {
                                        "data-slot": "close",
                                        class: ui.value.close({ class: props.ui?.close })
                                      }), null, 16, ["icon", "aria-label", "class"])) : createCommentVNode("", true)
                                    ])
                                  ]),
                                  _: 2
                                }, 1024)) : createCommentVNode("", true)
                              ])
                            ], 2)) : createCommentVNode("", true),
                            createVNode("div", {
                              "data-slot": "body",
                              class: ui.value.body({ class: props.ui?.body })
                            }, [
                              renderSlot(_ctx.$slots, "body", { close })
                            ], 2),
                            !!slots.footer ? (openBlock(), createBlock("div", {
                              key: 1,
                              "data-slot": "footer",
                              class: ui.value.footer({ class: props.ui?.footer })
                            }, [
                              renderSlot(_ctx.$slots, "footer", { close })
                            ], 2)) : createCommentVNode("", true)
                          ])
                        ];
                      }
                    }),
                    _: 2
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    __props.overlay ? (openBlock(), createBlock(unref(DialogOverlay), {
                      key: 0,
                      "data-slot": "overlay",
                      class: ui.value.overlay({ class: props.ui?.overlay })
                    }, null, 8, ["class"])) : createCommentVNode("", true),
                    createVNode(unref(DialogContent), mergeProps({
                      "data-side": __props.side,
                      "data-slot": "content",
                      class: ui.value.content({ class: [!slots.default && props.class, props.ui?.content] })
                    }, contentProps.value, {
                      onAfterEnter: ($event) => emits("after:enter"),
                      onAfterLeave: ($event) => emits("after:leave")
                    }, toHandlers(contentEvents.value)), {
                      default: withCtx(() => [
                        !!slots.content && (__props.title || !!slots.title || (__props.description || !!slots.description)) ? (openBlock(), createBlock(unref(VisuallyHidden), { key: 0 }, {
                          default: withCtx(() => [
                            __props.title || !!slots.title ? (openBlock(), createBlock(unref(DialogTitle), { key: 0 }, {
                              default: withCtx(() => [
                                renderSlot(_ctx.$slots, "title", {}, () => [
                                  createTextVNode(toDisplayString(__props.title), 1)
                                ])
                              ]),
                              _: 3
                            })) : createCommentVNode("", true),
                            __props.description || !!slots.description ? (openBlock(), createBlock(unref(DialogDescription), { key: 1 }, {
                              default: withCtx(() => [
                                renderSlot(_ctx.$slots, "description", {}, () => [
                                  createTextVNode(toDisplayString(__props.description), 1)
                                ])
                              ]),
                              _: 3
                            })) : createCommentVNode("", true)
                          ]),
                          _: 3
                        })) : createCommentVNode("", true),
                        renderSlot(_ctx.$slots, "content", { close }, () => [
                          !!slots.header || (__props.title || !!slots.title) || (__props.description || !!slots.description) || (props.close || !!slots.close) ? (openBlock(), createBlock("div", {
                            key: 0,
                            "data-slot": "header",
                            class: ui.value.header({ class: props.ui?.header })
                          }, [
                            renderSlot(_ctx.$slots, "header", { close }, () => [
                              createVNode("div", {
                                "data-slot": "wrapper",
                                class: ui.value.wrapper({ class: props.ui?.wrapper })
                              }, [
                                __props.title || !!slots.title ? (openBlock(), createBlock(unref(DialogTitle), {
                                  key: 0,
                                  "data-slot": "title",
                                  class: ui.value.title({ class: props.ui?.title })
                                }, {
                                  default: withCtx(() => [
                                    renderSlot(_ctx.$slots, "title", {}, () => [
                                      createTextVNode(toDisplayString(__props.title), 1)
                                    ])
                                  ]),
                                  _: 3
                                }, 8, ["class"])) : createCommentVNode("", true),
                                __props.description || !!slots.description ? (openBlock(), createBlock(unref(DialogDescription), {
                                  key: 1,
                                  "data-slot": "description",
                                  class: ui.value.description({ class: props.ui?.description })
                                }, {
                                  default: withCtx(() => [
                                    renderSlot(_ctx.$slots, "description", {}, () => [
                                      createTextVNode(toDisplayString(__props.description), 1)
                                    ])
                                  ]),
                                  _: 3
                                }, 8, ["class"])) : createCommentVNode("", true)
                              ], 2),
                              renderSlot(_ctx.$slots, "actions"),
                              props.close || !!slots.close ? (openBlock(), createBlock(unref(DialogClose), {
                                key: 0,
                                "as-child": ""
                              }, {
                                default: withCtx(() => [
                                  renderSlot(_ctx.$slots, "close", { ui: ui.value }, () => [
                                    props.close ? (openBlock(), createBlock(_sfc_main$9, mergeProps({
                                      key: 0,
                                      icon: __props.closeIcon || unref(appConfig).ui.icons.close,
                                      color: "neutral",
                                      variant: "ghost",
                                      "aria-label": unref(t)("slideover.close")
                                    }, typeof props.close === "object" ? props.close : {}, {
                                      "data-slot": "close",
                                      class: ui.value.close({ class: props.ui?.close })
                                    }), null, 16, ["icon", "aria-label", "class"])) : createCommentVNode("", true)
                                  ])
                                ]),
                                _: 2
                              }, 1024)) : createCommentVNode("", true)
                            ])
                          ], 2)) : createCommentVNode("", true),
                          createVNode("div", {
                            "data-slot": "body",
                            class: ui.value.body({ class: props.ui?.body })
                          }, [
                            renderSlot(_ctx.$slots, "body", { close })
                          ], 2),
                          !!slots.footer ? (openBlock(), createBlock("div", {
                            key: 1,
                            "data-slot": "footer",
                            class: ui.value.footer({ class: props.ui?.footer })
                          }, [
                            renderSlot(_ctx.$slots, "footer", { close })
                          ], 2)) : createCommentVNode("", true)
                        ])
                      ]),
                      _: 2
                    }, 1040, ["data-side", "class", "onAfterEnter", "onAfterLeave"])
                  ];
                }
              }),
              _: 2
            }, _parent2, _scopeId));
          } else {
            return [
              !!slots.default ? (openBlock(), createBlock(unref(DialogTrigger), {
                key: 0,
                "as-child": "",
                class: props.class
              }, {
                default: withCtx(() => [
                  renderSlot(_ctx.$slots, "default", { open })
                ]),
                _: 2
              }, 1032, ["class"])) : createCommentVNode("", true),
              createVNode(unref(DialogPortal), unref(portalProps), {
                default: withCtx(() => [
                  __props.overlay ? (openBlock(), createBlock(unref(DialogOverlay), {
                    key: 0,
                    "data-slot": "overlay",
                    class: ui.value.overlay({ class: props.ui?.overlay })
                  }, null, 8, ["class"])) : createCommentVNode("", true),
                  createVNode(unref(DialogContent), mergeProps({
                    "data-side": __props.side,
                    "data-slot": "content",
                    class: ui.value.content({ class: [!slots.default && props.class, props.ui?.content] })
                  }, contentProps.value, {
                    onAfterEnter: ($event) => emits("after:enter"),
                    onAfterLeave: ($event) => emits("after:leave")
                  }, toHandlers(contentEvents.value)), {
                    default: withCtx(() => [
                      !!slots.content && (__props.title || !!slots.title || (__props.description || !!slots.description)) ? (openBlock(), createBlock(unref(VisuallyHidden), { key: 0 }, {
                        default: withCtx(() => [
                          __props.title || !!slots.title ? (openBlock(), createBlock(unref(DialogTitle), { key: 0 }, {
                            default: withCtx(() => [
                              renderSlot(_ctx.$slots, "title", {}, () => [
                                createTextVNode(toDisplayString(__props.title), 1)
                              ])
                            ]),
                            _: 3
                          })) : createCommentVNode("", true),
                          __props.description || !!slots.description ? (openBlock(), createBlock(unref(DialogDescription), { key: 1 }, {
                            default: withCtx(() => [
                              renderSlot(_ctx.$slots, "description", {}, () => [
                                createTextVNode(toDisplayString(__props.description), 1)
                              ])
                            ]),
                            _: 3
                          })) : createCommentVNode("", true)
                        ]),
                        _: 3
                      })) : createCommentVNode("", true),
                      renderSlot(_ctx.$slots, "content", { close }, () => [
                        !!slots.header || (__props.title || !!slots.title) || (__props.description || !!slots.description) || (props.close || !!slots.close) ? (openBlock(), createBlock("div", {
                          key: 0,
                          "data-slot": "header",
                          class: ui.value.header({ class: props.ui?.header })
                        }, [
                          renderSlot(_ctx.$slots, "header", { close }, () => [
                            createVNode("div", {
                              "data-slot": "wrapper",
                              class: ui.value.wrapper({ class: props.ui?.wrapper })
                            }, [
                              __props.title || !!slots.title ? (openBlock(), createBlock(unref(DialogTitle), {
                                key: 0,
                                "data-slot": "title",
                                class: ui.value.title({ class: props.ui?.title })
                              }, {
                                default: withCtx(() => [
                                  renderSlot(_ctx.$slots, "title", {}, () => [
                                    createTextVNode(toDisplayString(__props.title), 1)
                                  ])
                                ]),
                                _: 3
                              }, 8, ["class"])) : createCommentVNode("", true),
                              __props.description || !!slots.description ? (openBlock(), createBlock(unref(DialogDescription), {
                                key: 1,
                                "data-slot": "description",
                                class: ui.value.description({ class: props.ui?.description })
                              }, {
                                default: withCtx(() => [
                                  renderSlot(_ctx.$slots, "description", {}, () => [
                                    createTextVNode(toDisplayString(__props.description), 1)
                                  ])
                                ]),
                                _: 3
                              }, 8, ["class"])) : createCommentVNode("", true)
                            ], 2),
                            renderSlot(_ctx.$slots, "actions"),
                            props.close || !!slots.close ? (openBlock(), createBlock(unref(DialogClose), {
                              key: 0,
                              "as-child": ""
                            }, {
                              default: withCtx(() => [
                                renderSlot(_ctx.$slots, "close", { ui: ui.value }, () => [
                                  props.close ? (openBlock(), createBlock(_sfc_main$9, mergeProps({
                                    key: 0,
                                    icon: __props.closeIcon || unref(appConfig).ui.icons.close,
                                    color: "neutral",
                                    variant: "ghost",
                                    "aria-label": unref(t)("slideover.close")
                                  }, typeof props.close === "object" ? props.close : {}, {
                                    "data-slot": "close",
                                    class: ui.value.close({ class: props.ui?.close })
                                  }), null, 16, ["icon", "aria-label", "class"])) : createCommentVNode("", true)
                                ])
                              ]),
                              _: 2
                            }, 1024)) : createCommentVNode("", true)
                          ])
                        ], 2)) : createCommentVNode("", true),
                        createVNode("div", {
                          "data-slot": "body",
                          class: ui.value.body({ class: props.ui?.body })
                        }, [
                          renderSlot(_ctx.$slots, "body", { close })
                        ], 2),
                        !!slots.footer ? (openBlock(), createBlock("div", {
                          key: 1,
                          "data-slot": "footer",
                          class: ui.value.footer({ class: props.ui?.footer })
                        }, [
                          renderSlot(_ctx.$slots, "footer", { close })
                        ], 2)) : createCommentVNode("", true)
                      ])
                    ]),
                    _: 2
                  }, 1040, ["data-side", "class", "onAfterEnter", "onAfterLeave"])
                ]),
                _: 2
              }, 1040)
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
};
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/@nuxt/ui/dist/runtime/components/Slideover.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const theme$1 = {
  "slots": {
    "overlay": "fixed inset-0 bg-elevated/75",
    "content": "fixed bg-default ring ring-default flex focus:outline-none",
    "handle": [
      "shrink-0 !bg-accented",
      "transition-opacity"
    ],
    "container": "w-full flex flex-col gap-4 p-4 overflow-y-auto",
    "header": "",
    "title": "text-highlighted font-semibold",
    "description": "mt-1 text-muted text-sm",
    "body": "flex-1",
    "footer": "flex flex-col gap-1.5"
  },
  "variants": {
    "direction": {
      "top": {
        "content": "mb-24 flex-col-reverse",
        "handle": "mb-4"
      },
      "right": {
        "content": "flex-row",
        "handle": "!ml-4"
      },
      "bottom": {
        "content": "mt-24 flex-col",
        "handle": "mt-4"
      },
      "left": {
        "content": "flex-row-reverse",
        "handle": "!mr-4"
      }
    },
    "inset": {
      "true": {
        "content": "rounded-lg after:hidden overflow-hidden [--initial-transform:calc(100%+1.5rem)]"
      }
    },
    "snapPoints": {
      "true": ""
    }
  },
  "compoundVariants": [
    {
      "direction": [
        "top",
        "bottom"
      ],
      "class": {
        "content": "h-auto max-h-[96%]",
        "handle": "!w-12 !h-1.5 mx-auto"
      }
    },
    {
      "direction": [
        "top",
        "bottom"
      ],
      "snapPoints": true,
      "class": {
        "content": "h-full"
      }
    },
    {
      "direction": [
        "right",
        "left"
      ],
      "class": {
        "content": "w-auto max-w-[calc(100%-2rem)]",
        "handle": "!h-12 !w-1.5 mt-auto mb-auto"
      }
    },
    {
      "direction": [
        "right",
        "left"
      ],
      "snapPoints": true,
      "class": {
        "content": "w-full"
      }
    },
    {
      "direction": "top",
      "inset": true,
      "class": {
        "content": "inset-x-4 top-4"
      }
    },
    {
      "direction": "top",
      "inset": false,
      "class": {
        "content": "inset-x-0 top-0 rounded-b-lg"
      }
    },
    {
      "direction": "bottom",
      "inset": true,
      "class": {
        "content": "inset-x-4 bottom-4"
      }
    },
    {
      "direction": "bottom",
      "inset": false,
      "class": {
        "content": "inset-x-0 bottom-0 rounded-t-lg"
      }
    },
    {
      "direction": "left",
      "inset": true,
      "class": {
        "content": "inset-y-4 left-4"
      }
    },
    {
      "direction": "left",
      "inset": false,
      "class": {
        "content": "inset-y-0 left-0 rounded-r-lg"
      }
    },
    {
      "direction": "right",
      "inset": true,
      "class": {
        "content": "inset-y-4 right-4"
      }
    },
    {
      "direction": "right",
      "inset": false,
      "class": {
        "content": "inset-y-0 right-0 rounded-l-lg"
      }
    }
  ]
};
const _sfc_main$4 = {
  __name: "UDrawer",
  __ssrInlineRender: true,
  props: {
    as: { type: null, required: false },
    title: { type: String, required: false },
    description: { type: String, required: false },
    inset: { type: Boolean, required: false },
    content: { type: Object, required: false },
    overlay: { type: Boolean, required: false, default: true },
    handle: { type: Boolean, required: false, default: true },
    portal: { type: [Boolean, String], required: false, skipCheck: true, default: true },
    nested: { type: Boolean, required: false },
    class: { type: null, required: false },
    ui: { type: null, required: false },
    activeSnapPoint: { type: [Number, String, null], required: false },
    closeThreshold: { type: Number, required: false },
    shouldScaleBackground: { type: Boolean, required: false },
    setBackgroundColorOnScale: { type: Boolean, required: false },
    scrollLockTimeout: { type: Number, required: false },
    fixed: { type: Boolean, required: false },
    dismissible: { type: Boolean, required: false, default: true },
    modal: { type: Boolean, required: false, default: true },
    open: { type: Boolean, required: false },
    defaultOpen: { type: Boolean, required: false },
    direction: { type: String, required: false, default: "bottom" },
    noBodyStyles: { type: Boolean, required: false },
    handleOnly: { type: Boolean, required: false },
    preventScrollRestoration: { type: Boolean, required: false },
    snapPoints: { type: Array, required: false }
  },
  emits: ["close:prevent", "drag", "release", "close", "update:open", "update:activeSnapPoint", "animationEnd"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const slots = useSlots();
    const appConfig = useAppConfig();
    const rootProps = useForwardPropsEmits(reactivePick(props, "activeSnapPoint", "closeThreshold", "shouldScaleBackground", "setBackgroundColorOnScale", "scrollLockTimeout", "fixed", "dismissible", "modal", "open", "defaultOpen", "nested", "direction", "noBodyStyles", "handleOnly", "preventScrollRestoration", "snapPoints"), emits);
    const portalProps = usePortal(toRef(() => props.portal));
    const contentProps = toRef(() => props.content);
    const contentEvents = computed(() => {
      if (!props.dismissible) {
        const events = ["pointerDownOutside", "interactOutside", "escapeKeyDown"];
        return events.reduce((acc, curr) => {
          acc[curr] = (e) => {
            e.preventDefault();
            emits("close:prevent");
          };
          return acc;
        }, {});
      }
      return {};
    });
    const ui = computed(() => tv({ extend: tv(theme$1), ...appConfig.ui?.drawer || {} })({
      direction: props.direction,
      inset: props.inset,
      snapPoints: props.snapPoints && props.snapPoints.length > 0
    }));
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderVNode(_push, createVNode(resolveDynamicComponent(__props.nested ? unref(DrawerRootNested) : unref(DrawerRoot)), mergeProps(unref(rootProps), _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (!!slots.default) {
              _push2(ssrRenderComponent(unref(DrawerTrigger), {
                "as-child": "",
                class: props.class
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    ssrRenderSlot(_ctx.$slots, "default", {}, null, _push3, _parent3, _scopeId2);
                  } else {
                    return [
                      renderSlot(_ctx.$slots, "default")
                    ];
                  }
                }),
                _: 3
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(ssrRenderComponent(unref(DrawerPortal), unref(portalProps), {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  if (__props.overlay) {
                    _push3(ssrRenderComponent(unref(DrawerOverlay), {
                      "data-slot": "overlay",
                      class: ui.value.overlay({ class: props.ui?.overlay })
                    }, null, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(ssrRenderComponent(unref(DrawerContent), mergeProps({
                    "data-slot": "content",
                    class: ui.value.content({ class: [!slots.default && props.class, props.ui?.content] })
                  }, contentProps.value, toHandlers(contentEvents.value)), {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        if (__props.handle) {
                          _push4(ssrRenderComponent(unref(DrawerHandle), {
                            "data-slot": "handle",
                            class: ui.value.handle({ class: props.ui?.handle })
                          }, null, _parent4, _scopeId3));
                        } else {
                          _push4(`<!---->`);
                        }
                        if (!!slots.content && (__props.title || !!slots.title || (__props.description || !!slots.description))) {
                          _push4(ssrRenderComponent(unref(VisuallyHidden), null, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                if (__props.title || !!slots.title) {
                                  _push5(ssrRenderComponent(unref(DrawerTitle), null, {
                                    default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                      if (_push6) {
                                        ssrRenderSlot(_ctx.$slots, "title", {}, () => {
                                          _push6(`${ssrInterpolate(__props.title)}`);
                                        }, _push6, _parent6, _scopeId5);
                                      } else {
                                        return [
                                          renderSlot(_ctx.$slots, "title", {}, () => [
                                            createTextVNode(toDisplayString(__props.title), 1)
                                          ])
                                        ];
                                      }
                                    }),
                                    _: 3
                                  }, _parent5, _scopeId4));
                                } else {
                                  _push5(`<!---->`);
                                }
                                if (__props.description || !!slots.description) {
                                  _push5(ssrRenderComponent(unref(DrawerDescription), null, {
                                    default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                      if (_push6) {
                                        ssrRenderSlot(_ctx.$slots, "description", {}, () => {
                                          _push6(`${ssrInterpolate(__props.description)}`);
                                        }, _push6, _parent6, _scopeId5);
                                      } else {
                                        return [
                                          renderSlot(_ctx.$slots, "description", {}, () => [
                                            createTextVNode(toDisplayString(__props.description), 1)
                                          ])
                                        ];
                                      }
                                    }),
                                    _: 3
                                  }, _parent5, _scopeId4));
                                } else {
                                  _push5(`<!---->`);
                                }
                              } else {
                                return [
                                  __props.title || !!slots.title ? (openBlock(), createBlock(unref(DrawerTitle), { key: 0 }, {
                                    default: withCtx(() => [
                                      renderSlot(_ctx.$slots, "title", {}, () => [
                                        createTextVNode(toDisplayString(__props.title), 1)
                                      ])
                                    ]),
                                    _: 3
                                  })) : createCommentVNode("", true),
                                  __props.description || !!slots.description ? (openBlock(), createBlock(unref(DrawerDescription), { key: 1 }, {
                                    default: withCtx(() => [
                                      renderSlot(_ctx.$slots, "description", {}, () => [
                                        createTextVNode(toDisplayString(__props.description), 1)
                                      ])
                                    ]),
                                    _: 3
                                  })) : createCommentVNode("", true)
                                ];
                              }
                            }),
                            _: 3
                          }, _parent4, _scopeId3));
                        } else {
                          _push4(`<!---->`);
                        }
                        ssrRenderSlot(_ctx.$slots, "content", {}, () => {
                          _push4(`<div data-slot="container" class="${ssrRenderClass(ui.value.container({ class: props.ui?.container }))}"${_scopeId3}>`);
                          if (!!slots.header || (__props.title || !!slots.title) || (__props.description || !!slots.description)) {
                            _push4(`<div data-slot="header" class="${ssrRenderClass(ui.value.header({ class: props.ui?.header }))}"${_scopeId3}>`);
                            ssrRenderSlot(_ctx.$slots, "header", {}, () => {
                              if (__props.title || !!slots.title) {
                                _push4(ssrRenderComponent(unref(DrawerTitle), {
                                  "data-slot": "title",
                                  class: ui.value.title({ class: props.ui?.title })
                                }, {
                                  default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                    if (_push5) {
                                      ssrRenderSlot(_ctx.$slots, "title", {}, () => {
                                        _push5(`${ssrInterpolate(__props.title)}`);
                                      }, _push5, _parent5, _scopeId4);
                                    } else {
                                      return [
                                        renderSlot(_ctx.$slots, "title", {}, () => [
                                          createTextVNode(toDisplayString(__props.title), 1)
                                        ])
                                      ];
                                    }
                                  }),
                                  _: 3
                                }, _parent4, _scopeId3));
                              } else {
                                _push4(`<!---->`);
                              }
                              if (__props.description || !!slots.description) {
                                _push4(ssrRenderComponent(unref(DrawerDescription), {
                                  "data-slot": "description",
                                  class: ui.value.description({ class: props.ui?.description })
                                }, {
                                  default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                    if (_push5) {
                                      ssrRenderSlot(_ctx.$slots, "description", {}, () => {
                                        _push5(`${ssrInterpolate(__props.description)}`);
                                      }, _push5, _parent5, _scopeId4);
                                    } else {
                                      return [
                                        renderSlot(_ctx.$slots, "description", {}, () => [
                                          createTextVNode(toDisplayString(__props.description), 1)
                                        ])
                                      ];
                                    }
                                  }),
                                  _: 3
                                }, _parent4, _scopeId3));
                              } else {
                                _push4(`<!---->`);
                              }
                            }, _push4, _parent4, _scopeId3);
                            _push4(`</div>`);
                          } else {
                            _push4(`<!---->`);
                          }
                          if (!!slots.body) {
                            _push4(`<div data-slot="body" class="${ssrRenderClass(ui.value.body({ class: props.ui?.body }))}"${_scopeId3}>`);
                            ssrRenderSlot(_ctx.$slots, "body", {}, null, _push4, _parent4, _scopeId3);
                            _push4(`</div>`);
                          } else {
                            _push4(`<!---->`);
                          }
                          if (!!slots.footer) {
                            _push4(`<div data-slot="footer" class="${ssrRenderClass(ui.value.footer({ class: props.ui?.footer }))}"${_scopeId3}>`);
                            ssrRenderSlot(_ctx.$slots, "footer", {}, null, _push4, _parent4, _scopeId3);
                            _push4(`</div>`);
                          } else {
                            _push4(`<!---->`);
                          }
                          _push4(`</div>`);
                        }, _push4, _parent4, _scopeId3);
                      } else {
                        return [
                          __props.handle ? (openBlock(), createBlock(unref(DrawerHandle), {
                            key: 0,
                            "data-slot": "handle",
                            class: ui.value.handle({ class: props.ui?.handle })
                          }, null, 8, ["class"])) : createCommentVNode("", true),
                          !!slots.content && (__props.title || !!slots.title || (__props.description || !!slots.description)) ? (openBlock(), createBlock(unref(VisuallyHidden), { key: 1 }, {
                            default: withCtx(() => [
                              __props.title || !!slots.title ? (openBlock(), createBlock(unref(DrawerTitle), { key: 0 }, {
                                default: withCtx(() => [
                                  renderSlot(_ctx.$slots, "title", {}, () => [
                                    createTextVNode(toDisplayString(__props.title), 1)
                                  ])
                                ]),
                                _: 3
                              })) : createCommentVNode("", true),
                              __props.description || !!slots.description ? (openBlock(), createBlock(unref(DrawerDescription), { key: 1 }, {
                                default: withCtx(() => [
                                  renderSlot(_ctx.$slots, "description", {}, () => [
                                    createTextVNode(toDisplayString(__props.description), 1)
                                  ])
                                ]),
                                _: 3
                              })) : createCommentVNode("", true)
                            ]),
                            _: 3
                          })) : createCommentVNode("", true),
                          renderSlot(_ctx.$slots, "content", {}, () => [
                            createVNode("div", {
                              "data-slot": "container",
                              class: ui.value.container({ class: props.ui?.container })
                            }, [
                              !!slots.header || (__props.title || !!slots.title) || (__props.description || !!slots.description) ? (openBlock(), createBlock("div", {
                                key: 0,
                                "data-slot": "header",
                                class: ui.value.header({ class: props.ui?.header })
                              }, [
                                renderSlot(_ctx.$slots, "header", {}, () => [
                                  __props.title || !!slots.title ? (openBlock(), createBlock(unref(DrawerTitle), {
                                    key: 0,
                                    "data-slot": "title",
                                    class: ui.value.title({ class: props.ui?.title })
                                  }, {
                                    default: withCtx(() => [
                                      renderSlot(_ctx.$slots, "title", {}, () => [
                                        createTextVNode(toDisplayString(__props.title), 1)
                                      ])
                                    ]),
                                    _: 3
                                  }, 8, ["class"])) : createCommentVNode("", true),
                                  __props.description || !!slots.description ? (openBlock(), createBlock(unref(DrawerDescription), {
                                    key: 1,
                                    "data-slot": "description",
                                    class: ui.value.description({ class: props.ui?.description })
                                  }, {
                                    default: withCtx(() => [
                                      renderSlot(_ctx.$slots, "description", {}, () => [
                                        createTextVNode(toDisplayString(__props.description), 1)
                                      ])
                                    ]),
                                    _: 3
                                  }, 8, ["class"])) : createCommentVNode("", true)
                                ])
                              ], 2)) : createCommentVNode("", true),
                              !!slots.body ? (openBlock(), createBlock("div", {
                                key: 1,
                                "data-slot": "body",
                                class: ui.value.body({ class: props.ui?.body })
                              }, [
                                renderSlot(_ctx.$slots, "body")
                              ], 2)) : createCommentVNode("", true),
                              !!slots.footer ? (openBlock(), createBlock("div", {
                                key: 2,
                                "data-slot": "footer",
                                class: ui.value.footer({ class: props.ui?.footer })
                              }, [
                                renderSlot(_ctx.$slots, "footer")
                              ], 2)) : createCommentVNode("", true)
                            ], 2)
                          ])
                        ];
                      }
                    }),
                    _: 3
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    __props.overlay ? (openBlock(), createBlock(unref(DrawerOverlay), {
                      key: 0,
                      "data-slot": "overlay",
                      class: ui.value.overlay({ class: props.ui?.overlay })
                    }, null, 8, ["class"])) : createCommentVNode("", true),
                    createVNode(unref(DrawerContent), mergeProps({
                      "data-slot": "content",
                      class: ui.value.content({ class: [!slots.default && props.class, props.ui?.content] })
                    }, contentProps.value, toHandlers(contentEvents.value)), {
                      default: withCtx(() => [
                        __props.handle ? (openBlock(), createBlock(unref(DrawerHandle), {
                          key: 0,
                          "data-slot": "handle",
                          class: ui.value.handle({ class: props.ui?.handle })
                        }, null, 8, ["class"])) : createCommentVNode("", true),
                        !!slots.content && (__props.title || !!slots.title || (__props.description || !!slots.description)) ? (openBlock(), createBlock(unref(VisuallyHidden), { key: 1 }, {
                          default: withCtx(() => [
                            __props.title || !!slots.title ? (openBlock(), createBlock(unref(DrawerTitle), { key: 0 }, {
                              default: withCtx(() => [
                                renderSlot(_ctx.$slots, "title", {}, () => [
                                  createTextVNode(toDisplayString(__props.title), 1)
                                ])
                              ]),
                              _: 3
                            })) : createCommentVNode("", true),
                            __props.description || !!slots.description ? (openBlock(), createBlock(unref(DrawerDescription), { key: 1 }, {
                              default: withCtx(() => [
                                renderSlot(_ctx.$slots, "description", {}, () => [
                                  createTextVNode(toDisplayString(__props.description), 1)
                                ])
                              ]),
                              _: 3
                            })) : createCommentVNode("", true)
                          ]),
                          _: 3
                        })) : createCommentVNode("", true),
                        renderSlot(_ctx.$slots, "content", {}, () => [
                          createVNode("div", {
                            "data-slot": "container",
                            class: ui.value.container({ class: props.ui?.container })
                          }, [
                            !!slots.header || (__props.title || !!slots.title) || (__props.description || !!slots.description) ? (openBlock(), createBlock("div", {
                              key: 0,
                              "data-slot": "header",
                              class: ui.value.header({ class: props.ui?.header })
                            }, [
                              renderSlot(_ctx.$slots, "header", {}, () => [
                                __props.title || !!slots.title ? (openBlock(), createBlock(unref(DrawerTitle), {
                                  key: 0,
                                  "data-slot": "title",
                                  class: ui.value.title({ class: props.ui?.title })
                                }, {
                                  default: withCtx(() => [
                                    renderSlot(_ctx.$slots, "title", {}, () => [
                                      createTextVNode(toDisplayString(__props.title), 1)
                                    ])
                                  ]),
                                  _: 3
                                }, 8, ["class"])) : createCommentVNode("", true),
                                __props.description || !!slots.description ? (openBlock(), createBlock(unref(DrawerDescription), {
                                  key: 1,
                                  "data-slot": "description",
                                  class: ui.value.description({ class: props.ui?.description })
                                }, {
                                  default: withCtx(() => [
                                    renderSlot(_ctx.$slots, "description", {}, () => [
                                      createTextVNode(toDisplayString(__props.description), 1)
                                    ])
                                  ]),
                                  _: 3
                                }, 8, ["class"])) : createCommentVNode("", true)
                              ])
                            ], 2)) : createCommentVNode("", true),
                            !!slots.body ? (openBlock(), createBlock("div", {
                              key: 1,
                              "data-slot": "body",
                              class: ui.value.body({ class: props.ui?.body })
                            }, [
                              renderSlot(_ctx.$slots, "body")
                            ], 2)) : createCommentVNode("", true),
                            !!slots.footer ? (openBlock(), createBlock("div", {
                              key: 2,
                              "data-slot": "footer",
                              class: ui.value.footer({ class: props.ui?.footer })
                            }, [
                              renderSlot(_ctx.$slots, "footer")
                            ], 2)) : createCommentVNode("", true)
                          ], 2)
                        ])
                      ]),
                      _: 3
                    }, 16, ["class"])
                  ];
                }
              }),
              _: 3
            }, _parent2, _scopeId));
          } else {
            return [
              !!slots.default ? (openBlock(), createBlock(unref(DrawerTrigger), {
                key: 0,
                "as-child": "",
                class: props.class
              }, {
                default: withCtx(() => [
                  renderSlot(_ctx.$slots, "default")
                ]),
                _: 3
              }, 8, ["class"])) : createCommentVNode("", true),
              createVNode(unref(DrawerPortal), unref(portalProps), {
                default: withCtx(() => [
                  __props.overlay ? (openBlock(), createBlock(unref(DrawerOverlay), {
                    key: 0,
                    "data-slot": "overlay",
                    class: ui.value.overlay({ class: props.ui?.overlay })
                  }, null, 8, ["class"])) : createCommentVNode("", true),
                  createVNode(unref(DrawerContent), mergeProps({
                    "data-slot": "content",
                    class: ui.value.content({ class: [!slots.default && props.class, props.ui?.content] })
                  }, contentProps.value, toHandlers(contentEvents.value)), {
                    default: withCtx(() => [
                      __props.handle ? (openBlock(), createBlock(unref(DrawerHandle), {
                        key: 0,
                        "data-slot": "handle",
                        class: ui.value.handle({ class: props.ui?.handle })
                      }, null, 8, ["class"])) : createCommentVNode("", true),
                      !!slots.content && (__props.title || !!slots.title || (__props.description || !!slots.description)) ? (openBlock(), createBlock(unref(VisuallyHidden), { key: 1 }, {
                        default: withCtx(() => [
                          __props.title || !!slots.title ? (openBlock(), createBlock(unref(DrawerTitle), { key: 0 }, {
                            default: withCtx(() => [
                              renderSlot(_ctx.$slots, "title", {}, () => [
                                createTextVNode(toDisplayString(__props.title), 1)
                              ])
                            ]),
                            _: 3
                          })) : createCommentVNode("", true),
                          __props.description || !!slots.description ? (openBlock(), createBlock(unref(DrawerDescription), { key: 1 }, {
                            default: withCtx(() => [
                              renderSlot(_ctx.$slots, "description", {}, () => [
                                createTextVNode(toDisplayString(__props.description), 1)
                              ])
                            ]),
                            _: 3
                          })) : createCommentVNode("", true)
                        ]),
                        _: 3
                      })) : createCommentVNode("", true),
                      renderSlot(_ctx.$slots, "content", {}, () => [
                        createVNode("div", {
                          "data-slot": "container",
                          class: ui.value.container({ class: props.ui?.container })
                        }, [
                          !!slots.header || (__props.title || !!slots.title) || (__props.description || !!slots.description) ? (openBlock(), createBlock("div", {
                            key: 0,
                            "data-slot": "header",
                            class: ui.value.header({ class: props.ui?.header })
                          }, [
                            renderSlot(_ctx.$slots, "header", {}, () => [
                              __props.title || !!slots.title ? (openBlock(), createBlock(unref(DrawerTitle), {
                                key: 0,
                                "data-slot": "title",
                                class: ui.value.title({ class: props.ui?.title })
                              }, {
                                default: withCtx(() => [
                                  renderSlot(_ctx.$slots, "title", {}, () => [
                                    createTextVNode(toDisplayString(__props.title), 1)
                                  ])
                                ]),
                                _: 3
                              }, 8, ["class"])) : createCommentVNode("", true),
                              __props.description || !!slots.description ? (openBlock(), createBlock(unref(DrawerDescription), {
                                key: 1,
                                "data-slot": "description",
                                class: ui.value.description({ class: props.ui?.description })
                              }, {
                                default: withCtx(() => [
                                  renderSlot(_ctx.$slots, "description", {}, () => [
                                    createTextVNode(toDisplayString(__props.description), 1)
                                  ])
                                ]),
                                _: 3
                              }, 8, ["class"])) : createCommentVNode("", true)
                            ])
                          ], 2)) : createCommentVNode("", true),
                          !!slots.body ? (openBlock(), createBlock("div", {
                            key: 1,
                            "data-slot": "body",
                            class: ui.value.body({ class: props.ui?.body })
                          }, [
                            renderSlot(_ctx.$slots, "body")
                          ], 2)) : createCommentVNode("", true),
                          !!slots.footer ? (openBlock(), createBlock("div", {
                            key: 2,
                            "data-slot": "footer",
                            class: ui.value.footer({ class: props.ui?.footer })
                          }, [
                            renderSlot(_ctx.$slots, "footer")
                          ], 2)) : createCommentVNode("", true)
                        ], 2)
                      ])
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
      }), _parent);
    };
  }
};
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/@nuxt/ui/dist/runtime/components/Drawer.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const theme = {
  "slots": {
    "root": "bg-default/75 backdrop-blur border-b border-default h-(--ui-header-height) sticky top-0 z-50",
    "container": "flex items-center justify-between gap-3 h-full",
    "left": "lg:flex-1 flex items-center gap-1.5",
    "center": "hidden lg:flex",
    "right": "flex items-center justify-end lg:flex-1 gap-1.5",
    "title": "shrink-0 font-bold text-xl text-highlighted flex items-end gap-1.5",
    "toggle": "lg:hidden",
    "content": "lg:hidden",
    "overlay": "lg:hidden",
    "header": "px-4 sm:px-6 h-(--ui-header-height) shrink-0 flex items-center justify-between gap-3",
    "body": "p-4 sm:p-6 overflow-y-auto"
  },
  "variants": {
    "toggleSide": {
      "left": {
        "toggle": "-ms-1.5"
      },
      "right": {
        "toggle": "-me-1.5"
      }
    }
  }
};
const _sfc_main$3 = /* @__PURE__ */ Object.assign({ inheritAttrs: false }, {
  __name: "UHeader",
  __ssrInlineRender: true,
  props: /* @__PURE__ */ mergeModels({
    as: { type: null, required: false, default: "header" },
    title: { type: String, required: false, default: "Nuxt UI" },
    to: { type: String, required: false, default: "/" },
    mode: { type: null, required: false, default: "modal" },
    menu: { type: null, required: false },
    toggle: { type: [Boolean, Object], required: false, default: true },
    toggleSide: { type: String, required: false, default: "right" },
    class: { type: null, required: false },
    ui: { type: null, required: false }
  }, {
    "open": { type: Boolean, ...{ default: false } },
    "openModifiers": {}
  }),
  emits: ["update:open"],
  setup(__props) {
    const props = __props;
    const slots = useSlots();
    const open = useModel(__props, "open", { type: Boolean, ...{ default: false } });
    const route = useRoute();
    const { t } = useLocale();
    const appConfig = useAppConfig();
    const [DefineLeftTemplate, ReuseLeftTemplate] = createReusableTemplate();
    const [DefineRightTemplate, ReuseRightTemplate] = createReusableTemplate();
    const [DefineToggleTemplate, ReuseToggleTemplate] = createReusableTemplate();
    const ariaLabel = computed(() => {
      const slotText = slots.title && getSlotChildrenText(slots.title());
      return (slotText || props.title || "Nuxt UI").trim();
    });
    watch(() => route.fullPath, () => {
      open.value = false;
    });
    const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.header || {} })());
    const Menu = computed(() => ({
      slideover: _sfc_main$5,
      modal: _sfc_main$7,
      drawer: _sfc_main$4
    })[props.mode]);
    const menuProps = toRef(() => defu(props.menu, {
      content: {
        onOpenAutoFocus: (e) => e.preventDefault()
      }
    }, props.mode === "modal" ? { fullscreen: true, transition: false } : {}));
    function toggleOpen() {
      open.value = !open.value;
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(DefineToggleTemplate), null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "toggle", {
              open: open.value,
              toggle: toggleOpen,
              ui: ui.value
            }, () => {
              if (__props.toggle) {
                _push2(ssrRenderComponent(_sfc_main$9, mergeProps({
                  color: "neutral",
                  variant: "ghost",
                  "aria-label": open.value ? unref(t)("header.close") : unref(t)("header.open"),
                  icon: open.value ? unref(appConfig).ui.icons.close : unref(appConfig).ui.icons.menu
                }, typeof __props.toggle === "object" ? __props.toggle : {}, {
                  "data-slot": "toggle",
                  class: ui.value.toggle({ class: props.ui?.toggle, toggleSide: __props.toggleSide }),
                  onClick: toggleOpen
                }), null, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
            }, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "toggle", {
                open: open.value,
                toggle: toggleOpen,
                ui: ui.value
              }, () => [
                __props.toggle ? (openBlock(), createBlock(_sfc_main$9, mergeProps({
                  key: 0,
                  color: "neutral",
                  variant: "ghost",
                  "aria-label": open.value ? unref(t)("header.close") : unref(t)("header.open"),
                  icon: open.value ? unref(appConfig).ui.icons.close : unref(appConfig).ui.icons.menu
                }, typeof __props.toggle === "object" ? __props.toggle : {}, {
                  "data-slot": "toggle",
                  class: ui.value.toggle({ class: props.ui?.toggle, toggleSide: __props.toggleSide }),
                  onClick: toggleOpen
                }), null, 16, ["aria-label", "icon", "class"])) : createCommentVNode("", true)
              ])
            ];
          }
        }),
        _: 3
      }, _parent));
      _push(ssrRenderComponent(unref(DefineLeftTemplate), null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div data-slot="left" class="${ssrRenderClass(ui.value.left({ class: props.ui?.left }))}"${_scopeId}>`);
            if (__props.toggleSide === "left") {
              _push2(ssrRenderComponent(unref(ReuseToggleTemplate), null, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            ssrRenderSlot(_ctx.$slots, "left", {}, () => {
              _push2(ssrRenderComponent(_sfc_main$a, {
                to: __props.to,
                "aria-label": ariaLabel.value,
                "data-slot": "title",
                class: ui.value.title({ class: props.ui?.title })
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    ssrRenderSlot(_ctx.$slots, "title", {}, () => {
                      _push3(`${ssrInterpolate(__props.title)}`);
                    }, _push3, _parent3, _scopeId2);
                  } else {
                    return [
                      renderSlot(_ctx.$slots, "title", {}, () => [
                        createTextVNode(toDisplayString(__props.title), 1)
                      ])
                    ];
                  }
                }),
                _: 3
              }, _parent2, _scopeId));
            }, _push2, _parent2, _scopeId);
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", {
                "data-slot": "left",
                class: ui.value.left({ class: props.ui?.left })
              }, [
                __props.toggleSide === "left" ? (openBlock(), createBlock(unref(ReuseToggleTemplate), { key: 0 })) : createCommentVNode("", true),
                renderSlot(_ctx.$slots, "left", {}, () => [
                  createVNode(_sfc_main$a, {
                    to: __props.to,
                    "aria-label": ariaLabel.value,
                    "data-slot": "title",
                    class: ui.value.title({ class: props.ui?.title })
                  }, {
                    default: withCtx(() => [
                      renderSlot(_ctx.$slots, "title", {}, () => [
                        createTextVNode(toDisplayString(__props.title), 1)
                      ])
                    ]),
                    _: 3
                  }, 8, ["to", "aria-label", "class"])
                ])
              ], 2)
            ];
          }
        }),
        _: 3
      }, _parent));
      _push(ssrRenderComponent(unref(DefineRightTemplate), null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div data-slot="right" class="${ssrRenderClass(ui.value.right({ class: props.ui?.right }))}"${_scopeId}>`);
            ssrRenderSlot(_ctx.$slots, "right", {}, null, _push2, _parent2, _scopeId);
            if (__props.toggleSide === "right") {
              _push2(ssrRenderComponent(unref(ReuseToggleTemplate), null, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", {
                "data-slot": "right",
                class: ui.value.right({ class: props.ui?.right })
              }, [
                renderSlot(_ctx.$slots, "right"),
                __props.toggleSide === "right" ? (openBlock(), createBlock(unref(ReuseToggleTemplate), { key: 0 })) : createCommentVNode("", true)
              ], 2)
            ];
          }
        }),
        _: 3
      }, _parent));
      _push(ssrRenderComponent(unref(Primitive), mergeProps({ as: __props.as }, _ctx.$attrs, {
        "data-slot": "root",
        class: ui.value.root({ class: [props.ui?.root, props.class] })
      }), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "top", {}, null, _push2, _parent2, _scopeId);
            _push2(ssrRenderComponent(_sfc_main$8, {
              "data-slot": "container",
              class: ui.value.container({ class: props.ui?.container })
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(ReuseLeftTemplate), null, null, _parent3, _scopeId2));
                  _push3(`<div data-slot="center" class="${ssrRenderClass(ui.value.center({ class: props.ui?.center }))}"${_scopeId2}>`);
                  ssrRenderSlot(_ctx.$slots, "default", {}, null, _push3, _parent3, _scopeId2);
                  _push3(`</div>`);
                  _push3(ssrRenderComponent(unref(ReuseRightTemplate), null, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(ReuseLeftTemplate)),
                    createVNode("div", {
                      "data-slot": "center",
                      class: ui.value.center({ class: props.ui?.center })
                    }, [
                      renderSlot(_ctx.$slots, "default")
                    ], 2),
                    createVNode(unref(ReuseRightTemplate))
                  ];
                }
              }),
              _: 3
            }, _parent2, _scopeId));
            ssrRenderSlot(_ctx.$slots, "bottom", {}, null, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "top"),
              createVNode(_sfc_main$8, {
                "data-slot": "container",
                class: ui.value.container({ class: props.ui?.container })
              }, {
                default: withCtx(() => [
                  createVNode(unref(ReuseLeftTemplate)),
                  createVNode("div", {
                    "data-slot": "center",
                    class: ui.value.center({ class: props.ui?.center })
                  }, [
                    renderSlot(_ctx.$slots, "default")
                  ], 2),
                  createVNode(unref(ReuseRightTemplate))
                ]),
                _: 3
              }, 8, ["class"]),
              renderSlot(_ctx.$slots, "bottom")
            ];
          }
        }),
        _: 3
      }, _parent));
      _push(ssrRenderComponent(unref(Menu), mergeProps({
        open: open.value,
        "onUpdate:open": ($event) => open.value = $event,
        title: unref(t)("header.title"),
        description: unref(t)("header.description")
      }, menuProps.value, {
        ui: {
          overlay: ui.value.overlay({ class: props.ui?.overlay }),
          content: ui.value.content({ class: props.ui?.content })
        }
      }), {
        content: withCtx((contentData, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "content", contentData, () => {
              if (__props.mode !== "drawer") {
                _push2(`<div data-slot="header" class="${ssrRenderClass(ui.value.header({ class: props.ui?.header }))}"${_scopeId}>`);
                _push2(ssrRenderComponent(unref(ReuseLeftTemplate), null, null, _parent2, _scopeId));
                _push2(ssrRenderComponent(unref(ReuseRightTemplate), null, null, _parent2, _scopeId));
                _push2(`</div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`<div data-slot="body" class="${ssrRenderClass(ui.value.body({ class: props.ui?.body }))}"${_scopeId}>`);
              ssrRenderSlot(_ctx.$slots, "body", {}, null, _push2, _parent2, _scopeId);
              _push2(`</div>`);
            }, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "content", contentData, () => [
                __props.mode !== "drawer" ? (openBlock(), createBlock("div", {
                  key: 0,
                  "data-slot": "header",
                  class: ui.value.header({ class: props.ui?.header })
                }, [
                  createVNode(unref(ReuseLeftTemplate)),
                  createVNode(unref(ReuseRightTemplate))
                ], 2)) : createCommentVNode("", true),
                createVNode("div", {
                  "data-slot": "body",
                  class: ui.value.body({ class: props.ui?.body })
                }, [
                  renderSlot(_ctx.$slots, "body")
                ], 2)
              ])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/@nuxt/ui/dist/runtime/components/Header.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const _sfc_main$2 = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  _push(`<svg${ssrRenderAttrs(mergeProps({
    width: "1020",
    height: "200",
    viewBox: "0 0 1020 200",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, _attrs))}><path d="M377 200C379.16 200 381 198.209 381 196V103C381 103 386 112 395 127L434 194C435.785 197.74 439.744 200 443 200H470V50H443C441.202 50 439 51.4941 439 54V148L421 116L385 55C383.248 51.8912 379.479 50 376 50H350V200H377Z" fill="currentColor"></path><path d="M726 92H739C742.314 92 745 89.3137 745 86V60H773V92H800V116H773V159C773 169.5 778.057 174 787 174H800V200H783C759.948 200 745 185.071 745 160V116H726V92Z" fill="currentColor"></path><path d="M591 92V154C591 168.004 585.742 179.809 578 188C570.258 196.191 559.566 200 545 200C530.434 200 518.742 196.191 511 188C503.389 179.809 498 168.004 498 154V92H514C517.412 92 520.769 92.622 523 95C525.231 97.2459 526 98.5652 526 102V154C526 162.059 526.457 167.037 530 171C533.543 174.831 537.914 176 545 176C552.217 176 555.457 174.831 559 171C562.543 167.037 563 162.059 563 154V102C563 98.5652 563.769 96.378 566 94C567.96 91.9107 570.028 91.9599 573 92C573.411 92.0055 574.586 92 575 92H591Z" fill="currentColor"></path><path d="M676 144L710 92H684C680.723 92 677.812 93.1758 676 96L660 120L645 97C643.188 94.1758 639.277 92 636 92H611L645 143L608 200H634C637.25 200 640.182 196.787 642 194L660 167L679 195C680.818 197.787 683.75 200 687 200H713L676 144Z" fill="currentColor"></path><path d="M168 200H279C282.542 200 285.932 198.756 289 197C292.068 195.244 295.23 193.041 297 190C298.77 186.959 300.002 183.51 300 179.999C299.998 176.488 298.773 173.04 297 170.001L222 41C220.23 37.96 218.067 35.7552 215 34C211.933 32.2448 207.542 31 204 31C200.458 31 197.067 32.2448 194 34C190.933 35.7552 188.77 37.96 187 41L168 74L130 9.99764C128.228 6.95784 126.068 3.75491 123 2C119.932 0.245087 116.542 0 113 0C109.458 0 106.068 0.245087 103 2C99.9323 3.75491 96.7717 6.95784 95 9.99764L2 170.001C0.226979 173.04 0.00154312 176.488 1.90993e-06 179.999C-0.0015393 183.51 0.229648 186.959 2 190C3.77035 193.04 6.93245 195.244 10 197C13.0675 198.756 16.4578 200 20 200H90C117.737 200 137.925 187.558 152 164L186 105L204 74L259 168H186L168 200ZM89 168H40L113 42L150 105L125.491 147.725C116.144 163.01 105.488 168 89 168Z" fill="var(--ui-primary)"></path><path d="M958 60.0001H938C933.524 60.0001 929.926 59.9395 927 63C924.074 65.8905 925 67.5792 925 72V141C925 151.372 923.648 156.899 919 162C914.352 166.931 908.468 169 899 169C889.705 169 882.648 166.931 878 162C873.352 156.899 873 151.372 873 141V72.0001C873 67.5793 872.926 65.8906 870 63.0001C867.074 59.9396 863.476 60.0001 859 60.0001H840V141C840 159.023 845.016 173.458 855 184C865.156 194.542 879.893 200 899 200C918.107 200 932.844 194.542 943 184C953.156 173.458 958 159.023 958 141V60.0001Z" fill="var(--ui-primary)"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M1000 60.0233L1020 60V77L1020 128V156.007L1020 181L1020 189.004C1020 192.938 1019.98 194.429 1017 197.001C1014.02 199.725 1009.56 200 1005 200H986.001V181.006L986 130.012V70.0215C986 66.1576 986.016 64.5494 989 62.023C991.819 59.6358 995.437 60.0233 1000 60.0233Z" fill="var(--ui-primary)"></path></svg>`);
}
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AppLogo.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_2 = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$2, [["ssrRender", _sfc_ssrRender]]), { __name: "AppLogo" });
const useColorMode = () => {
  return useState("color-mode").value;
};
const _sfc_main$1 = /* @__PURE__ */ Object.assign({ inheritAttrs: false }, {
  __name: "UColorModeButton",
  __ssrInlineRender: true,
  props: {
    color: { type: null, required: false, default: "neutral" },
    variant: { type: null, required: false, default: "ghost" },
    label: { type: String, required: false },
    activeColor: { type: null, required: false },
    activeVariant: { type: null, required: false },
    size: { type: null, required: false },
    square: { type: Boolean, required: false },
    block: { type: Boolean, required: false },
    loadingAuto: { type: Boolean, required: false },
    onClick: { type: [Function, Array], required: false },
    class: { type: null, required: false },
    ui: { type: null, required: false },
    icon: { type: null, required: false },
    avatar: { type: Object, required: false },
    leading: { type: Boolean, required: false },
    leadingIcon: { type: null, required: false },
    trailing: { type: Boolean, required: false },
    trailingIcon: { type: null, required: false },
    loading: { type: Boolean, required: false },
    loadingIcon: { type: null, required: false },
    as: { type: null, required: false },
    type: { type: null, required: false },
    disabled: { type: Boolean, required: false },
    exactActiveClass: { type: String, required: false },
    viewTransition: { type: Boolean, required: false }
  },
  setup(__props) {
    const props = __props;
    const { t } = useLocale();
    const colorMode = useColorMode();
    const appConfig = useAppConfig();
    const buttonProps = useForwardProps(reactiveOmit(props, "icon"));
    const isDark = computed({
      get() {
        return colorMode.value === "dark";
      },
      set(_isDark) {
        colorMode.preference = _isDark ? "dark" : "light";
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$9, mergeProps({
        ...unref(buttonProps),
        "aria-label": isDark.value ? unref(t)("colorMode.switchToLight") : unref(t)("colorMode.switchToDark"),
        ..._ctx.$attrs
      }, {
        onClick: ($event) => isDark.value = !isDark.value
      }, _attrs), {
        leading: withCtx(({ ui }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_sfc_main$f, {
              class: ui.leadingIcon({ class: [props.ui?.leadingIcon, "hidden dark:inline-block"] }),
              name: unref(appConfig).ui.icons.dark
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$f, {
              class: ui.leadingIcon({ class: [props.ui?.leadingIcon, "dark:hidden"] }),
              name: unref(appConfig).ui.icons.light
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_sfc_main$f, {
                class: ui.leadingIcon({ class: [props.ui?.leadingIcon, "hidden dark:inline-block"] }),
                name: unref(appConfig).ui.icons.dark
              }, null, 8, ["class", "name"]),
              createVNode(_sfc_main$f, {
                class: ui.leadingIcon({ class: [props.ui?.leadingIcon, "dark:hidden"] }),
                name: unref(appConfig).ui.icons.light
              }, null, 8, ["class", "name"])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/@nuxt/ui/dist/runtime/components/color-mode/ColorModeButton.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Header",
  __ssrInlineRender: true,
  setup(__props) {
    const portalurl = ref("http://d4k4u.com/c/");
    const macaddress = ref("00:1A:79:AC:51:80");
    const token = ref("");
    const stalkerStore = useStalkerStore();
    function makeHandshake() {
      stalkerStore.makeHandshake(portalurl.value, macaddress.value);
      token.value = stalkerStore.token;
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UHeader = _sfc_main$3;
      const _component_NuxtLink = __nuxt_component_0$2;
      const _component_AppLogo = __nuxt_component_2;
      const _component_UInput = _sfc_main$6;
      const _component_UButton = _sfc_main$9;
      const _component_UColorModeButton = _sfc_main$1;
      _push(ssrRenderComponent(_component_UHeader, _attrs, {
        left: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_NuxtLink, { to: "/" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_AppLogo, { class: "w-auto h-6 shrink-0" }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_AppLogo, { class: "w-auto h-6 shrink-0" })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_NuxtLink, { to: "/" }, {
                default: withCtx(() => [
                  createVNode(_component_AppLogo, { class: "w-auto h-6 shrink-0" })
                ]),
                _: 1
              })
            ];
          }
        }),
        right: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UInput, {
              modelValue: unref(portalurl),
              "onUpdate:modelValue": ($event) => isRef(portalurl) ? portalurl.value = $event : null,
              placeholder: "Portal URL"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UInput, {
              modelValue: unref(macaddress),
              "onUpdate:modelValue": ($event) => isRef(macaddress) ? macaddress.value = $event : null,
              placeholder: "MAC Address"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UButton, { onClick: makeHandshake }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Make Handshake`);
                } else {
                  return [
                    createTextVNode("Make Handshake")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UColorModeButton, null, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UInput, {
                modelValue: unref(portalurl),
                "onUpdate:modelValue": ($event) => isRef(portalurl) ? portalurl.value = $event : null,
                placeholder: "Portal URL"
              }, null, 8, ["modelValue", "onUpdate:modelValue"]),
              createVNode(_component_UInput, {
                modelValue: unref(macaddress),
                "onUpdate:modelValue": ($event) => isRef(macaddress) ? macaddress.value = $event : null,
                placeholder: "MAC Address"
              }, null, 8, ["modelValue", "onUpdate:modelValue"]),
              createVNode(_component_UButton, { onClick: makeHandshake }, {
                default: withCtx(() => [
                  createTextVNode("Make Handshake")
                ]),
                _: 1
              }),
              createVNode(_component_UColorModeButton)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Header.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_1 = Object.assign(_sfc_main, { __name: "Header" });

export { __nuxt_component_1 as _ };
//# sourceMappingURL=Header-CIp_Me-4.mjs.map
