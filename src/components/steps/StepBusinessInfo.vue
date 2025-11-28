<template>
  <div class="space-y-6">
    <div>
      <h3 class="text-2xl text-center font-bold text-gray-900 mb-2">Business Information</h3>
      <p class="text-gray-600 text-center">Please verify and complete your business details</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="md:col-span-2">
        <label class="block text-sm font-semibold text-gray-700 mb-2">
          Legal Business Name <span class="text-red-500">*</span>
        </label>
        <input v-model="localData.legalBusinessName" type="text" required :class="[
          'w-full px-4 py-3 border-2 rounded-lg focus:ring-2 transition-all outline-none',
          hasError('legalBusinessName') ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
        ]" placeholder="Enter your legal business name" @blur="validateSingleField('legalBusinessName')" />
        <p v-if="hasError('legalBusinessName')" class="mt-1 text-sm text-red-600">{{ getError('legalBusinessName') }}
        </p>
      </div>

      <div class="md:col-span-2">
        <label class="block text-sm font-semibold text-gray-700 mb-2">
          DBA (Doing Business As)
        </label>
        <input v-model="localData.dba" type="text"
          class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
          placeholder="Enter DBA if different from legal name" />
      </div>

      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">
          Email Address <span class="text-red-500">*</span>
        </label>
        <input v-model="localData.businessEmail" type="email" required :class="[
          'w-full px-4 py-3 border-2 rounded-lg focus:ring-2 transition-all outline-none',
          hasError('businessEmail') ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
        ]" placeholder="business@example.com" @blur="validateSingleField('businessEmail')" />
        <p v-if="hasError('businessEmail')" class="mt-1 text-sm text-red-600">{{ getError('businessEmail') }}</p>
      </div>

      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">
          EIN <span class="text-red-500">*</span>
        </label>
        <input v-model="localData.ein" type="text" required :class="[
          'w-full px-4 py-3 border-2 rounded-lg focus:ring-2 transition-all outline-none',
          hasError('ein') ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
        ]" placeholder="12-3456789" @blur="validateSingleField('ein')" />
        <p v-if="hasError('ein')" class="mt-1 text-sm text-red-600">{{ getError('ein') }}</p>
      </div>

      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">
          Business Start Date <span class="text-red-500">*</span>
        </label>
        <input v-model="localData.businessStartDate" type="date" required :class="[
          'w-full px-4 py-3 border-2 rounded-lg focus:ring-2 transition-all outline-none',
          hasError('businessStartDate') ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
        ]" @blur="validateSingleField('businessStartDate')" />
        <p v-if="hasError('businessStartDate')" class="mt-1 text-sm text-red-600">{{ getError('businessStartDate') }}
        </p>
      </div>

      <div class="md:col-span-2">
        <AddressAutocomplete v-model="localData.streetAddress" label="Street Address"
          placeholder="Start typing your address..." :required="true" :error="getError('streetAddress')"
          @addressSelected="handleBusinessAddressSelected" @blur="validateSingleField('streetAddress')" />
      </div>

      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">
          City
        </label>
        <input v-model="localData.city" type="text"
          class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
          placeholder="City" />
      </div>

      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">
          State <span class="text-red-500">*</span>
        </label>
        <input v-model="localData.state" type="text" required maxlength="2" :class="[
          'w-full px-4 py-3 border-2 rounded-lg focus:ring-2 transition-all outline-none uppercase',
          hasError('state') ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
        ]" placeholder="CA" @input="localData.state = (localData.state || '').toUpperCase()"
          @blur="validateSingleField('state')" />
        <p v-if="hasError('state')" class="mt-1 text-sm text-red-600">{{ getError('state') }}</p>
      </div>

      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">
          ZIP Code <span class="text-red-500">*</span>
        </label>
        <input v-model="localData.zipCode" type="text" required maxlength="10" :class="[
          'w-full px-4 py-3 border-2 rounded-lg focus:ring-2 transition-all outline-none',
          hasError('zipCode') ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
        ]" placeholder="12345" @blur="validateSingleField('zipCode')" />
        <p v-if="hasError('zipCode')" class="mt-1 text-sm text-red-600">{{ getError('zipCode') }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { FormData } from '../../types'
import AddressAutocomplete from '../AddressAutocomplete.vue'
import { useFormValidation } from '../../composables/useFormValidation'

const props = defineProps<{
  formData: Partial<FormData>
}>()

const emit = defineEmits<{
  update: [data: Partial<FormData>]
  validate: [isValid: boolean]
}>()

const localData = ref({ ...props.formData })
const { rules, validateField, hasError, getError, clearFieldError, errors } = useFormValidation()

// Define validation rules for this step
const validationRules = {
  legalBusinessName: [rules.required('Legal Business Name')],
  businessEmail: [rules.required('Email Address'), rules.email()],
  ein: [rules.required('EIN'), rules.ein()],
  businessStartDate: [rules.required('Business Start Date')],
  streetAddress: [rules.required('Street Address')],
  state: [rules.required('State')],
  zipCode: [rules.required('ZIP Code'), rules.zipCode()]
}

const validateSingleField = (fieldName: string) => {
  clearFieldError(fieldName)
  const fieldRules = validationRules[fieldName as keyof typeof validationRules]
  if (fieldRules) {
    const error = validateField(localData.value[fieldName as keyof typeof localData.value], fieldRules)
    if (error) {
      errors.value[fieldName] = error
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

const handleBusinessAddressSelected = (addressData: any) => {
  localData.value.streetAddress = addressData.streetAddress
  localData.value.city = addressData.city
  localData.value.state = addressData.stateShort
  localData.value.zipCode = addressData.zipCode
  clearFieldError('streetAddress')
  clearFieldError('state')
  clearFieldError('zipCode')
}

defineExpose({ validateStep })
</script>
