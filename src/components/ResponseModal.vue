<template>
  <Transition name="modal">
    <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto" @click.self="close">
      <!-- Backdrop -->
      <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>

      <!-- Modal -->
      <div class="flex min-h-full items-center justify-center p-4">
        <div 
          class="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden"
          style="max-height: 90vh;"
          @click.stop
        >
          <!-- Header -->
          <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
            <div>
              <h2 class="text-2xl font-bold text-gray-900">
                {{ response.formData?.businessInfo?.businessName || 'Application Details' }}
              </h2>
              <p class="text-sm text-gray-500 mt-1">ID: {{ response.uniqueId }}</p>
            </div>
            <button
              @click="close"
              class="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Content -->
          <div class="px-6 py-6 overflow-y-auto" style="max-height: calc(90vh - 180px);">
            <!-- Status -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">Status Management</label>
              <div class="flex items-center gap-4">
                <span 
                  :class="statusColorClass"
                  class="inline-flex px-4 py-2 rounded-lg text-sm font-medium"
                >
                  {{ response.status }}
                </span>
                
                <!-- Status Update Buttons -->
                <div class="flex items-center gap-2">
                  <button
                    v-if="response.status !== 'pending'"
                    @click="updateStatus('pending')"
                    :disabled="isUpdatingStatus"
                    class="px-3 py-1 text-xs font-medium text-yellow-700 bg-yellow-100 hover:bg-yellow-200 rounded-lg transition-colors disabled:opacity-50"
                  >
                    Set Pending
                  </button>
                  <button
                    v-if="response.status !== 'submitted'"
                    @click="updateStatus('submitted')"
                    :disabled="isUpdatingStatus"
                    class="px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors disabled:opacity-50"
                  >
                    Set Submitted
                  </button>
                  <button
                    v-if="response.status !== 'approved'"
                    @click="updateStatus('approved')"
                    :disabled="isUpdatingStatus"
                    class="px-3 py-1 text-xs font-medium text-green-700 bg-green-100 hover:bg-green-200 rounded-lg transition-colors disabled:opacity-50"
                  >
                    Approve
                  </button>
                  <button
                    v-if="response.status !== 'rejected'"
                    @click="updateStatus('rejected')"
                    :disabled="isUpdatingStatus"
                    class="px-3 py-1 text-xs font-medium text-red-700 bg-red-100 hover:bg-red-200 rounded-lg transition-colors disabled:opacity-50"
                  >
                    Reject
                  </button>
                </div>
              </div>
              
              <!-- Success/Error Messages -->
              <div v-if="updateMessage" class="mt-3 p-3 rounded-lg" :class="updateMessageClass">
                <p class="text-sm">{{ updateMessage }}</p>
              </div>
            </div>

            <!-- Business Information -->
            <div v-if="hasBusinessInfo" class="mb-8">
              <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <svg class="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                Business Information
              </h3>
              <div class="bg-gray-50 rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoItem v-if="formData.legalBusinessName" label="Legal Business Name" :value="formData.legalBusinessName" />
                <InfoItem v-if="formData.businessEmail" label="Business Email" :value="formData.businessEmail" />
                <InfoItem v-if="formData.ein" label="EIN" :value="formData.ein" />
                <InfoItem v-if="formData.businessStartDate" label="Business Start Date" :value="formData.businessStartDate" />
                <InfoItem v-if="formData.streetAddress" label="Street Address" :value="formData.streetAddress" />
                <InfoItem v-if="formData.city" label="City" :value="formData.city" />
                <InfoItem v-if="formData.state" label="State" :value="formData.state" />
                <InfoItem v-if="formData.zipCode" label="Zip Code" :value="formData.zipCode" />
                <InfoItem v-if="formData.monthlyRevenue" label="Monthly Revenue" :value="'$' + formData.monthlyRevenue" />
                <InfoItem v-if="formData.dba" label="DBA" :value="formData.dba" />
              </div>
            </div>

            <!-- Owner Information -->
            <div v-if="hasOwnerInfo" class="mb-8">
              <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <svg class="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Owner Information
              </h3>
              <div class="bg-gray-50 rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoItem v-if="formData.firstName" label="First Name" :value="formData.firstName" />
                <InfoItem v-if="formData.lastName" label="Last Name" :value="formData.lastName" />
                <InfoItem v-if="formData.ownerEmail" label="Email" :value="formData.ownerEmail" />
                <InfoItem v-if="formData.phone" label="Phone" :value="formData.phone" />
                <InfoItem v-if="formData.dateOfBirth" label="Date of Birth" :value="formData.dateOfBirth" />
                <InfoItem v-if="formData.ssn" label="SSN" :value="formData.ssn" />
                <InfoItem v-if="formData.ownershipPercent" label="Ownership %" :value="String(formData.ownershipPercent) + '%'" />
                <InfoItem v-if="formData.numberOfOwners" label="Number of Owners" :value="formData.numberOfOwners" />
                <InfoItem v-if="formData.ownerStreetAddress" label="Home Street Address" :value="formData.ownerStreetAddress" />
                <InfoItem v-if="formData.ownerCity" label="Home City" :value="formData.ownerCity" />
                <InfoItem v-if="formData.ownerState" label="Home State" :value="formData.ownerState" />
                <InfoItem v-if="formData.ownerZip" label="Home Zip" :value="formData.ownerZip" />
              </div>
            </div>

            <!-- Funding Information -->
            <div v-if="hasFundingInfo" class="mb-8">
              <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <svg class="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Funding Information
              </h3>
              <div class="bg-gray-50 rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoItem v-if="formData.amountRequested" label="Amount Requested" :value="'$' + formData.amountRequested" />
                <InfoItem v-if="formData.hasExistingBalances" label="Has Existing Balances" :value="formData.hasExistingBalances" />
                <InfoItem v-if="formData.fundDirectSpecialist" label="Fund Direct Specialist" :value="formData.fundDirectSpecialist" />
              </div>
            </div>

            <!-- User Contact -->
            <div v-if="response.userContact" class="mb-8">
              <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <svg class="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Contact Information
              </h3>
              <div class="bg-gray-50 rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoItem label="Name" :value="response.userContact.name" />
                <InfoItem label="Email" :value="response.userContact.email" />
                <InfoItem label="Phone" :value="response.userContact.phone" />
              </div>
            </div>

            <!-- Bank Statements -->
            <div v-if="response.bankStatements?.length" class="mb-8">
              <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <svg class="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
                Bank Statements ({{ response.bankStatements.length }})
              </h3>
              <div class="space-y-2">
                <a
                  v-for="(file, index) in response.bankStatements"
                  :key="index"
                  :href="file.url"
                  target="_blank"
                  class="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
                >
                  <div class="flex items-center">
                    <svg class="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <p class="text-sm font-medium text-gray-900">{{ file.originalName }}</p>
                      <p class="text-xs text-gray-500">{{ formatFileSize(file.size) }} • {{ formatDate(file.uploadedAt) }}</p>
                    </div>
                  </div>
                  <svg class="w-5 h-5 text-gray-400 group-hover:text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>

            <!-- Signature -->
            <div v-if="formData.signature || formData.signatureDate" class="mb-8">
              <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <svg class="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Signature
              </h3>
              <div class="bg-gray-50 rounded-lg p-4 space-y-4">
                <div v-if="formData.signature" class="border border-gray-300 rounded-lg bg-white p-4">
                  <img :src="formData.signature" alt="Signature" class="max-w-full h-auto max-h-32" />
                </div>
                <InfoItem v-if="formData.signatureDate" label="Signature Date" :value="formData.signatureDate" />
              </div>
            </div>

            <!-- Metadata -->
            <div class="border-t border-gray-200 pt-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Submission Details</h3>
              <div class="bg-gray-50 rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <InfoItem label="Submitted At" :value="formatDateTime(response.createdAt)" />
                <InfoItem label="Updated At" :value="formatDateTime(response.updatedAt)" />
                <InfoItem label="IP Address" :value="response.ipAddress" />
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end">
            <button
              @click="close"
              class="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import axios from 'axios';
