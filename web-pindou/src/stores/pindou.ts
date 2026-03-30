import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { BeadColor } from '../data/colors'
import { mardColors } from '../data/colors'
import type { PaletteBrandId } from '../data/brands'

export interface PixelData {
  x: number
  y: number
  r: number
  g: number
  b: number
  colorCode: string
  hex: string
  /** 是否被当作“背景/空洞”处理（不参与配色与用量统计） */
  isRemoved?: boolean
}

export interface ColorCount {
  color: BeadColor
  count: number
}

export const usePindouStore = defineStore('pindou', () => {
  // ============ 状态 ============
  const originalImage = ref<HTMLImageElement | null>(null)
  const pixelData = ref<PixelData[]>([])
  const gridSize = ref({ width: 52, height: 52 })
  /** 品牌 / 色板（多品牌 UI；匹配数据见 colors 说明） */
  const paletteBrandId = ref<PaletteBrandId>('MARD')
  /** 自定义模式下允许的色号（自 MARD 色库勾选） */
  const customPaletteCodes = ref<string[]>([])
  const useCIEDE2000 = ref(true)
  const isProcessing = ref(false)
  const brightness = ref(0)
  const contrast = ref(0)
  const saturation = ref(0)
  const showGrid = ref(true)
  // 默认显示编号
  const showNumbers = ref(true)

  /** 色板数量限制：0 表示不限制（例如 24/48/72/…/221） */
  const maxColors = ref<number>(0)

  /** 底色（导出背景） */
  const backgroundMode = ref<'black' | 'transparent' | 'custom'>('black')
  const customBackgroundHex = ref<string>('#000000')

  /** 去除背景（将接近选定颜色的像素标记为空洞） */
  const removeBgEnabled = ref(false)
  const removeBgHex = ref<string>('')
  /** RGB 距离容差：0-100 */
  const removeBgTolerance = ref<number>(25)

  /** 处理模式（图像预处理风格） */
  const processMode = ref<'real' | 'cartoon' | 'edge'>('real')

  /** 抖动算法（基于有限色板做量化） */
  const ditherMode = ref<'none' | 'floyd' | 'ordered'>('none')
  const ditherStrength = ref<number>(0.25)
  const zoomLevel = ref(1)
  const panOffset = ref({ x: 0, y: 0 })
  const selectedColorFilter = ref<string | null>(null)
  const isDarkMode = ref(false)

  // ============ Getters ============
  const colors = computed<BeadColor[]>(() => {
    if (paletteBrandId.value === 'CUSTOM') {
      if (customPaletteCodes.value.length === 0) return mardColors
      const set = new Set(customPaletteCodes.value)
      return mardColors.filter((c) => set.has(c.code))
    }
    return mardColors
  })
  
  const colorCounts = computed<ColorCount[]>(() => {
    const counts = new Map<string, { color: BeadColor; count: number }>()
    
    for (const pixel of pixelData.value) {
      if (pixel.isRemoved) continue
      const color = mardColors.find(c => c.code === pixel.colorCode)
      if (color) {
        if (counts.has(pixel.colorCode)) {
          counts.get(pixel.colorCode)!.count++
        } else {
          counts.set(pixel.colorCode, { color, count: 1 })
        }
      }
    }
    
    return Array.from(counts.values()).sort((a, b) => b.count - a.count)
  })

  const totalBeads = computed(() => pixelData.value.filter(p => !p.isRemoved).length)
  const uniqueColors = computed(() => colorCounts.value.length)

  const filteredPixelData = computed(() => {
    if (!selectedColorFilter.value) return pixelData.value
    return pixelData.value.filter(p => !p.isRemoved && p.colorCode === selectedColorFilter.value)
  })

  // ============ Actions ============
  function setOriginalImage(img: HTMLImageElement) {
    originalImage.value = img
  }

  function setPixelData(data: PixelData[]) {
    pixelData.value = data
  }

  function setGridSize(width: number, height: number) {
    gridSize.value = { width, height }
  }

  function setIsProcessing(processing: boolean) {
    isProcessing.value = processing
  }

  function resetView() {
    zoomLevel.value = 1
    panOffset.value = { x: 0, y: 0 }
  }

  function toggleDarkMode() {
    isDarkMode.value = !isDarkMode.value
    if (isDarkMode.value) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  function clearProject() {
    originalImage.value = null
    pixelData.value = []
    resetView()
  }

  function exportToJSON(): string {
    const exportData = {
      gridSize: gridSize.value,
      paletteBrandId: paletteBrandId.value,
      customPaletteCodes: customPaletteCodes.value,
      maxColors: maxColors.value,
      backgroundMode: backgroundMode.value,
      customBackgroundHex: customBackgroundHex.value,
      removeBgEnabled: removeBgEnabled.value,
      removeBgHex: removeBgHex.value,
      removeBgTolerance: removeBgTolerance.value,
      processMode: processMode.value,
      ditherMode: ditherMode.value,
      ditherStrength: ditherStrength.value,
      pixelData: pixelData.value,
      colorCounts: colorCounts.value.map(c => ({
        code: c.color.code,
        count: c.count
      })),
      totalBeads: totalBeads.value,
      uniqueColors: uniqueColors.value
    }
    return JSON.stringify(exportData, null, 2)
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
    maxColors,
    backgroundMode,
    customBackgroundHex,
    removeBgEnabled,
    removeBgHex,
    removeBgTolerance,
    processMode,
    ditherMode,
    ditherStrength,
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
  }
})
