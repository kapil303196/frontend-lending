<template>
  <div class="space-y-6">
    <div>
      <h3 class="text-2xl text-center font-bold text-gray-900 mb-2">Primary Owner Information</h3>
      <p class="text-gray-600 text-center">Please provide details about the primary business owner</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">
          First Name <span class="text-red-500">*</span>
        </label>
        <input v-model="localData.firstName" type="text" required :class="[
          'w-full px-4 py-3 border-2 rounded-lg focus:ring-2 transition-all outline-none',
          hasError('firstName') ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
        ]" placeholder="E.g. John" @blur="validateSingleField('firstName')" />
        <p v-if="hasError('firstName')" class="mt-1 text-sm text-red-600">{{ getError('firstName') }}</p>
      </div>

      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">
          Last Name <span class="text-red-500">*</span>
        </label>
        <input v-model="localData.lastName" type="text" required :class="[
          'w-full px-4 py-3 border-2 rounded-lg focus:ring-2 transition-all outline-none',
          hasError('lastName') ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
        ]" placeholder="E.g. Doe" @blur="validateSingleField('lastName')" />
        <p v-if="hasError('lastName')" class="mt-1 text-sm text-red-600">{{ getError('lastName') }}</p>
      </div>

      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">
          Email Address <span class="text-red-500">*</span>
        </label>
        <input v-model="localData.ownerEmail" type="email" required :class="[
          'w-full px-4 py-3 border-2 rounded-lg focus:ring-2 transition-all outline-none',
          hasError('ownerEmail') ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
        ]" placeholder="E.g. john@doe.com" @blur="validateSingleField('ownerEmail')" />
        <p v-if="hasError('ownerEmail')" class="mt-1 text-sm text-red-600">{{ getError('ownerEmail') }}</p>
      </div>

      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">
          Phone <span class="text-red-500">*</span>
        </label>
        <input v-model="localData.phone" type="tel" required :class="[
          'w-full px-4 py-3 border-2 rounded-lg focus:ring-2 transition-all outline-none',
          hasError('phone') ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
        ]" placeholder="E.g. +1 300 400 5000" @input="formatPhone" @blur="validateSingleField('phone')" />
        <p v-if="hasError('phone')" class="mt-1 text-sm text-red-600">{{ getError('phone') }}</p>
        <p class="mt-1 text-xs text-gray-500">By submitting your phone number you accept to receive messages from Fund
          Direct</p>
      </div>

      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">
          Social Security Number <span class="text-red-500">*</span>
        </label>
        <div class="relative">
          <input v-model="localData.ssn" :type="showSSN ? 'text' : 'password'" required maxlength="11" :class="[
            'w-full px-4 py-3 pr-12 border-2 rounded-lg focus:ring-2 transition-all outline-none',
            hasError('ssn') ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
          ]" placeholder="XXX-XX-XXXX" @input="formatSSN" @blur="validateSingleField('ssn')" />
          <button type="button" @click="showSSN = !showSSN"
            class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none">
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
        <p v-if="hasError('ssn')" class="mt-1 text-sm text-red-600">{{ getError('ssn') }}</p>
      </div>

      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">
          % Ownership <span class="text-red-500">*</span>
        </label>
        <div class="relative">
          <input v-model.number="localData.ownershipPercent" type="number" min="0" max="100" required :class="[
            'w-full px-4 py-3 pr-10 border-2 rounded-lg focus:ring-2 transition-all outline-none',
            hasError('ownershipPercent') ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
          ]" placeholder="100" @blur="validateSingleField('ownershipPercent')" />
          <span class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">%</span>
        </div>
        <p v-if="hasError('ownershipPercent')" class="mt-1 text-sm text-red-600">{{ getError('ownershipPercent') }}</p>
      </div>

      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">
          Date of Birth <span class="text-red-500">*</span>
        </label>
        <BaseDatePicker v-model="localData.dateOfBirth" :error="getError('dateOfBirth')"
          @blur="validateSingleField('dateOfBirth')" />
      </div>

      <div class="md:col-span-2">
        <AddressAutocomplete v-model="localData.ownerStreetAddress" label="Street Address"
          placeholder="Start typing your address..." :required="true" :error="getError('ownerStreetAddress')"
          @addressSelected="handleOwnerAddressSelected" @blur="validateSingleField('ownerStreetAddress')" />
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
        <input v-model="localData.ownerState" type="text" required maxlength="2" :class="[
          'w-full px-4 py-3 border-2 rounded-lg focus:ring-2 transition-all outline-none uppercase',
          hasError('ownerState') ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
        ]" placeholder="CA" @input="localData.ownerState = (localData.ownerState || '').toUpperCase()"
          @blur="validateSingleField('ownerState')" />
        <p v-if="hasError('ownerState')" class="mt-1 text-sm text-red-600">{{ getError('ownerState') }}</p>
      </div>

      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">
          ZIP <span class="text-red-500">*</span>
        </label>
        <input v-model="localData.ownerZip" type="text" required maxlength="10" :class="[
          'w-full px-4 py-3 border-2 rounded-lg focus:ring-2 transition-all outline-none',
          hasError('ownerZip') ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
        ]" placeholder="12345" @blur="validateSingleField('ownerZip')" />
        <p v-if="hasError('ownerZip')" class="mt-1 text-sm text-red-600">{{ getError('ownerZip') }}</p>
      </div>

      <div class="md:col-span-2">
        <label class="block text-sm font-semibold text-gray-700 mb-2">
          Did you work with an EZBiz Funding Specialist? If so, Who? <span class="text-red-500">*</span>
        </label>
        <input v-model="localData.fundDirectSpecialist" type="text" required :class="[
          'w-full px-4 py-3 border-2 rounded-lg focus:ring-2 transition-all outline-none',
          hasError('fundDirectSpecialist') ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
        ]" placeholder="Specialist name or 'None'" @blur="validateSingleField('fundDirectSpecialist')" />
        <p v-if="hasError('fundDirectSpecialist')" class="mt-1 text-sm text-red-600">{{ getError('fundDirectSpecialist')
          }}</p>
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
import BaseDatePicker from '../BaseDatePicker.vue'
import { useFormValidation } from '../../composables/useFormValidation'

