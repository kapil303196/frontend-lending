<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <div class="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <div>
              <h1 class="text-xl font-bold text-gray-900">My Applications</h1>
              <p class="text-sm text-gray-600">{{ user?.businessName || user?.name }}</p>
            </div>
          </div>
          <button
            @click="handleLogout"
            class="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg class="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
            </svg>
            Logout
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Loading State -->
      <div v-if="isLoading" class="flex items-center justify-center py-12">
        <div class="text-center">
          <svg class="animate-spin h-12 w-12 text-purple-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p class="text-gray-600">Loading your applications...</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6">
        <div class="flex items-start">
          <svg class="w-6 h-6 text-red-600 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
          </svg>
          <div>
            <h3 class="text-lg font-semibold text-red-800 mb-1">Error Loading Applications</h3>
            <p class="text-red-700">{{ error }}</p>
          </div>
        </div>
      </div>

      <!-- Applications List -->
      <div v-else-if="applications && applications.length > 0">
        <!-- Summary Stats -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div class="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600">Total Applications</p>
                <p class="text-2xl font-bold text-gray-900">{{ applications.length }}</p>
              </div>
              <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600">Pending</p>
                <p class="text-2xl font-bold text-yellow-600">{{ getStatusCount('pending') }}</p>
              </div>
              <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600">Approved</p>
                <p class="text-2xl font-bold text-green-600">{{ getStatusCount('approved') }}</p>
              </div>
              <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600">Rejected</p>
                <p class="text-2xl font-bold text-red-600">{{ getStatusCount('rejected') }}</p>
              </div>
              <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Applications Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="app in applications"
            :key="app._id"
            @click="selectedApplication = app"
            class="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 cursor-pointer hover:shadow-xl hover:scale-105 transition-all duration-200"
          >
            <!-- Status Badge -->
            <div class="flex items-center justify-between mb-4">
              <span :class="getStatusBadgeClass(app.status)" class="px-3 py-1 rounded-full text-xs font-semibold">
                {{ app.status.toUpperCase() }}
              </span>
              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </div>

            <!-- Application Info -->
            <div class="space-y-3">
              <div>
                <p class="text-xs text-gray-500">Application ID</p>
                <p class="text-sm font-bold text-gray-900">{{ app.uniqueId }}</p>
              </div>

              <div>
                <p class="text-xs text-gray-500">Business Name</p>
                <p class="text-sm font-semibold text-gray-900">{{ app.formData.businessName || 'N/A' }}</p>
              </div>

              <div>
                <p class="text-xs text-gray-500">Amount Requested</p>
                <p class="text-lg font-bold text-green-600">${{ formatCurrency(app.formData.amountRequested) }}</p>
              </div>

              <div>
                <p class="text-xs text-gray-500">Submitted On</p>
                <p class="text-sm text-gray-700">{{ formatDate(app.createdAt) }}</p>
              </div>
            </div>

            <!-- View Details Button -->
            <button class="mt-4 w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all text-sm">
              View Details
            </button>
          </div>
        </div>

        <!-- First Login Notice -->
        <div v-if="user?.isFirstLogin" class="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div class="flex items-start">
            <svg class="w-6 h-6 text-yellow-600 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
            </svg>
            <div>
              <h3 class="text-lg font-semibold text-yellow-800 mb-1">Security Notice</h3>
              <p class="text-yellow-700 mb-3">This is your first login. For security reasons, we recommend changing your password.</p>
              <button class="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm font-medium">
                Change Password
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- No Applications State -->
      <div v-else class="bg-white rounded-2xl shadow-lg p-12 text-center">
        <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
        <h3 class="text-xl font-bold text-gray-900 mb-2">No Applications Found</h3>
        <p class="text-gray-600 mb-6">You don't have any applications yet.</p>
        <a href="/" class="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all">
          Submit an Application
        </a>
      </div>
    </main>

    <!-- Application Detail Modal -->
    <div v-if="selectedApplication" @click.self="selectedApplication = null" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <!-- Modal Header -->
        <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 class="text-2xl font-bold text-gray-900">Application Details</h2>
          <button @click="selectedApplication = null" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <!-- Modal Content -->
        <div class="p-6 space-y-6">
          <!-- Status Section -->
          <div class="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6">
            <div class="flex items-center justify-between mb-4">
              <div>
                <h3 class="text-lg font-bold text-gray-900 mb-1">Application Status</h3>
                <p class="text-sm text-gray-600">ID: {{ selectedApplication.uniqueId }}</p>
              </div>
              <span :class="getStatusBadgeClass(selectedApplication.status)" class="px-4 py-2 rounded-full font-semibold">
                {{ selectedApplication.status.toUpperCase() }}
              </span>
            </div>
          </div>

          <!-- Business Information -->
          <div class="bg-white border border-gray-200 rounded-xl p-6">
            <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <svg class="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
              </svg>
              Business Information
            </h3>
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-1">
                <p class="text-xs text-gray-500">Business Name</p>
                <p class="text-sm font-semibold text-gray-900">{{ selectedApplication.formData.businessName || 'N/A' }}</p>
              </div>
              <div class="space-y-1">
                <p class="text-xs text-gray-500">Owner Name</p>
                <p class="text-sm font-semibold text-gray-900">{{ selectedApplication.formData.ownerName || 'N/A' }}</p>
              </div>
              <div class="space-y-1">
                <p class="text-xs text-gray-500">Email</p>
                <p class="text-sm font-semibold text-gray-900">{{ selectedApplication.formData.businessEmail || user?.email }}</p>
              </div>
              <div class="space-y-1">
                <p class="text-xs text-gray-500">Phone</p>
                <p class="text-sm font-semibold text-gray-900">{{ selectedApplication.formData.phone || user?.phone || 'N/A' }}</p>
              </div>
            </div>
          </div>

          <!-- Financial Information -->
          <div class="bg-white border border-gray-200 rounded-xl p-6">
            <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <svg class="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              Financial Information
            </h3>
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-1">
                <p class="text-xs text-gray-500">Amount Requested</p>
                <p class="text-2xl font-bold text-green-600">${{ formatCurrency(selectedApplication.formData.amountRequested) }}</p>
              </div>
              <div class="space-y-1">
                <p class="text-xs text-gray-500">Monthly Revenue</p>
                <p class="text-lg font-semibold text-gray-900">${{ formatCurrency(selectedApplication.formData.monthlyRevenue) }}</p>
              </div>
              <div class="space-y-1">
                <p class="text-xs text-gray-500">Submitted On</p>
                <p class="text-sm font-semibold text-gray-900">{{ formatDate(selectedApplication.createdAt) }}</p>
              </div>
            </div>
          </div>

          <!-- Documents -->
          <div v-if="selectedApplication.bankStatements && selectedApplication.bankStatements.length > 0" class="bg-white border border-gray-200 rounded-xl p-6">
            <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <svg class="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              Uploaded Documents
            </h3>
            <div class="space-y-2">
              <div v-for="(doc, index) in selectedApplication.bankStatements" :key="index" class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div class="flex items-center">
                  <svg class="w-8 h-8 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                  </svg>
                  <div>
                    <p class="text-sm font-medium text-gray-900">{{ doc.originalName || 'Document' }}</p>
                    <p class="text-xs text-gray-500">{{ formatFileSize(doc.size) }}</p>
                  </div>
                </div>
                <a :href="doc.url" target="_blank" class="text-purple-600 hover:text-purple-700">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserAuth } from '../composables/useUserAuth';

const router = useRouter();
const { user, applications, isLoading, error, logout, fetchUserApplication } = useUserAuth();

const selectedApplication = ref<any>(null);

onMounted(async () => {
  await fetchUserApplication();
});

const handleLogout = () => {
  logout();
  router.push('/user/login');
};

const getStatusCount = (status: string) => {
  return applications.value.filter(app => app.status === status).length;
};

const getStatusBadgeClass = (status: string) => {
  const classes: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    submitted: 'bg-blue-100 text-blue-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800'
  };
  return classes[status] || 'bg-gray-100 text-gray-800';
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const formatCurrency = (amount: number | undefined) => {
  if (!amount) return '0';
  return amount.toLocaleString('en-US');
};

const formatFileSize = (bytes: number | undefined) => {
  if (!bytes) return '0 KB';
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
};
</script>

<style scoped>
/* Add any additional custom styles here */
</style>
