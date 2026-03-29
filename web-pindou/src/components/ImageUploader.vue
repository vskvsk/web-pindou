<template>
  <div class="image-uploader">
    <div
      class="upload-zone"
      :class="{ dragging, 'has-image': previewUrl }"
      @dragenter.prevent="dragging = true"
      @dragleave.prevent="dragging = false"
      @dragover.prevent
      @drop.prevent="handleDrop"
      @click="triggerFileInput"
    >
      <input
        ref="fileInput"
        type="file"
        accept="image/*"
        class="hidden"
        @change="handleFileChange"
      />
      
      <template v-if="!previewUrl">
        <el-icon class="upload-icon"><Upload /></el-icon>
        <p class="upload-text">点击或拖拽图片到此处</p>
        <p class="upload-hint">支持 JPG、PNG、GIF 格式</p>
      </template>
      
      <template v-else>
        <img :src="previewUrl" alt="Preview" class="preview-image" />
        <div class="upload-overlay">
          <el-icon><Refresh /></el-icon>
          <span>点击更换图片</span>
        </div>
      </template>
    </div>
    
    <div v-if="fileName" class="file-info">
      <span>{{ fileName }}</span>
      <el-button type="danger" size="small" text @click="clearImage">
        <el-icon><Delete /></el-icon>
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Upload, Refresh, Delete } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const props = defineProps<{
  modelValue?: HTMLImageElement | null
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', img: HTMLImageElement | null): void
  (e: 'change', file: File): void
}>()

const fileInput = ref<HTMLInputElement>()
const dragging = ref(false)
const previewUrl = ref('')
const fileName = ref('')

watch(() => props.modelValue, (newVal) => {
  if (!newVal) {
    previewUrl.value = ''
    fileName.value = ''
  }
})

function triggerFileInput() {
  fileInput.value?.click()
}

function handleFileChange(e: Event) {
  const files = (e.target as HTMLInputElement).files
  if (files && files.length > 0) {
    processFile(files[0])
  }
}

function handleDrop(e: DragEvent) {
  dragging.value = false
  const files = e.dataTransfer?.files
  if (files && files.length > 0) {
    if (files[0].type.startsWith('image/')) {
      processFile(files[0])
    } else {
      ElMessage.error('请上传图片文件')
    }
  }
}

function processFile(file: File) {
  if (!file.type.startsWith('image/')) {
    ElMessage.error('请上传图片文件')
    return
  }
  
  if (file.size > 10 * 1024 * 1024) {
    ElMessage.error('图片大小不能超过 10MB')
    return
  }
  
  fileName.value = file.name
  
  const reader = new FileReader()
  reader.onload = (e) => {
    const img = new Image()
    img.onload = () => {
      previewUrl.value = e.target?.result as string
      emit('update:modelValue', img)
    }
    img.src = e.target?.result as string
  }
  reader.readAsDataURL(file)
  
  emit('change', file)
}

function clearImage() {
  previewUrl.value = ''
  fileName.value = ''
  if (fileInput.value) {
    fileInput.value.value = ''
  }
  emit('update:modelValue', null)
}
</script>

<style scoped>
.image-uploader {
  width: 100%;
}

.upload-zone {
  position: relative;
  border: 2px dashed #d1d5db;
  border-radius: 12px;
  padding: 32px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  background: #f9fafb;
}

.dark .upload-zone {
  border-color: #4b5563;
  background: #1f2937;
}

.upload-zone:hover {
  border-color: #60a5fa;
  background: #eff6ff;
}

.dark .upload-zone:hover {
  background: #374151;
}

.upload-zone.dragging {
  border-color: #3b82f6;
  background: #dbeafe;
}

.dark .upload-zone.dragging {
  background: rgba(59, 130, 246, 0.3);
}

.upload-zone.has-image {
  padding: 8px;
}

.hidden {
  display: none;
}

.upload-icon {
  font-size: 48px;
  color: #9ca3af;
  margin-bottom: 16px;
}

.upload-text {
  font-size: 16px;
  color: #4b5563;
  margin-bottom: 8px;
  margin-top: 0;
}

.dark .upload-text {
  color: #d1d5db;
}

.upload-hint {
  font-size: 12px;
  color: #9ca3af;
  margin: 0;
}

.preview-image {
  max-width: 100%;
  max-height: 300px;
  border-radius: 8px;
  object-fit: contain;
}

.upload-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  opacity: 0;
  transition: opacity 0.2s;
}

.upload-zone.has-image:hover .upload-overlay {
  opacity: 1;
}

.file-info {
  margin-top: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  color: #4b5563;
  background: #f3f4f6;
  padding: 8px 12px;
  border-radius: 8px;
}

.dark .file-info {
  color: #d1d5db;
  background: #374151;
}
</style>
