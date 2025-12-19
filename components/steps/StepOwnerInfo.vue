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
        <p class="mt-1 text-xs text-gray-500">By submitting your phone number you accept to receive messages from Heroic
          Funding</p>
      </div>

      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">
          Social Security Number <span class="text-red-500">*</span>
        </label>
        <div
          class="flex items-center w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 transition-all bg-white relative"
          @click="focusSSN">
          <input id="ssn-1" :value="ssnPart1" :type="showSSN ? 'text' : 'password'" maxlength="3"
            class="w-16 p-0 border-none outline-none text-center bg-transparent focus:ring-0" placeholder="XXX"
            @input="e => handleSSNInput(e, 1)" @keydown="e => handleSSNKeydown(e, 1)" />
          <span class="text-gray-400 font-bold mx-2">-</span>
          <input id="ssn-2" :value="ssnPart2" :type="showSSN ? 'text' : 'password'" maxlength="2"
            class="w-12 p-0 border-none outline-none text-center bg-transparent focus:ring-0" placeholder="XX"
            @input="e => handleSSNInput(e, 2)" @keydown="e => handleSSNKeydown(e, 2)" />
          <span class="text-gray-400 font-bold mx-2">-</span>
          <input id="ssn-3" :value="ssnPart3" :type="showSSN ? 'text' : 'password'" maxlength="4"
            class="w-20 p-0 border-none outline-none text-center bg-transparent focus:ring-0" placeholder="XXXX"
            @input="e => handleSSNInput(e, 3)" @keydown="e => handleSSNKeydown(e, 3)" />

          <button type="button" @click.stop="showSSN = !showSSN"
            class="absolute right-4 text-gray-500 hover:text-gray-700 focus:outline-none bg-white pl-2">
            <svg v-if="showSSN" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
        </div>
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
          Did you work with a Heroic Funding Specialist? If so, Who? <span class="text-red-500">*</span>
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
const showSSN = ref(false)

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

// SSN Handling
const ssnPart1 = ref('')
const ssnPart2 = ref('')
const ssnPart3 = ref('')

// Initialize from existing data
watch(() => localData.value.ssn, (newVal) => {
  const clean = (newVal || '').replace(/\D/g, '')
  const currentParts = ssnPart1.value + ssnPart2.value + ssnPart3.value

  if (clean !== currentParts) {
    ssnPart1.value = clean.slice(0, 3)
    ssnPart2.value = clean.slice(3, 5)
    ssnPart3.value = clean.slice(5, 9)
  }
}, { immediate: true })

const updateSSN = () => {
  localData.value.ssn = ssnPart1.value + ssnPart2.value + ssnPart3.value
}

const handleSSNInput = (e: Event, part: 1 | 2 | 3) => {
  const input = e.target as HTMLInputElement
  const val = input.value.replace(/\D/g, '') // Remove non-digits

  if (part === 1) {
    ssnPart1.value = val.slice(0, 3)
    if (val.length >= 3) {
      document.getElementById('ssn-2')?.focus()
    }
  } else if (part === 2) {
    ssnPart2.value = val.slice(0, 2)
    if (val.length >= 2) {
      document.getElementById('ssn-3')?.focus()
    }
  } else {
    ssnPart3.value = val.slice(0, 4)
  }
  updateSSN()
}

const handleSSNKeydown = (e: KeyboardEvent, part: 1 | 2 | 3) => {
  if (e.key === 'Backspace') {
    const input = e.target as HTMLInputElement
    if (input.value.length === 0) {
      if (part === 3) document.getElementById('ssn-2')?.focus()
      if (part === 2) document.getElementById('ssn-1')?.focus()
    }
  }
}

const focusSSN = (e: MouseEvent) => {
  // Prevent focusing if clicking the button or inputs directly
  if ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).closest('button')) return

  // Focus logic
  if (!ssnPart1.value) document.getElementById('ssn-1')?.focus()
  else if (!ssnPart2.value) document.getElementById('ssn-2')?.focus()
  else if (!ssnPart3.value) document.getElementById('ssn-3')?.focus()
  else document.getElementById('ssn-1')?.focus()
}
</script>
