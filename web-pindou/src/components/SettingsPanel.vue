<template>
  <div class="settings-panel">
    <h3 class="panel-title">转换设置</h3>

    <div class="setting-section">
      <label class="setting-label">网格尺寸</label>
      <div class="grid-size-inputs">
        <el-input-number
          v-model="gridWidth"
          :min="10"
          :max="200"
          :step="1"
          size="small"
          controls-position="right"
        />
        <span class="size-separator">×</span>
        <el-input-number
          v-model="gridHeight"
          :min="10"
          :max="200"
          :step="1"
          size="small"
          controls-position="right"
        />
      </div>
      <el-checkbox
        v-model="lockAspect"
        :disabled="!originalImage"
        class="mt-3"
      >
        锁定原图比例
      </el-checkbox>
      <div class="size-presets">
        <el-button
          v-for="preset in sizePresets"
          :key="preset.label"
          size="small"
          text
          @click="applyPreset(preset)"
        >
          {{ preset.label }}
        </el-button>
      </div>
    </div>

    <div class="setting-section">
      <label class="setting-label">色彩设置</label>
      <div class="color-settings">
        <div class="setting-row">
          <span>颜色匹配</span>
          <el-radio-group v-model="useCIEDE2000" size="small">
            <el-radio-button :label="false">快速</el-radio-button>
            <el-radio-button :label="true">CIEDE2000</el-radio-button>
          </el-radio-group>
        </div>

        <div class="setting-row brand-row">
          <span>拼豆品牌 / 色板</span>
          <el-select v-model="paletteBrandId" size="small" class="brand-select">
            <el-option
              v-for="opt in PALETTE_BRAND_OPTIONS"
              :key="opt.id"
              :label="opt.label"
              :value="opt.id"
            >
              <span>{{ opt.label }}</span>
              <span v-if="opt.hint" class="opt-hint">{{ opt.hint }}</span>
            </el-option>
          </el-select>
        </div>
        <p v-if="brandHint" class="brand-hint">{{ brandHint }}</p>

        <el-button
          v-if="paletteBrandId === 'CUSTOM'"
          size="small"
          class="w-full"
          @click="customDialogVisible = true"
        >
          配置自定义色板（已选 {{ customPaletteCodes.length || '全部' }} 色）
        </el-button>
      </div>
    </div>

    <div class="setting-section">
      <label class="setting-label">图像调整</label>
      <div class="adjustments">
        <div class="adjustment-item">
          <span>亮度</span>
          <el-slider v-model="brightness" :min="-50" :max="50" :step="1" show-stops />
        </div>
        <div class="adjustment-item">
          <span>对比度</span>
          <el-slider v-model="contrast" :min="-50" :max="50" :step="1" show-stops />
        </div>
        <div class="adjustment-item">
          <span>饱和度</span>
          <el-slider v-model="saturation" :min="-50" :max="50" :step="1" show-stops />
        </div>
      </div>
    </div>

    <div class="setting-section" v-if="pixelData.length > 0">
      <label class="setting-label">导出</label>
      <div class="export-options">
        <el-checkbox v-model="exportPngWithCodes">PNG 含色号文字</el-checkbox>
      </div>
    </div>

    <div class="action-buttons">
      <el-button
        type="primary"
        size="large"
        :loading="isProcessing"
        :disabled="!originalImage"
        @click="processImage"
        class="w-full"
      >
        <el-icon class="mr-1"><Refresh /></el-icon>
        {{ isProcessing ? '处理中...' : '生成拼豆图' }}
      </el-button>

      <template v-if="pixelData.length > 0">
        <el-button type="success" size="large" @click="exportImage" class="w-full mt-3">
          <el-icon class="mr-1"><Download /></el-icon>
          导出 PNG 图纸
        </el-button>
        <el-button size="large" @click="exportSvg" class="w-full mt-3">
          <el-icon class="mr-1"><Document /></el-icon>
          导出 SVG 矢量
        </el-button>
      </template>
    </div>

    <el-dialog v-model="customDialogVisible" title="自定义色板" width="520px" destroy-on-close>
      <p class="dialog-hint">勾选你手头拥有的颜色，生成图纸时只在这些颜色中匹配（基于 MARD 色库）。不勾选任何项则使用全部颜色。</p>
      <el-input
        v-model="customFilter"
        size="small"
        clearable
        placeholder="搜索色号或名称"
        class="mb-2"
      />
      <div class="custom-check-wrap">
        <el-checkbox-group v-model="customPaletteCodes">
          <el-checkbox
            v-for="c in filteredMardForCustom"
            :key="c.code"
            :label="c.code"
            border
            size="small"
            class="custom-chip"
          >
            <span class="chip-swatch" :style="{ background: c.hex }" />
            {{ c.code }} {{ c.nameCn || c.name }}
          </el-checkbox>
        </el-checkbox-group>
      </div>
      <template #footer>
        <el-button @click="selectAllCustom">全选</el-button>
        <el-button @click="clearCustom">清空</el-button>
        <el-button type="primary" @click="customDialogVisible = false">完成</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Refresh, Download, Document } from '@element-plus/icons-vue'
