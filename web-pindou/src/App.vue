<template>
  <div class="app" :class="{ dark: isDarkMode }">
    <AppHeader />
    
    <main class="main-content">
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

.main-content {
  display: flex;
  gap: 16px;
  padding: 16px;
  max-width: 1800px;
  margin: 0 auto;
  height: calc(100vh - 64px);
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
