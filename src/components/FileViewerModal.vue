<template>
  <Transition name="modal">
    <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto" @click.self="close">
      <!-- Backdrop -->
      <div class="fixed inset-0 bg-black bg-opacity-75 transition-opacity"></div>

      <!-- Modal -->
      <div class="flex min-h-full items-center justify-center p-0 md:p-4">
        <div 
          class="relative bg-white rounded-none md:rounded-2xl shadow-2xl w-full h-full md:h-auto overflow-hidden md:max-w-[90vw] md:max-h-[90vh] flex flex-col"
          @click.stop
        >
          <!-- Header -->
          <div class="sticky top-0 bg-white border-b border-gray-200 px-4 md:px-6 py-3 md:py-4 flex items-center justify-between z-10">
            <div class="flex items-center gap-3">
              <component :is="fileIcon" class="w-8 h-8" :class="fileIconColor" />
              <div>
                <h2 class="text-lg font-bold text-gray-900">{{ file.originalName }}</h2>
                <p class="text-sm text-gray-500">{{ formatFileSize(file.size) }}</p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <a
                :href="file.url"
                download
                target="_blank"
                class="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download
              </a>
              <button
                @click="close"
                class="text-gray-400 hover:text-gray-600 transition-colors p-2"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Content -->
          <div class="overflow-auto h-full md:max-h-[calc(90vh-80px)]">
            <!-- PDF Viewer -->
            <iframe
              v-if="fileType === 'pdf'"
              :src="file.url"
              class="w-full h-full md:h-[calc(90vh-80px)]"
            ></iframe>

            <!-- Image Viewer -->
            <div v-else-if="fileType === 'image'" class="flex items-center justify-center p-4 md:p-8 bg-gray-50 min-h-full">
              <img :src="file.url" :alt="file.originalName" class="max-w-full h-auto" />
            </div>

            <!-- Unsupported File Type -->
            <div v-else class="flex flex-col items-center justify-center p-6 md:p-12 text-center min-h-full">
              <component :is="fileIcon" class="w-24 h-24 mb-4" :class="fileIconColor" />
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Preview not available</h3>
              <p class="text-gray-600 mb-4">This file type cannot be previewed in the browser.</p>
              <a
                :href="file.url"
                download
                target="_blank"
                class="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
              >
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download File
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  isOpen: boolean;
  file: {
    url: string;
    originalName: string;
    size: number;
  };
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: 'close'): void;
}>();

const fileType = computed(() => {
  const ext = props.file.originalName.split('.').pop()?.toLowerCase();
  if (ext === 'pdf') return 'pdf';
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext || '')) return 'image';
  return 'other';
});

const fileIcon = computed(() => {
  const ext = props.file.originalName.split('.').pop()?.toLowerCase();
  
  if (ext === 'pdf') {
    return 'svg';
  } else if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext || '')) {
    return 'svg';
  } else if (['doc', 'docx'].includes(ext || '')) {
    return 'svg';
  } else if (['xls', 'xlsx'].includes(ext || '')) {
    return 'svg';
  }
  return 'svg';
});

const fileIconColor = computed(() => {
  const ext = props.file.originalName.split('.').pop()?.toLowerCase();
  
  if (ext === 'pdf') return 'text-red-600';
  if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '')) return 'text-blue-600';
  if (['doc', 'docx'].includes(ext || '')) return 'text-blue-700';
  if (['xls', 'xlsx'].includes(ext || '')) return 'text-green-600';
  return 'text-gray-600';
});

const close = () => {
  emit('close');
};

const formatFileSize = (bytes: number) => {
  if (!bytes) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};
</script>

<script lang="ts">
export default {
  name: 'FileViewerModal'
};
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>

