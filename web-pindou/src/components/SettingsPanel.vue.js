/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { computed, ref } from 'vue';
import { Refresh, Download, Document } from '@element-plus/icons-vue';
import { usePindouStore } from '../stores/pindou';
import { ElMessage } from 'element-plus';
import { PALETTE_BRAND_OPTIONS } from '../data/brands';
import { mardColors } from '../data/colors';
import { buildPatternSvg, downloadTextFile } from '../utils/exportPattern';
const store = usePindouStore();
const sizePresets = [
    { label: '52×52', width: 52, height: 52 },
    { label: '72×72', width: 72, height: 72 },
    { label: '100×100', width: 100, height: 100 },
    { label: 'A4横版', width: 120, height: 80 },
];
const customDialogVisible = ref(false);
const customFilter = ref('');
const exportPngWithCodes = ref(true);
const gridWidth = computed({
    get: () => store.gridSize.width,
    set: (val) => store.setGridSize(val, store.gridSize.height),
});
const gridHeight = computed({
    get: () => store.gridSize.height,
    set: (val) => store.setGridSize(store.gridSize.width, val),
});
const useCIEDE2000 = computed({
    get: () => store.useCIEDE2000,
    set: (val) => {
        store.useCIEDE2000 = val;
    },
});
const paletteBrandId = computed({
    get: () => store.paletteBrandId,
    set: (val) => {
        store.paletteBrandId = val;
    },
});
const customPaletteCodes = computed({
    get: () => store.customPaletteCodes,
    set: (val) => {
        store.customPaletteCodes = val;
    },
});
const brandHint = computed(() => {
    return PALETTE_BRAND_OPTIONS.find((o) => o.id === paletteBrandId.value)?.hint;
});
const filteredMardForCustom = computed(() => {
    const q = customFilter.value.trim().toLowerCase();
    if (!q)
        return mardColors;
    return mardColors.filter((c) => c.code.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q) ||
        (c.nameCn && c.nameCn.includes(q)));
});
const brightness = computed({
    get: () => store.brightness,
    set: (val) => {
        store.brightness = val;
    },
});
const contrast = computed({
    get: () => store.contrast,
    set: (val) => {
        store.contrast = val;
    },
});
const saturation = computed({
    get: () => store.saturation,
    set: (val) => {
        store.saturation = val;
    },
});
const originalImage = computed(() => store.originalImage);
const isProcessing = computed(() => store.isProcessing);
const pixelData = computed(() => store.pixelData);
function applyPreset(preset) {
    store.setGridSize(preset.width, preset.height);
}
function selectAllCustom() {
    customPaletteCodes.value = mardColors.map((c) => c.code);
}
function clearCustom() {
    customPaletteCodes.value = [];
}
async function processImage() {
    if (!originalImage.value) {
        ElMessage.warning('请先上传图片');
        return;
    }
    const lib = store.colors;
    if (lib.length === 0) {
        ElMessage.error('当前色板为空，请调整自定义色板');
        return;
    }
    store.setIsProcessing(true);
    try {
        await performPixelization();
        ElMessage.success('转换完成！');
    }
    catch (error) {
        ElMessage.error('处理失败，请重试');
        console.error(error);
    }
    finally {
        store.setIsProcessing(false);
    }
}
async function performPixelization() {
    const img = store.originalImage;
    const { width, height } = store.gridSize;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    const filterString = `
    brightness(${100 + store.brightness}%)
    contrast(${100 + store.contrast}%)
    saturate(${100 + store.saturation}%)
  `;
    ctx.filter = filterString;
    const scale = Math.min(width / img.width, height / img.height);
    const scaledWidth = img.width * scale;
    const scaledHeight = img.height * scale;
    const offsetX = (width - scaledWidth) / 2;
    const offsetY = (height - scaledHeight) / 2;
    ctx.drawImage(img, offsetX, offsetY, scaledWidth, scaledHeight);
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    const pixelData = [];
    const colors = store.colors;
    const { findClosestColor, findClosestColorFast } = await import('../utils/color');
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const i = (y * width + x) * 4;
            let r = data[i];
            let g = data[i + 1];
            let b = data[i + 2];
            const a = data[i + 3];
            if (a < 128) {
                r = 255;
                g = 255;
                b = 255;
            }
            const findFn = store.useCIEDE2000 ? findClosestColor : findClosestColorFast;
            const result = findFn(r, g, b, colors);
            pixelData.push({
                x,
                y,
                r,
                g,
                b,
                colorCode: result.color.code,
                hex: result.color.hex,
            });
        }
    }
    store.setPixelData(pixelData);
}
function exportImage() {
    const { width, height } = store.gridSize;
    const pixelSize = exportPngWithCodes.value ? 24 : 20;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = width * pixelSize;
    canvas.height = height * pixelSize;
    ctx.fillStyle = '#1f2937';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (const pixel of store.pixelData) {
        const x = pixel.x * pixelSize;
        const y = pixel.y * pixelSize;
        ctx.fillStyle = pixel.hex;
        ctx.beginPath();
        ctx.roundRect(x + 1, y + 1, pixelSize - 2, pixelSize - 2, 4);
        ctx.fill();
        ctx.fillStyle = 'rgba(0,0,0,0.35)';
        ctx.beginPath();
        ctx.arc(x + pixelSize / 2, y + pixelSize / 2, pixelSize / 7, 0, Math.PI * 2);
        ctx.fill();
        if (exportPngWithCodes.value) {
            const code = pixel.colorCode;
            ctx.fillStyle = 'rgba(0,0,0,0.82)';
            ctx.font = `${Math.max(7, pixelSize * 0.28)}px system-ui,sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(code, x + pixelSize / 2, y + pixelSize / 2);
        }
    }
    const brand = store.paletteBrandId;
    const link = document.createElement('a');
    link.download = `拼豆图纸_${brand}_${width}x${height}_${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    ElMessage.success('PNG 已导出');
}
function exportSvg() {
    const { width, height } = store.gridSize;
    const title = `拼豆图纸 ${store.paletteBrandId} ${width}×${height}`;
    const svg = buildPatternSvg(store.pixelData, width, height, {
        cellSize: 14,
        showCodes: true,
        title,
    });
    downloadTextFile(`拼豆图纸_${store.paletteBrandId}_${width}x${height}_${Date.now()}.svg`, svg, 'image/svg+xml;charset=utf-8');
    ElMessage.success('SVG 已导出');
}
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['settings-panel']} */ ;
/** @type {__VLS_StyleScopedClasses['dark']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-title']} */ ;
/** @type {__VLS_StyleScopedClasses['dark']} */ ;
/** @type {__VLS_StyleScopedClasses['setting-section']} */ ;
/** @type {__VLS_StyleScopedClasses['setting-section']} */ ;
/** @type {__VLS_StyleScopedClasses['dark']} */ ;
/** @type {__VLS_StyleScopedClasses['setting-label']} */ ;
/** @type {__VLS_StyleScopedClasses['dark']} */ ;
/** @type {__VLS_StyleScopedClasses['setting-row']} */ ;
/** @type {__VLS_StyleScopedClasses['dark']} */ ;
/** @type {__VLS_StyleScopedClasses['brand-hint']} */ ;
/** @type {__VLS_StyleScopedClasses['adjustment-item']} */ ;
/** @type {__VLS_StyleScopedClasses['dark']} */ ;
/** @type {__VLS_StyleScopedClasses['adjustment-item']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "settings-panel" },
});
/** @type {__VLS_StyleScopedClasses['settings-panel']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h3, __VLS_intrinsics.h3)({
    ...{ class: "panel-title" },
});
/** @type {__VLS_StyleScopedClasses['panel-title']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "setting-section" },
});
/** @type {__VLS_StyleScopedClasses['setting-section']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.label, __VLS_intrinsics.label)({
    ...{ class: "setting-label" },
});
/** @type {__VLS_StyleScopedClasses['setting-label']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "grid-size-inputs" },
});
/** @type {__VLS_StyleScopedClasses['grid-size-inputs']} */ ;
let __VLS_0;
/** @ts-ignore @type {typeof __VLS_components.elInputNumber | typeof __VLS_components.ElInputNumber} */
elInputNumber;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    modelValue: (__VLS_ctx.gridWidth),
    min: (10),
    max: (200),
    step: (1),
    size: "small",
    controlsPosition: "right",
}));
const __VLS_2 = __VLS_1({
    modelValue: (__VLS_ctx.gridWidth),
    min: (10),
    max: (200),
    step: (1),
    size: "small",
    controlsPosition: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "size-separator" },
});
/** @type {__VLS_StyleScopedClasses['size-separator']} */ ;
let __VLS_5;
/** @ts-ignore @type {typeof __VLS_components.elInputNumber | typeof __VLS_components.ElInputNumber} */
elInputNumber;
// @ts-ignore
const __VLS_6 = __VLS_asFunctionalComponent1(__VLS_5, new __VLS_5({
    modelValue: (__VLS_ctx.gridHeight),
    min: (10),
    max: (200),
    step: (1),
    size: "small",
    controlsPosition: "right",
}));
const __VLS_7 = __VLS_6({
    modelValue: (__VLS_ctx.gridHeight),
    min: (10),
    max: (200),
    step: (1),
    size: "small",
    controlsPosition: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_6));
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "size-presets" },
});
/** @type {__VLS_StyleScopedClasses['size-presets']} */ ;
for (const [preset] of __VLS_vFor((__VLS_ctx.sizePresets))) {
    let __VLS_10;
    /** @ts-ignore @type {typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components.elButton | typeof __VLS_components.ElButton} */
    elButton;
    // @ts-ignore
    const __VLS_11 = __VLS_asFunctionalComponent1(__VLS_10, new __VLS_10({
        ...{ 'onClick': {} },
        key: (preset.label),
        size: "small",
        text: true,
    }));
    const __VLS_12 = __VLS_11({
        ...{ 'onClick': {} },
        key: (preset.label),
        size: "small",
        text: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_11));
    let __VLS_15;
    const __VLS_16 = ({ click: {} },
        { onClick: (...[$event]) => {
                __VLS_ctx.applyPreset(preset);
                // @ts-ignore
                [gridWidth, gridHeight, sizePresets, applyPreset,];
            } });
    const { default: __VLS_17 } = __VLS_13.slots;
    (preset.label);
    // @ts-ignore
    [];
    var __VLS_13;
    var __VLS_14;
    // @ts-ignore
    [];
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "setting-section" },
});
/** @type {__VLS_StyleScopedClasses['setting-section']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.label, __VLS_intrinsics.label)({
    ...{ class: "setting-label" },
});
/** @type {__VLS_StyleScopedClasses['setting-label']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "color-settings" },
});
/** @type {__VLS_StyleScopedClasses['color-settings']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "setting-row" },
});
/** @type {__VLS_StyleScopedClasses['setting-row']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
let __VLS_18;
/** @ts-ignore @type {typeof __VLS_components.elRadioGroup | typeof __VLS_components.ElRadioGroup | typeof __VLS_components.elRadioGroup | typeof __VLS_components.ElRadioGroup} */
elRadioGroup;
// @ts-ignore
const __VLS_19 = __VLS_asFunctionalComponent1(__VLS_18, new __VLS_18({
    modelValue: (__VLS_ctx.useCIEDE2000),
    size: "small",
}));
const __VLS_20 = __VLS_19({
    modelValue: (__VLS_ctx.useCIEDE2000),
    size: "small",
}, ...__VLS_functionalComponentArgsRest(__VLS_19));
const { default: __VLS_23 } = __VLS_21.slots;
let __VLS_24;
/** @ts-ignore @type {typeof __VLS_components.elRadioButton | typeof __VLS_components.ElRadioButton | typeof __VLS_components.elRadioButton | typeof __VLS_components.ElRadioButton} */
elRadioButton;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent1(__VLS_24, new __VLS_24({
    label: (false),
}));
const __VLS_26 = __VLS_25({
    label: (false),
}, ...__VLS_functionalComponentArgsRest(__VLS_25));
const { default: __VLS_29 } = __VLS_27.slots;
// @ts-ignore
[useCIEDE2000,];
var __VLS_27;
let __VLS_30;
/** @ts-ignore @type {typeof __VLS_components.elRadioButton | typeof __VLS_components.ElRadioButton | typeof __VLS_components.elRadioButton | typeof __VLS_components.ElRadioButton} */
elRadioButton;
// @ts-ignore
const __VLS_31 = __VLS_asFunctionalComponent1(__VLS_30, new __VLS_30({
    label: (true),
}));
const __VLS_32 = __VLS_31({
    label: (true),
}, ...__VLS_functionalComponentArgsRest(__VLS_31));
const { default: __VLS_35 } = __VLS_33.slots;
// @ts-ignore
[];
var __VLS_33;
// @ts-ignore
[];
var __VLS_21;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "setting-row brand-row" },
});
/** @type {__VLS_StyleScopedClasses['setting-row']} */ ;
/** @type {__VLS_StyleScopedClasses['brand-row']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
let __VLS_36;
/** @ts-ignore @type {typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect} */
elSelect;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent1(__VLS_36, new __VLS_36({
    modelValue: (__VLS_ctx.paletteBrandId),
    size: "small",
    ...{ class: "brand-select" },
}));
const __VLS_38 = __VLS_37({
    modelValue: (__VLS_ctx.paletteBrandId),
    size: "small",
    ...{ class: "brand-select" },
}, ...__VLS_functionalComponentArgsRest(__VLS_37));
/** @type {__VLS_StyleScopedClasses['brand-select']} */ ;
const { default: __VLS_41 } = __VLS_39.slots;
for (const [opt] of __VLS_vFor((__VLS_ctx.PALETTE_BRAND_OPTIONS))) {
    let __VLS_42;
    /** @ts-ignore @type {typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components.elOption | typeof __VLS_components.ElOption} */
    elOption;
    // @ts-ignore
    const __VLS_43 = __VLS_asFunctionalComponent1(__VLS_42, new __VLS_42({
        key: (opt.id),
        label: (opt.label),
        value: (opt.id),
    }));
    const __VLS_44 = __VLS_43({
        key: (opt.id),
        label: (opt.label),
        value: (opt.id),
    }, ...__VLS_functionalComponentArgsRest(__VLS_43));
    const { default: __VLS_47 } = __VLS_45.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    (opt.label);
    if (opt.hint) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "opt-hint" },
        });
        /** @type {__VLS_StyleScopedClasses['opt-hint']} */ ;
        (opt.hint);
    }
    // @ts-ignore
    [paletteBrandId, PALETTE_BRAND_OPTIONS,];
    var __VLS_45;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_39;
