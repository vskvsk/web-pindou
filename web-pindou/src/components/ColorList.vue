<template>
  <div class="color-list-panel">
    <div class="panel-header">
      <h3 class="panel-title">用量清单</h3>
      <div class="stats">
        <el-tag type="info" size="small">{{ totalBeads }} 颗</el-tag>
        <el-tag type="success" size="small">{{ uniqueColors }} 色</el-tag>
      </div>
    </div>
    
    <div class="color-list" v-if="colorCounts.length > 0">
      <div
        v-for="item in colorCounts"
        :key="item.color.code"
        class="color-item"
        :class="{ active: selectedFilter === item.color.code }"
        @click="toggleFilter(item.color.code)"
      >
        <div
          class="color-swatch"
          :style="{ backgroundColor: item.color.hex }"
        >
          <span class="color-code">{{ item.color.code }}</span>
        </div>
        <div class="color-info">
          <span class="color-name">{{ item.color.nameCn || item.color.name }}</span>
          <span class="color-count">{{ item.count }} 颗</span>
        </div>
        <div class="color-percentage">
          {{ ((item.count / totalBeads) * 100).toFixed(1) }}%
        </div>
      </div>
    </div>
    
    <el-empty v-else description="暂无数据，请先生成拼豆图" />
    
    <!-- 导出选项 -->
    <div class="export-section" v-if="colorCounts.length > 0">
      <el-divider />
      <el-button-group class="w-full">
        <el-button @click="copyList" :icon="DocumentCopy">复制清单</el-button>
        <el-button @click="exportCSV" :icon="Download">导出 CSV</el-button>
      </el-button-group>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { DocumentCopy, Download } from '@element-plus/icons-vue'
import { usePindouStore } from '../stores/pindou'
import { ElMessage } from 'element-plus'

const store = usePindouStore()

const colorCounts = computed(() => store.colorCounts)
const totalBeads = computed(() => store.totalBeads)
const uniqueColors = computed(() => store.uniqueColors)
const selectedFilter = computed(() => store.selectedColorFilter)

function toggleFilter(colorCode: string) {
  if (store.selectedColorFilter === colorCode) {
    store.selectedColorFilter = null
  } else {
    store.selectedColorFilter = colorCode
  }
}

function copyList() {
  const lines = [
    '拼豆用量清单',
    `总计: ${totalBeads.value} 颗 | ${uniqueColors.value} 种颜色`,
    '',
    ...colorCounts.value.map(item => 
      `${item.color.code}\t${item.color.nameCn || item.color.name}\t${item.count}颗`
    )
  ]
  
  navigator.clipboard.writeText(lines.join('\n'))
  ElMessage.success('清单已复制到剪贴板')
}

function exportCSV() {
  const headers = '色号,名称,数量,占比\n'
  const rows = colorCounts.value.map(item => 
    `${item.color.code},${item.color.nameCn || item.color.name},${item.count},${((item.count / totalBeads.value) * 100).toFixed(1)}%`
  ).join('\n')
  
  const blob = new Blob(['\uFEFF' + headers + rows], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `拼豆清单_${store.gridSize.width}x${store.gridSize.height}_${Date.now()}.csv`
  link.click()
  
  ElMessage.success('CSV 已导出')
}
</script>

<style scoped>
.color-list-panel {
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
  padding: 20px;
  border: 1px solid #e5e7eb;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.dark .color-list-panel {
  background: #1f2937;
  border-color: #374151;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.panel-title {
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.dark .panel-title {
  color: white;
}

.stats {
  display: flex;
  gap: 8px;
}

.color-list {
  flex: 1;
  overflow-y: auto;
  max-height: 400px;
}

.color-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.color-item:hover {
  background: #f3f4f6;
}

.dark .color-item:hover {
  background: #374151;
}

.color-item.active {
  background: #dbeafe;
  box-shadow: 0 0 0 2px #3b82f6;
}

.dark .color-item.active {
  background: rgba(59, 130, 246, 0.2);
}

.color-swatch {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  flex-shrink: 0;
  border: 1px solid rgba(0,0,0,0.1);
}

.dark .color-swatch {
  border-color: rgba(255,255,255,0.1);
}

.color-code {
  font-size: 10px;
  font-weight: bold;
  padding: 2px 4px;
  border-radius: 4px;
  background: rgba(0,0,0,0.3);
  color: white;
}

.color-info {
  flex: 1;
  min-width: 0;
}

.color-name {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dark .color-name {
  color: #d1d5db;
}

.color-count {
  display: block;
  font-size: 12px;
  color: #6b7280;
}

.dark .color-count {
  color: #9ca3af;
}

.color-percentage {
  font-size: 12px;
  color: #9ca3af;
  font-family: monospace;
}

.export-section {
  margin-top: auto;
  padding-top: 8px;
}

.w-full {
  width: 100%;
}

:deep(.el-empty) {
  padding: 32px 0;
}
</style>
