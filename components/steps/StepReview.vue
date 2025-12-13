<template>
  <div class="space-y-6">
    <div>
      <h3 class="text-2xl font-bold text-gray-900 mb-2">Review & Sign</h3>
      <p class="text-gray-600">Please review your information and sign to complete your application</p>
    </div>

    <!-- Summary Cards -->
    <div class="space-y-4">
      <!-- Business Information Summary -->
      <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-5 border border-blue-200">
        <h4 class="font-bold text-gray-900 mb-3 flex items-center">
          <svg class="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          Business Information
        </h4>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div><span class="text-gray-600">Legal Name:</span> <span class="font-semibold">{{ localData.legalBusinessName
              }}</span></div>
          <div><span class="text-gray-600">DBA:</span> <span class="font-semibold">{{ localData.dba || 'N/A' }}</span>
          </div>
          <div><span class="text-gray-600">Email:</span> <span class="font-semibold">{{ localData.businessEmail
              }}</span></div>
          <div><span class="text-gray-600">EIN:</span> <span class="font-semibold">{{ localData.ein }}</span></div>
          <div class="sm:col-span-2"><span class="text-gray-600">Address:</span> <span class="font-semibold">{{
            formatAddress('business') }}</span></div>
        </div>
      </div>

      <!-- Funding Information Summary -->
      <div class="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-5 border border-green-200">
        <h4 class="font-bold text-gray-900 mb-3 flex items-center">
          <svg class="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Funding Information
        </h4>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div><span class="text-gray-600">Amount Requested:</span> <span class="font-semibold text-green-700">${{
            localData.amountRequested }}</span></div>
          <div><span class="text-gray-600">Monthly Revenue:</span> <span class="font-semibold">${{
            localData.monthlyRevenue }}</span></div>
          <div><span class="text-gray-600">Existing Balances:</span> <span class="font-semibold">{{
            localData.hasExistingBalances === 'yes' ? 'Yes' : 'No' }}</span></div>
          <div><span class="text-gray-600">Number of Owners:</span> <span class="font-semibold">{{
            localData.numberOfOwners }}</span></div>
        </div>
      </div>

      <!-- Owner Information Summary -->
      <div class="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-5 border border-purple-200">
        <h4 class="font-bold text-gray-900 mb-3 flex items-center">
          <svg class="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Primary Owner Information
        </h4>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div><span class="text-gray-600">Name:</span> <span class="font-semibold">{{ localData.firstName }} {{
            localData.lastName }}</span></div>
          <div><span class="text-gray-600">Email:</span> <span class="font-semibold">{{ localData.ownerEmail }}</span>
          </div>
          <div><span class="text-gray-600">Phone:</span> <span class="font-semibold">{{ localData.phone }}</span></div>
          <div><span class="text-gray-600">Ownership:</span> <span class="font-semibold">{{ localData.ownershipPercent
              }}%</span></div>
          <div class="sm:col-span-2"><span class="text-gray-600">Address:</span> <span class="font-semibold">{{
            formatAddress('owner') }}</span></div>
        </div>
      </div>
    </div>

    <!-- Signature Pad -->
    <div class="space-y-4">
      <label class="block text-sm font-semibold text-gray-700">
        Signature <span class="text-red-500">*</span>
      </label>
      <div class="border-2 border-gray-300 rounded-lg overflow-hidden bg-white">
        <canvas ref="signatureCanvas" @mousedown="startDrawing" @mousemove="draw" @mouseup="stopDrawing"
          @mouseleave="stopDrawing" @touchstart.prevent="startDrawing" @touchmove.prevent="draw"
          @touchend.prevent="stopDrawing" class="w-full h-40 touch-none cursor-crosshair" />
      </div>
      <button @click="clearSignature" type="button" class="text-sm text-red-600 hover:text-red-700 font-medium">
        Clear Signature
      </button>
    </div>

    <!-- Terms and Conditions -->
    <div
      class="bg-gray-50 border-2 border-gray-200 rounded-lg p-6 max-h-64 overflow-y-auto text-sm text-gray-700 space-y-3">
      <p class="font-semibold text-gray-900">By signing below, each of the above listed business and business
        owner/officer (individually and collectively, "you") authorize:</p>

      <p>EZBiz Funding and each of its representatives, successors, assigns and designees ("Recipients") that may be
        involved with or acquire commercial loans having daily repayment features or purchases of future receivables
        including Merchant Cash Advance transactions, including without limitation the application therefor
        (collectively, "Transactions") to obtain consumer or personal, business and investigative reports and other
        information about you, including credit card processor statements and bank statements, from one or more consumer
        reporting agencies, such as TransUnion, Experian and Equifax, and from other credit bureaus, banks, creditors
        and other third parties.</p>

      <p>You also authorize EZBiz Funding to transmit this application form, along with any of the foregoing information
        obtained in connection with this application, to any or all of the Recipients for the foregoing purposes. You
        also consent to the release, by any creditor or financial institution, of any information relating to any of
        you, to EZBiz Funding and to each of the Recipients, on its own behalf.</p>

      <p class="font-semibold text-gray-900">CONSENT TO TELEPHONE CALLS:</p>
      <p>You expressly consent to receiving marketing and other calls and messages, to landline, wireless or similar
        devices, including auto-dialed and pre-recorded message calls, and SMS messages (including text messages) from
        recipients, at telephone numbers that you have provided. Message and data rates may apply. Your consent to
        receive marketing calls is not required for your application, if you do not consent, do not provide your phone
        number.</p>

      <p class="font-semibold text-gray-900">CONSENT TO ELECTRONIC DISCLOSURE:</p>
      <p>You expressly consent to transactions and disclosures with recipients online and electronically. Disclosure
        will be provided to you either on the screen, on recipients' website or via electronic mail to the email address
        you provided.</p>

      <p class="text-xs text-gray-500 mt-4">EZBiz Funding online application is secured by SSL connection, making sure
        that your information is protected.</p>
    </div>

    <div class="flex items-start space-x-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <input v-model="agreedToTerms" type="checkbox" required
        class="mt-1 w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500" />
      <label class="text-sm text-gray-700">
        <span class="font-semibold">I agree to the terms and conditions</span> and confirm that all information provided
        is accurate and complete.
      </label>
    </div>

    <!-- Warning if not complete -->
    <div v-if="!isComplete" class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start space-x-3">
      <svg class="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <div class="text-sm text-yellow-900">
        <p class="font-semibold">Please complete all required fields:</p>
        <ul class="list-disc list-inside mt-2 space-y-1">
          <li v-if="!hasSignature">Add your signature</li>
          <li v-if="!agreedToTerms">Agree to terms and conditions</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormData } from '~/types'