import { usePindouStore, type PixelData } from '../stores/pindou'
import { ElMessage } from 'element-plus'
import { PALETTE_BRAND_OPTIONS } from '../data/brands'
import { mardColors } from '../data/colors'
import { buildPatternSvg, downloadTextFile } from '../utils/exportPattern'
import { textColorOnHex } from '../utils/flatPixelStyle'

const store = usePindouStore()

const sizePresets = [
  { label: '52×52', width: 52, height: 52 },
  { label: '72×72', width: 72, height: 72 },
  { label: '100×100', width: 100, height: 100 },
  { label: 'A4横版', width: 120, height: 80 },
]

const customDialogVisible = ref(false)
const customFilter = ref('')
const exportPngWithCodes = ref(true)
const lockAspect = ref(true)

const gridWidth = computed({
  get: () => store.gridSize.width,
  set: (val: number) => {
    const width = Math.min(200, Math.max(10, val))
    const img = store.originalImage
    if (lockAspect.value && img) {
      const ratio = img.height / img.width
      let height = Math.round(width * ratio)
      height = Math.min(200, Math.max(10, height))
      store.setGridSize(width, height)
    } else {
      store.setGridSize(width, store.gridSize.height)
    }
  },
})

const gridHeight = computed({
  get: () => store.gridSize.height,
  set: (val: number) => {
    const height = Math.min(200, Math.max(10, val))
    const img = store.originalImage
    if (lockAspect.value && img) {
      const ratio = img.width / img.height
      let width = Math.round(height * ratio)
      width = Math.min(200, Math.max(10, width))
      store.setGridSize(width, height)
    } else {
      store.setGridSize(store.gridSize.width, height)
    }
  },
})

const useCIEDE2000 = computed({
  get: () => store.useCIEDE2000,
  set: (val) => {
    store.useCIEDE2000 = val
  },
})

const paletteBrandId = computed({
  get: () => store.paletteBrandId,
  set: (val) => {
    store.paletteBrandId = val
  },
})

const customPaletteCodes = computed({
  get: () => store.customPaletteCodes,
  set: (val) => {
    store.customPaletteCodes = val
  },
})

const brandHint = computed(() => {
  return PALETTE_BRAND_OPTIONS.find((o) => o.id === paletteBrandId.value)?.hint
})

const filteredMardForCustom = computed(() => {
  const q = customFilter.value.trim().toLowerCase()
  if (!q) return mardColors
  return mardColors.filter(
    (c) =>
      c.code.toLowerCase().includes(q) ||
      c.name.toLowerCase().includes(q) ||
      (c.nameCn && c.nameCn.includes(q))
  )
})

