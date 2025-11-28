<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
    <!-- Header -->
    <header class="bg-white shadow-sm sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
            <span class="text-white font-bold text-xl">FD</span>
          </div>
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Fund Direct</h1>
            <p class="text-xs text-gray-500">Business Funding Verification</p>
          </div>
        </div>
      </div>
    </header>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center min-h-[60vh]">
      <div class="text-center">
        <div class="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
        <p class="mt-4 text-gray-600 font-medium">Loading your information...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="max-w-2xl mx-auto px-4 py-16">
      <div class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <svg class="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h2 class="text-2xl font-bold text-gray-900 mb-2">Unable to Load Application</h2>
        <p class="text-gray-600 mb-4">{{ error }}</p>
        <p class="text-sm text-gray-500">Please contact us at <a href="tel:8006412609" class="text-blue-600 font-semibold">(800) 641-2609</a></p>
      </div>
    </div>

    <!-- Main Content -->
    <main v-else class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20">
      <MultiStepForm :mca-data="mcaData" />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { MCAData } from '../types'
import { useApi } from '../composables/useApi'

const route = useRoute()
const router = useRouter()
const uniqueId = route.params.uniqueId as string
const { fetchMCAData } = useApi()

const loading = ref(true)
const error = ref('')
const mcaData = ref<MCAData | null>(null)

onMounted(async () => {
  // Check if uniqueId is provided
  if (!uniqueId) {
    error.value = 'You are on the wrong page. Please use the link provided in your email.'
    loading.value = false
    return
  }

  try {
    mcaData.value = await fetchMCAData(uniqueId)
    loading.value = false
  } catch (err: any) {
    error.value = err?.data?.message || 'Failed to load application data. Please check your link and try again.'
    loading.value = false
  }
})
</script>