if (__VLS_ctx.brandHint) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "brand-hint" },
    });
    /** @type {__VLS_StyleScopedClasses['brand-hint']} */ ;
    (__VLS_ctx.brandHint);
}
if (__VLS_ctx.paletteBrandId === 'CUSTOM') {
    let __VLS_48;
    /** @ts-ignore @type {typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components.elButton | typeof __VLS_components.ElButton} */
    elButton;
    // @ts-ignore
    const __VLS_49 = __VLS_asFunctionalComponent1(__VLS_48, new __VLS_48({
        ...{ 'onClick': {} },
        size: "small",
        ...{ class: "w-full" },
    }));
    const __VLS_50 = __VLS_49({
        ...{ 'onClick': {} },
        size: "small",
        ...{ class: "w-full" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_49));
    let __VLS_53;
    const __VLS_54 = ({ click: {} },
        { onClick: (...[$event]) => {
                if (!(__VLS_ctx.paletteBrandId === 'CUSTOM'))
                    return;
                __VLS_ctx.customDialogVisible = true;
                // @ts-ignore
                [paletteBrandId, brandHint, brandHint, customDialogVisible,];
            } });
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    const { default: __VLS_55 } = __VLS_51.slots;
    (__VLS_ctx.customPaletteCodes.length || '全部');
    // @ts-ignore
    [customPaletteCodes,];
    var __VLS_51;
    var __VLS_52;
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "setting-section" },
});
/** @type {__VLS_StyleScopedClasses['setting-section']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.label, __VLS_intrinsics.label)({
    ...{ class: "setting-label" },
});
/** @type {__VLS_StyleScopedClasses['setting-label']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "adjustments" },
});
/** @type {__VLS_StyleScopedClasses['adjustments']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "adjustment-item" },
});
/** @type {__VLS_StyleScopedClasses['adjustment-item']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
let __VLS_56;
/** @ts-ignore @type {typeof __VLS_components.elSlider | typeof __VLS_components.ElSlider} */
elSlider;
// @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent1(__VLS_56, new __VLS_56({
    modelValue: (__VLS_ctx.brightness),
    min: (-50),
    max: (50),
    step: (1),
    showStops: true,
}));
const __VLS_58 = __VLS_57({
    modelValue: (__VLS_ctx.brightness),
    min: (-50),
    max: (50),
    step: (1),
    showStops: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_57));
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "adjustment-item" },
});
/** @type {__VLS_StyleScopedClasses['adjustment-item']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
let __VLS_61;
/** @ts-ignore @type {typeof __VLS_components.elSlider | typeof __VLS_components.ElSlider} */
elSlider;
// @ts-ignore
const __VLS_62 = __VLS_asFunctionalComponent1(__VLS_61, new __VLS_61({
    modelValue: (__VLS_ctx.contrast),
    min: (-50),
    max: (50),
    step: (1),
    showStops: true,
}));
const __VLS_63 = __VLS_62({
    modelValue: (__VLS_ctx.contrast),
    min: (-50),
    max: (50),
    step: (1),
    showStops: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_62));
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "adjustment-item" },
});
/** @type {__VLS_StyleScopedClasses['adjustment-item']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
let __VLS_66;
/** @ts-ignore @type {typeof __VLS_components.elSlider | typeof __VLS_components.ElSlider} */
elSlider;
// @ts-ignore
const __VLS_67 = __VLS_asFunctionalComponent1(__VLS_66, new __VLS_66({
    modelValue: (__VLS_ctx.saturation),
    min: (-50),
    max: (50),
    step: (1),
    showStops: true,
}));
const __VLS_68 = __VLS_67({
    modelValue: (__VLS_ctx.saturation),
    min: (-50),
    max: (50),
    step: (1),
    showStops: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_67));
