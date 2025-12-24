<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Header -->
    <!-- <LogoHeader logoTheme="dark" /> -->
    <!-- <header class="bg-white shadow-sm sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center space-x-3">
          <div
            class="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
            <span class="text-white font-bold text-xl">FD</span>
          </div>
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Heroic Funding</h1>
            <p class="text-xs text-gray-500">Business Funding Verification</p>
          </div>
        </div>
      </div>
    </header> -->

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
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h2 class="text-2xl font-bold text-gray-900 mb-2">Unable to Load Application</h2>
        <p class="text-gray-600 mb-4">{{ error }}</p>
        <!-- <p class="text-sm text-gray-500">Please contact us at <a href="tel:8006412609"
            class="text-blue-600 font-semibold">(800) 641-2609</a></p> -->
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
import { useRoute } from 'vue-router'
import type { MCAData } from '../types'
import { useApi } from '../composables/useApi'
import MultiStepForm from '../components/MultiStepForm.vue'
import LogoHeader from '../components/LogoHeader/LogoHeader.vue'

const route = useRoute()
const uniqueId = route.params.uniqueId as string
const { fetchMCAData } = useApi()

const loading = ref(true)
const error = ref('')
const mcaData = ref<MCAData | null>(null)

const formatDateForInput = (dateInput: string | Date) => {
  let date;
  if (!dateInput) return ''

  // Handle different input types
  if (dateInput instanceof Date) {
    date = dateInput;
  } else if (typeof dateInput === 'string') {
    // Check if it's in DD.MM.YYYY format
    if (/^\d{2}\.\d{2}\.\d{4}$/.test(dateInput)) {
      const [day, month, year] = dateInput.split('.');
      date = new Date(Number(year), Number(month) - 1, Number(day));
    } else {
      // Try parsing as ISO string or other date string
      date = new Date(dateInput);
    }
  } else {
    throw new Error('Invalid date input');
  }

  // Validate date
  if (isNaN(date.getTime())) {
    throw new Error('Invalid date');
  }

  // Extract date components
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  // Return in YYYY-MM-DD format (HTML date input format)
  return `${year}-${month}-${day}`;
}

onMounted(async () => {
  if (!uniqueId) {
    error.value = 'You are on the wrong page. Please use the link provided in your email.'
    loading.value = false
    return
  }

  try {
    const data = await fetchMCAData(uniqueId)
    const formattedData = {
      ...data,
      data: {
        ...data.data,
        birthDate: formatDateForInput(data.data.birthDate),
        dateBusinessStarted: formatDateForInput(data.data.dateBusinessStarted),
      }
    }
    mcaData.value = formattedData
    loading.value = false
  } catch (err: any) {
    error.value = err?.message || 'Failed to load application data. Please check your link and try again.'
    loading.value = false
  }
})
</script>
