<template>
  <div class="app" :class="{ dark: isDarkMode }">
    <AppHeader />
    
    <main class="main-wrap">
      <section v-if="!originalImage" class="hero">
        <p class="hero-kicker">PERLER BEADS TOOL</p>
        <h2 class="hero-title">拼豆神器 · 图片转拼豆图纸</h2>
        <p class="hero-lead">
          上传任意图片，以 CIEDE2000 感知色差匹配拼豆颜色；支持多品牌色板选项与自定义色板，生成带色号图纸与用量清单（对齐常见拼豆工具工作流）。
        </p>
        <div class="hero-cards">
          <div class="hero-card">
            <span class="hero-card-title">多品牌色卡</span>
            <span class="hero-card-desc">MARD、COCO、漫漫、盼盼、咪小窝等选项，可自定义可用颜色</span>
          </div>
          <div class="hero-card">
            <span class="hero-card-title">精准配色</span>
            <span class="hero-card-desc">Lab 空间 + CIEDE2000，更接近肉眼观感</span>
          </div>
          <div class="hero-card">
            <span class="hero-card-title">图纸导出</span>
            <span class="hero-card-desc">PNG（可选色号）、SVG 矢量，配合右侧用量表打印</span>
          </div>
        </div>
      </section>

      <div class="main-content">
      <!-- 左侧：图片上传和设置 -->
      <aside class="sidebar left">
        <ImageUploader v-model="originalImage" />
        <SettingsPanel class="mt-4" />
      </aside>
      
      <!-- 中间：Canvas 预览 -->
      <section class="canvas-area">
        <div class="canvas-container">
          <PixelCanvas v-if="pixelData.length > 0" />
          <el-empty v-else description="上传图片并点击「生成拼豆图」开始">
            <template #image>
              <div class="placeholder-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <path d="M21 15l-5-5L5 21" />
                </svg>
              </div>
            </template>
          </el-empty>
        </div>
      </section>
      
      <!-- 右侧：颜色列表 -->
      <aside class="sidebar right">
        <ColorList />
      </aside>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePindouStore } from './stores/pindou'
import AppHeader from './components/Header.vue'
import ImageUploader from './components/ImageUploader.vue'
import SettingsPanel from './components/SettingsPanel.vue'
import PixelCanvas from './components/PixelCanvas.vue'
import ColorList from './components/ColorList.vue'

const store = usePindouStore()

const originalImage = computed({
  get: () => store.originalImage,
  set: (val) => store.setOriginalImage(val!)
})

const pixelData = computed(() => store.pixelData)
const isDarkMode = computed(() => store.isDarkMode)
</script>

<style scoped>
.app {
  min-height: 100vh;
  background: #f9fafb;
}

.dark .app {
  background: #030712;
}

.main-wrap {
  max-width: 1800px;
  margin: 0 auto;
  padding: 16px;
  min-height: calc(100vh - 64px);
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-sizing: border-box;
}

.hero {
  flex-shrink: 0;
  padding: 24px 28px;
  border-radius: 16px;
  background: linear-gradient(135deg, #f0f9ff 0%, #eef2ff 50%, #faf5ff 100%);
  border: 1px solid #e0e7ff;
}

.dark .hero {
  background: linear-gradient(135deg, #0c1222 0%, #111827 50%, #1e1b2e 100%);
  border-color: #374151;
}

.hero-kicker {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.2em;
  color: #6366f1;
  margin: 0 0 8px;
}

.dark .hero-kicker {
  color: #a5b4fc;
}

.hero-title {
  font-size: 22px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 12px;
  line-height: 1.3;
}

.dark .hero-title {
  color: #f9fafb;
}

.hero-lead {
  font-size: 14px;
  line-height: 1.7;
  color: #4b5563;
  margin: 0 0 20px;
  max-width: 920px;
}

.dark .hero-lead {
  color: #9ca3af;
}

.hero-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

@media (max-width: 960px) {
  .hero-cards {
    grid-template-columns: 1fr;
  }
}

.hero-card {
  padding: 14px 16px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.75);
  border: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.dark .hero-card {
  background: rgba(31, 41, 55, 0.6);
  border-color: #4b5563;
}

.hero-card-title {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
}

.dark .hero-card-title {
  color: #e5e7eb;
}

.hero-card-desc {
  font-size: 12px;
  line-height: 1.5;
  color: #6b7280;
}

.dark .hero-card-desc {
  color: #9ca3af;
}

.main-content {
  flex: 1;
  min-height: 0;
  display: flex;
  gap: 16px;
}

.sidebar {
  flex-shrink: 0;
}

.sidebar.left {
  width: 320px;
}

.sidebar.right {
  width: 288px;
}

.canvas-area {
  flex: 1;
  min-width: 0;
}

.canvas-container {
  height: 100%;
  background: #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dark .canvas-container {
  background: #1f2937;
}

.placeholder-icon {
  width: 96px;
  height: 96px;
  color: #d1d5db;
}

.dark .placeholder-icon {
  color: #4b5563;
}

/* 响应式布局 */
@media (max-width: 1280px) {
  .main-content {
    flex-direction: column;
    height: auto;
  }
  
  .sidebar,
  .canvas-area {
    width: 100%;
    height: auto;
  }
  
  .canvas-container {
    height: 500px;
  }
}

.mt-4 {
  margin-top: 16px;
}
</style>
