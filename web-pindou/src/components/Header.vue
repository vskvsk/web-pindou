<template>
  <div>
    <header class="app-header">
      <div class="header-left">
        <div class="logo">
          <div class="logo-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="12" r="3" fill="currentColor" />
            </svg>
          </div>
          <h1 class="logo-text">拼豆工坊</h1>
        </div>
        <span class="version">v1.0</span>
      </div>
      
      <div class="header-right">
        <el-button
          text
          @click="toggleDarkMode"
        >
          <el-icon class="mr-1"><component :is="isDarkMode ? Sunny : Moon" /></el-icon>
          {{ isDarkMode ? '浅色' : '深色' }}
        </el-button>
        
        <el-dropdown>
          <el-button text>
            更多<el-icon class="el-icon--right"><ArrowDown /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="clearProject">
                <el-icon><Delete /></el-icon> 清空项目
              </el-dropdown-item>
              <el-dropdown-item @click="showHelp">
                <el-icon><QuestionFilled /></el-icon> 使用帮助
              </el-dropdown-item>
              <el-dropdown-item divided @click="showAbout">
                <el-icon><InfoFilled /></el-icon> 关于
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </header>
    
    <!-- 帮助对话框 -->
    <el-dialog v-model="helpVisible" title="使用帮助" width="600px">
      <div class="help-content">
        <h4>快速开始</h4>
        <ol>
          <li>上传你想要转换的图片（支持拖拽）</li>
          <li>调整网格尺寸（默认 52×52）</li>
          <li>选择颜色匹配算法（快速/精确）</li>
          <li>点击「生成拼豆图」按钮</li>
          <li>在预览区域查看效果，支持缩放和拖拽</li>
          <li>导出图纸或用量清单</li>
        </ol>
        
        <h4>颜色匹配算法</h4>
        <ul>
          <li><strong>快速</strong>：使用欧几里得距离，处理速度快</li>
          <li><strong>精确 (CIEDE2000)</strong>：更符合人眼感知，推荐</li>
        </ul>
        
        <h4>快捷键</h4>
        <ul>
          <li>滚轮：缩放画布</li>
          <li>拖拽：平移画布</li>
        </ul>
      </div>
    </el-dialog>
    
    <!-- 关于对话框 -->
    <el-dialog v-model="aboutVisible" title="关于" width="400px">
      <div class="about-content">
        <div class="about-logo">🎨 拼豆工坊</div>
        <p>一个将图片转换为拼豆图纸的工具</p>
        <p class="tech-stack">Vue 3 + Vite + Pinia + Element Plus</p>
        <p class="copyright">© 2026 拼豆工坊</p>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Moon, Sunny, ArrowDown, Delete, QuestionFilled, InfoFilled } from '@element-plus/icons-vue'
import { usePindouStore } from '../stores/pindou'
import { ElMessageBox } from 'element-plus'

const store = usePindouStore()
const isDarkMode = computed(() => store.isDarkMode)

const helpVisible = ref(false)
const aboutVisible = ref(false)

function toggleDarkMode() {
  store.toggleDarkMode()
}

function clearProject() {
  ElMessageBox.confirm('确定要清空当前项目吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    store.clearProject()
  })
}

function showHelp() {
  helpVisible.value = true
}

function showAbout() {
  aboutVisible.value = true
}
</script>

<style scoped>
.app-header {
  height: 64px;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: white;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  z-index: 50;
}

.dark .app-header {
  background: #111827;
  border-color: #1f2937;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
}

.logo-icon {
  width: 32px;
  height: 32px;
  color: #3b82f6;
}

.logo-text {
  font-size: 20px;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.dark .logo-text {
  color: white;
}

.version {
  font-size: 12px;
  color: #9ca3af;
  background: #f3f4f6;
  padding: 2px 8px;
  border-radius: 4px;
}

.dark .version {
  background: #1f2937;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.mr-1 {
  margin-right: 4px;
}

.help-content {
  color: #4b5563;
}

.dark .help-content {
  color: #9ca3af;
}

.help-content h4 {
  color: #111827;
  font-weight: 600;
  margin-top: 16px;
  margin-bottom: 8px;
}

.help-content h4:first-child {
  margin-top: 0;
}

.dark .help-content h4 {
  color: white;
}

.help-content ol,
.help-content ul {
  padding-left: 20px;
  margin: 0;
}

.help-content li {
  font-size: 14px;
  line-height: 1.8;
}

.about-content {
  text-align: center;
  padding: 16px 0;
}

.about-logo {
  font-size: 36px;
  margin-bottom: 12px;
}

.about-content p {
  color: #6b7280;
  margin: 8px 0;
}

.dark .about-content p {
  color: #9ca3af;
}

.tech-stack {
  font-size: 12px;
  color: #9ca3af;
  margin-top: 8px;
}

.copyright {
  font-size: 12px;
  color: #9ca3af;
  margin-top: 16px;
}
</style>