const brightness = computed({
  get: () => store.brightness,
  set: (val) => {
    store.brightness = val
  },
})

const contrast = computed({
  get: () => store.contrast,
  set: (val) => {
    store.contrast = val
  },
})

const saturation = computed({
  get: () => store.saturation,
  set: (val) => {
    store.saturation = val
  },
})

const originalImage = computed(() => store.originalImage)
const isProcessing = computed(() => store.isProcessing)
const pixelData = computed(() => store.pixelData)

function applyPreset(preset: (typeof sizePresets)[0]) {
  store.setGridSize(preset.width, preset.height)
}

function selectAllCustom() {
  customPaletteCodes.value = mardColors.map((c) => c.code)
}

function clearCustom() {
  customPaletteCodes.value = []
}

async function processImage() {
  if (!originalImage.value) {
    ElMessage.warning('请先上传图片')
    return
  }

  const lib = store.colors
  if (lib.length === 0) {
    ElMessage.error('当前色板为空，请调整自定义色板')
    return
  }

  store.setIsProcessing(true)

  try {
    await performPixelization()
    ElMessage.success('转换完成！')
  } catch (error) {
    ElMessage.error('处理失败，请重试')
    console.error(error)
  } finally {
    store.setIsProcessing(false)
  }
}

async function performPixelization() {
  const img = store.originalImage!
  const { width, height } = store.gridSize

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')!

  const filterString = `
    brightness(${100 + store.brightness}%)
    contrast(${100 + store.contrast}%)
    saturate(${100 + store.saturation}%)
  `
  ctx.filter = filterString

  const scale = Math.min(width / img.width, height / img.height)
  const scaledWidth = img.width * scale
  const scaledHeight = img.height * scale
  const offsetX = (width - scaledWidth) / 2
  const offsetY = (height - scaledHeight) / 2

  ctx.drawImage(img, offsetX, offsetY, scaledWidth, scaledHeight)

  const imageData = ctx.getImageData(0, 0, width, height)
  const data = imageData.data

  const pixelData: PixelData[] = []
  const colors = store.colors

  const { findClosestColor, findClosestColorFast } = await import('../utils/color')

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4
      let r = data[i]
      let g = data[i + 1]
      let b = data[i + 2]
      const a = data[i + 3]
      if (a < 128) {
        r = 255
        g = 255
        b = 255
      }

      const findFn = store.useCIEDE2000 ? findClosestColor : findClosestColorFast
      const result = findFn(r, g, b, colors)

      pixelData.push({
        x,
        y,
        r,
        g,
        b,
        colorCode: result.color.code,
        hex: result.color.hex,
      })
    }
  }

  store.setPixelData(pixelData)
}

