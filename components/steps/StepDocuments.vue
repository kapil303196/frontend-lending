<template>
  <div class="space-y-6">
    <div>
      <h3 class="text-2xl font-bold text-gray-900 mb-2">Upload Bank Statements</h3>
      <p class="text-gray-600">This is needed to verify your application. You can upload PDF files.</p>
    </div>

    <div class="space-y-4">
      <div v-for="(statement, index) in bankStatements" :key="index" class="space-y-2">
        <label class="block text-sm font-semibold text-gray-700">
          Bank Statement {{ index + 1 }}
          <span v-if="index === 0" class="text-red-500">*</span>
        </label>
        <div class="relative">
          <input
            :ref="el => fileInputs[index] = el"
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            @change="handleFileChange(index, $event)"
            class="hidden"
          />
          <div
            @click="triggerFileInput(index)"
            @dragover.prevent="handleDragOver(index)"
            @dragleave.prevent="handleDragLeave(index)"
            @drop.prevent="handleDrop(index, $event)"
            :class="[
              'border-2 border-dashed rounded-lg p-6 cursor-pointer transition-all',
              statement.file ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-blue-500 bg-gray-50',
              isDragging[index] ? 'border-blue-500 bg-blue-50' : ''
            ]"
          >
            <div class="flex flex-col items-center justify-center text-center">
              <svg v-if="!statement.file" class="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <svg v-else class="w-12 h-12 text-green-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              
              <p v-if="!statement.file" class="text-sm text-gray-600 mb-1">
                <span class="font-semibold text-blue-600">Click to upload</span> or drag and drop
              </p>
              <p v-else class="text-sm font-semibold text-green-700 mb-1">
                {{ statement.file.name }}
              </p>
              <p class="text-xs text-gray-500">
                {{ statement.file ? formatFileSize(statement.file.size) : 'PDF, JPG, PNG up to 10MB' }}
              </p>
              
              <button
                v-if="statement.file"
                @click.stop="removeFile(index)"
                type="button"
                class="mt-3 text-sm text-red-600 hover:text-red-700 font-medium"
              >
                Remove file
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Info Box -->
    <div class="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 flex items-start space-x-3">
      <svg class="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <div class="text-sm text-yellow-900">
        <p class="font-semibold mb-1">Required Documents</p>
        <p>Please upload at least your most recent bank statement. Additional statements help speed up the approval process.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormData } from '~/types'

const props = defineProps<{
  formData: Partial<FormData>
}>()

const emit = defineEmits<{
  update: [data: Partial<FormData>]
}>()

const bankStatements = ref([
  { file: null as File | null },
  { file: null as File | null },
  { file: null as File | null }
])

const isDragging = ref([false, false, false])
const fileInputs = ref<any[]>([])

const triggerFileInput = (index: number) => {
  fileInputs.value[index]?.click()
}

const handleFileChange = (index: number, event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    const file = input.files[0]
    if (validateFile(file)) {
      bankStatements.value[index].file = file
      updateFormData()
    }
  }
}

const handleDragOver = (index: number) => {
  isDragging.value[index] = true
}

const handleDragLeave = (index: number) => {
  isDragging.value[index] = false
}

const handleDrop = (index: number, event: DragEvent) => {
  isDragging.value[index] = false
  if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
    const file = event.dataTransfer.files[0]
    if (validateFile(file)) {
      bankStatements.value[index].file = file
      updateFormData()
    }
  }
}

const removeFile = (index: number) => {
  bankStatements.value[index].file = null
  updateFormData()
}

const validateFile = (file: File): boolean => {
  const maxSize = 10 * 1024 * 1024 // 10MB
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']
  
  if (!allowedTypes.includes(file.type)) {
    alert('Please upload a PDF, JPG, or PNG file')
    return false
  }
  
  if (file.size > maxSize) {
    alert('File size must be less than 10MB')
    return false
  }
  
  return true
}

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

const updateFormData = () => {
  const files = bankStatements.value
    .map(s => s.file)
    .filter(f => f !== null) as File[]
  emit('update', { bankStatements: files })
}
</script>

