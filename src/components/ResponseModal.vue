<template>
  <Transition name="modal">
    <div v-if="isOpen" class="fixed inset-0 z-50" @click.self="close">
      <!-- Backdrop -->
      <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>

      <!-- Modal -->
      <div class="fixed inset-0 flex items-center justify-center p-0 md:p-4 pointer-events-none">
        <div
          class="relative bg-white rounded-none md:rounded-2xl shadow-2xl max-w-4xl w-full h-full md:h-auto md:max-h-[90vh] flex flex-col overflow-y-auto pointer-events-auto"
          @click.stop>
          <!-- Header -->
          <div
            class="sticky top-0 bg-white border-b border-gray-200 px-4 md:px-6 py-3 md:py-4 flex items-center justify-between z-10 flex-shrink-0 shadow-sm">
            <div>
              <h2 class="text-2xl font-bold text-gray-900">
                {{ response.formData?.businessInfo?.businessName || 'Application Details' }}
              </h2>
              <p class="text-sm text-gray-500 mt-1">ID: {{ response.uniqueId }}</p>
            </div>
            <div class="flex items-center gap-2">
              <!-- Delete Button (Admin only) -->
              <button v-if="isAdminView" @click="handleDelete"
                class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete application">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
              <button @click="close" class="text-gray-400 hover:text-gray-600 transition-colors">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Content -->
          <div class="px-4 md:px-6 py-4 md:py-6 flex-1">
            <!-- Status -->
            <div v-if="isAdminView" class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">Status Management</label>
              <div class="flex flex-wrap items-center gap-2 sm:gap-3">
                <span :class="statusColorClass"
                  class="inline-flex px-4 py-2.5 sm:px-4 sm:py-2 rounded-lg text-base sm:text-sm font-bold sm:font-semibold shadow-md sm:shadow-sm border-2 sm:border-0 whitespace-nowrap">
                  {{ formatStatusLabel(response.status) }}
                </span>

                <!-- Status Update Buttons -->
                <div v-if="adminConfig.features.allowStatusUpdate" class="flex flex-wrap items-center gap-2">
                  <button v-if="response.status !== 'pending'" @click="updateStatus('pending')"
                    :disabled="isUpdatingStatus"
                    class="px-3 py-1.5 sm:py-1 text-xs font-medium text-yellow-700 bg-yellow-100 hover:bg-yellow-200 rounded-lg transition-colors disabled:opacity-50">
                    Set Pending
                  </button>
                  <button v-if="response.status !== 'submitted'" @click="updateStatus('submitted')"
                    :disabled="isUpdatingStatus"
                    class="px-3 py-1.5 sm:py-1 text-xs font-medium text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors disabled:opacity-50">
                    Set Submitted
                  </button>
                  <button v-if="response.status !== 'approved'" @click="updateStatus('approved')"
                    :disabled="isUpdatingStatus"
                    class="px-3 py-1.5 sm:py-1 text-xs font-medium text-green-700 bg-green-100 hover:bg-green-200 rounded-lg transition-colors disabled:opacity-50">
                    Approve
                  </button>
                  <button v-if="response.status !== 'rejected'" @click="updateStatus('rejected')"
                    :disabled="isUpdatingStatus"
                    class="px-3 py-1.5 sm:py-1 text-xs font-medium text-red-700 bg-red-100 hover:bg-red-200 rounded-lg transition-colors disabled:opacity-50">
                    Reject
                  </button>
                </div>
              </div>

              <!-- Success/Error Messages -->
              <div v-if="updateMessage && adminConfig.features.allowStatusUpdate" class="mt-3 p-3 rounded-lg"
                :class="updateMessageClass">
                <p class="text-sm">{{ updateMessage }}</p>
              </div>
            </div>

            <!-- Business Information -->
            <div v-if="hasBusinessInfo" class="mb-8">
              <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <svg class="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                Business Information
              </h3>
              <div class="bg-gray-50 rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoItem v-if="formData.legalBusinessName" label="Legal Business Name"
                  :value="formData.legalBusinessName" />
                <InfoItem v-if="formData.businessEmail" label="Business Email" :value="formData.businessEmail" />
                <InfoItem v-if="formData.ein" label="EIN" :value="formData.ein" />
                <InfoItem v-if="formData.businessStartDate" label="Business Start Date"
                  :value="formatUSDate(formData.businessStartDate)" />
                <InfoItem v-if="formData.streetAddress" label="Street Address" :value="formData.streetAddress" />
                <InfoItem v-if="formData.city" label="City" :value="formData.city" />
                <InfoItem v-if="formData.state" label="State" :value="formData.state" />
                <InfoItem v-if="formData.zipCode" label="Zip Code" :value="formData.zipCode" />
                <InfoItem v-if="formData.monthlyRevenue" label="Monthly Revenue"
                  :value="'$' + formData.monthlyRevenue" />
                <InfoItem v-if="formData.dba" label="DBA" :value="formData.dba" />
              </div>
            </div>

            <!-- Owner Information -->
            <div v-if="hasOwnerInfo" class="mb-8">
              <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <svg class="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Owner Information
              </h3>
              <div class="bg-gray-50 rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoItem v-if="formData.firstName" label="First Name" :value="formData.firstName" />
                <InfoItem v-if="formData.lastName" label="Last Name" :value="formData.lastName" />
                <InfoItem v-if="formData.ownerEmail" label="Email" :value="formData.ownerEmail" />
                <InfoItem v-if="formData.phone" label="Phone" :value="formData.phone" />
                <InfoItem v-if="formData.dateOfBirth" label="Date of Birth"
                  :value="formatUSDate(formData.dateOfBirth)" />
                <InfoItem v-if="formData.ssn" label="SSN" :value="formatSSN(formData.ssn)" />
                <InfoItem v-if="formData.ownershipPercent" label="Ownership %"
                  :value="String(formData.ownershipPercent) + '%'" />
                <InfoItem v-if="formData.numberOfOwners" label="Number of Owners" :value="formData.numberOfOwners" />
                <InfoItem v-if="formData.ownerStreetAddress" label="Home Street Address"
                  :value="formData.ownerStreetAddress" />
                <InfoItem v-if="formData.ownerCity" label="Home City" :value="formData.ownerCity" />
                <InfoItem v-if="formData.ownerState" label="Home State" :value="formData.ownerState" />
                <InfoItem v-if="formData.ownerZip" label="Home Zip" :value="formData.ownerZip" />
              </div>
            </div>

            <!-- Funding Information -->
            <div v-if="hasFundingInfo" class="mb-8">
              <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <svg class="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Funding Information
              </h3>
              <div class="bg-gray-50 rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoItem v-if="formData.amountRequested" label="Amount Requested"
                  :value="'$' + formData.amountRequested" />
                <InfoItem v-if="formData.hasExistingBalances" label="Has Existing Balances"
                  :value="formData.hasExistingBalances" />
                <InfoItem v-if="formData.fundDirectSpecialist" label="Heroic Funding Specialist"
                  :value="formData.fundDirectSpecialist" />
              </div>
            </div>

            <div v-if="hasExistingBalances" class="mb-8">
              <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <svg class="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Existing Balances
              </h3>

              <!-- Multiple Funders Display -->
              <div v-if="formData.existingFunders && formData.existingFunders.length > 0" class="space-y-3">
                <div v-for="(funder, index) in formData.existingFunders" :key="index"
                  class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-xs font-semibold text-gray-500 uppercase">Funder #{{ index + 1 }}</span>
                  </div>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InfoItem label="Funder Name" :value="funder.funderName" />
                    <InfoItem label="Balance Remaining" :value="'$' + funder.balanceRemaining" />
                  </div>
                </div>
              </div>

              <!-- Legacy Single Funder Display (Backward Compatibility) -->
              <div v-else-if="formData.existingLender || formData.existingBalance"
                class="bg-gray-50 rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoItem v-if="formData.existingLender" label="Funder Name" :value="formData.existingLender" />
                <InfoItem v-if="formData.existingBalance" label="Balance Remaining"
                  :value="'$' + formData.existingBalance" />
              </div>
            </div>

            <!-- User Contact -->
            <div v-if="response.userContact" class="mb-8">
              <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <svg class="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
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
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
                Bank Statements ({{ response.bankStatements.length }})
              </h3>
              <div class="space-y-2">
                <button v-for="(file, index) in response.bankStatements" :key="index" @click="openFileViewer(file)"
                  class="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group cursor-pointer border border-transparent hover:border-indigo-200">
                  <div class="flex items-center">
                    <component :is="getFileIcon(file.originalName)" class="w-6 h-6 mr-3"
                      :class="getFileIconColor(file.originalName)" />
                    <div class="text-left">
                      <p class="text-sm font-medium text-gray-900">{{ file.originalName }}</p>
                      <p class="text-xs text-gray-500">{{ formatFileSize(file.size) }} • {{ formatDate(file.uploadedAt)
                        }}</p>
                    </div>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="text-xs text-gray-500 group-hover:text-indigo-600">Click to view</span>
                    <svg class="w-5 h-5 text-gray-400 group-hover:text-indigo-600" fill="none" stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                </button>
              </div>
            </div>

            <!-- Signature -->
            <div v-if="formData.signature || formData.signatureDate" class="mb-8">
              <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <svg class="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
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
          <div
            class="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-4 md:px-6 py-3 md:py-4 flex justify-end flex-shrink-0 z-10">
            <button @click="close"
              class="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>

  <!-- File Viewer Modal -->
  <FileViewerModal v-if="selectedFile" :isOpen="isFileViewerOpen" :file="selectedFile" @close="closeFileViewer" />
