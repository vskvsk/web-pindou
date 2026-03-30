/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, computed } from 'vue';
import { Moon, Sunny, ArrowDown, Delete, QuestionFilled, InfoFilled } from '@element-plus/icons-vue';
import { usePindouStore } from '../stores/pindou';
import { ElMessageBox } from 'element-plus';
const store = usePindouStore();
const isDarkMode = computed(() => store.isDarkMode);
const helpVisible = ref(false);
const aboutVisible = ref(false);
function toggleDarkMode() {
    store.toggleDarkMode();
}
function clearProject() {
    ElMessageBox.confirm('确定要清空当前项目吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        store.clearProject();
    });
}
function showHelp() {
    helpVisible.value = true;
}
function showAbout() {
    aboutVisible.value = true;
}
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['app-header']} */ ;
/** @type {__VLS_StyleScopedClasses['dark']} */ ;
/** @type {__VLS_StyleScopedClasses['logo-text']} */ ;
/** @type {__VLS_StyleScopedClasses['dark']} */ ;
/** @type {__VLS_StyleScopedClasses['logo-sub']} */ ;
/** @type {__VLS_StyleScopedClasses['dark']} */ ;
/** @type {__VLS_StyleScopedClasses['version']} */ ;
/** @type {__VLS_StyleScopedClasses['dark']} */ ;
/** @type {__VLS_StyleScopedClasses['help-content']} */ ;
/** @type {__VLS_StyleScopedClasses['help-content']} */ ;
/** @type {__VLS_StyleScopedClasses['help-content']} */ ;
/** @type {__VLS_StyleScopedClasses['dark']} */ ;
/** @type {__VLS_StyleScopedClasses['help-content']} */ ;
/** @type {__VLS_StyleScopedClasses['help-content']} */ ;
/** @type {__VLS_StyleScopedClasses['help-content']} */ ;
/** @type {__VLS_StyleScopedClasses['help-content']} */ ;
/** @type {__VLS_StyleScopedClasses['about-content']} */ ;
/** @type {__VLS_StyleScopedClasses['dark']} */ ;
/** @type {__VLS_StyleScopedClasses['about-content']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.header, __VLS_intrinsics.header)({
    ...{ class: "app-header" },
});
/** @type {__VLS_StyleScopedClasses['app-header']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "header-left" },
});
/** @type {__VLS_StyleScopedClasses['header-left']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "logo" },
});
/** @type {__VLS_StyleScopedClasses['logo']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "logo-icon" },
});
/** @type {__VLS_StyleScopedClasses['logo-icon']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.svg, __VLS_intrinsics.svg)({
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    'stroke-width': "2",
});
__VLS_asFunctionalElement1(__VLS_intrinsics.circle)({
    cx: "12",
    cy: "12",
    r: "10",
});
__VLS_asFunctionalElement1(__VLS_intrinsics.circle)({
    cx: "12",
    cy: "12",
    r: "3",
    fill: "currentColor",
});
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "logo-titles" },
});
/** @type {__VLS_StyleScopedClasses['logo-titles']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h1, __VLS_intrinsics.h1)({
    ...{ class: "logo-text" },
});
/** @type {__VLS_StyleScopedClasses['logo-text']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "logo-sub" },
});
/** @type {__VLS_StyleScopedClasses['logo-sub']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "version" },
});
/** @type {__VLS_StyleScopedClasses['version']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "header-right" },
});
/** @type {__VLS_StyleScopedClasses['header-right']} */ ;
let __VLS_0;
/** @ts-ignore @type {typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components.elButton | typeof __VLS_components.ElButton} */
elButton;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    ...{ 'onClick': {} },
    text: true,
}));
const __VLS_2 = __VLS_1({
    ...{ 'onClick': {} },
    text: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_5;
const __VLS_6 = ({ click: {} },
    { onClick: (__VLS_ctx.toggleDarkMode) });
const { default: __VLS_7 } = __VLS_3.slots;
let __VLS_8;
/** @ts-ignore @type {typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon} */
elIcon;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent1(__VLS_8, new __VLS_8({
    ...{ class: "mr-1" },
}));
const __VLS_10 = __VLS_9({
    ...{ class: "mr-1" },
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
/** @type {__VLS_StyleScopedClasses['mr-1']} */ ;
const { default: __VLS_13 } = __VLS_11.slots;
const __VLS_14 = (__VLS_ctx.isDarkMode ? __VLS_ctx.Sunny : __VLS_ctx.Moon);
// @ts-ignore
const __VLS_15 = __VLS_asFunctionalComponent1(__VLS_14, new __VLS_14({}));
const __VLS_16 = __VLS_15({}, ...__VLS_functionalComponentArgsRest(__VLS_15));
// @ts-ignore
[toggleDarkMode, isDarkMode, Sunny, Moon,];
var __VLS_11;
(__VLS_ctx.isDarkMode ? '浅色' : '深色');
// @ts-ignore
[isDarkMode,];
var __VLS_3;
var __VLS_4;
let __VLS_19;
/** @ts-ignore @type {typeof __VLS_components.elDropdown | typeof __VLS_components.ElDropdown | typeof __VLS_components.elDropdown | typeof __VLS_components.ElDropdown} */
elDropdown;
// @ts-ignore
const __VLS_20 = __VLS_asFunctionalComponent1(__VLS_19, new __VLS_19({}));
const __VLS_21 = __VLS_20({}, ...__VLS_functionalComponentArgsRest(__VLS_20));
const { default: __VLS_24 } = __VLS_22.slots;
let __VLS_25;
/** @ts-ignore @type {typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components.elButton | typeof __VLS_components.ElButton} */
elButton;
// @ts-ignore
const __VLS_26 = __VLS_asFunctionalComponent1(__VLS_25, new __VLS_25({
    text: true,
}));
const __VLS_27 = __VLS_26({
    text: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_26));
const { default: __VLS_30 } = __VLS_28.slots;
let __VLS_31;
/** @ts-ignore @type {typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon} */
elIcon;
// @ts-ignore
const __VLS_32 = __VLS_asFunctionalComponent1(__VLS_31, new __VLS_31({
    ...{ class: "el-icon--right" },
}));
const __VLS_33 = __VLS_32({
    ...{ class: "el-icon--right" },
}, ...__VLS_functionalComponentArgsRest(__VLS_32));
/** @type {__VLS_StyleScopedClasses['el-icon--right']} */ ;
const { default: __VLS_36 } = __VLS_34.slots;
let __VLS_37;
/** @ts-ignore @type {typeof __VLS_components.ArrowDown} */
ArrowDown;
// @ts-ignore
const __VLS_38 = __VLS_asFunctionalComponent1(__VLS_37, new __VLS_37({}));
const __VLS_39 = __VLS_38({}, ...__VLS_functionalComponentArgsRest(__VLS_38));
// @ts-ignore
[];
var __VLS_34;
// @ts-ignore
[];
var __VLS_28;
{
    const { dropdown: __VLS_42 } = __VLS_22.slots;
    let __VLS_43;
    /** @ts-ignore @type {typeof __VLS_components.elDropdownMenu | typeof __VLS_components.ElDropdownMenu | typeof __VLS_components.elDropdownMenu | typeof __VLS_components.ElDropdownMenu} */
    elDropdownMenu;
    // @ts-ignore
    const __VLS_44 = __VLS_asFunctionalComponent1(__VLS_43, new __VLS_43({}));
    const __VLS_45 = __VLS_44({}, ...__VLS_functionalComponentArgsRest(__VLS_44));
    const { default: __VLS_48 } = __VLS_46.slots;
    let __VLS_49;
    /** @ts-ignore @type {typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem} */
    elDropdownItem;
    // @ts-ignore
    const __VLS_50 = __VLS_asFunctionalComponent1(__VLS_49, new __VLS_49({
        ...{ 'onClick': {} },
    }));
    const __VLS_51 = __VLS_50({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_50));
    let __VLS_54;
    const __VLS_55 = ({ click: {} },
        { onClick: (__VLS_ctx.clearProject) });
    const { default: __VLS_56 } = __VLS_52.slots;
    let __VLS_57;
    /** @ts-ignore @type {typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon} */
    elIcon;
    // @ts-ignore
    const __VLS_58 = __VLS_asFunctionalComponent1(__VLS_57, new __VLS_57({}));
    const __VLS_59 = __VLS_58({}, ...__VLS_functionalComponentArgsRest(__VLS_58));
    const { default: __VLS_62 } = __VLS_60.slots;
    let __VLS_63;
    /** @ts-ignore @type {typeof __VLS_components.Delete} */
    Delete;
    // @ts-ignore
    const __VLS_64 = __VLS_asFunctionalComponent1(__VLS_63, new __VLS_63({}));
    const __VLS_65 = __VLS_64({}, ...__VLS_functionalComponentArgsRest(__VLS_64));
    // @ts-ignore
    [clearProject,];
    var __VLS_60;
    // @ts-ignore
    [];
    var __VLS_52;
    var __VLS_53;
    let __VLS_68;
    /** @ts-ignore @type {typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem} */
    elDropdownItem;
    // @ts-ignore
    const __VLS_69 = __VLS_asFunctionalComponent1(__VLS_68, new __VLS_68({
        ...{ 'onClick': {} },
    }));
    const __VLS_70 = __VLS_69({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_69));
    let __VLS_73;
    const __VLS_74 = ({ click: {} },
        { onClick: (__VLS_ctx.showHelp) });
    const { default: __VLS_75 } = __VLS_71.slots;
    let __VLS_76;
    /** @ts-ignore @type {typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon} */
    elIcon;
    // @ts-ignore
    const __VLS_77 = __VLS_asFunctionalComponent1(__VLS_76, new __VLS_76({}));
    const __VLS_78 = __VLS_77({}, ...__VLS_functionalComponentArgsRest(__VLS_77));
    const { default: __VLS_81 } = __VLS_79.slots;
    let __VLS_82;
    /** @ts-ignore @type {typeof __VLS_components.QuestionFilled} */
    QuestionFilled;
    // @ts-ignore
    const __VLS_83 = __VLS_asFunctionalComponent1(__VLS_82, new __VLS_82({}));
    const __VLS_84 = __VLS_83({}, ...__VLS_functionalComponentArgsRest(__VLS_83));
    // @ts-ignore
    [showHelp,];
    var __VLS_79;
    // @ts-ignore
    [];
    var __VLS_71;
    var __VLS_72;
    let __VLS_87;
    /** @ts-ignore @type {typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem} */
    elDropdownItem;
    // @ts-ignore
    const __VLS_88 = __VLS_asFunctionalComponent1(__VLS_87, new __VLS_87({
        ...{ 'onClick': {} },
        divided: true,
    }));
    const __VLS_89 = __VLS_88({
        ...{ 'onClick': {} },
        divided: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_88));
    let __VLS_92;
    const __VLS_93 = ({ click: {} },
        { onClick: (__VLS_ctx.showAbout) });
    const { default: __VLS_94 } = __VLS_90.slots;
    let __VLS_95;
    /** @ts-ignore @type {typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon} */
    elIcon;
    // @ts-ignore
    const __VLS_96 = __VLS_asFunctionalComponent1(__VLS_95, new __VLS_95({}));
    const __VLS_97 = __VLS_96({}, ...__VLS_functionalComponentArgsRest(__VLS_96));
    const { default: __VLS_100 } = __VLS_98.slots;
    let __VLS_101;
    /** @ts-ignore @type {typeof __VLS_components.InfoFilled} */
    InfoFilled;
    // @ts-ignore
    const __VLS_102 = __VLS_asFunctionalComponent1(__VLS_101, new __VLS_101({}));
    const __VLS_103 = __VLS_102({}, ...__VLS_functionalComponentArgsRest(__VLS_102));
    // @ts-ignore
    [showAbout,];
    var __VLS_98;
    // @ts-ignore
    [];
    var __VLS_90;
    var __VLS_91;
    // @ts-ignore
    [];
    var __VLS_46;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_22;
let __VLS_106;
/** @ts-ignore @type {typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog} */
elDialog;
// @ts-ignore
const __VLS_107 = __VLS_asFunctionalComponent1(__VLS_106, new __VLS_106({
    modelValue: (__VLS_ctx.helpVisible),
    title: "使用帮助",
    width: "600px",
}));
const __VLS_108 = __VLS_107({
    modelValue: (__VLS_ctx.helpVisible),
    title: "使用帮助",
    width: "600px",
}, ...__VLS_functionalComponentArgsRest(__VLS_107));
const { default: __VLS_111 } = __VLS_109.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "help-content" },
});
/** @type {__VLS_StyleScopedClasses['help-content']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h4, __VLS_intrinsics.h4)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.ol, __VLS_intrinsics.ol)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.li, __VLS_intrinsics.li)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.li, __VLS_intrinsics.li)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.li, __VLS_intrinsics.li)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.li, __VLS_intrinsics.li)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.li, __VLS_intrinsics.li)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.li, __VLS_intrinsics.li)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.h4, __VLS_intrinsics.h4)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.ul, __VLS_intrinsics.ul)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.li, __VLS_intrinsics.li)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.li, __VLS_intrinsics.li)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.h4, __VLS_intrinsics.h4)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.ul, __VLS_intrinsics.ul)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.li, __VLS_intrinsics.li)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.li, __VLS_intrinsics.li)({});
// @ts-ignore
[helpVisible,];
var __VLS_109;
let __VLS_112;
/** @ts-ignore @type {typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog} */
elDialog;
// @ts-ignore
const __VLS_113 = __VLS_asFunctionalComponent1(__VLS_112, new __VLS_112({
    modelValue: (__VLS_ctx.aboutVisible),
    title: "关于",
    width: "400px",
}));
const __VLS_114 = __VLS_113({
    modelValue: (__VLS_ctx.aboutVisible),
    title: "关于",
    width: "400px",
}, ...__VLS_functionalComponentArgsRest(__VLS_113));
const { default: __VLS_117 } = __VLS_115.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "about-content" },
});
/** @type {__VLS_StyleScopedClasses['about-content']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "about-logo" },
});
/** @type {__VLS_StyleScopedClasses['about-logo']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "tech-stack" },
});
/** @type {__VLS_StyleScopedClasses['tech-stack']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "copyright" },
});
/** @type {__VLS_StyleScopedClasses['copyright']} */ ;
// @ts-ignore
[aboutVisible,];
var __VLS_115;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
