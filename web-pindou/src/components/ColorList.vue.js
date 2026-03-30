/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { computed } from 'vue';
import { DocumentCopy, Download } from '@element-plus/icons-vue';
import { usePindouStore } from '../stores/pindou';
import { ElMessage } from 'element-plus';
const store = usePindouStore();
const colorCounts = computed(() => store.colorCounts);
const totalBeads = computed(() => store.totalBeads);
const uniqueColors = computed(() => store.uniqueColors);
const selectedFilter = computed(() => store.selectedColorFilter);
function toggleFilter(colorCode) {
    if (store.selectedColorFilter === colorCode) {
        store.selectedColorFilter = null;
    }
    else {
        store.selectedColorFilter = colorCode;
    }
}
function copyList() {
    const lines = [
        '拼豆用量清单',
        `总计: ${totalBeads.value} 颗 | ${uniqueColors.value} 种颜色`,
        '',
        ...colorCounts.value.map(item => `${item.color.code}\t${item.color.nameCn || item.color.name}\t${item.count}颗`)
    ];
    navigator.clipboard.writeText(lines.join('\n'));
    ElMessage.success('清单已复制到剪贴板');
}
function exportCSV() {
    const headers = '色号,名称,数量,占比\n';
    const rows = colorCounts.value.map(item => `${item.color.code},${item.color.nameCn || item.color.name},${item.count},${((item.count / totalBeads.value) * 100).toFixed(1)}%`).join('\n');
    const blob = new Blob(['\uFEFF' + headers + rows], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `拼豆清单_${store.gridSize.width}x${store.gridSize.height}_${Date.now()}.csv`;
    link.click();
    ElMessage.success('CSV 已导出');
}
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['color-list-panel']} */ ;
/** @type {__VLS_StyleScopedClasses['dark']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-title']} */ ;
/** @type {__VLS_StyleScopedClasses['color-item']} */ ;
/** @type {__VLS_StyleScopedClasses['dark']} */ ;
/** @type {__VLS_StyleScopedClasses['color-item']} */ ;
/** @type {__VLS_StyleScopedClasses['color-item']} */ ;
/** @type {__VLS_StyleScopedClasses['dark']} */ ;
/** @type {__VLS_StyleScopedClasses['color-item']} */ ;
/** @type {__VLS_StyleScopedClasses['active']} */ ;
/** @type {__VLS_StyleScopedClasses['dark']} */ ;
/** @type {__VLS_StyleScopedClasses['color-swatch']} */ ;
/** @type {__VLS_StyleScopedClasses['dark']} */ ;
/** @type {__VLS_StyleScopedClasses['color-name']} */ ;
/** @type {__VLS_StyleScopedClasses['dark']} */ ;
/** @type {__VLS_StyleScopedClasses['color-count']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "color-list-panel" },
});
/** @type {__VLS_StyleScopedClasses['color-list-panel']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "panel-header" },
});
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h3, __VLS_intrinsics.h3)({
    ...{ class: "panel-title" },
});
/** @type {__VLS_StyleScopedClasses['panel-title']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "stats" },
});
/** @type {__VLS_StyleScopedClasses['stats']} */ ;
let __VLS_0;
/** @ts-ignore @type {typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components.elTag | typeof __VLS_components.ElTag} */
elTag;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    type: "info",
    size: "small",
}));
const __VLS_2 = __VLS_1({
    type: "info",
    size: "small",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
const { default: __VLS_5 } = __VLS_3.slots;
(__VLS_ctx.totalBeads);
// @ts-ignore
[totalBeads,];
var __VLS_3;
let __VLS_6;
/** @ts-ignore @type {typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components.elTag | typeof __VLS_components.ElTag} */
elTag;
// @ts-ignore
const __VLS_7 = __VLS_asFunctionalComponent1(__VLS_6, new __VLS_6({
    type: "success",
    size: "small",
}));
const __VLS_8 = __VLS_7({
    type: "success",
    size: "small",
}, ...__VLS_functionalComponentArgsRest(__VLS_7));
const { default: __VLS_11 } = __VLS_9.slots;
(__VLS_ctx.uniqueColors);
// @ts-ignore
[uniqueColors,];
var __VLS_9;
if (__VLS_ctx.colorCounts.length > 0) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "color-list" },
    });
    /** @type {__VLS_StyleScopedClasses['color-list']} */ ;
    for (const [item] of __VLS_vFor((__VLS_ctx.colorCounts))) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ onClick: (...[$event]) => {
                    if (!(__VLS_ctx.colorCounts.length > 0))
                        return;
                    __VLS_ctx.toggleFilter(item.color.code);
                    // @ts-ignore
                    [colorCounts, colorCounts, toggleFilter,];
                } },
            key: (item.color.code),
            ...{ class: "color-item" },
            ...{ class: ({ active: __VLS_ctx.selectedFilter === item.color.code }) },
        });
        /** @type {__VLS_StyleScopedClasses['color-item']} */ ;
        /** @type {__VLS_StyleScopedClasses['active']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "color-swatch" },
            ...{ style: ({ backgroundColor: item.color.hex }) },
        });
        /** @type {__VLS_StyleScopedClasses['color-swatch']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "color-code" },
        });
        /** @type {__VLS_StyleScopedClasses['color-code']} */ ;
        (item.color.code);
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "color-info" },
        });
        /** @type {__VLS_StyleScopedClasses['color-info']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "color-name" },
        });
        /** @type {__VLS_StyleScopedClasses['color-name']} */ ;
        (item.color.nameCn || item.color.name);
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "color-count" },
        });
        /** @type {__VLS_StyleScopedClasses['color-count']} */ ;
        (item.count);
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "color-percentage" },
        });
        /** @type {__VLS_StyleScopedClasses['color-percentage']} */ ;
        (((item.count / __VLS_ctx.totalBeads) * 100).toFixed(1));
        // @ts-ignore
        [totalBeads, selectedFilter,];
    }
}
else {
    let __VLS_12;
    /** @ts-ignore @type {typeof __VLS_components.elEmpty | typeof __VLS_components.ElEmpty} */
    elEmpty;
    // @ts-ignore
    const __VLS_13 = __VLS_asFunctionalComponent1(__VLS_12, new __VLS_12({
        description: "暂无数据，请先生成拼豆图",
    }));
    const __VLS_14 = __VLS_13({
        description: "暂无数据，请先生成拼豆图",
    }, ...__VLS_functionalComponentArgsRest(__VLS_13));
}
if (__VLS_ctx.colorCounts.length > 0) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "export-section" },
    });
    /** @type {__VLS_StyleScopedClasses['export-section']} */ ;
    let __VLS_17;
    /** @ts-ignore @type {typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider} */
    elDivider;
    // @ts-ignore
    const __VLS_18 = __VLS_asFunctionalComponent1(__VLS_17, new __VLS_17({}));
    const __VLS_19 = __VLS_18({}, ...__VLS_functionalComponentArgsRest(__VLS_18));
    let __VLS_22;
    /** @ts-ignore @type {typeof __VLS_components.elButtonGroup | typeof __VLS_components.ElButtonGroup | typeof __VLS_components.elButtonGroup | typeof __VLS_components.ElButtonGroup} */
    elButtonGroup;
    // @ts-ignore
    const __VLS_23 = __VLS_asFunctionalComponent1(__VLS_22, new __VLS_22({
        ...{ class: "w-full" },
    }));
    const __VLS_24 = __VLS_23({
        ...{ class: "w-full" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_23));
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    const { default: __VLS_27 } = __VLS_25.slots;
    let __VLS_28;
    /** @ts-ignore @type {typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components.elButton | typeof __VLS_components.ElButton} */
    elButton;
    // @ts-ignore
    const __VLS_29 = __VLS_asFunctionalComponent1(__VLS_28, new __VLS_28({
        ...{ 'onClick': {} },
        icon: (__VLS_ctx.DocumentCopy),
    }));
    const __VLS_30 = __VLS_29({
        ...{ 'onClick': {} },
        icon: (__VLS_ctx.DocumentCopy),
    }, ...__VLS_functionalComponentArgsRest(__VLS_29));
    let __VLS_33;
    const __VLS_34 = ({ click: {} },
        { onClick: (__VLS_ctx.copyList) });
    const { default: __VLS_35 } = __VLS_31.slots;
    // @ts-ignore
    [colorCounts, DocumentCopy, copyList,];
    var __VLS_31;
    var __VLS_32;
    let __VLS_36;
    /** @ts-ignore @type {typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components.elButton | typeof __VLS_components.ElButton} */
    elButton;
    // @ts-ignore
    const __VLS_37 = __VLS_asFunctionalComponent1(__VLS_36, new __VLS_36({
        ...{ 'onClick': {} },
        icon: (__VLS_ctx.Download),
    }));
    const __VLS_38 = __VLS_37({
        ...{ 'onClick': {} },
        icon: (__VLS_ctx.Download),
    }, ...__VLS_functionalComponentArgsRest(__VLS_37));
    let __VLS_41;
    const __VLS_42 = ({ click: {} },
        { onClick: (__VLS_ctx.exportCSV) });
    const { default: __VLS_43 } = __VLS_39.slots;
    // @ts-ignore
    [Download, exportCSV,];
    var __VLS_39;
    var __VLS_40;
    // @ts-ignore
    [];
    var __VLS_25;
}
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