const props = defineProps<{
  formData: Partial<FormData>
}>()

const emit = defineEmits<{
  update: [data: Partial<FormData>]
}>()

const localData = ref({ ...props.formData })
const showSSN = ref(false)
const { rules, validateField, hasError, getError, clearFieldError, errors } = useFormValidation()

// Define validation rules for this step
const validationRules = {
  firstName: [rules.required('First Name')],
  lastName: [rules.required('Last Name')],
  ownerEmail: [rules.required('Email Address'), rules.email()],
  phone: [rules.required('Phone'), rules.phone()],
  ssn: [rules.required('SSN'), rules.ssn()],
  ownershipPercent: [rules.required('Ownership Percentage'), rules.percentage()],
  dateOfBirth: [rules.required('Date of Birth'), rules.minAge(18)],
  ownerStreetAddress: [rules.required('Street Address')],
  ownerState: [rules.required('State')],
  ownerZip: [rules.required('ZIP Code'), rules.zipCode()],
  fundDirectSpecialist: [rules.required('EZBiz Funding Specialist')]
}

const validateSingleField = (fieldName: string) => {
  clearFieldError(fieldName)
  const fieldRules = validationRules[fieldName as keyof typeof validationRules]
  if (fieldRules) {
    const fieldValue = localData.value[fieldName as keyof typeof localData.value]
    console.log(`Validating ${fieldName}:`, fieldValue)
    const error = validateField(fieldValue, fieldRules)
    console.log(`Validation result for ${fieldName}:`, error)
    if (error) {
      errors.value[fieldName] = error
      console.log(`Error set for ${fieldName}:`, errors.value[fieldName])
    }
  }
}

const validateStep = (): boolean => {
  let isValid = true
  Object.keys(validationRules).forEach(fieldName => {
    validateSingleField(fieldName)
    if (hasError(fieldName)) {
      isValid = false
    }
  })
  return isValid
}

watch(localData, (newVal) => {
  emit('update', newVal)
}, { deep: true })

const handleOwnerAddressSelected = (addressData: any) => {
  localData.value.ownerStreetAddress = addressData.streetAddress
  localData.value.ownerCity = addressData.city
  localData.value.ownerState = addressData.stateShort
  localData.value.ownerZip = addressData.zipCode
  clearFieldError('ownerStreetAddress')
  clearFieldError('ownerState')
  clearFieldError('ownerZip')
}

const formatPhone = (e: Event) => {
  const input = e.target as HTMLInputElement
  let value = input.value.replace(/\D/g, '')
  if (value.length > 10) value = value.slice(0, 10)
  localData.value.phone = value
  clearFieldError('phone')
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
  clearFieldError('ssn')
}

defineExpose({ validateStep })
</script>
