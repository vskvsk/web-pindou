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
            <el-radio-button :value="false">快速</el-radio-button>
            <el-radio-button :value="true">CIEDE2000</el-radio-button>
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

    <div class="setting-section">
      <label class="setting-label">处理模式</label>
      <div class="process-modes">
        <el-radio-group v-model="processMode" size="small">
          <el-radio-button value="cartoon">卡通（主色）</el-radio-button>
          <el-radio-button value="real">真实（平均）</el-radio-button>
          <el-radio-button value="edge">边缘优先（清晰）</el-radio-button>
        </el-radio-group>
      </div>
    </div>

    <div class="setting-section">
      <label class="setting-label">色板数量</label>
      <div class="color-limit">
        <el-button-group>
          <el-button
            v-for="opt in colorLimitOptions"
            :key="opt.value"
            :type="maxColors === opt.value ? 'primary' : ''"
            size="small"
            @click="maxColors = opt.value"
          >
            {{ opt.label }}
          </el-button>
        </el-button-group>
      </div>
    </div>

    <div class="setting-section">
      <label class="setting-label">底色</label>
      <div class="bg-mode">
        <el-radio-group v-model="backgroundMode" size="small">
          <el-radio-button value="black">黑色</el-radio-button>
          <el-radio-button value="transparent">透明</el-radio-button>
          <el-radio-button value="custom">自定义</el-radio-button>
        </el-radio-group>
        <el-color-picker
          v-if="backgroundMode === 'custom'"
          v-model="customBackgroundHex"
          size="small"
          class="ml-2"
        />
      </div>
    </div>

    <div class="setting-section">
      <label class="setting-label">去除背景</label>
      <div class="remove-bg">
        <el-checkbox v-model="removeBgEnabled">启用去背景</el-checkbox>
        <div v-if="removeBgEnabled" class="remove-bg-controls">
          <div class="setting-row mt-3">
            <span>背景色</span>
            <el-color-picker v-model="removeBgHex" size="small" />
            <el-button size="small" @click="autoPickRemoveBgColor" :disabled="!originalImage">
              自动取色
            </el-button>
          </div>
          <div class="setting-row mt-3">
            <span>容差</span>
            <el-slider
              v-model="removeBgTolerance"
              :min="0"
              :max="100"
              :step="1"
              show-input
              class="tolerance-slider"
            />
          </div>
          <p class="helper-text">容差越大，越多像素会被当作背景并移除。</p>
        </div>
      </div>
    </div>

    <div class="setting-section">
      <label class="setting-label">抖动算法</label>
      <div class="dither-mode">
        <el-radio-group v-model="ditherMode" size="small">
          <el-radio-button value="none">无</el-radio-button>
          <el-radio-button value="floyd">Floyd–Steinberg</el-radio-button>
          <el-radio-button value="ordered">有序抖动</el-radio-button>
        </el-radio-group>
        <div v-if="ditherMode !== 'none'" class="mt-3">
          <div class="adjustment-item">
            <span>抖动强度</span>
            <el-slider v-model="ditherStrength" :min="0" :max="0.6" :step="0.01" show-stops />
          </div>
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

const colorLimitOptions = [
  { label: '不限制', value: 0 },
  { label: '24色', value: 24 },
  { label: '48色', value: 48 },
  { label: '72色', value: 72 },
  { label: '96色', value: 96 },
  { label: '120色', value: 120 },
  { label: '144色', value: 144 },
  { label: '221色', value: 221 },
]

const maxColors = computed({
  get: () => store.maxColors,
  set: (val: number) => {
    store.maxColors = val
    if (originalImage.value) {
      processImage()
    }
  },
})

const backgroundMode = computed({
  get: () => store.backgroundMode,
  set: (val: 'black' | 'transparent' | 'custom') => {
    store.backgroundMode = val
  },
})

