<template>
  <div class="space-y-6">
    <div>
      <h3 class="text-2xl text-center font-bold text-gray-900 mb-2">Business Funding</h3>
      <p class="text-gray-600 text-center">Tell us about your funding needs</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">
          Amount Requested <span class="text-red-500">*</span>
        </label>
        <div class="relative">
          <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">$</span>
          <input v-model="localData.amountRequested" type="text" required :class="[
            'w-full pl-8 pr-4 py-3 border-2 rounded-lg focus:ring-2 transition-all outline-none',
            hasError('amountRequested') ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
          ]" placeholder="50,000" @input="formatCurrency" @blur="validateSingleField('amountRequested')" />
        </div>
        <p v-if="hasError('amountRequested')" class="mt-1 text-sm text-red-600">{{ getError('amountRequested') }}</p>
      </div>

      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">
          Monthly Revenue <span class="text-red-500">*</span>
        </label>
        <div class="relative">
          <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">$</span>
          <input v-model="localData.monthlyRevenue" type="text" required :class="[
            'w-full pl-8 pr-4 py-3 border-2 rounded-lg focus:ring-2 transition-all outline-none',
            hasError('monthlyRevenue') ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
          ]" placeholder="100,000" @input="formatRevenue" @blur="validateSingleField('monthlyRevenue')" />
        </div>
        <p v-if="hasError('monthlyRevenue')" class="mt-1 text-sm text-red-600">{{ getError('monthlyRevenue') }}</p>
      </div>

      <div class="md:col-span-2">
        <label class="block text-sm font-semibold text-gray-700 mb-3">
          Do You Have Any Existing Balances? <span class="text-red-500">*</span>
        </label>
        <div class="flex gap-4">
          <label class="flex items-center space-x-3 cursor-pointer group">
            <input v-model="localData.hasExistingBalances" type="radio" value="yes" required
              class="w-5 h-5 text-blue-600 focus:ring-2 focus:ring-blue-500"
              @change="validateSingleField('hasExistingBalances')" />
            <span class="text-gray-700 group-hover:text-gray-900 font-medium">Yes</span>
          </label>
          <label class="flex items-center space-x-3 cursor-pointer group">
            <input v-model="localData.hasExistingBalances" type="radio" value="no" required
              class="w-5 h-5 text-blue-600 focus:ring-2 focus:ring-blue-500"
              @change="validateSingleField('hasExistingBalances')" />
            <span class="text-gray-700 group-hover:text-gray-900 font-medium">No</span>
          </label>
        </div>
        <p v-if="hasError('hasExistingBalances')" class="mt-1 text-sm text-red-600">{{ getError('hasExistingBalances')
          }}</p>
      </div>

      <!-- Conditional Fields for Existing Balances -->
      <div v-if="localData.hasExistingBalances === 'yes'" class="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">
            Lender Name <span class="text-red-500">*</span>
          </label>
          <input v-model="localData.existingLender" type="text" required :class="[
            'w-full px-4 py-3 border-2 rounded-lg focus:ring-2 transition-all outline-none',
            hasError('existingLender') ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
          ]" placeholder="E.g. ABC Capital" @blur="validateSingleField('existingLender')" />
          <p v-if="hasError('existingLender')" class="mt-1 text-sm text-red-600">{{ getError('existingLender') }}</p>
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">
            Balance Remaining <span class="text-red-500">*</span>
          </label>
          <div class="relative">
            <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">$</span>
            <input v-model="localData.existingBalance" type="text" required :class="[
              'w-full pl-8 pr-4 py-3 border-2 rounded-lg focus:ring-2 transition-all outline-none',
              hasError('existingBalance') ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
            ]" placeholder="10,000" @input="formatBalance" @blur="validateSingleField('existingBalance')" />
          </div>
          <p v-if="hasError('existingBalance')" class="mt-1 text-sm text-red-600">{{ getError('existingBalance') }}</p>
        </div>
      </div>

      <div class="md:col-span-2">
        <label class="block text-sm font-semibold text-gray-700 mb-2">
          How many owners are in the business? <span class="text-red-500">*</span>
        </label>
        <input v-model.number="localData.numberOfOwners" type="number" min="1" required :class="[
          'w-full px-4 py-3 border-2 rounded-lg focus:ring-2 transition-all outline-none',
          hasError('numberOfOwners') ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
        ]" placeholder="1" @blur="validateSingleField('numberOfOwners')" />
        <p v-if="hasError('numberOfOwners')" class="mt-1 text-sm text-red-600">{{ getError('numberOfOwners') }}</p>
      </div>
    </div>

    <!-- Info Box -->
    <div class="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 flex items-start space-x-3">
      <svg class="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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
import { useFormValidation } from '../../composables/useFormValidation'

const props = defineProps<{
  formData: Partial<FormData>
}>()

const emit = defineEmits<{
  update: [data: Partial<FormData>]
}>()

const localData = ref({ ...props.formData })
const { rules, validateField, hasError, getError, clearFieldError, errors } = useFormValidation()

// Define validation rules for this step
const validationRules = {
  amountRequested: [rules.required('Amount Requested'), rules.minValue(1000, 'Amount Requested')],
  monthlyRevenue: [rules.required('Monthly Revenue'), rules.minValue(1000, 'Monthly Revenue')],
  hasExistingBalances: [rules.required('Existing Balances')],
  numberOfOwners: [rules.required('Number of Owners'), rules.minValue(1, 'Number of Owners')],
  existingLender: [rules.required('Lender Name')],
  existingBalance: [rules.required('Balance Remaining')]
}

const validateSingleField = (fieldName: string) => {
  clearFieldError(fieldName)

  // Skip validation for conditional fields if not applicable
  if ((fieldName === 'existingLender' || fieldName === 'existingBalance') && localData.value.hasExistingBalances !== 'yes') {
    return
  }

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
  // Clear conditional fields if user switches back to "No"
  if (newVal.hasExistingBalances === 'no') {
    newVal.existingLender = ''
    newVal.existingBalance = ''
    clearFieldError('existingLender')
    clearFieldError('existingBalance')
  }
  emit('update', newVal)
}, { deep: true })

const formatCurrency = (e: Event) => {
  const input = e.target as HTMLInputElement
  let value = input.value.replace(/[^0-9]/g, '')
  if (value) {
    value = parseInt(value).toLocaleString()
  }
  localData.value.amountRequested = value
  clearFieldError('amountRequested')
}

const formatRevenue = (e: Event) => {
  const input = e.target as HTMLInputElement
  let value = input.value.replace(/[^0-9]/g, '')
  if (value) {
    value = parseInt(value).toLocaleString()
  }
  localData.value.monthlyRevenue = value
  clearFieldError('monthlyRevenue')
}

const formatBalance = (e: Event) => {
  const input = e.target as HTMLInputElement
  let value = input.value.replace(/[^0-9]/g, '')
  if (value) {
    value = parseInt(value).toLocaleString()
  }
  localData.value.existingBalance = value
  clearFieldError('existingBalance')
}

defineExpose({ validateStep })
</script>
