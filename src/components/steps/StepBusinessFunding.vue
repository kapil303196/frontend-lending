<template>
  <div class="space-y-6">
    <div>
      <h3 class="text-2xl font-bold text-gray-900 mb-2">Business Funding</h3>
      <p class="text-gray-600">Tell us about your funding needs</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">
          Amount Requested <span class="text-red-500">*</span>
        </label>
        <div class="relative">
          <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">$</span>
          <input
            v-model="localData.amountRequested"
            type="text"
            required
            class="w-full pl-8 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
            placeholder="50,000"
            @input="formatCurrency"
          />
        </div>
      </div>

      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">
          Monthly Revenue <span class="text-red-500">*</span>
        </label>
        <div class="relative">
          <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">$</span>
          <input
            v-model="localData.monthlyRevenue"
            type="text"
            required
            class="w-full pl-8 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
            placeholder="100,000"
            @input="formatRevenue"
          />
        </div>
      </div>

      <div class="md:col-span-2">
        <label class="block text-sm font-semibold text-gray-700 mb-3">
          Do You Have Any Existing Balances? <span class="text-red-500">*</span>
        </label>
        <div class="flex gap-4">
          <label class="flex items-center space-x-3 cursor-pointer group">
            <input
              v-model="localData.hasExistingBalances"
              type="radio"
              value="yes"
              required
              class="w-5 h-5 text-blue-600 focus:ring-2 focus:ring-blue-500"
            />
            <span class="text-gray-700 group-hover:text-gray-900 font-medium">Yes</span>
          </label>
          <label class="flex items-center space-x-3 cursor-pointer group">
            <input
              v-model="localData.hasExistingBalances"
              type="radio"
              value="no"
              required
              class="w-5 h-5 text-blue-600 focus:ring-2 focus:ring-blue-500"
            />
            <span class="text-gray-700 group-hover:text-gray-900 font-medium">No</span>
          </label>
        </div>
      </div>

      <div class="md:col-span-2">
        <label class="block text-sm font-semibold text-gray-700 mb-2">
          How many owners are in the business? <span class="text-red-500">*</span>
        </label>
        <input
          v-model.number="localData.numberOfOwners"
          type="number"
          min="1"
          required
          class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
          placeholder="1"
        />
      </div>
    </div>

    <!-- Info Box -->
    <div class="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 flex items-start space-x-3">
      <svg class="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <div class="text-sm text-blue-900">
        <p class="font-semibold mb-1">Why we ask for this information</p>
        <p>This helps us understand your business needs and find the best funding solution for you.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { FormData } from '../../types'

const props = defineProps<{
  formData: Partial<FormData>
}>()

const emit = defineEmits<{
  update: [data: Partial<FormData>]
}>()

const localData = ref({ ...props.formData })

watch(localData, (newVal) => {
  emit('update', newVal)
}, { deep: true })

const formatCurrency = (e: Event) => {
  const input = e.target as HTMLInputElement
  let value = input.value.replace(/[^0-9]/g, '')
  if (value) {
    value = parseInt(value).toLocaleString()
  }
  localData.value.amountRequested = value
}

const formatRevenue = (e: Event) => {
  const input = e.target as HTMLInputElement
  let value = input.value.replace(/[^0-9]/g, '')
  if (value) {
    value = parseInt(value).toLocaleString()
  }
  localData.value.monthlyRevenue = value
}
</script>

