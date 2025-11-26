<template>
  <div 
    class="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 p-6 cursor-pointer border border-gray-200 hover:border-indigo-300"
    @click="$emit('click')"
  >
    <!-- Header -->
    <div class="flex items-start justify-between mb-4">
      <div class="flex-1">
        <h3 class="text-lg font-semibold text-gray-900 mb-1">
          {{ businessName }}
        </h3>
        <p class="text-sm text-gray-500">ID: {{ response.uniqueId }}</p>
      </div>
      <div>
        <span 
          :class="statusColorClass"
          class="px-3 py-1 rounded-full text-xs font-medium"
        >
          {{ response.status }}
        </span>
      </div>
    </div>

    <!-- Details Grid -->
    <div class="space-y-2 mb-4">
      <div v-if="ownerName" class="flex items-center text-sm">
        <svg class="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <span class="text-gray-700">{{ ownerName }}</span>
      </div>

      <div v-if="email" class="flex items-center text-sm">
        <svg class="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        <span class="text-gray-700">{{ email }}</span>
      </div>

      <div v-if="phone" class="flex items-center text-sm">
        <svg class="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
        <span class="text-gray-700">{{ phone }}</span>
      </div>

      <div v-if="requestedAmount" class="flex items-center text-sm">
        <svg class="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span class="text-gray-700">{{ requestedAmount }}</span>
      </div>
    </div>

    <!-- Footer -->
    <div class="pt-4 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
      <div class="flex items-center">
        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span>{{ formatDate(response.createdAt) }}</span>
      </div>
      <div v-if="response.bankStatements?.length" class="flex items-center">
        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
        </svg>
        <span>{{ response.bankStatements.length }} file(s)</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  response: any;
}

const props = defineProps<Props>();

// Extract data from different possible structures
const businessName = computed(() => {
  return props.response.formData?.legalBusinessName || 
         props.response.formData?.businessInfo?.businessName ||
         props.response.mcaId?.company ||
         props.response.mcaId?.businessName ||
         'Business Application';
});

const ownerName = computed(() => {
  const formData = props.response.formData;
  const userContact = props.response.userContact;
  const mcaId = props.response.mcaId;
  
  if (formData?.firstName && formData?.lastName) {
    return `${formData.firstName} ${formData.lastName}`;
  }
  if (formData?.ownerInfo?.firstName && formData?.ownerInfo?.lastName) {
    return `${formData.ownerInfo.firstName} ${formData.ownerInfo.lastName}`;
  }
  if (userContact?.name) {
    return userContact.name;
  }
  if (mcaId?.firstName && mcaId?.lastName) {
    return `${mcaId.firstName} ${mcaId.lastName}`;
  }
  return '';
});

const email = computed(() => {
  return props.response.formData?.ownerEmail ||
         props.response.formData?.businessEmail ||
         props.response.formData?.ownerInfo?.email ||
         props.response.userContact?.email ||
         props.response.mcaId?.email ||
         '';
});

const phone = computed(() => {
  return props.response.formData?.phone ||
         props.response.formData?.ownerInfo?.phoneNumber ||
         props.response.userContact?.phone ||
         props.response.mcaId?.phoneNumber ||
         '';
});

const requestedAmount = computed(() => {
  const amount = props.response.formData?.amountRequested ||
                 props.response.formData?.businessFunding?.requestedAmount ||
                 props.response.mcaId?.amount;
  
  if (!amount) return '';
  
  // If it's already formatted with commas, return as is
  if (typeof amount === 'string' && amount.includes(',')) {
    return `$${amount}`;
  }
  
  // Otherwise format it
  const numAmount = typeof amount === 'string' ? parseFloat(amount.replace(/,/g, '')) : amount;
  return isNaN(numAmount) ? '' : `$${numAmount.toLocaleString()}`;
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

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};
</script>

