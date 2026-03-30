import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { mardColors } from '../data/colors';
export const usePindouStore = defineStore('pindou', () => {
    // ============ 状态 ============
    const originalImage = ref(null);
    const pixelData = ref([]);
    const gridSize = ref({ width: 52, height: 52 });
    /** 品牌 / 色板（多品牌 UI；匹配数据见 colors 说明） */
    const paletteBrandId = ref('MARD');
    /** 自定义模式下允许的色号（自 MARD 色库勾选） */
    const customPaletteCodes = ref([]);
    const useCIEDE2000 = ref(true);
    const isProcessing = ref(false);
    const brightness = ref(0);
    const contrast = ref(0);
    const saturation = ref(0);
    const showGrid = ref(true);
    const showNumbers = ref(false);
    const zoomLevel = ref(1);
    const panOffset = ref({ x: 0, y: 0 });
    const selectedColorFilter = ref(null);
    const isDarkMode = ref(false);
    // ============ Getters ============
    const colors = computed(() => {
        if (paletteBrandId.value === 'CUSTOM') {
            if (customPaletteCodes.value.length === 0)
                return mardColors;
            const set = new Set(customPaletteCodes.value);
            return mardColors.filter((c) => set.has(c.code));
        }
        return mardColors;
    });
    const colorCounts = computed(() => {
        const counts = new Map();
        for (const pixel of pixelData.value) {
            const color = mardColors.find(c => c.code === pixel.colorCode);
            if (color) {
                if (counts.has(pixel.colorCode)) {
                    counts.get(pixel.colorCode).count++;
                }
                else {
                    counts.set(pixel.colorCode, { color, count: 1 });
                }
            }
        }
        return Array.from(counts.values()).sort((a, b) => b.count - a.count);
    });
    const totalBeads = computed(() => pixelData.value.length);
    const uniqueColors = computed(() => colorCounts.value.length);
    const filteredPixelData = computed(() => {
        if (!selectedColorFilter.value)
            return pixelData.value;
        return pixelData.value.filter(p => p.colorCode === selectedColorFilter.value);
    });
    // ============ Actions ============
    function setOriginalImage(img) {
        originalImage.value = img;
    }
    function setPixelData(data) {
        pixelData.value = data;
    }
    function setGridSize(width, height) {
        gridSize.value = { width, height };
    }
    function setIsProcessing(processing) {
        isProcessing.value = processing;
    }
    function resetView() {
        zoomLevel.value = 1;
        panOffset.value = { x: 0, y: 0 };
    }
    function toggleDarkMode() {
        isDarkMode.value = !isDarkMode.value;
        if (isDarkMode.value) {
            document.documentElement.classList.add('dark');
        }
        else {
            document.documentElement.classList.remove('dark');
        }
    }
    function clearProject() {
        originalImage.value = null;
        pixelData.value = [];
        resetView();
    }
    function exportToJSON() {
        const exportData = {
            gridSize: gridSize.value,
            paletteBrandId: paletteBrandId.value,
            customPaletteCodes: customPaletteCodes.value,
            pixelData: pixelData.value,
            colorCounts: colorCounts.value.map(c => ({
                code: c.color.code,
                count: c.count
            })),
            totalBeads: totalBeads.value,
            uniqueColors: uniqueColors.value
        };
        return JSON.stringify(exportData, null, 2);
    }
    return {
        // 状态
        originalImage,
        pixelData,
        gridSize,
        paletteBrandId,
        customPaletteCodes,
        useCIEDE2000,
        isProcessing,
        brightness,
        contrast,
        saturation,
        showGrid,
        showNumbers,
        zoomLevel,
        panOffset,
        selectedColorFilter,
        isDarkMode,
        // Getters
        colors,
        colorCounts,
        totalBeads,
        uniqueColors,
        filteredPixelData,
        // Actions
        setOriginalImage,
        setPixelData,
        setGridSize,
        setIsProcessing,
        resetView,
        toggleDarkMode,
        clearProject,
        exportToJSON
    };
});
