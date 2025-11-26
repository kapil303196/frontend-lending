<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
    <div class="max-w-2xl w-full">
      <div class="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center">
        <div class="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <span class="text-white font-bold text-3xl">FD</span>
        </div>
        
        <h1 class="text-4xl font-bold text-gray-900 mb-4">
          Welcome to Fund Direct
        </h1>
        
        <p class="text-lg text-gray-600 mb-8">
          Business Funding Application Verification Portal
        </p>
        
        <div class="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 mb-8">
          <h2 class="text-xl font-bold text-gray-900 mb-3">Getting Started</h2>
          <p class="text-gray-700 mb-4">
            To verify your funding application, you'll need the unique verification link that was sent to you via email.
          </p>
          <p class="text-sm text-gray-600">
            The link format: <code class="bg-white px-2 py-1 rounded text-blue-600 font-mono">/YOUR-UNIQUE-ID</code>
          </p>
        </div>

        <div class="space-y-4">
          <div class="flex items-center justify-center space-x-2 text-gray-600">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span>Check your email for the verification link</span>
          </div>
          
          <div class="flex items-center justify-center space-x-2 text-gray-600">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span>Need help? Call us at <a href="tel:8006412609" class="text-blue-600 font-semibold">(800) 641-2609</a></span>
          </div>
        </div>

        <div class="mt-8 pt-8 border-t border-gray-200">
          <p class="text-sm text-gray-500">
            <svg class="w-4 h-4 inline mr-1 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Secured by SSL encryption
          </p>
        </div>
      </div>

      <div class="mt-8 text-center">
        <p class="text-sm text-gray-500">
          © 2024 Fund Direct. All rights reserved.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Fund Direct - Business Funding Verification'
})
</script>

