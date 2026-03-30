/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, computed, watch, onMounted } from 'vue';
import { ZoomIn, ZoomOut, FullScreen } from '@element-plus/icons-vue';
import { usePindouStore } from '../stores/pindou';
const store = usePindouStore();
const containerRef = ref();
const canvasRef = ref();
// Canvas 设置
const beadSize = 20;
const beadGap = 1;
const canvasWidth = computed(() => store.gridSize.width * (beadSize + beadGap) + beadGap);
const canvasHeight = computed(() => store.gridSize.height * (beadSize + beadGap) + beadGap);
// 缩放和平移
const zoomLevel = computed({
    get: () => store.zoomLevel,
    set: (val) => { store.zoomLevel = Math.max(0.5, Math.min(5, val)); }
});
const showGrid = computed({
    get: () => store.showGrid,
    set: (val) => { store.showGrid = val; }
});
const showNumbers = computed({
    get: () => store.showNumbers,
    set: (val) => { store.showNumbers = val; }
});
const wrapperStyle = computed(() => ({
    transform: `scale(${zoomLevel.value}) translate(${store.panOffset.x}px, ${store.panOffset.y}px)`,
    transformOrigin: 'center center'
}));
// 绘制
function draw() {
    const canvas = canvasRef.value;
    if (!canvas)
        return;
    const ctx = canvas.getContext('2d');
    if (!ctx)
        return;
    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // 绘制背景
    ctx.fillStyle = '#1f2937';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // 绘制每个像素
    for (const pixel of store.pixelData) {
        const x = pixel.x * (beadSize + beadGap) + beadGap;
        const y = pixel.y * (beadSize + beadGap) + beadGap;
        // 绘制珠子
        ctx.fillStyle = pixel.hex;
        ctx.beginPath();
        ctx.roundRect(x, y, beadSize, beadSize, 3);
        ctx.fill();
        // 绘制珠子阴影效果
        const gradient = ctx.createRadialGradient(x + beadSize / 2, y + beadSize / 2, 0, x + beadSize / 2, y + beadSize / 2, beadSize / 2);
        gradient.addColorStop(0, 'rgba(255,255,255,0.1)');
        gradient.addColorStop(1, 'rgba(0,0,0,0.2)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x, y, beadSize, beadSize, 3);
        ctx.fill();
        // 绘制中心孔
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.beginPath();
        ctx.arc(x + beadSize / 2, y + beadSize / 2, beadSize / 6, 0, Math.PI * 2);
        ctx.fill();
    }
    // 绘制网格
    if (showGrid.value) {
        ctx.strokeStyle = 'rgba(255,255,255,0.1)';
        ctx.lineWidth = 0.5;
        for (let i = 0; i <= store.gridSize.width; i++) {
            const x = i * (beadSize + beadGap) + beadGap / 2;
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }
        for (let i = 0; i <= store.gridSize.height; i++) {
            const y = i * (beadSize + beadGap) + beadGap / 2;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }
    }
    // 绘制色号（仅在大缩放级别时显示）
    if (showNumbers.value && zoomLevel.value >= 1.5) {
        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.font = '8px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        for (const pixel of store.pixelData) {
            const x = pixel.x * (beadSize + beadGap) + beadGap + beadSize / 2;
            const y = pixel.y * (beadSize + beadGap) + beadGap + beadSize / 2;
            ctx.fillText(pixel.colorCode.slice(-2), x, y);
        }
    }
}
// 监听数据变化
watch(() => store.pixelData, draw, { deep: true });
watch(showGrid, draw);
watch(showNumbers, draw);
watch(zoomLevel, draw);
onMounted(() => {
    draw();
});
// 缩放控制
function zoomIn() {
    zoomLevel.value += 0.25;
}
function zoomOut() {
    zoomLevel.value -= 0.25;
}
function resetView() {
    store.resetView();
}
// 拖拽平移
let isDragging = false;
let lastPos = { x: 0, y: 0 };
function handleMouseDown(e) {
    if (e.button === 0) {
        isDragging = true;
        lastPos = { x: e.clientX, y: e.clientY };
        containerRef.value?.classList.add('dragging');
    }
}
function handleMouseMove(e) {
    if (isDragging) {
        const deltaX = (e.clientX - lastPos.x) / zoomLevel.value;
        const deltaY = (e.clientY - lastPos.y) / zoomLevel.value;
        store.panOffset.x += deltaX;
        store.panOffset.y += deltaY;
        lastPos = { x: e.clientX, y: e.clientY };
    }
}
function handleMouseUp() {
    isDragging = false;
    containerRef.value?.classList.remove('dragging');
}
function handleWheel(e) {
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    zoomLevel.value += delta;
}
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['canvas-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['canvas-wrapper']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "pixel-canvas-container" },
    ref: "containerRef",
});
/** @type {__VLS_StyleScopedClasses['pixel-canvas-container']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ onMousedown: (__VLS_ctx.handleMouseDown) },
    ...{ onMousemove: (__VLS_ctx.handleMouseMove) },
    ...{ onMouseup: (__VLS_ctx.handleMouseUp) },
    ...{ onMouseleave: (__VLS_ctx.handleMouseUp) },
    ...{ onWheel: (__VLS_ctx.handleWheel) },
    ...{ class: "canvas-wrapper" },
    ...{ style: (__VLS_ctx.wrapperStyle) },
});
/** @type {__VLS_StyleScopedClasses['canvas-wrapper']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.canvas)({
    ref: "canvasRef",
    width: (__VLS_ctx.canvasWidth),
    height: (__VLS_ctx.canvasHeight),
    ...{ class: "pixel-canvas" },
});
/** @type {__VLS_StyleScopedClasses['pixel-canvas']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "canvas-controls" },
});
/** @type {__VLS_StyleScopedClasses['canvas-controls']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "zoom-controls" },
});
/** @type {__VLS_StyleScopedClasses['zoom-controls']} */ ;
let __VLS_0;
/** @ts-ignore @type {typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components.elButton | typeof __VLS_components.ElButton} */
elButton;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    ...{ 'onClick': {} },
    size: "small",
}));
const __VLS_2 = __VLS_1({
    ...{ 'onClick': {} },
    size: "small",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_5;
const __VLS_6 = ({ click: {} },
    { onClick: (__VLS_ctx.zoomOut) });
const { default: __VLS_7 } = __VLS_3.slots;
let __VLS_8;
/** @ts-ignore @type {typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon} */
elIcon;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent1(__VLS_8, new __VLS_8({}));
const __VLS_10 = __VLS_9({}, ...__VLS_functionalComponentArgsRest(__VLS_9));
const { default: __VLS_13 } = __VLS_11.slots;
let __VLS_14;
/** @ts-ignore @type {typeof __VLS_components.ZoomOut} */
ZoomOut;
// @ts-ignore
const __VLS_15 = __VLS_asFunctionalComponent1(__VLS_14, new __VLS_14({}));
const __VLS_16 = __VLS_15({}, ...__VLS_functionalComponentArgsRest(__VLS_15));
// @ts-ignore
[handleMouseDown, handleMouseMove, handleMouseUp, handleMouseUp, handleWheel, wrapperStyle, canvasWidth, canvasHeight, zoomOut,];
var __VLS_11;
// @ts-ignore
[];
var __VLS_3;
var __VLS_4;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "zoom-level" },
});
/** @type {__VLS_StyleScopedClasses['zoom-level']} */ ;
(Math.round(__VLS_ctx.zoomLevel * 100));
let __VLS_19;
/** @ts-ignore @type {typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components.elButton | typeof __VLS_components.ElButton} */
elButton;
// @ts-ignore
const __VLS_20 = __VLS_asFunctionalComponent1(__VLS_19, new __VLS_19({
    ...{ 'onClick': {} },
    size: "small",
}));
const __VLS_21 = __VLS_20({
    ...{ 'onClick': {} },
    size: "small",
}, ...__VLS_functionalComponentArgsRest(__VLS_20));
let __VLS_24;
const __VLS_25 = ({ click: {} },
    { onClick: (__VLS_ctx.zoomIn) });