import { config } from '../config';

interface Props {
  isOpen: boolean;
  response: any;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'statusUpdated', response: any): void;
}>();

const formData = computed(() => props.response.formData || {});
const isUpdatingStatus = ref(false);
const updateMessage = ref('');
const updateMessageClass = ref('');

const hasBusinessInfo = computed(() => {
  const fd = formData.value;
  return !!(fd.legalBusinessName || fd.businessEmail || fd.ein || fd.businessStartDate || 
            fd.streetAddress || fd.city || fd.state || fd.zipCode);
});

const hasOwnerInfo = computed(() => {
  const fd = formData.value;
  return !!(fd.firstName || fd.lastName || fd.ownerEmail || fd.phone || fd.dateOfBirth || 
            fd.ssn || fd.ownerStreetAddress);
});

const hasFundingInfo = computed(() => {
  const fd = formData.value;
  return !!(fd.amountRequested || fd.hasExistingBalances || fd.fundDirectSpecialist);
});

const statusColorClass = computed(() => {
  const status = props.response.status;
  switch (status) {
    case 'submitted':
      return 'bg-blue-100 text-blue-800';
    case 'approved':
      return 'bg-green-100 text-green-800';
    case 'rejected':
      return 'bg-red-100 text-red-800';
    case 'pending':
    default:
      return 'bg-yellow-100 text-yellow-800';
  }
});

const close = () => {
  emit('close');
};

const updateStatus = async (newStatus: string) => {
  try {
    isUpdatingStatus.value = true;
    updateMessage.value = '';
    
    const response = await axios.patch(
      `${config.apiUrl}/responses/${props.response._id}/status`,
      { status: newStatus }
    );
    
    if (response.data.success) {
      // Update local response object
      props.response.status = newStatus;
      
      // Show success message
      updateMessage.value = `Status updated to ${newStatus} successfully!`;
      updateMessageClass.value = 'bg-green-50 text-green-800 border border-green-200';
      
      // Emit event to parent to refresh data
      emit('statusUpdated', response.data.data);
      
      // Clear message after 3 seconds
      setTimeout(() => {
        updateMessage.value = '';
      }, 3000);
    }
  } catch (error: any) {
    updateMessage.value = error.response?.data?.message || 'Failed to update status';
    updateMessageClass.value = 'bg-red-50 text-red-800 border border-red-200';
  } finally {
    isUpdatingStatus.value = false;
  }
};

const formatDate = (date: string) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const formatDateTime = (date: string) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const formatFileSize = (bytes: number) => {
  if (!bytes) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};
</script>

<script lang="ts">
// InfoItem component
import { defineComponent, h } from 'vue';

const InfoItem = defineComponent({
  props: {
    label: String,
    value: [String, Number]
  },
  setup(props) {
    return () => h('div', { class: 'space-y-1' }, [
      h('p', { class: 'text-xs font-medium text-gray-500 uppercase tracking-wider' }, props.label),
      h('p', { class: 'text-sm text-gray-900 font-medium' }, props.value || 'N/A')
    ]);
  }
});

export { InfoItem };
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>

