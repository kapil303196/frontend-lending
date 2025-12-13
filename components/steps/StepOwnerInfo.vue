<template>
  <div class="space-y-6">
    <div>
      <h3 class="text-2xl font-bold text-gray-900 mb-2">Primary Owner Information</h3>
      <p class="text-gray-600">Please provide details about the primary business owner</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">
          First Name <span class="text-red-500">*</span>
        </label>
        <input v-model="localData.firstName" type="text" required
          class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
          placeholder="E.g. John" />
      </div>

      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">
          Last Name <span class="text-red-500">*</span>
        </label>
        <input v-model="localData.lastName" type="text" required
          class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
          placeholder="E.g. Doe" />
      </div>

      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">
          Email Address <span class="text-red-500">*</span>
        </label>
        <input v-model="localData.ownerEmail" type="email" required
          class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
          placeholder="E.g. john@doe.com" />
      </div>

      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">
          Phone <span class="text-red-500">*</span>
        </label>
        <input v-model="localData.phone" type="tel" required
          class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
          placeholder="E.g. +1 300 400 5000" @input="formatPhone" />
        <p class="mt-1 text-xs text-gray-500">By submitting your phone number you accept to receive messages from EZBiz
          Funding</p>
      </div>

      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">
          Social Security Number <span class="text-red-500">*</span>
        </label>
        <input v-model="localData.ssn" type="password" required maxlength="11"
          class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
          placeholder="XXX-XX-XXXX" @input="formatSSN" />
      </div>

      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">
          % Ownership <span class="text-red-500">*</span>
        </label>
        <div class="relative">
          <input v-model.number="localData.ownershipPercent" type="number" min="0" max="100" required
            class="w-full px-4 py-3 pr-10 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
            placeholder="100" />
          <span class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">%</span>
        </div>
      </div>

      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">
          Date of Birth <span class="text-red-500">*</span>
        </label>
        <input v-model="localData.dateOfBirth" type="date" required
          class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none" />
      </div>

      <div class="md:col-span-2">
        <AddressAutocomplete v-model="localData.ownerStreetAddress" label="Street Address"
          placeholder="Start typing your address..." :required="true" @addressSelected="handleOwnerAddressSelected" />
      </div>

      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">
          City
        </label>
        <input v-model="localData.ownerCity" type="text"
          class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
          placeholder="City" />
      </div>

      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">
          State <span class="text-red-500">*</span>
        </label>
        <input v-model="localData.ownerState" type="text" required
          class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
          placeholder="State" />
      </div>

      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">
          ZIP <span class="text-red-500">*</span>
        </label>
        <input v-model="localData.ownerZip" type="text" required maxlength="10"
          class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
          placeholder="12345" />
      </div>

      <div class="md:col-span-2">
        <label class="block text-sm font-semibold text-gray-700 mb-2">
          Did you work with a EZBiz Funding Specialist? If so, Who? <span class="text-red-500">*</span>
        </label>
        <input v-model="localData.fundDirectSpecialist" type="text" required
          class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
          placeholder="Specialist name or 'None'" />
      </div>
    </div>

    <!-- Security Notice -->
    <div class="bg-green-50 border-2 border-green-200 rounded-lg p-4 flex items-start space-x-3">
      <svg class="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
      <div class="text-sm text-green-900">
        <p class="font-semibold mb-1">Your information is secure</p>
        <p>All personal information is encrypted and protected with SSL security.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { FormData } from '../../types'
import AddressAutocomplete from '../AddressAutocomplete.vue'

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

const handleOwnerAddressSelected = (addressData: any) => {
  localData.value.ownerStreetAddress = addressData.streetAddress
  localData.value.ownerCity = addressData.city
  localData.value.ownerState = addressData.stateShort
  localData.value.ownerZip = addressData.zipCode
}

const formatPhone = (e: Event) => {
  const input = e.target as HTMLInputElement
  let value = input.value.replace(/\D/g, '')
  if (value.length > 10) value = value.slice(0, 10)
  localData.value.phone = value
}

const formatSSN = (e: Event) => {
  const input = e.target as HTMLInputElement
  let value = input.value.replace(/\D/g, '')
  if (value.length > 9) value = value.slice(0, 9)
  if (value.length > 5) {
    value = value.slice(0, 3) + '-' + value.slice(3, 5) + '-' + value.slice(5)
  } else if (value.length > 3) {
    value = value.slice(0, 3) + '-' + value.slice(3)
  }
  localData.value.ssn = value
}
</script>
