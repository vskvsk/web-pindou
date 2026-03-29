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
          <span>颜色匹配算法</span>
          <el-radio-group v-model="useCIEDE2000" size="small">
            <el-radio-button :label="false">快速</el-radio-button>
            <el-radio-button :label="true">精确 (CIEDE2000)</el-radio-button>
          </el-radio-group>
        </div>
        
        <div class="setting-row">
          <span>拼豆品牌</span>
          <el-select v-model="selectedBrand" size="small">
            <el-option label="MARD" value="MARD" />
            <el-option label="DODO" value="DODO" disabled />
            <el-option label="HAMA" value="HAMA" disabled />
          </el-select>
        </div>
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
      
      <el-button
        v-if="pixelData.length > 0"
        type="success"
        size="large"
        @click="exportImage"
        class="w-full mt-3"
      >
        <el-icon class="mr-1"><Download /></el-icon>
        导出图纸
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Refresh, Download } from '@element-plus/icons-vue'
import { usePindouStore } from '../stores/pindou'
import { ElMessage } from 'element-plus'

const store = usePindouStore()

const sizePresets = [
  { label: '52×52', width: 52, height: 52 },
  { label: '72×72', width: 72, height: 72 },
  { label: '100×100', width: 100, height: 100 },
  { label: 'A4横版', width: 120, height: 80 },
]

const gridWidth = computed({
  get: () => store.gridSize.width,
  set: (val) => store.setGridSize(val, store.gridSize.height)
})

const gridHeight = computed({
  get: () => store.gridSize.height,
  set: (val) => store.setGridSize(store.gridSize.width, val)
})

const useCIEDE2000 = computed({
  get: () => store.useCIEDE2000,
  set: (val) => { store.useCIEDE2000 = val }
})

const selectedBrand = computed({
  get: () => store.selectedBrand,
  set: (val) => { store.selectedBrand = val }
})

const brightness = computed({
  get: () => store.brightness,
  set: (val) => { store.brightness = val }
})

const contrast = computed({
  get: () => store.contrast,
  set: (val) => { store.contrast = val }
})

const saturation = computed({
  get: () => store.saturation,
  set: (val) => { store.saturation = val }
})

const originalImage = computed(() => store.originalImage)
const isProcessing = computed(() => store.isProcessing)
const pixelData = computed(() => store.pixelData)

function applyPreset(preset: typeof sizePresets[0]) {
  store.setGridSize(preset.width, preset.height)
}

async function processImage() {
  if (!originalImage.value) {
    ElMessage.warning('请先上传图片')
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
  
  const pixelData = []
  const colors = store.colors
  
  const { findClosestColor, findClosestColorFast } = await import('../utils/color')
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]
      
      if (data[i + 3] < 128) continue
      
      const findFn = store.useCIEDE2000 ? findClosestColor : findClosestColorFast
      const result = findFn(r, g, b, colors)
      
      pixelData.push({
        x,
        y,
        r,
        g,
        b,
        colorCode: result.color.code,
        hex: result.color.hex
      })
    }
  }
  
  store.setPixelData(pixelData)
}

function exportImage() {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')!
  const { width, height } = store.gridSize
  const pixelSize = 20
  
  canvas.width = width * pixelSize
  canvas.height = height * pixelSize
  
  ctx.fillStyle = '#1f2937'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  
  for (const pixel of store.pixelData) {
    const x = pixel.x * pixelSize
    const y = pixel.y * pixelSize
    
    ctx.fillStyle = pixel.hex
    ctx.beginPath()
    ctx.roundRect(x + 1, y + 1, pixelSize - 2, pixelSize - 2, 4)
    ctx.fill()
    
    ctx.fillStyle = 'rgba(0,0,0,0.3)'
    ctx.beginPath()
    ctx.arc(x + pixelSize / 2, y + pixelSize / 2, pixelSize / 6, 0, Math.PI * 2)
    ctx.fill()
  }
  
  const link = document.createElement('a')
  link.download = `拼豆图纸_${width}x${height}_${Date.now()}.png`
  link.href = canvas.toDataURL()
  link.click()
  
  ElMessage.success('图纸已导出')
}
</script>

<style scoped>
.settings-panel {
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
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

.setting-section:last-child {
  border-bottom: none;
  padding-bottom: 0;
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
}

.dark .setting-row {
  color: #d1d5db;
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
</style>
