<template>
  <div class="w-full">
    <!-- Progress Steps -->
    <div class="mb-8 rounded-xl p-6">
      <!-- <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold text-gray-900">Verify Your Information</h2>
        <span class="text-sm text-gray-500">Step {{ currentStep + 1 }} of {{ steps.length }}</span>
      </div> -->

      <!-- Desktop Progress Bar -->
      <div class="hidden md:flex items-center justify-between">
        <div v-for="(step, index) in steps" :key="index" class="flex-1 flex items-center">
          <div class="flex flex-col items-center flex-1">
            <div
              class="w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300"
              :class="[
                index < currentStep ? 'bg-green-500 text-white' : '',
                index === currentStep ? 'bg-blue-600 text-white ring-4 ring-blue-100' : '',
                index > currentStep ? 'bg-gray-200 text-gray-500' : ''
              ]">
              <svg v-if="index < currentStep" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
              </svg>
              <span v-else>{{ index + 1 }}</span>
            </div>
            <span class="mt-2 text-xs font-medium text-center"
              :class="index <= currentStep ? 'text-gray-900' : 'text-gray-400'">
              {{ step.title }}
            </span>
          </div>
          <div v-if="index < steps.length - 1" class="flex-1 h-1 mx-2 rounded transition-all duration-300 -mt-3"
            :class="index < currentStep ? 'bg-green-500' : 'bg-gray-200'" />
        </div>
      </div>

      <!-- Mobile Progress Bar -->
      <div class="md:hidden">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-medium text-gray-700">{{ steps[currentStep].title }}</span>
          <span class="text-sm text-gray-500">{{ currentStep + 1 }}/{{ steps.length }}</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div class="bg-blue-600 h-2 rounded-full transition-all duration-300"
            :style="{ width: `${((currentStep + 1) / steps.length) * 100}%` }" />
        </div>
      </div>
    </div>

    <!-- Form Content -->
    <div class="p-6 md:p-8">
      <transition name="slide-fade" mode="out-in">
        <component :is="currentStepComponent" :form-data="formData" :mca-data="mcaData" @update="updateFormData" />
      </transition>

      <!-- Navigation Buttons -->
      <div class="flex flex-row flex-wrap justify-center gap-4 mt-8 pt-6 border-t">
        <button v-if="currentStep > 0" @click="previousStep" type="button"
          class="px-6 py-3 border-gray-300 bg-gray-200 rounded-full font-semibold text-black hover:bg-gray-200 transition-colors focus:outline-none">
          <span class="flex items-center justify-center">
            <!-- <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg> -->
            Previous
          </span>
        </button>

        <button v-if="currentStep < steps.length - 1" @click="nextStep" type="button"
          class="px-6 py-3 bg-white rounded-full text-black font-semibold hover:bg-white transition-all focus:outline-none">
          <span class="flex items-center justify-center">
            Continue
            <!-- <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg> -->
          </span>
        </button>

        <button v-if="currentStep === steps.length - 1" @click="submitForm" :disabled="submitting" type="button"
          class="px-6 py-3 bg-white text-black rounded-full font-semibold hover:bg-white transition-all focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed">
          <span class="flex items-center justify-center">
            <svg v-if="submitting" class="animate-spin -ml-1 mr-3 h-5 w-5 text-black" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
              </path>
            </svg>
            {{ submitting ? 'Submitting...' : 'Submit' }}
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import type { MCAData, FormData } from '../types'
import { useApi } from '../composables/useApi'
import { useFormPersistence } from '../composables/useFormPersistence'
import StepBusinessInfo from './steps/StepBusinessInfo.vue'
import StepBusinessFunding from './steps/StepBusinessFunding.vue'
import StepOwnerInfo from './steps/StepOwnerInfo.vue'
import StepDocuments from './steps/StepDocuments.vue'
import StepReview from './steps/StepReview.vue'

const props = defineProps<{
  mcaData: MCAData | null
}>()