const customBackgroundHex = computed({
  get: () => store.customBackgroundHex,
  set: (val: string) => {
    store.customBackgroundHex = val
  },
})

const removeBgEnabled = computed({
  get: () => store.removeBgEnabled,
  set: (val: boolean) => {
    store.removeBgEnabled = val
  },
})

const removeBgHex = computed({
  get: () => store.removeBgHex,
  set: (val: string) => {
    store.removeBgHex = val
  },
})

const removeBgTolerance = computed({
  get: () => store.removeBgTolerance,
  set: (val: number) => {
    store.removeBgTolerance = val
  },
})

const processMode = computed({
  get: () => store.processMode,
  set: (val: 'real' | 'cartoon' | 'edge') => {
    store.processMode = val
  },
})

const ditherMode = computed({
  get: () => store.ditherMode,
  set: (val: 'none' | 'floyd' | 'ordered') => {
    store.ditherMode = val
  },
})

const ditherStrength = computed({
  get: () => store.ditherStrength,
  set: (val: number) => {
    store.ditherStrength = val
  },
})

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

function rgbToHex(r: number, g: number, b: number): string {
  const to = (v: number) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')
  return `#${to(r)}${to(g)}${to(b)}`
}

function autoPickRemoveBgColor() {
  if (!originalImage.value) return
  const img = store.originalImage!
  const { width, height } = store.gridSize

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')!

  // 只取原图，不叠加滤镜（减少误差）
  ctx.filter = 'none'
  const scale = Math.min(width / img.width, height / img.height)
  const scaledWidth = img.width * scale
  const scaledHeight = img.height * scale
  const offsetX = (width - scaledWidth) / 2
  const offsetY = (height - scaledHeight) / 2
  ctx.drawImage(img, offsetX, offsetY, scaledWidth, scaledHeight)

  const imageData = ctx.getImageData(0, 0, width, height)
  const data = imageData.data

  const samplePoints: Array<[number, number]> = [
    [0, 0],
    [width - 1, 0],
    [0, height - 1],
    [width - 1, height - 1],
  ]

  let sumR = 0
  let sumG = 0
  let sumB = 0
  let count = 0
  const pick = (x: number, y: number) => {
    const ix = Math.max(0, Math.min(width - 1, x))
    const iy = Math.max(0, Math.min(height - 1, y))
    const idx = (iy * width + ix) * 4
    const a = data[idx + 3]
    if (a < 128) return
    sumR += data[idx]
    sumG += data[idx + 1]
    sumB += data[idx + 2]
    count++
  }

  for (const [sx, sy] of samplePoints) {
    // 取小邻域，避免某个像素刚好在边缘
    for (let oy = -2; oy <= 2; oy++) {
      for (let ox = -2; ox <= 2; ox++) {
        pick(sx + ox, sy + oy)
      }
    }
  }

  if (count === 0) {
    removeBgHex.value = '#ffffff'
    return
  }

  removeBgHex.value = rgbToHex(sumR / count, sumG / count, sumB / count)
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

  const paletteAll = store.colors
  if (paletteAll.length === 0) return

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')!

  // ---------- 图像预处理（处理模式 + 亮度对比度饱和度） ----------
  let brightnessAdj = store.brightness
  let contrastAdj = store.contrast
  let saturationAdj = store.saturation

  if (store.processMode === 'cartoon') {
    contrastAdj += 20
    saturationAdj += 15
    brightnessAdj += 5
  } else if (store.processMode === 'edge') {
    contrastAdj += 25
    saturationAdj += 5
  }

  ctx.filter = `
    brightness(${100 + brightnessAdj}%)
    contrast(${100 + contrastAdj}%)
    saturate(${100 + saturationAdj}%)
  `

  const scale = Math.min(width / img.width, height / img.height)
  const scaledWidth = img.width * scale
  const scaledHeight = img.height * scale
  const offsetX = (width - scaledWidth) / 2
  const offsetY = (height - scaledHeight) / 2
  ctx.drawImage(img, offsetX, offsetY, scaledWidth, scaledHeight)

  let imageData = ctx.getImageData(0, 0, width, height)
  const data = imageData.data

  // 边缘优先：轻微锐化（unsharp-ish）
  if (store.processMode === 'edge') {
    const src = new Uint8ClampedArray(data)
    const amount = 0.75
    const clamp = (v: number) => Math.max(0, Math.min(255, v))

    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const idx = (y * width + x) * 4
        for (let c = 0; c < 3; c++) {
          let sum = 0
          for (let ky = -1; ky <= 1; ky++) {
            for (let kx = -1; kx <= 1; kx++) {
              const nIdx = ((y + ky) * width + (x + kx)) * 4 + c
              sum += src[nIdx]
            }
          }
          const blur = sum / 9
          const orig = src[idx + c]
          data[idx + c] = clamp(orig + amount * (orig - blur))
        }
      }
    }
  }

  const { findClosestColor, findClosestColorFast } = await import('../utils/color')
  const findFn = store.useCIEDE2000 ? findClosestColor : findClosestColorFast

  // ---------- 去背景（把接近指定颜色的像素标记为“空洞”） ----------
  const maxDist2 = 255 * 255 * 3
  const parseHex = (hex: string): { r: number; g: number; b: number } | null => {
    const h = hex.trim()
    if (!/^#[0-9A-Fa-f]{6}$/.test(h)) return null
    const r = parseInt(h.slice(1, 3), 16)
    const g = parseInt(h.slice(3, 5), 16)
    const b = parseInt(h.slice(5, 7), 16)
    return { r, g, b }
  }

  const removeRgb = store.removeBgEnabled ? parseHex(store.removeBgHex) : null
  const removeThreshold2 =
    (maxDist2 * Math.pow(Math.max(0, Math.min(100, store.removeBgTolerance)) / 100, 2)) || 0

  // 先做一次“全色板映射”，用于统计高频色（再限制色板数量）
  const pixelData: PixelData[] = []
  const rWork = new Float32Array(width * height)
  const gWork = new Float32Array(width * height)
  const bWork = new Float32Array(width * height)

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const pIndex = y * width + x
      const i = pIndex * 4
      const r0 = data[i]
      const g0 = data[i + 1]
      const b0 = data[i + 2]
      const a0 = data[i + 3]

      let isRemoved = a0 < 128
      if (!isRemoved && removeRgb) {
        const dr = r0 - removeRgb.r
        const dg = g0 - removeRgb.g
        const db = b0 - removeRgb.b
        const dist2 = dr * dr + dg * dg + db * db
        if (dist2 <= removeThreshold2) isRemoved = true
      }

      if (isRemoved) {
        pixelData.push({
          x,
          y,
          r: 0,
          g: 0,
          b: 0,
          colorCode: '',
          hex: '#000000',
          isRemoved: true,
        })
        continue
      }

      rWork[pIndex] = r0
      gWork[pIndex] = g0
      bWork[pIndex] = b0

      const result = findFn(r0, g0, b0, paletteAll)
      pixelData.push({
        x,
        y,
        r: result.color.r,
        g: result.color.g,
        b: result.color.b,
        colorCode: result.color.code,
        hex: result.color.hex,
      })
    }
  }

  // ---------- 限制色板数量（基于高频色二次映射） ----------
  let paletteTarget = paletteAll
  if (store.maxColors > 0 && store.maxColors < paletteAll.length) {
    const counts = new Map<string, number>()
    for (const p of pixelData) {
      if (p.isRemoved) continue
      counts.set(p.colorCode, (counts.get(p.colorCode) || 0) + 1)
    }
    const sortedCodes = Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, store.maxColors)
      .map((e) => e[0])

    const limited = sortedCodes
      .map((code) => paletteAll.find((c) => c.code === code))
      .filter(Boolean) as typeof paletteAll

    if (limited.length > 0 && limited.length < paletteAll.length) {
      paletteTarget = limited
    }
  }

  const clamp255 = (v: number) => Math.max(0, Math.min(255, v))

  // ---------- 抖动算法（基于 paletteTarget 做量化） ----------
  if (store.ditherMode !== 'none') {
    if (store.ditherMode === 'floyd') {
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const idx = y * width + x
          if (pixelData[idx].isRemoved) continue

          const r = clamp255(rWork[idx])
          const g = clamp255(gWork[idx])
          const b = clamp255(bWork[idx])

          const result = findFn(r, g, b, paletteTarget)
          const chosen = result.color

          pixelData[idx].r = chosen.r
          pixelData[idx].g = chosen.g
          pixelData[idx].b = chosen.b
          pixelData[idx].colorCode = chosen.code
          pixelData[idx].hex = chosen.hex

          const errR = r - chosen.r
          const errG = g - chosen.g
          const errB = b - chosen.b

          const addErr = (nx: number, ny: number, w: number) => {
            if (nx < 0 || nx >= width || ny < 0 || ny >= height) return
            const nIdx = ny * width + nx
            if (pixelData[nIdx].isRemoved) return
            rWork[nIdx] += errR * w
            gWork[nIdx] += errG * w
            bWork[nIdx] += errB * w
          }

          addErr(x + 1, y, 7 / 16)
          addErr(x - 1, y + 1, 3 / 16)
          addErr(x, y + 1, 5 / 16)
          addErr(x + 1, y + 1, 1 / 16)
        }
      }
    } else if (store.ditherMode === 'ordered') {
      // 4x4 Bayer
      const bayer = [
        [0, 8, 2, 10],
        [12, 4, 14, 6],
        [3, 11, 1, 9],
        [15, 7, 13, 5],
      ]

      const strength = store.ditherStrength

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const idx = y * width + x
          if (pixelData[idx].isRemoved) continue

          const thr = (bayer[y % 4][x % 4] + 0.5) / 16 // 0..1
          const delta = (thr - 0.5) * 2 * strength * 255
          const r = clamp255(rWork[idx] + delta)
          const g = clamp255(gWork[idx] + delta)
          const b = clamp255(bWork[idx] + delta)

          const result = findFn(r, g, b, paletteTarget)
          const chosen = result.color

          pixelData[idx].r = chosen.r
          pixelData[idx].g = chosen.g
          pixelData[idx].b = chosen.b
          pixelData[idx].colorCode = chosen.code
          pixelData[idx].hex = chosen.hex
        }
      }
    }
  } else if (paletteTarget !== paletteAll) {
    // 无抖动但有限色板：重映射
    for (const p of pixelData) {
      if (p.isRemoved) continue
      const idx = p.y * width + p.x
      const r = rWork[idx]
      const g = gWork[idx]
      const b = bWork[idx]
      const result = findFn(r, g, b, paletteTarget)
      p.colorCode = result.color.code
      p.hex = result.color.hex
      p.r = result.color.r
      p.g = result.color.g
      p.b = result.color.b
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

  if (backgroundMode.value !== 'transparent') {
    const bg =
      backgroundMode.value === 'custom' ? customBackgroundHex.value : '#020617'
    ctx.fillStyle = bg
    ctx.fillRect(0, 0, lw, lh)
  }

  for (const pixel of store.pixelData) {
    if (pixel.isRemoved) continue
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
      if (pixel.isRemoved) continue
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
    backgroundFill:
      backgroundMode.value === 'transparent'
        ? null
        : backgroundMode.value === 'custom'
          ? customBackgroundHex.value
          : '#020617',
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

.ml-2 {
  margin-left: 8px;
}

.helper-text {
  margin: 6px 0 0;
  font-size: 12px;
  color: #6b7280;
  line-height: 1.5;
}

.dark .helper-text {
  color: #9ca3af;
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