if (__VLS_ctx.pixelData.length > 0) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "setting-section" },
    });
    /** @type {__VLS_StyleScopedClasses['setting-section']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.label, __VLS_intrinsics.label)({
        ...{ class: "setting-label" },
    });
    /** @type {__VLS_StyleScopedClasses['setting-label']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "export-options" },
    });
    /** @type {__VLS_StyleScopedClasses['export-options']} */ ;
    let __VLS_71;
    /** @ts-ignore @type {typeof __VLS_components.elCheckbox | typeof __VLS_components.ElCheckbox | typeof __VLS_components.elCheckbox | typeof __VLS_components.ElCheckbox} */
    elCheckbox;
    // @ts-ignore
    const __VLS_72 = __VLS_asFunctionalComponent1(__VLS_71, new __VLS_71({
        modelValue: (__VLS_ctx.exportPngWithCodes),
    }));
    const __VLS_73 = __VLS_72({
        modelValue: (__VLS_ctx.exportPngWithCodes),
    }, ...__VLS_functionalComponentArgsRest(__VLS_72));
    const { default: __VLS_76 } = __VLS_74.slots;
    // @ts-ignore
    [brightness, contrast, saturation, pixelData, exportPngWithCodes,];
    var __VLS_74;
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "action-buttons" },
});
/** @type {__VLS_StyleScopedClasses['action-buttons']} */ ;
let __VLS_77;
/** @ts-ignore @type {typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components.elButton | typeof __VLS_components.ElButton} */
elButton;
// @ts-ignore
const __VLS_78 = __VLS_asFunctionalComponent1(__VLS_77, new __VLS_77({
    ...{ 'onClick': {} },
    type: "primary",
    size: "large",
    loading: (__VLS_ctx.isProcessing),
    disabled: (!__VLS_ctx.originalImage),
    ...{ class: "w-full" },
}));
const __VLS_79 = __VLS_78({
    ...{ 'onClick': {} },
    type: "primary",
    size: "large",
    loading: (__VLS_ctx.isProcessing),
    disabled: (!__VLS_ctx.originalImage),
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_78));
let __VLS_82;
const __VLS_83 = ({ click: {} },
    { onClick: (__VLS_ctx.processImage) });
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
const { default: __VLS_84 } = __VLS_80.slots;
let __VLS_85;
/** @ts-ignore @type {typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon} */
elIcon;
// @ts-ignore
const __VLS_86 = __VLS_asFunctionalComponent1(__VLS_85, new __VLS_85({
    ...{ class: "mr-1" },
}));
const __VLS_87 = __VLS_86({
    ...{ class: "mr-1" },
}, ...__VLS_functionalComponentArgsRest(__VLS_86));
/** @type {__VLS_StyleScopedClasses['mr-1']} */ ;
const { default: __VLS_90 } = __VLS_88.slots;
let __VLS_91;
/** @ts-ignore @type {typeof __VLS_components.Refresh} */
Refresh;
// @ts-ignore
const __VLS_92 = __VLS_asFunctionalComponent1(__VLS_91, new __VLS_91({}));
const __VLS_93 = __VLS_92({}, ...__VLS_functionalComponentArgsRest(__VLS_92));
// @ts-ignore
[isProcessing, originalImage, processImage,];
var __VLS_88;
(__VLS_ctx.isProcessing ? '处理中...' : '生成拼豆图');
// @ts-ignore
[isProcessing,];
var __VLS_80;
var __VLS_81;
if (__VLS_ctx.pixelData.length > 0) {
    let __VLS_96;
    /** @ts-ignore @type {typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components.elButton | typeof __VLS_components.ElButton} */
    elButton;
    // @ts-ignore
    const __VLS_97 = __VLS_asFunctionalComponent1(__VLS_96, new __VLS_96({
        ...{ 'onClick': {} },
        type: "success",
        size: "large",
        ...{ class: "w-full mt-3" },
    }));
    const __VLS_98 = __VLS_97({
        ...{ 'onClick': {} },
        type: "success",
        size: "large",
        ...{ class: "w-full mt-3" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_97));
    let __VLS_101;
    const __VLS_102 = ({ click: {} },
        { onClick: (__VLS_ctx.exportImage) });
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    /** @type {__VLS_StyleScopedClasses['mt-3']} */ ;
    const { default: __VLS_103 } = __VLS_99.slots;
    let __VLS_104;
    /** @ts-ignore @type {typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon} */
    elIcon;
    // @ts-ignore
    const __VLS_105 = __VLS_asFunctionalComponent1(__VLS_104, new __VLS_104({
        ...{ class: "mr-1" },
    }));
    const __VLS_106 = __VLS_105({
        ...{ class: "mr-1" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_105));
    /** @type {__VLS_StyleScopedClasses['mr-1']} */ ;
    const { default: __VLS_109 } = __VLS_107.slots;
    let __VLS_110;
    /** @ts-ignore @type {typeof __VLS_components.Download} */
    Download;
    // @ts-ignore
    const __VLS_111 = __VLS_asFunctionalComponent1(__VLS_110, new __VLS_110({}));
    const __VLS_112 = __VLS_111({}, ...__VLS_functionalComponentArgsRest(__VLS_111));
    // @ts-ignore
    [pixelData, exportImage,];
    var __VLS_107;
    // @ts-ignore
    [];
    var __VLS_99;
    var __VLS_100;
    let __VLS_115;
    /** @ts-ignore @type {typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components.elButton | typeof __VLS_components.ElButton} */
    elButton;
    // @ts-ignore
    const __VLS_116 = __VLS_asFunctionalComponent1(__VLS_115, new __VLS_115({
        ...{ 'onClick': {} },
        size: "large",
        ...{ class: "w-full mt-3" },
    }));
    const __VLS_117 = __VLS_116({
        ...{ 'onClick': {} },
        size: "large",
        ...{ class: "w-full mt-3" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_116));
    let __VLS_120;
    const __VLS_121 = ({ click: {} },
        { onClick: (__VLS_ctx.exportSvg) });
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    /** @type {__VLS_StyleScopedClasses['mt-3']} */ ;
    const { default: __VLS_122 } = __VLS_118.slots;
    let __VLS_123;
    /** @ts-ignore @type {typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon} */
    elIcon;
    // @ts-ignore
    const __VLS_124 = __VLS_asFunctionalComponent1(__VLS_123, new __VLS_123({
        ...{ class: "mr-1" },
    }));
    const __VLS_125 = __VLS_124({
        ...{ class: "mr-1" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_124));
    /** @type {__VLS_StyleScopedClasses['mr-1']} */ ;
    const { default: __VLS_128 } = __VLS_126.slots;
    let __VLS_129;
    /** @ts-ignore @type {typeof __VLS_components.Document} */
    Document;
    // @ts-ignore
    const __VLS_130 = __VLS_asFunctionalComponent1(__VLS_129, new __VLS_129({}));
    const __VLS_131 = __VLS_130({}, ...__VLS_functionalComponentArgsRest(__VLS_130));
    // @ts-ignore
    [exportSvg,];
    var __VLS_126;
    // @ts-ignore
    [];
    var __VLS_118;
    var __VLS_119;
}
let __VLS_134;
/** @ts-ignore @type {typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog} */
elDialog;
// @ts-ignore
const __VLS_135 = __VLS_asFunctionalComponent1(__VLS_134, new __VLS_134({
    modelValue: (__VLS_ctx.customDialogVisible),
    title: "自定义色板",
    width: "520px",
    destroyOnClose: true,
}));
const __VLS_136 = __VLS_135({
    modelValue: (__VLS_ctx.customDialogVisible),
    title: "自定义色板",
    width: "520px",
    destroyOnClose: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_135));
const { default: __VLS_139 } = __VLS_137.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "dialog-hint" },
});
/** @type {__VLS_StyleScopedClasses['dialog-hint']} */ ;
let __VLS_140;
/** @ts-ignore @type {typeof __VLS_components.elInput | typeof __VLS_components.ElInput} */
elInput;
// @ts-ignore
const __VLS_141 = __VLS_asFunctionalComponent1(__VLS_140, new __VLS_140({
    modelValue: (__VLS_ctx.customFilter),
    size: "small",
    clearable: true,
    placeholder: "搜索色号或名称",
    ...{ class: "mb-2" },
}));
const __VLS_142 = __VLS_141({
    modelValue: (__VLS_ctx.customFilter),
    size: "small",
    clearable: true,
    placeholder: "搜索色号或名称",
    ...{ class: "mb-2" },
}, ...__VLS_functionalComponentArgsRest(__VLS_141));
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "custom-check-wrap" },
});
/** @type {__VLS_StyleScopedClasses['custom-check-wrap']} */ ;
let __VLS_145;
/** @ts-ignore @type {typeof __VLS_components.elCheckboxGroup | typeof __VLS_components.ElCheckboxGroup | typeof __VLS_components.elCheckboxGroup | typeof __VLS_components.ElCheckboxGroup} */
elCheckboxGroup;
// @ts-ignore
const __VLS_146 = __VLS_asFunctionalComponent1(__VLS_145, new __VLS_145({
    modelValue: (__VLS_ctx.customPaletteCodes),
}));
const __VLS_147 = __VLS_146({
    modelValue: (__VLS_ctx.customPaletteCodes),
}, ...__VLS_functionalComponentArgsRest(__VLS_146));
const { default: __VLS_150 } = __VLS_148.slots;
for (const [c] of __VLS_vFor((__VLS_ctx.filteredMardForCustom))) {
    let __VLS_151;
    /** @ts-ignore @type {typeof __VLS_components.elCheckbox | typeof __VLS_components.ElCheckbox | typeof __VLS_components.elCheckbox | typeof __VLS_components.ElCheckbox} */
    elCheckbox;
    // @ts-ignore
    const __VLS_152 = __VLS_asFunctionalComponent1(__VLS_151, new __VLS_151({
        key: (c.code),
        label: (c.code),
        border: true,
        size: "small",
        ...{ class: "custom-chip" },
    }));
    const __VLS_153 = __VLS_152({
        key: (c.code),
        label: (c.code),
        border: true,
        size: "small",
        ...{ class: "custom-chip" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_152));
    /** @type {__VLS_StyleScopedClasses['custom-chip']} */ ;
    const { default: __VLS_156 } = __VLS_154.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span)({
        ...{ class: "chip-swatch" },
        ...{ style: ({ background: c.hex }) },
    });
    /** @type {__VLS_StyleScopedClasses['chip-swatch']} */ ;
    (c.code);
    (c.nameCn || c.name);
    // @ts-ignore
    [customDialogVisible, customPaletteCodes, customFilter, filteredMardForCustom,];
    var __VLS_154;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_148;
{
    const { footer: __VLS_157 } = __VLS_137.slots;
    let __VLS_158;
    /** @ts-ignore @type {typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components.elButton | typeof __VLS_components.ElButton} */
    elButton;
    // @ts-ignore
    const __VLS_159 = __VLS_asFunctionalComponent1(__VLS_158, new __VLS_158({
        ...{ 'onClick': {} },
    }));
    const __VLS_160 = __VLS_159({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_159));
    let __VLS_163;
    const __VLS_164 = ({ click: {} },
        { onClick: (__VLS_ctx.selectAllCustom) });
    const { default: __VLS_165 } = __VLS_161.slots;
    // @ts-ignore
    [selectAllCustom,];
    var __VLS_161;
    var __VLS_162;
    let __VLS_166;
    /** @ts-ignore @type {typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components.elButton | typeof __VLS_components.ElButton} */
    elButton;
    // @ts-ignore
    const __VLS_167 = __VLS_asFunctionalComponent1(__VLS_166, new __VLS_166({
        ...{ 'onClick': {} },
    }));
    const __VLS_168 = __VLS_167({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_167));
    let __VLS_171;
    const __VLS_172 = ({ click: {} },
        { onClick: (__VLS_ctx.clearCustom) });
    const { default: __VLS_173 } = __VLS_169.slots;
    // @ts-ignore
    [clearCustom,];
    var __VLS_169;
    var __VLS_170;
    let __VLS_174;
    /** @ts-ignore @type {typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components.elButton | typeof __VLS_components.ElButton} */
    elButton;
    // @ts-ignore
    const __VLS_175 = __VLS_asFunctionalComponent1(__VLS_174, new __VLS_174({
        ...{ 'onClick': {} },
        type: "primary",
    }));
    const __VLS_176 = __VLS_175({
        ...{ 'onClick': {} },
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_175));
    let __VLS_179;
    const __VLS_180 = ({ click: {} },
        { onClick: (...[$event]) => {
                __VLS_ctx.customDialogVisible = false;
                // @ts-ignore
                [customDialogVisible,];
            } });
    const { default: __VLS_181 } = __VLS_177.slots;
    // @ts-ignore
    [];
    var __VLS_177;
    var __VLS_178;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_137;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