const props = defineProps<{
  formData: Partial<FormData>
}>()

const emit = defineEmits<{
  update: [data: Partial<FormData>]
}>()

const localData = ref({ ...props.formData })
const signatureCanvas = ref<HTMLCanvasElement | null>(null)
const isDrawing = ref(false)
const agreedToTerms = ref(false)
const hasSignature = ref(false)

let ctx: CanvasRenderingContext2D | null = null

onMounted(() => {
  if (signatureCanvas.value) {
    const canvas = signatureCanvas.value
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight
    ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.strokeStyle = '#000'
      ctx.lineWidth = 2
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
    }
  }
})

const getCoordinates = (event: MouseEvent | TouchEvent) => {
  const canvas = signatureCanvas.value
  if (!canvas) return { x: 0, y: 0 }

  const rect = canvas.getBoundingClientRect()

  if (event instanceof MouseEvent) {
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    }
  } else {
    return {
      x: event.touches[0].clientX - rect.left,
      y: event.touches[0].clientY - rect.top
    }
  }
}

const startDrawing = (event: MouseEvent | TouchEvent) => {
  isDrawing.value = true
  const { x, y } = getCoordinates(event)
  if (ctx) {
    ctx.beginPath()
    ctx.moveTo(x, y)
  }
}

const draw = (event: MouseEvent | TouchEvent) => {
  if (!isDrawing.value || !ctx) return

  const { x, y } = getCoordinates(event)
  ctx.lineTo(x, y)
  ctx.stroke()
  hasSignature.value = true
}

const stopDrawing = () => {
  if (isDrawing.value && ctx) {
    ctx.closePath()
    isDrawing.value = false
    saveSignature()
  }
}

const clearSignature = () => {
  if (ctx && signatureCanvas.value) {
    ctx.clearRect(0, 0, signatureCanvas.value.width, signatureCanvas.value.height)
    hasSignature.value = false
    emit('update', { signature: '' })
  }
}

const saveSignature = () => {
  if (signatureCanvas.value && hasSignature.value) {
    const dataUrl = signatureCanvas.value.toDataURL()
    emit('update', { signature: dataUrl })
  }
}

const formatAddress = (type: 'business' | 'owner') => {
  if (type === 'business') {
    return `${localData.value.streetAddress || ''}, ${localData.value.city || ''}, ${localData.value.state || ''} ${localData.value.zipCode || ''}`.trim()
  } else {
    return `${localData.value.ownerStreetAddress || ''}, ${localData.value.ownerCity || ''}, ${localData.value.ownerState || ''} ${localData.value.ownerZip || ''}`.trim()
  }
}

const isComplete = computed(() => {
  return hasSignature.value && agreedToTerms.value
})
</script>
