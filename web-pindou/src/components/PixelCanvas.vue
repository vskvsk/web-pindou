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
        :width="canvasWidth"
        :height="canvasHeight"
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

const store = usePindouStore()
const containerRef = ref<HTMLElement>()
const canvasRef = ref<HTMLCanvasElement>()

// Canvas 设置
const beadSize = 20
const beadGap = 1

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
  
  // 清空画布
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  
  // 绘制背景
  ctx.fillStyle = '#1f2937'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  
  // 绘制每个像素
  for (const pixel of store.pixelData) {
    const x = pixel.x * (beadSize + beadGap) + beadGap
    const y = pixel.y * (beadSize + beadGap) + beadGap
    
    // 绘制珠子
    ctx.fillStyle = pixel.hex
    ctx.beginPath()
    ctx.roundRect(x, y, beadSize, beadSize, 3)
    ctx.fill()
    
    // 绘制珠子阴影效果
    const gradient = ctx.createRadialGradient(
      x + beadSize / 2, y + beadSize / 2, 0,
      x + beadSize / 2, y + beadSize / 2, beadSize / 2
    )
    gradient.addColorStop(0, 'rgba(255,255,255,0.1)')
    gradient.addColorStop(1, 'rgba(0,0,0,0.2)')
    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.roundRect(x, y, beadSize, beadSize, 3)
    ctx.fill()
    
    // 绘制中心孔
    ctx.fillStyle = 'rgba(0,0,0,0.3)'
    ctx.beginPath()
    ctx.arc(x + beadSize / 2, y + beadSize / 2, beadSize / 6, 0, Math.PI * 2)
    ctx.fill()
  }
  
  // 绘制网格
  if (showGrid.value) {
    ctx.strokeStyle = 'rgba(255,255,255,0.1)'
    ctx.lineWidth = 0.5
    
    for (let i = 0; i <= store.gridSize.width; i++) {
      const x = i * (beadSize + beadGap) + beadGap / 2
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, canvas.height)
      ctx.stroke()
    }
    
    for (let i = 0; i <= store.gridSize.height; i++) {
      const y = i * (beadSize + beadGap) + beadGap / 2
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(canvas.width, y)
      ctx.stroke()
    }
  }
  
  // 绘制色号（仅在大缩放级别时显示）
  if (showNumbers.value && zoomLevel.value >= 1.5) {
    ctx.fillStyle = 'rgba(0,0,0,0.7)'
    ctx.font = '8px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    
    for (const pixel of store.pixelData) {
      const x = pixel.x * (beadSize + beadGap) + beadGap + beadSize / 2
      const y = pixel.y * (beadSize + beadGap) + beadGap + beadSize / 2
      ctx.fillText(pixel.colorCode.slice(-2), x, y)
    }
  }
}

// 监听数据变化
watch(() => store.pixelData, draw, { deep: true })
watch(showGrid, draw)
watch(showNumbers, draw)

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
