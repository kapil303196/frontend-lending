<template>
  <div class="space-y-6">
    <div>
      <h3 class="text-2xl font-bold text-gray-900 mb-2">Business Information</h3>
      <p class="text-gray-600">Please verify and complete your business details</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="md:col-span-2">
        <label class="block text-sm font-semibold text-gray-700 mb-2">
          Legal Business Name <span class="text-red-500">*</span>
        </label>
        <input
          v-model="localData.legalBusinessName"
          type="text"
          required
          class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
          placeholder="Enter your legal business name"
        />
      </div>

      <div class="md:col-span-2">
        <label class="block text-sm font-semibold text-gray-700 mb-2">
          DBA (Doing Business As)
        </label>
        <input
          v-model="localData.dba"
          type="text"
          class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
          placeholder="Enter DBA if different from legal name"
        />
      </div>

      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">
          Email Address <span class="text-red-500">*</span>
        </label>
        <input
          v-model="localData.businessEmail"
          type="email"
          required
          class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
          placeholder="business@example.com"
        />
      </div>

      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">
          EIN <span class="text-red-500">*</span>
        </label>
        <input
          v-model="localData.ein"
          type="text"
          required
          class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
          placeholder="12-3456789"
        />
      </div>

      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">
          Business Start Date <span class="text-red-500">*</span>
        </label>
        <input
          v-model="localData.businessStartDate"
          type="date"
          required
          class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
        />
      </div>

      <div class="md:col-span-2">
        <label class="block text-sm font-semibold text-gray-700 mb-2">
          Street Address <span class="text-red-500">*</span>
        </label>
        <input
          v-model="localData.streetAddress"
          type="text"
          required
          class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
          placeholder="123 Main Street"
        />
      </div>

      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">
          City <span class="text-red-500">*</span>
        </label>
        <input
          v-model="localData.city"
          type="text"
          required
          class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
          placeholder="City"
        />
      </div>

      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">
          State <span class="text-red-500">*</span>
        </label>
        <select
          v-model="localData.state"
          required
          class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
        >
          <option value="">Select State</option>
          <option v-for="state in states" :key="state" :value="state">{{ state }}</option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">
          ZIP Code <span class="text-red-500">*</span>
        </label>
        <input
          v-model="localData.zipCode"
          type="text"
          required
          maxlength="10"
          class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
          placeholder="12345"
        />
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

const localData = ref({ ...props.formData })

watch(localData, (newVal) => {
  emit('update', newVal)
}, { deep: true })

const states = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY']
</script>

