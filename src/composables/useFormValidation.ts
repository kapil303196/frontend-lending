import { ref, computed } from 'vue'

export interface ValidationRule {
  validate: (value: any) => boolean
  message: string
}

export interface FieldValidation {
  [key: string]: ValidationRule[]
}

export function useFormValidation() {
  const errors = ref<Record<string, string>>({})

  // Common validation rules
  const rules = {
    required: (fieldName: string): ValidationRule => ({
      validate: (value: any) => {
        // Handle arrays
        if (Array.isArray(value)) return value.length > 0
        
        // Handle strings (including date inputs which return empty string when empty)
        if (typeof value === 'string') {
          const trimmed = value.trim()
          // Explicitly check for empty string - date inputs return "" when empty
          if (trimmed === '' || trimmed.length === 0) return false
          return true
        }
        
        // Handle numbers (0 is valid)
        if (typeof value === 'number') return true
        
        // Handle null/undefined
        if (value === null || value === undefined) return false
        
        return true
      },
      message: `${fieldName} is required`
    }),

    email: (): ValidationRule => ({
      validate: (value: string) => {
        if (!value) return true // Let required rule handle empty values
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(value)
      },
      message: 'Please enter a valid email address'
    }),

    ein: (): ValidationRule => ({
      validate: (value: string) => {
        if (!value) return true
        const einRegex = /^\d{2}-?\d{7}$/
        return einRegex.test(value.replace(/-/g, ''))
      },
      message: 'EIN must be in format XX-XXXXXXX or 9 digits'
    }),

    ssn: (): ValidationRule => ({
      validate: (value: string) => {
        if (!value) return true
        const ssnRegex = /^\d{3}-?\d{2}-?\d{4}$/
        return ssnRegex.test(value.replace(/-/g, ''))
      },
      message: 'SSN must be 9 digits'
    }),

    phone: (): ValidationRule => ({
      validate: (value: string) => {
        if (!value) return true
        const phoneRegex = /^\d{10}$/
        return phoneRegex.test(value.replace(/\D/g, ''))
      },
      message: 'Phone number must be 10 digits'
    }),

    zipCode: (): ValidationRule => ({
      validate: (value: string) => {
        if (!value) return true
        const zipRegex = /^\d{5}(-\d{4})?$/
        return zipRegex.test(value)
      },
      message: 'ZIP code must be 5 digits or ZIP+4 format'
    }),

    minValue: (min: number, fieldName: string): ValidationRule => ({
      validate: (value: any) => {
        if (!value && value !== 0) return true
        const numValue = typeof value === 'string' ? parseFloat(value.replace(/,/g, '')) : value
        return numValue >= min
      },
      message: `${fieldName} must be at least ${min}`
    }),

    maxValue: (max: number, fieldName: string): ValidationRule => ({
      validate: (value: any) => {
        if (!value && value !== 0) return true
        const numValue = typeof value === 'string' ? parseFloat(value.replace(/,/g, '')) : value
        return numValue <= max
      },
      message: `${fieldName} must be at most ${max}`
    }),

    minLength: (min: number, fieldName: string): ValidationRule => ({
      validate: (value: string) => {
        if (!value) return true
        return value.length >= min
      },
      message: `${fieldName} must be at least ${min} characters`
    }),

    minAge: (age: number): ValidationRule => ({
      validate: (value: string) => {
        if (!value) return true
        const birthDate = new Date(value)
        const today = new Date()
        const yearsDiff = today.getFullYear() - birthDate.getFullYear()
        const monthDiff = today.getMonth() - birthDate.getMonth()
        const dayDiff = today.getDate() - birthDate.getDate()
        
        if (yearsDiff > age) return true
        if (yearsDiff === age && monthDiff > 0) return true
        if (yearsDiff === age && monthDiff === 0 && dayDiff >= 0) return true
        
        return false
      },
      message: `Must be at least ${age} years old`
    }),

    percentage: (): ValidationRule => ({
      validate: (value: any) => {
        if (!value && value !== 0) return true
        const numValue = typeof value === 'string' ? parseFloat(value) : value
        return numValue >= 0 && numValue <= 100
      },
      message: 'Percentage must be between 0 and 100'
    })
  }

  const validateField = (value: any, validationRules: ValidationRule[]): string | null => {
    for (const rule of validationRules) {
      if (!rule.validate(value)) {
        return rule.message
      }
    }
    return null
  }

  const validateFields = (data: Record<string, any>, fieldValidations: FieldValidation): boolean => {
    errors.value = {}
    let isValid = true

    for (const [fieldName, validationRules] of Object.entries(fieldValidations)) {
      const error = validateField(data[fieldName], validationRules)
      if (error) {
        errors.value[fieldName] = error
        isValid = false
      }
    }

    return isValid
  }

  const clearErrors = () => {
    errors.value = {}
  }

  const clearFieldError = (fieldName: string) => {
    delete errors.value[fieldName]
  }

  const hasError = (fieldName: string) => {
    return !!errors.value[fieldName]
  }

  const getError = (fieldName: string) => {
    return errors.value[fieldName] || ''
  }

  return {
    errors: computed(() => errors.value),
    rules,
    validateField,
    validateFields,
    clearErrors,
    clearFieldError,
    hasError,
    getError
  }
}
