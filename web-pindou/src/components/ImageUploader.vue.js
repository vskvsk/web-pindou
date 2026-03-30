/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, watch } from 'vue';
import { Upload, Refresh, Delete } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
const props = defineProps();
const emit = defineEmits();
const fileInput = ref();
const dragging = ref(false);
const previewUrl = ref('');
const fileName = ref('');
watch(() => props.modelValue, (newVal) => {
    if (!newVal) {
        previewUrl.value = '';
        fileName.value = '';
    }
});
function triggerFileInput() {
    fileInput.value?.click();
}
function handleFileChange(e) {
    const files = e.target.files;
    if (files && files.length > 0) {
        processFile(files[0]);
    }
}
function handleDrop(e) {
    dragging.value = false;
    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
        if (files[0].type.startsWith('image/')) {
            processFile(files[0]);
        }
        else {
            ElMessage.error('请上传图片文件');
        }
    }
}
function processFile(file) {
    if (!file.type.startsWith('image/')) {
        ElMessage.error('请上传图片文件');
        return;
    }
    if (file.size > 10 * 1024 * 1024) {
        ElMessage.error('图片大小不能超过 10MB');
        return;
    }
    fileName.value = file.name;
    const reader = new FileReader();
    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            previewUrl.value = e.target?.result;
            emit('update:modelValue', img);
        };
        img.src = e.target?.result;
    };
    reader.readAsDataURL(file);
    emit('change', file);
}
function clearImage() {
    previewUrl.value = '';
    fileName.value = '';
    if (fileInput.value) {
        fileInput.value.value = '';
    }
    emit('update:modelValue', null);
}
const __VLS_ctx = {
    ...{},
    ...{},
    ...{},
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['upload-zone']} */ ;
/** @type {__VLS_StyleScopedClasses['upload-zone']} */ ;
/** @type {__VLS_StyleScopedClasses['dark']} */ ;
/** @type {__VLS_StyleScopedClasses['upload-zone']} */ ;
/** @type {__VLS_StyleScopedClasses['upload-zone']} */ ;
/** @type {__VLS_StyleScopedClasses['dark']} */ ;
/** @type {__VLS_StyleScopedClasses['upload-zone']} */ ;
/** @type {__VLS_StyleScopedClasses['dragging']} */ ;
/** @type {__VLS_StyleScopedClasses['upload-zone']} */ ;
/** @type {__VLS_StyleScopedClasses['dark']} */ ;
/** @type {__VLS_StyleScopedClasses['upload-text']} */ ;
/** @type {__VLS_StyleScopedClasses['upload-zone']} */ ;
/** @type {__VLS_StyleScopedClasses['has-image']} */ ;
/** @type {__VLS_StyleScopedClasses['upload-overlay']} */ ;
/** @type {__VLS_StyleScopedClasses['dark']} */ ;
/** @type {__VLS_StyleScopedClasses['file-info']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "image-uploader" },
});
/** @type {__VLS_StyleScopedClasses['image-uploader']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ onDragenter: (...[$event]) => {
            __VLS_ctx.dragging = true;
            // @ts-ignore
            [dragging,];
        } },
    ...{ onDragleave: (...[$event]) => {
            __VLS_ctx.dragging = false;
            // @ts-ignore
            [dragging,];
        } },
    ...{ onDragover: () => { } },
    ...{ onDrop: (__VLS_ctx.handleDrop) },
    ...{ onClick: (__VLS_ctx.triggerFileInput) },
    ...{ class: "upload-zone" },
    ...{ class: ({ dragging: __VLS_ctx.dragging, 'has-image': __VLS_ctx.previewUrl }) },
});
/** @type {__VLS_StyleScopedClasses['upload-zone']} */ ;
/** @type {__VLS_StyleScopedClasses['dragging']} */ ;
/** @type {__VLS_StyleScopedClasses['has-image']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.input)({
    ...{ onChange: (__VLS_ctx.handleFileChange) },
    ref: "fileInput",
    type: "file",
    accept: "image/jpeg,image/png,image/webp,image/gif",
    ...{ class: "hidden" },
});
/** @type {__VLS_StyleScopedClasses['hidden']} */ ;
if (!__VLS_ctx.previewUrl) {
    let __VLS_0;
    /** @ts-ignore @type {typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon} */
    elIcon;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
        ...{ class: "upload-icon" },
    }));
    const __VLS_2 = __VLS_1({
        ...{ class: "upload-icon" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    /** @type {__VLS_StyleScopedClasses['upload-icon']} */ ;
    const { default: __VLS_5 } = __VLS_3.slots;
    let __VLS_6;
    /** @ts-ignore @type {typeof __VLS_components.Upload} */
    Upload;
    // @ts-ignore
    const __VLS_7 = __VLS_asFunctionalComponent1(__VLS_6, new __VLS_6({}));
    const __VLS_8 = __VLS_7({}, ...__VLS_functionalComponentArgsRest(__VLS_7));
    // @ts-ignore
    [dragging, handleDrop, triggerFileInput, previewUrl, previewUrl, handleFileChange,];
    var __VLS_3;
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "upload-text" },
    });
    /** @type {__VLS_StyleScopedClasses['upload-text']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "upload-hint" },
    });
    /** @type {__VLS_StyleScopedClasses['upload-hint']} */ ;
}
else {
    __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
        src: (__VLS_ctx.previewUrl),
        alt: "Preview",
        ...{ class: "preview-image" },
    });
    /** @type {__VLS_StyleScopedClasses['preview-image']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "upload-overlay" },
    });
    /** @type {__VLS_StyleScopedClasses['upload-overlay']} */ ;
    let __VLS_11;
    /** @ts-ignore @type {typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon} */
    elIcon;
    // @ts-ignore
    const __VLS_12 = __VLS_asFunctionalComponent1(__VLS_11, new __VLS_11({}));
    const __VLS_13 = __VLS_12({}, ...__VLS_functionalComponentArgsRest(__VLS_12));
    const { default: __VLS_16 } = __VLS_14.slots;
    let __VLS_17;
    /** @ts-ignore @type {typeof __VLS_components.Refresh} */
    Refresh;
    // @ts-ignore
    const __VLS_18 = __VLS_asFunctionalComponent1(__VLS_17, new __VLS_17({}));
    const __VLS_19 = __VLS_18({}, ...__VLS_functionalComponentArgsRest(__VLS_18));
    // @ts-ignore
    [previewUrl,];
    var __VLS_14;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
}
if (__VLS_ctx.fileName) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "file-info" },
    });
    /** @type {__VLS_StyleScopedClasses['file-info']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    (__VLS_ctx.fileName);
    let __VLS_22;
    /** @ts-ignore @type {typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components.elButton | typeof __VLS_components.ElButton} */
    elButton;
    // @ts-ignore
    const __VLS_23 = __VLS_asFunctionalComponent1(__VLS_22, new __VLS_22({
        ...{ 'onClick': {} },
        type: "danger",
        size: "small",
        text: true,
    }));
    const __VLS_24 = __VLS_23({
        ...{ 'onClick': {} },
        type: "danger",
        size: "small",
        text: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_23));
    let __VLS_27;
    const __VLS_28 = ({ click: {} },
        { onClick: (__VLS_ctx.clearImage) });
    const { default: __VLS_29 } = __VLS_25.slots;
    let __VLS_30;
    /** @ts-ignore @type {typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon} */
    elIcon;
    // @ts-ignore
    const __VLS_31 = __VLS_asFunctionalComponent1(__VLS_30, new __VLS_30({}));
    const __VLS_32 = __VLS_31({}, ...__VLS_functionalComponentArgsRest(__VLS_31));
    const { default: __VLS_35 } = __VLS_33.slots;
    let __VLS_36;
    /** @ts-ignore @type {typeof __VLS_components.Delete} */
    Delete;
    // @ts-ignore
    const __VLS_37 = __VLS_asFunctionalComponent1(__VLS_36, new __VLS_36({}));
    const __VLS_38 = __VLS_37({}, ...__VLS_functionalComponentArgsRest(__VLS_37));
    // @ts-ignore
    [fileName, fileName, clearImage,];
    var __VLS_33;
    // @ts-ignore
    [];
    var __VLS_25;
    var __VLS_26;
}
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    __typeEmits: {},
    __typeProps: {},
});
export default {};
