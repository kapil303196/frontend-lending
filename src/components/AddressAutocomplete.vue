<template>
  <div class="relative">
    <label v-if="label" class="block text-sm font-semibold text-gray-700 mb-2">
      {{ label }} <span v-if="required" class="text-red-500">*</span>
    </label>
    
    <input
      v-model="searchQuery"
      type="text"
      :placeholder="placeholder"
      :required="required"
      @input="handleInput"
      @focus="showSuggestions = true"
      @blur="handleBlur"
      class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
    />

    <!-- Suggestions Dropdown -->
    <div
      v-if="showSuggestions && suggestions.length > 0"
      class="absolute z-50 w-full mt-1 bg-white border-2 border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
    >
      <div
        v-for="(suggestion, index) in suggestions"
        :key="suggestion.placeId"
        @mousedown.prevent="selectSuggestion(suggestion)"
        class="px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0"
      >
        <div class="font-semibold text-gray-900">{{ suggestion.mainText }}</div>
        <div class="text-sm text-gray-600">{{ suggestion.secondaryText }}</div>
      </div>
    </div>

    <!-- Loading Indicator -->
    <div
      v-if="loading"
      class="absolute right-3 top-1/2 -translate-y-1/2 mt-4"
    >
      <div class="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-600"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useApi } from '../composables/useApi'

const props = defineProps<{
  modelValue: string
  label?: string
  placeholder?: string
  required?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'addressSelected': [addressData: any]
}>()

const { searchAddress, getAddressDetails } = useApi()

const searchQuery = ref(props.modelValue)
const suggestions = ref<any[]>([])
const showSuggestions = ref(false)
const loading = ref(false)
let searchTimeout: ReturnType<typeof setTimeout> | null = null

watch(() => props.modelValue, (newVal) => {
  if (newVal !== searchQuery.value) {
    searchQuery.value = newVal
  }
})

const handleInput = () => {
  emit('update:modelValue', searchQuery.value)
  
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }

  if (searchQuery.value.length >= 3) {
    searchTimeout = setTimeout(async () => {
      await performSearch()
    }, 300)
  } else {
    suggestions.value = []
  }
}

const performSearch = async () => {
  try {
    loading.value = true
    const result = await searchAddress(searchQuery.value)
    
    if (result.success) {
      suggestions.value = result.data
      showSuggestions.value = true
    }
  } catch (error) {
    console.error('Address search error:', error)
    suggestions.value = []
  } finally {
    loading.value = false
  }
}

const selectSuggestion = async (suggestion: any) => {
  try {
    loading.value = true
    searchQuery.value = suggestion.description
    emit('update:modelValue', suggestion.description)
    showSuggestions.value = false

    const result = await getAddressDetails(suggestion.placeId)
    
    if (result.success) {
      emit('addressSelected', result.data)
    }
  } catch (error) {
    console.error('Get address details error:', error)
  } finally {
    loading.value = false
  }
}

const handleBlur = () => {
  setTimeout(() => {
    showSuggestions.value = false
  }, 200)
}
</script>

