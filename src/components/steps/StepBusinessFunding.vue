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
            <input v-model="localData.hasExistingBalances" type="radio" value="yes" name="hasExistingBalances" required
              class="w-5 h-5 text-blue-600 focus:ring-2 focus:ring-blue-500" @change="onBalancesChange" />
            <span class="text-gray-700 group-hover:text-gray-900 font-medium">Yes</span>
          </label>
          <label class="flex items-center space-x-3 cursor-pointer group">
            <input v-model="localData.hasExistingBalances" type="radio" value="no" name="hasExistingBalances" required
              class="w-5 h-5 text-blue-600 focus:ring-2 focus:ring-blue-500" @change="onBalancesChange" />
            <span class="text-gray-700 group-hover:text-gray-900 font-medium">No</span>
          </label>
        </div>
        <p v-if="hasError('hasExistingBalances')" class="mt-1 text-sm text-red-600">{{ getError('hasExistingBalances')
        }}</p>
      </div>

      <!-- Multiple Funders Section -->
      <div v-if="localData.hasExistingBalances === 'yes'" class="md:col-span-2 space-y-4">
        <div class="flex items-center justify-between mb-2">
          <h4 class="text-lg font-semibold text-gray-900">Existing Funders</h4>
          <button type="button" @click="addFunder"
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Add Another Funder
          </button>
        </div>

        <!-- Funder Items -->
        <div v-for="(funder, index) in funders" :key="index"
          class="bg-gray-50 border-2 border-gray-200 rounded-lg p-4 space-y-4">
          <div class="flex items-center justify-between mb-2">
            <h5 class="text-sm font-semibold text-gray-700">Funder #{{ index + 1 }}</h5>
            <button v-if="funders.length > 1" type="button" @click="removeFunder(index)"
              class="text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors"
              title="Remove funder">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                Funder Name <span class="text-red-500">*</span>
              </label>
              <input v-model="funder.funderName" type="text" required :class="[
                'w-full px-4 py-3 border-2 rounded-lg focus:ring-2 transition-all outline-none',
                hasError(`funder_${index}_name`) ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
              ]" placeholder="E.g. ABC Capital" @blur="validateFunder(index)" />
              <p v-if="hasError(`funder_${index}_name`)" class="mt-1 text-sm text-red-600">{{
                getError(`funder_${index}_name`) }}</p>
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                Balance Remaining <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">$</span>
                <input v-model="funder.balanceRemaining" type="text" required :class="[
                  'w-full pl-8 pr-4 py-3 border-2 rounded-lg focus:ring-2 transition-all outline-none',
                  hasError(`funder_${index}_balance`) ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
                ]" placeholder="10,000" @input="formatFunderBalance($event, index)" @blur="validateFunder(index)" />
              </div>
              <p v-if="hasError(`funder_${index}_balance`)" class="mt-1 text-sm text-red-600">{{
                getError(`funder_${index}_balance`) }}</p>
            </div>
          </div>
        </div>

        <p v-if="hasError('existingFunders')" class="text-sm text-red-600">{{ getError('existingFunders') }}</p>
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

// Initialize funders array from formData
const funders = ref<Array<{ funderName: string; balanceRemaining: string }>>(
  localData.value.existingFunders && localData.value.existingFunders.length > 0
    ? [...localData.value.existingFunders]
    : [{ funderName: '', balanceRemaining: '' }]
)

// Define validation rules for this step
const validationRules = {
  amountRequested: [rules.required('Amount Requested'), rules.minValue(1000, 'Amount Requested')],
  monthlyRevenue: [rules.required('Monthly Revenue'), rules.minValue(1000, 'Monthly Revenue')],
  hasExistingBalances: [rules.required('Existing Balances')],
  numberOfOwners: [rules.required('Number of Owners'), rules.minValue(1, 'Number of Owners')],
  existingFunders: [rules.required('At least one funder')]
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

const validateFunder = (index: number) => {
  const funder = funders.value[index]

  // Clear previous errors
  clearFieldError(`funder_${index}_name`)
  clearFieldError(`funder_${index}_balance`)

  // Validate funder name
  if (!funder.funderName || funder.funderName.trim() === '') {
    errors.value[`funder_${index}_name`] = 'Funder name is required'
  }

  // Validate balance
  if (!funder.balanceRemaining || funder.balanceRemaining.trim() === '') {
    errors.value[`funder_${index}_balance`] = 'Balance is required'
  } else {
    const numericValue = parseFloat(funder.balanceRemaining.replace(/,/g, ''))
    if (isNaN(numericValue) || numericValue < 1) {
      errors.value[`funder_${index}_balance`] = 'Balance must be at least $1'
    }
  }
}

const validateAllFunders = (): boolean => {
  if (localData.value.hasExistingBalances !== 'yes') {
    return true
  }

  // Clear previous funder errors
  clearFieldError('existingFunders')

  // Check if at least one funder exists
  if (funders.value.length === 0) {
    errors.value['existingFunders'] = 'At least one funder is required'
    return false
  }

  let isValid = true
  funders.value.forEach((_, index) => {
    validateFunder(index)
    if (hasError(`funder_${index}_name`) || hasError(`funder_${index}_balance`)) {
      isValid = false
    }
  })

  return isValid
}

const validateStep = (): boolean => {
  let isValid = true

  // Validate basic fields
  Object.keys(validationRules).forEach(fieldName => {
    if (fieldName === 'existingFunders') {
      return // Skip, will validate separately
    }
    validateSingleField(fieldName)
    if (hasError(fieldName)) {
      isValid = false
    }
  })

  // Validate funders if applicable
  if (localData.value.hasExistingBalances === 'yes') {
    if (!validateAllFunders()) {
      isValid = false
    }
  }

  return isValid
}

const onBalancesChange = () => {
  validateSingleField('hasExistingBalances')

  if (localData.value.hasExistingBalances === 'no') {
    funders.value = [{ funderName: '', balanceRemaining: '' }]
    localData.value.existingFunders = []

    // Clear all funder errors
    Object.keys(errors.value).forEach(key => {
      if (key.startsWith('funder_')) {
        clearFieldError(key)
      }
    })
    clearFieldError('existingFunders')
  }
}

const addFunder = () => {
  funders.value.push({ funderName: '', balanceRemaining: '' })
}

const removeFunder = (index: number) => {
  if (funders.value.length > 1) {
    funders.value.splice(index, 1)
    // Clear errors for removed funder
    clearFieldError(`funder_${index}_name`)
    clearFieldError(`funder_${index}_balance`)
    // Update localData
    syncFundersToLocalData()
  }
}

const syncFundersToLocalData = () => {
  localData.value.existingFunders = funders.value.filter(
    f => f.funderName.trim() !== '' || f.balanceRemaining.trim() !== ''
  )
}

watch(localData, (newVal) => {
  emit('update', newVal)
}, { deep: true })

// Watch funders array for changes
watch(funders, () => {
  if (localData.value.hasExistingBalances === 'yes') {
    syncFundersToLocalData()
  }
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

const formatFunderBalance = (e: Event, index: number) => {
  const input = e.target as HTMLInputElement
  let value = input.value.replace(/[^0-9]/g, '')
  if (value) {
    value = parseInt(value).toLocaleString()
  }
  funders.value[index].balanceRemaining = value
  clearFieldError(`funder_${index}_balance`)
}

defineExpose({ validateStep })
</script>
