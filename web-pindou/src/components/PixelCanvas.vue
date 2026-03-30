<template>
  <div class="pixel-canvas-container" ref="containerRef">
    <div
      class="canvas-wrapper"
      :style="wrapperStyle"
      @mousedown="handleMouseDown"
      @mousemove="handleMouseMove"
      @mouseup="handleMouseUp"
      @mouseleave="handleMouseUp"
      @wheel.prevent="handleWheel"
    >
      <canvas
        ref="canvasRef"
        :width="canvasWidth * dpr"
        :height="canvasHeight * dpr"
        class="pixel-canvas"
      />
    </div>
    
    <!-- 控制栏 -->
    <div class="canvas-controls">
      <div class="zoom-controls">
        <el-button size="small" @click="zoomOut">
          <el-icon><ZoomOut /></el-icon>
        </el-button>
        <span class="zoom-level">{{ Math.round(zoomLevel * 100) }}%</span>
        <el-button size="small" @click="zoomIn">
          <el-icon><ZoomIn /></el-icon>
        </el-button>
        <el-button size="small" @click="resetView">
          <el-icon><FullScreen /></el-icon>
        </el-button>
      </div>
      
      <div class="display-options">
        <el-checkbox v-model="showGrid">显示网格</el-checkbox>
        <el-checkbox v-model="showNumbers">显示编号</el-checkbox>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { ZoomIn, ZoomOut, FullScreen } from '@element-plus/icons-vue'
import { usePindouStore } from '../stores/pindou'
import { textColorOnHex } from '../utils/flatPixelStyle'

const store = usePindouStore()
const containerRef = ref<HTMLElement>()
const canvasRef = ref<HTMLCanvasElement>()

// 扁平化网格：纯色块 + 清晰分割线（无渐变、无立体孔）
const beadSize = 22
const beadGap = 2
const dpr = window.devicePixelRatio || 1

const canvasWidth = computed(() =>
  store.gridSize.width * (beadSize + beadGap) + beadGap
)
const canvasHeight = computed(() =>
  store.gridSize.height * (beadSize + beadGap) + beadGap
)

// 缩放和平移
const zoomLevel = computed({
  get: () => store.zoomLevel,
  set: (val) => { store.zoomLevel = Math.max(0.5, Math.min(5, val)) }
})

const showGrid = computed({
  get: () => store.showGrid,
  set: (val) => { store.showGrid = val }
})

const showNumbers = computed({
  get: () => store.showNumbers,
  set: (val) => { store.showNumbers = val }
})

const wrapperStyle = computed(() => ({
  transform: `scale(${zoomLevel.value}) translate(${store.panOffset.x}px, ${store.panOffset.y}px)`,
  transformOrigin: 'center center'
}))

// 绘制
function draw() {
  const canvas = canvasRef.value
  if (!canvas) return
  
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  ctx.imageSmoothingEnabled = false

  // 使用逻辑尺寸绘制，高分屏放大
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  const w = canvasWidth.value
  const h = canvasHeight.value

  // 清空画布
  ctx.clearRect(0, 0, w, h)

  // 网格槽底色（格与格之间的缝隙）
  ctx.fillStyle = '#020617'
  ctx.fillRect(0, 0, w, h)

  // 纯色平铺格子
  for (const pixel of store.pixelData) {
    const x = pixel.x * (beadSize + beadGap) + beadGap
    const y = pixel.y * (beadSize + beadGap) + beadGap
    ctx.fillStyle = pixel.hex
    ctx.fillRect(x, y, beadSize, beadSize)
  }

  // 网格线（略亮于槽底，便于辨认每一格）
  if (showGrid.value) {
    ctx.strokeStyle = 'rgba(148,163,184,0.45)'
    ctx.lineWidth = 1
    ctx.beginPath()
    for (let i = 0; i <= store.gridSize.width; i++) {
      const gx = i * (beadSize + beadGap) + beadGap / 2
      ctx.moveTo(gx + 0.5, 0)
      ctx.lineTo(gx + 0.5, h)
    }
    for (let j = 0; j <= store.gridSize.height; j++) {
      const gy = j * (beadSize + beadGap) + beadGap / 2
      ctx.moveTo(0, gy + 0.5)
      ctx.lineTo(w, gy + 0.5)
    }
    ctx.stroke()
  }

  // 色号（完整色号，颜色随格子亮度反相，易辨认）
  if (showNumbers.value) {
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    const fontPx = Math.max(8, Math.min(11, Math.floor(beadSize * 0.42)))
    ctx.font = `600 ${fontPx}px ui-sans-serif, system-ui, sans-serif`

    for (const pixel of store.pixelData) {
      const cx = pixel.x * (beadSize + beadGap) + beadGap + beadSize / 2
      const cy = pixel.y * (beadSize + beadGap) + beadGap + beadSize / 2
      const label = pixel.colorCode
      const fill = textColorOnHex(pixel.hex)
      ctx.strokeStyle = fill === '#f8fafc' ? 'rgba(0,0,0,0.35)' : 'rgba(255,255,255,0.35)'
      ctx.lineWidth = 2
      ctx.lineJoin = 'round'
      ctx.strokeText(label, cx, cy)
      ctx.fillStyle = fill
      ctx.fillText(label, cx, cy)
    }
  }
}

// 监听数据变化
watch(() => store.pixelData, draw, { deep: true })
watch(showGrid, draw)
watch(showNumbers, draw)
watch(zoomLevel, draw)

onMounted(() => {
  draw()
})

// 缩放控制
function zoomIn() {
  zoomLevel.value += 0.25
}

function zoomOut() {
  zoomLevel.value -= 0.25
}

function resetView() {
  store.resetView()
}

// 拖拽平移
let isDragging = false
let lastPos = { x: 0, y: 0 }

function handleMouseDown(e: MouseEvent) {
  if (e.button === 0) {
    isDragging = true
    lastPos = { x: e.clientX, y: e.clientY }
    containerRef.value?.classList.add('dragging')
  }
}

function handleMouseMove(e: MouseEvent) {
  if (isDragging) {
    const deltaX = (e.clientX - lastPos.x) / zoomLevel.value
    const deltaY = (e.clientY - lastPos.y) / zoomLevel.value
    store.panOffset.x += deltaX
    store.panOffset.y += deltaY
    lastPos = { x: e.clientX, y: e.clientY }
  }
}

function handleMouseUp() {
  isDragging = false
  containerRef.value?.classList.remove('dragging')
}

function handleWheel(e: WheelEvent) {
  const delta = e.deltaY > 0 ? -0.1 : 0.1
  zoomLevel.value += delta
}
</script>

<style scoped>
.pixel-canvas-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #111827;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
}

.canvas-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  cursor: grab;
}

.canvas-wrapper:active,
.canvas-wrapper.dragging {
  cursor: grabbing;
}

.pixel-canvas {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 100%;
}

.canvas-controls {
  position: absolute;
  bottom: 16px;
  left: 16px;
  right: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(31, 41, 55, 0.9);
  backdrop-filter: blur(4px);
  border-radius: 8px;
  padding: 8px 16px;
}

.zoom-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.zoom-level {
  font-size: 14px;
  color: white;
  min-width: 60px;
  text-align: center;
}

.display-options {
  display: flex;
  align-items: center;
  gap: 16px;
}

:deep(.el-checkbox__label) {
  color: white;
  font-size: 14px;
}
</style>
