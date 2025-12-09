<template>
  <div class="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-4">
    <div class="max-w-2xl w-full">
      <div class="bg-white rounded-2xl shadow-2xl p-8 md:p-12 text-center">
        <!-- Success Icon -->
        <div class="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg class="w-16 h-16 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <!-- Success Message -->
        <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Application Submitted Successfully!
        </h1>
        
        <p class="text-lg text-gray-600 mb-6">
          Thank you for verifying your information. Your application has been received and is being processed.
        </p>

        <!-- Next Steps -->
        <div class="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 mb-8 text-left">
          <h2 class="font-bold text-gray-900 mb-3 text-lg">What's Next?</h2>
          <ul class="space-y-2 text-gray-700">
            <li class="flex items-start">
              <svg class="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Our team will review your application within 24-48 hours</span>
            </li>
            <li class="flex items-start">
              <svg class="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>You'll receive an email confirmation shortly</span>
            </li>
            <li class="flex items-start">
              <svg class="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>A Fund Direct specialist will contact you with the next steps</span>
            </li>
          </ul>
        </div>

        <!-- Contact Info -->
        <div class="text-gray-600 mb-8">
          <p class="mb-2">Questions? Contact us:</p>
          <a href="mailto:sales@funddirect.us" class="text-blue-600 hover:text-blue-700 font-semibold block mb-2">
            sales@funddirect.us
          </a>
          <a href="tel:8006412609" class="text-blue-600 hover:text-blue-700 font-semibold text-lg">
            (800) 641-2609
          </a>
        </div>

        <!-- Security Notice -->
        <div class="bg-green-50 border-2 border-green-200 rounded-lg p-4 flex items-center justify-center space-x-3">
          <svg class="w-6 h-6 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <p class="text-sm text-green-900 font-medium">
            Your information is encrypted and secure
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// This page is shown after successful form submission
</script>