const { default: __VLS_26 } = __VLS_22.slots;
let __VLS_27;
/** @ts-ignore @type {typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon} */
elIcon;
// @ts-ignore
const __VLS_28 = __VLS_asFunctionalComponent1(__VLS_27, new __VLS_27({}));
const __VLS_29 = __VLS_28({}, ...__VLS_functionalComponentArgsRest(__VLS_28));
const { default: __VLS_32 } = __VLS_30.slots;
let __VLS_33;
/** @ts-ignore @type {typeof __VLS_components.ZoomIn} */
ZoomIn;
// @ts-ignore
const __VLS_34 = __VLS_asFunctionalComponent1(__VLS_33, new __VLS_33({}));
const __VLS_35 = __VLS_34({}, ...__VLS_functionalComponentArgsRest(__VLS_34));
// @ts-ignore
[zoomLevel, zoomIn,];
var __VLS_30;
// @ts-ignore
[];
var __VLS_22;
var __VLS_23;
let __VLS_38;
/** @ts-ignore @type {typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components.elButton | typeof __VLS_components.ElButton} */
elButton;
// @ts-ignore
const __VLS_39 = __VLS_asFunctionalComponent1(__VLS_38, new __VLS_38({
    ...{ 'onClick': {} },
    size: "small",
}));
const __VLS_40 = __VLS_39({
    ...{ 'onClick': {} },
    size: "small",
}, ...__VLS_functionalComponentArgsRest(__VLS_39));
let __VLS_43;
const __VLS_44 = ({ click: {} },
    { onClick: (__VLS_ctx.resetView) });
