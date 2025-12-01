<template>
    <div class="base-date-picker">
        <label v-if="label" class="block text-sm font-semibold text-gray-700 mb-2">
            {{ label }} <span v-if="required" class="text-red-500">*</span>
        </label>
        <VueDatePicker v-model="modelValue" :format="format" :input-attrs="{ hideInputIcon: true }"
            :time-config="{ enableTimePicker: false }" :auto-apply="true" :year-first="true" :text-input="true"
            :placeholder="placeholder" :input-class-name="inputClasses" @update:model-value="updateValue"
            @blur="handleBlur" />
        <p v-if="error" class="mt-1 text-sm text-red-600">{{ error }}</p>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { VueDatePicker } from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'

const props = defineProps<{
    modelValue: string | Date | null
    label?: string
    required?: boolean
    placeholder?: string
    error?: string
}>()

const emit = defineEmits<{
    'update:modelValue': [value: string | null]
    'blur': []
}>()

const modelValue = computed({
    get: () => props.modelValue,
    set: (value) => {
        // VueDatePicker returns a Date object or null
        // We need to emit it in a format compatible with our app (e.g., YYYY-MM-DD or Date object)
        // Based on existing code using <input type="date">, it likely expects YYYY-MM-DD string
        if (value instanceof Date) {
            emit('update:modelValue', formatDate(value))
        } else {
            emit('update:modelValue', null)
        }
    }
})

const updateValue = (value: Date | null) => {
    if (value) {
        emit('update:modelValue', formatDate(value))
    } else {
        emit('update:modelValue', null)
    }
}

const handleBlur = () => {
    emit('blur')
}

const format = (date: Date) => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return `${month}/${day}/${year}`;
}

const formatDate = (date: Date): string => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}

const inputClasses = computed(() => {
    return `w-full px-4 py-3 border-2 rounded-lg focus:ring-2 transition-all outline-none ${props.error
        ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
        }`
})
</script>

<style>
.dp__input {
    @apply py-3 px-4 rounded-lg border-2 border-gray-300 transition-all outline-none;
    font-family: inherit;
    font-size: 1rem;
    line-height: 1.5;
}

.dp__input:focus {
    @apply border-blue-500 ring-2 ring-blue-200;
}

.dp__input_invalid {
    @apply border-red-500 ring-red-200;
}

/* Override internal styles to match design system */
.dp__theme_light {
    --dp-primary-color: #3b82f6;
    --dp-border-radius: 0.5rem;
}
</style>
