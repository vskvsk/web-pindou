/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { computed } from 'vue';
import { usePindouStore } from './stores/pindou';
import AppHeader from './components/Header.vue';
import ImageUploader from './components/ImageUploader.vue';
import SettingsPanel from './components/SettingsPanel.vue';
import PixelCanvas from './components/PixelCanvas.vue';
import ColorList from './components/ColorList.vue';
const store = usePindouStore();
const originalImage = computed({
    get: () => store.originalImage,
    set: (val) => store.setOriginalImage(val)
});
const pixelData = computed(() => store.pixelData);
const isDarkMode = computed(() => store.isDarkMode);
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['app']} */ ;
/** @type {__VLS_StyleScopedClasses['dark']} */ ;
/** @type {__VLS_StyleScopedClasses['hero']} */ ;
/** @type {__VLS_StyleScopedClasses['dark']} */ ;
/** @type {__VLS_StyleScopedClasses['hero-kicker']} */ ;
/** @type {__VLS_StyleScopedClasses['dark']} */ ;
/** @type {__VLS_StyleScopedClasses['hero-title']} */ ;
/** @type {__VLS_StyleScopedClasses['dark']} */ ;
/** @type {__VLS_StyleScopedClasses['hero-lead']} */ ;
/** @type {__VLS_StyleScopedClasses['hero-cards']} */ ;
/** @type {__VLS_StyleScopedClasses['dark']} */ ;
/** @type {__VLS_StyleScopedClasses['hero-card']} */ ;
/** @type {__VLS_StyleScopedClasses['dark']} */ ;
/** @type {__VLS_StyleScopedClasses['hero-card-title']} */ ;
/** @type {__VLS_StyleScopedClasses['dark']} */ ;
/** @type {__VLS_StyleScopedClasses['hero-card-desc']} */ ;
/** @type {__VLS_StyleScopedClasses['sidebar']} */ ;
/** @type {__VLS_StyleScopedClasses['sidebar']} */ ;
/** @type {__VLS_StyleScopedClasses['dark']} */ ;
/** @type {__VLS_StyleScopedClasses['canvas-container']} */ ;
/** @type {__VLS_StyleScopedClasses['dark']} */ ;
/** @type {__VLS_StyleScopedClasses['placeholder-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['main-content']} */ ;
/** @type {__VLS_StyleScopedClasses['sidebar']} */ ;
/** @type {__VLS_StyleScopedClasses['canvas-area']} */ ;
/** @type {__VLS_StyleScopedClasses['canvas-container']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "app" },
    ...{ class: ({ dark: __VLS_ctx.isDarkMode }) },
});
/** @type {__VLS_StyleScopedClasses['app']} */ ;
/** @type {__VLS_StyleScopedClasses['dark']} */ ;
const __VLS_0 = AppHeader;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({}));
const __VLS_2 = __VLS_1({}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_asFunctionalElement1(__VLS_intrinsics.main, __VLS_intrinsics.main)({
    ...{ class: "main-wrap" },
});
/** @type {__VLS_StyleScopedClasses['main-wrap']} */ ;
if (!__VLS_ctx.originalImage) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.section, __VLS_intrinsics.section)({
        ...{ class: "hero" },
    });
    /** @type {__VLS_StyleScopedClasses['hero']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "hero-kicker" },
    });
    /** @type {__VLS_StyleScopedClasses['hero-kicker']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({
        ...{ class: "hero-title" },
    });
    /** @type {__VLS_StyleScopedClasses['hero-title']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "hero-lead" },
    });
    /** @type {__VLS_StyleScopedClasses['hero-lead']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "hero-cards" },
    });
    /** @type {__VLS_StyleScopedClasses['hero-cards']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "hero-card" },
    });
    /** @type {__VLS_StyleScopedClasses['hero-card']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "hero-card-title" },
    });
    /** @type {__VLS_StyleScopedClasses['hero-card-title']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "hero-card-desc" },
    });
    /** @type {__VLS_StyleScopedClasses['hero-card-desc']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "hero-card" },
    });
    /** @type {__VLS_StyleScopedClasses['hero-card']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "hero-card-title" },
    });
    /** @type {__VLS_StyleScopedClasses['hero-card-title']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "hero-card-desc" },
    });
    /** @type {__VLS_StyleScopedClasses['hero-card-desc']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "hero-card" },
    });
    /** @type {__VLS_StyleScopedClasses['hero-card']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "hero-card-title" },
    });
    /** @type {__VLS_StyleScopedClasses['hero-card-title']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "hero-card-desc" },
    });
    /** @type {__VLS_StyleScopedClasses['hero-card-desc']} */ ;
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "main-content" },
});
/** @type {__VLS_StyleScopedClasses['main-content']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.aside, __VLS_intrinsics.aside)({
    ...{ class: "sidebar left" },
});
/** @type {__VLS_StyleScopedClasses['sidebar']} */ ;
/** @type {__VLS_StyleScopedClasses['left']} */ ;
const __VLS_5 = ImageUploader;
// @ts-ignore
const __VLS_6 = __VLS_asFunctionalComponent1(__VLS_5, new __VLS_5({
    modelValue: (__VLS_ctx.originalImage),
}));
const __VLS_7 = __VLS_6({
    modelValue: (__VLS_ctx.originalImage),
}, ...__VLS_functionalComponentArgsRest(__VLS_6));
const __VLS_10 = SettingsPanel;
// @ts-ignore
const __VLS_11 = __VLS_asFunctionalComponent1(__VLS_10, new __VLS_10({
    ...{ class: "mt-4" },
}));
const __VLS_12 = __VLS_11({
    ...{ class: "mt-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_11));
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.section, __VLS_intrinsics.section)({
    ...{ class: "canvas-area" },
});
/** @type {__VLS_StyleScopedClasses['canvas-area']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "canvas-container" },
});
/** @type {__VLS_StyleScopedClasses['canvas-container']} */ ;
if (__VLS_ctx.pixelData.length > 0) {
    const __VLS_15 = PixelCanvas;
    // @ts-ignore
    const __VLS_16 = __VLS_asFunctionalComponent1(__VLS_15, new __VLS_15({}));
    const __VLS_17 = __VLS_16({}, ...__VLS_functionalComponentArgsRest(__VLS_16));
}
else {
    let __VLS_20;
    /** @ts-ignore @type {typeof __VLS_components.elEmpty | typeof __VLS_components.ElEmpty | typeof __VLS_components.elEmpty | typeof __VLS_components.ElEmpty} */
    elEmpty;
    // @ts-ignore
    const __VLS_21 = __VLS_asFunctionalComponent1(__VLS_20, new __VLS_20({
        description: "上传图片并点击「生成拼豆图」开始",
    }));
    const __VLS_22 = __VLS_21({
        description: "上传图片并点击「生成拼豆图」开始",
    }, ...__VLS_functionalComponentArgsRest(__VLS_21));
    const { default: __VLS_25 } = __VLS_23.slots;
    {
        const { image: __VLS_26 } = __VLS_23.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "placeholder-icon" },
        });
        /** @type {__VLS_StyleScopedClasses['placeholder-icon']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.svg, __VLS_intrinsics.svg)({
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            'stroke-width': "1.5",
        });
        __VLS_asFunctionalElement1(__VLS_intrinsics.rect)({
            x: "3",
            y: "3",
            width: "18",
            height: "18",
            rx: "2",
        });
        __VLS_asFunctionalElement1(__VLS_intrinsics.circle)({
            cx: "8.5",
            cy: "8.5",
            r: "1.5",
        });
        __VLS_asFunctionalElement1(__VLS_intrinsics.path)({
            d: "M21 15l-5-5L5 21",
        });
        // @ts-ignore
        [isDarkMode, originalImage, originalImage, pixelData,];
    }
    // @ts-ignore
    [];
    var __VLS_23;
}
__VLS_asFunctionalElement1(__VLS_intrinsics.aside, __VLS_intrinsics.aside)({
    ...{ class: "sidebar right" },
});
/** @type {__VLS_StyleScopedClasses['sidebar']} */ ;
/** @type {__VLS_StyleScopedClasses['right']} */ ;
const __VLS_27 = ColorList;
// @ts-ignore
const __VLS_28 = __VLS_asFunctionalComponent1(__VLS_27, new __VLS_27({}));
const __VLS_29 = __VLS_28({}, ...__VLS_functionalComponentArgsRest(__VLS_28));
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