function exportImage() {
  const { width, height } = store.gridSize
  const pixelSize = exportPngWithCodes.value ? 30 : 24
  const dpr = window.devicePixelRatio || 1
  const lw = width * pixelSize
  const lh = height * pixelSize

  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')!
  canvas.width = lw * dpr
  canvas.height = lh * dpr
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  ctx.imageSmoothingEnabled = false

  ctx.fillStyle = '#020617'
  ctx.fillRect(0, 0, lw, lh)

  for (const pixel of store.pixelData) {
    const x = pixel.x * pixelSize
    const y = pixel.y * pixelSize
    ctx.fillStyle = pixel.hex
    ctx.fillRect(x, y, pixelSize, pixelSize)
  }

  ctx.strokeStyle = 'rgba(148,163,184,0.5)'
  ctx.lineWidth = 1
  ctx.beginPath()
  for (let i = 0; i <= width; i++) {
    const gx = i * pixelSize + 0.5
    ctx.moveTo(gx, 0)
    ctx.lineTo(gx, lh)
  }
  for (let j = 0; j <= height; j++) {
    const gy = j * pixelSize + 0.5
    ctx.moveTo(0, gy)
    ctx.lineTo(lw, gy)
  }
  ctx.stroke()

  if (exportPngWithCodes.value) {
    const fs = Math.max(10, pixelSize * 0.36)
    ctx.font = `600 ${fs}px ui-sans-serif, system-ui, sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.lineJoin = 'round'

    for (const pixel of store.pixelData) {
      const x = pixel.x * pixelSize + pixelSize / 2
      const y = pixel.y * pixelSize + pixelSize / 2
      const code = pixel.colorCode
      const fill = textColorOnHex(pixel.hex)
      ctx.strokeStyle = fill === '#f8fafc' ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.45)'
      ctx.lineWidth = Math.max(2, fs * 0.12)
      ctx.strokeText(code, x, y)
      ctx.fillStyle = fill
      ctx.fillText(code, x, y)
    }
  }

  const brand = store.paletteBrandId
  const link = document.createElement('a')
  link.download = `拼豆图纸_${brand}_${width}x${height}_${Date.now()}.png`
  link.href = canvas.toDataURL('image/png')
  link.click()

  ElMessage.success('PNG 已导出')
}

function exportSvg() {
  const { width, height } = store.gridSize
  const title = `拼豆图纸 ${store.paletteBrandId} ${width}×${height}`
  const svg = buildPatternSvg(store.pixelData, width, height, {
    cellSize: 14,
    showCodes: true,
    title,
  })
  downloadTextFile(`拼豆图纸_${store.paletteBrandId}_${width}x${height}_${Date.now()}.svg`, svg, 'image/svg+xml;charset=utf-8')
  ElMessage.success('SVG 已导出')
}
</script>

<style scoped>
.settings-panel {
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  padding: 20px;
  border: 1px solid #e5e7eb;
}

.dark .settings-panel {
  background: #1f2937;
  border-color: #374151;
}

.panel-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #111827;
}

.dark .panel-title {
  color: white;
}

.setting-section {
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e5e7eb;
}

.dark .setting-section {
  border-color: #374151;
}

.setting-section:last-of-type {
  border-bottom: none;
}

.setting-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #4b5563;
  margin-bottom: 8px;
}

.dark .setting-label {
  color: #9ca3af;
}

.grid-size-inputs {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.size-separator {
  color: #9ca3af;
}

.size-presets {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.color-settings {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.setting-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  color: #4b5563;
  gap: 8px;
}

.brand-row {
  align-items: flex-start;
  flex-direction: column;
}

.brand-select {
  width: 100%;
}

.dark .setting-row {
  color: #d1d5db;
}

.opt-hint {
  display: block;
  font-size: 12px;
  color: #9ca3af;
  margin-top: 2px;
}

.brand-hint {
  font-size: 12px;
  color: #6b7280;
  margin: 0;
  line-height: 1.5;
}

.dark .brand-hint {
  color: #9ca3af;
}

.export-options {
  padding-top: 4px;
}

.adjustments {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.adjustment-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.adjustment-item span {
  font-size: 14px;
  color: #4b5563;
}

.dark .adjustment-item span {
  color: #9ca3af;
}

.action-buttons {
  margin-top: 24px;
}

.w-full {
  width: 100%;
}

.mt-3 {
  margin-top: 12px;
}

.mr-1 {
  margin-right: 4px;
}

.mb-2 {
  margin-bottom: 8px;
}

.dialog-hint {
  font-size: 13px;
  color: #6b7280;
  margin: 0 0 12px;
  line-height: 1.5;
}

.custom-check-wrap {
  max-height: 360px;
  overflow-y: auto;
  padding: 4px 0;
}

.custom-chip {
  margin: 4px 8px 4px 0 !important;
}

.chip-swatch {
  display: inline-block;
  width: 14px;
  height: 14px;
  border-radius: 4px;
  margin-right: 6px;
  vertical-align: middle;
  border: 1px solid rgba(0, 0, 0, 0.15);
}
</style>