const router = useRouter()
const { uploadFiles, submitResponse } = useApi()
const { loadSavedData, saveData, clearSavedData } = useFormPersistence(props.mcaData?.data?.uniqueId || '')

const currentStep = ref(0)
const submitting = ref(false)

const steps = [
  { title: 'Business Info', component: StepBusinessInfo },
  { title: 'Funding', component: StepBusinessFunding },
  { title: 'Owner Info', component: StepOwnerInfo },
  { title: 'Documents', component: StepDocuments },
  { title: 'Review', component: StepReview }
]

const savedData = loadSavedData()

const formData = ref<Partial<FormData>>(savedData?.formData || {
  uniqueId: props.mcaData?.data?.uniqueId || '',
  legalBusinessName: props.mcaData?.data?.company || '',
  businessEmail: props.mcaData?.data?.email || '',
  ein: props.mcaData?.data?.taxId || '',
  businessStartDate: props.mcaData?.data?.dateBusinessStarted || '',
  streetAddress: props.mcaData?.data?.address || '',
  city: props.mcaData?.data?.city || '',
  state: props.mcaData?.data?.state || '',
  zipCode: props.mcaData?.data?.zip || '',
  monthlyRevenue: props.mcaData?.data?.monthlyRevenue || '',
  firstName: props.mcaData?.data?.firstName || '',
  lastName: props.mcaData?.data?.lastName || '',
  ownerEmail: props.mcaData?.data?.email || '',
  phone: props.mcaData?.data?.phoneNumber || '',
  dateOfBirth: props.mcaData?.data?.birthDate || '',
  dba: '',
  amountRequested: '',
  hasExistingBalances: '',
  numberOfOwners: '1',
  ssn: '',
  ownershipPercent: '',
  ownerStreetAddress: '',
  ownerCity: '',
  ownerState: '',
  ownerZip: '',
  fundDirectSpecialist: '',
  bankStatements: [],
  signature: '',
  signatureDate: new Date().toISOString().split('T')[0]
})

if (savedData?.currentStep !== undefined) {
  currentStep.value = savedData.currentStep
}

watch([formData, currentStep], () => {
  saveData({
    formData: formData.value,
    currentStep: currentStep.value
  })
}, { deep: true })

const currentStepComponent = computed(() => steps[currentStep.value].component)

const updateFormData = (updates: Partial<FormData>) => {
  formData.value = { ...formData.value, ...updates }
}

const nextStep = () => {
  if (currentStep.value < steps.length - 1) {
    currentStep.value++
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const previousStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const submitForm = async () => {
  submitting.value = true
  try {
    let bankStatements: any[] = []

    if (formData.value.bankStatements && formData.value.bankStatements.length > 0) {
      try {
        const uploadResult = await uploadFiles(formData.value.bankStatements)
        if (uploadResult.success && uploadResult.data) {
          bankStatements = uploadResult.data.map((file: any) => ({
            url: file.url,
            key: file.key,
            originalName: file.originalName,
            size: file.size
          }))
        }
      } catch (uploadError) {
        console.error('File upload error:', uploadError)
        alert('Error uploading bank statements. Please try again.')
        submitting.value = false
        return
      }
    }

    const responseData = {
      uniqueId: formData.value.uniqueId,
      isVerified: true,
      comments: 'Application verified and submitted',
      formData: formData.value,
      bankStatements: bankStatements,
      status: 'submitted',
      userContact: {
        name: `${formData.value.firstName} ${formData.value.lastName}`,
        email: formData.value.ownerEmail,
        phone: formData.value.phone
      }
    }

    await submitResponse(responseData)
    clearSavedData()
    router.push('/thank-you')
  } catch (error) {
    console.error('Submission error:', error)
    alert('There was an error submitting your application. Please try again.')
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.2s ease-in;
}

.slide-fade-enter-from {
  transform: translateX(20px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateX(-20px);
  opacity: 0;
}
</style>