</template>

<script setup lang="ts">
import { computed, ref, h, onMounted, defineComponent } from 'vue';
import axios from 'axios';
import Swal from 'sweetalert2';
import { config } from '../config';
import { useAdminConfig } from '../composables/useAdminConfig';
import FileViewerModal from './FileViewerModal.vue';

// InfoItem component
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

interface Props {
  isOpen: boolean;
  response: any;
  isAdminView?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isAdminView: false
});
const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'statusUpdated', response: any): void;
  (e: 'deleted', responseId: string): void;
}>();

const { config: adminConfig, fetchConfig } = useAdminConfig();
const formData = computed(() => props.response.formData || {});
const isUpdatingStatus = ref(false);

onMounted(() => {
  fetchConfig();
});
const updateMessage = ref('');
const updateMessageClass = ref('');

// File viewer state
const isFileViewerOpen = ref(false);
const selectedFile = ref<any>(null);

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

const hasExistingBalances = computed(() => {
  const fd = formData.value;
  return fd?.hasExistingBalances?.toLowerCase() == 'yes';
});

const statusColorClass = computed(() => {
  const status = props.response.status;
  switch (status) {
    case 'submitted':
      return 'bg-blue-100 text-blue-800 border-blue-400';
    case 'approved':
      return 'bg-green-100 text-green-800 border-green-400';
    case 'rejected':
      return 'bg-red-100 text-red-800 border-red-400';
    case 'pending':
    default:
      return 'bg-yellow-100 text-yellow-800 border-yellow-400';
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

const handleDelete = async () => {
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: `Do you want to delete the application for "${props.response.formData?.legalBusinessName || props.response.formData?.businessInfo?.businessName || 'this business'}"?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc2626',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel'
  });

  if (result.isConfirmed) {
    try {
      await axios.delete(`${config.apiUrl}/responses/${props.response._id}`);

      // Show success message
      await Swal.fire({
        title: 'Deleted!',
        text: 'The application has been deleted.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });

      // Emit deleted event and close modal
      emit('deleted', props.response._id);
      close();
    } catch (error: any) {
      console.error('Delete error:', error);
      Swal.fire({
        title: 'Error!',
        text: error.response?.data?.message || 'Failed to delete application',
        icon: 'error'
      });
    }
  }
};

const formatStatusLabel = (status: string) => {
  if (!status) return '';
  return status.charAt(0).toUpperCase() + status.slice(1);
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
    timeZone: 'America/New_York', // Eastern Time
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZoneName: 'short' // ✅ Shows EST or EDT
  });
};

const formatFileSize = (bytes: number) => {
  if (!bytes) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

const openFileViewer = (file: any) => {
  selectedFile.value = file;
  isFileViewerOpen.value = true;
};

const closeFileViewer = () => {
  isFileViewerOpen.value = false;
  selectedFile.value = null;
};

const getFileIcon = (filename: string) => {
  const ext = filename.split('.').pop()?.toLowerCase();

  const icons: any = {
    pdf: () => h('svg', { class: 'w-6 h-6', fill: 'currentColor', viewBox: '0 0 20 20' }, [
      h('path', { 'fill-rule': 'evenodd', d: 'M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z', 'clip-rule': 'evenodd' })
    ]),
    image: () => h('svg', { class: 'w-6 h-6', fill: 'currentColor', viewBox: '0 0 20 20' }, [
      h('path', { 'fill-rule': 'evenodd', d: 'M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z', 'clip-rule': 'evenodd' })
    ]),
    doc: () => h('svg', { class: 'w-6 h-6', fill: 'currentColor', viewBox: '0 0 20 20' }, [
      h('path', { 'fill-rule': 'evenodd', d: 'M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z', 'clip-rule': 'evenodd' })
    ]),
    excel: () => h('svg', { class: 'w-6 h-6', fill: 'currentColor', viewBox: '0 0 20 20' }, [
      h('path', { 'fill-rule': 'evenodd', d: 'M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z', 'clip-rule': 'evenodd' })
    ]),
    default: () => h('svg', { class: 'w-6 h-6', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z' })
    ])
  };

  if (ext === 'pdf') return icons.pdf;
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext || '')) return icons.image;
  if (['doc', 'docx'].includes(ext || '')) return icons.doc;
  if (['xls', 'xlsx'].includes(ext || '')) return icons.excel;
  return icons.default;
};

const getFileIconColor = (filename: string) => {
  const ext = filename.split('.').pop()?.toLowerCase();

  if (ext === 'pdf') return 'text-red-600';
  if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '')) return 'text-blue-600';
  if (['doc', 'docx'].includes(ext || '')) return 'text-blue-700';
  if (['xls', 'xlsx'].includes(ext || '')) return 'text-green-600';
  return 'text-gray-600';
};

const formatUSDate = (date: string) => {
  if (!date) return 'N/A';
  // Check if date is in YYYY-MM-DD format
  if (date.match(/^\d{4}-\d{2}-\d{2}$/)) {
    const [year, month, day] = date.split('-');
    return `${month}/${day}/${year}`;
  }
  // Fallback to locale date string
  const d = new Date(date);
  if (isNaN(d.getTime())) return date;
  return d.toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric'
  });
};

const formatSSN = (ssn: string) => {
  if (!ssn) return 'N/A';
  // Remove non-digits
  const cleanSSN = ssn.replace(/\D/g, '');
  if (cleanSSN.length !== 9) return ssn; // Return original if not 9 digits
  return `${cleanSSN.slice(0, 3)}-${cleanSSN.slice(3, 5)}-${cleanSSN.slice(5)}`;
};
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