const { default: __VLS_45 } = __VLS_41.slots;
let __VLS_46;
/** @ts-ignore @type {typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon} */
elIcon;
// @ts-ignore
const __VLS_47 = __VLS_asFunctionalComponent1(__VLS_46, new __VLS_46({}));
const __VLS_48 = __VLS_47({}, ...__VLS_functionalComponentArgsRest(__VLS_47));
const { default: __VLS_51 } = __VLS_49.slots;
let __VLS_52;
/** @ts-ignore @type {typeof __VLS_components.FullScreen} */
FullScreen;
// @ts-ignore
const __VLS_53 = __VLS_asFunctionalComponent1(__VLS_52, new __VLS_52({}));
const __VLS_54 = __VLS_53({}, ...__VLS_functionalComponentArgsRest(__VLS_53));
// @ts-ignore
[resetView,];
var __VLS_49;
// @ts-ignore
[];
var __VLS_41;
var __VLS_42;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "display-options" },
});
/** @type {__VLS_StyleScopedClasses['display-options']} */ ;
let __VLS_57;
/** @ts-ignore @type {typeof __VLS_components.elCheckbox | typeof __VLS_components.ElCheckbox | typeof __VLS_components.elCheckbox | typeof __VLS_components.ElCheckbox} */
elCheckbox;
// @ts-ignore
const __VLS_58 = __VLS_asFunctionalComponent1(__VLS_57, new __VLS_57({
    modelValue: (__VLS_ctx.showGrid),
}));
const __VLS_59 = __VLS_58({
    modelValue: (__VLS_ctx.showGrid),
}, ...__VLS_functionalComponentArgsRest(__VLS_58));
const { default: __VLS_62 } = __VLS_60.slots;
// @ts-ignore
[showGrid,];
var __VLS_60;
let __VLS_63;
/** @ts-ignore @type {typeof __VLS_components.elCheckbox | typeof __VLS_components.ElCheckbox | typeof __VLS_components.elCheckbox | typeof __VLS_components.ElCheckbox} */
elCheckbox;
// @ts-ignore
const __VLS_64 = __VLS_asFunctionalComponent1(__VLS_63, new __VLS_63({
    modelValue: (__VLS_ctx.showNumbers),
}));
const __VLS_65 = __VLS_64({
    modelValue: (__VLS_ctx.showNumbers),
}, ...__VLS_functionalComponentArgsRest(__VLS_64));
const { default: __VLS_68 } = __VLS_66.slots;
// @ts-ignore
[showNumbers,];
var __VLS_66;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
