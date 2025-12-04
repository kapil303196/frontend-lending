<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="w-full px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <div class="flex items-center justify-center w-10 h-10 bg-emerald-600 rounded-lg mr-3">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M3 10h4l3 10 4-18 3 8h4" />
              </svg>
            </div>
            <div>
              <h1 class="text-xl font-bold text-gray-900 leading-tight">Dealer Portal</h1>
              <p class="text-xs text-gray-500 hidden sm:block">Rejected offers (read-only)</p>
            </div>
          </div>

          <div class="flex items-center gap-4">
            <div class="text-right hidden sm:block">
              <p class="text-sm font-medium text-gray-900">{{ dealerUser?.name || dealerUser?.email }}</p>
              <p class="text-xs text-gray-500">Dealer</p>
            </div>
            <button @click="handleLogout"
              class="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
              title="Logout">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>

    <main class="w-full px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 class="text-lg font-semibold text-gray-900">Rejected Offers</h2>
            <p class="text-sm text-gray-500">
              You can review these offers and maintain internal statuses and notes. The main offer data is read-only.
            </p>
          </div>
          <button @click="loadOffers" class="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M4 4v6h6M20 20v-6h-6M5 19l4.5-4.5M19 5l-4.5 4.5" />
            </svg>
            Refresh
          </button>
        </div>

        <div v-if="isLoading" class="flex items-center justify-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        </div>

        <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-800">
          {{ error }}
        </div>

        <div v-else-if="offers.length === 0" class="bg-gray-50 border border-dashed border-gray-300 rounded-lg p-8 text-center text-gray-500 text-sm">
          No rejected offers available yet.
        </div>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="item in offers"
            :key="item.response._id"
            class="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow bg-white flex flex-col"
          >
            <!-- Top: basic info -->
            <div
              class="flex items-start justify-between mb-3 cursor-pointer"
              @click="openDetails(item.response)"
            >
              <div class="pr-2">
                <h3 class="text-base font-semibold text-gray-900">
                  {{ getBusinessName(item.response) }}
                </h3>
                <p class="text-xs text-gray-500 mt-0.5">
                  ID: {{ item.response.uniqueId }}
                </p>
                <p class="text-xs text-gray-500 mt-1">
                  {{ getOwnerName(item.response) || 'Owner unknown' }}
                </p>
              </div>
              <div class="text-right">
                <span class="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium bg-red-100 text-red-800">
                  Rejected
                </span>
                <p class="text-[11px] text-gray-400 mt-1">
                  {{ formatDate(item.response.createdAt) }}
                </p>
              </div>
            </div>

            <!-- Mid: key figures -->
            <div class="grid grid-cols-2 gap-2 text-xs text-gray-700 mb-3">
              <div v-if="getEmail(item.response)">
                <p class="font-medium text-gray-500">Email</p>
                <p class="truncate">{{ getEmail(item.response) }}</p>
              </div>
              <div v-if="getRequestedAmount(item.response)">
                <p class="font-medium text-gray-500">Requested</p>
                <p>{{ getRequestedAmount(item.response) }}</p>
              </div>
              <div v-if="item.dealerMeta?.internalStatus">
                <p class="font-medium text-gray-500">Dealer Status</p>
                <p class="capitalize">{{ item.dealerMeta.internalStatus.replace('_', ' ') }}</p>
              </div>
              <div v-if="item.dealerMeta?.internalStatusUpdatedAt">
                <p class="font-medium text-gray-500">Updated</p>
                <p class="truncate">
                  {{ formatDate(item.dealerMeta.internalStatusUpdatedAt) }}
                  <span v-if="item.dealerMeta.internalStatusUpdatedByEmail" class="block text-[10px] text-gray-400">
                    by {{ item.dealerMeta.internalStatusUpdatedByName || item.dealerMeta.internalStatusUpdatedByEmail }}
                  </span>
                </p>
              </div>
            </div>

            <!-- Dealer controls -->
            <div class="mt-auto pt-3 border-t border-gray-100 space-y-2">
              <div>
                <label class="block text-[11px] font-medium text-gray-700 mb-1">
                  Dealer Status (internal only)
                </label>
                <select
                  v-model="item.localInternalStatus"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="">Not set</option>
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="in_review">In Review</option>
                  <option value="offered">Offered</option>
                  <option value="declined">Declined</option>
                </select>
              </div>

              <div>
                <label class="block text-[11px] font-medium text-gray-700 mb-1">
                  Add Note
                </label>
                <textarea
                  v-model="item.newNote"
                  rows="2"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs resize-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Internal note about this offer"
                ></textarea>
              </div>

              <div class="flex items-center justify-between">
                <button
                  @click="saveDealerMeta(item)"
                  :disabled="item.isSaving"
                  class="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg
                    v-if="item.isSaving"
                    class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      class="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      stroke-width="4"
                    ></circle>
                    <path
                      class="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>{{ item.isSaving ? 'Saving...' : 'Save internal status & note' }}</span>
                </button>
                <span v-if="item.saveMessage" class="text-[11px] text-gray-500">
                  {{ item.saveMessage }}
                </span>
              </div>

              <div
                v-if="item.dealerMeta?.notes?.length"
                class="mt-2 border-t border-gray-200 pt-2 max-h-24 overflow-y-auto"
              >
                <p class="text-[11px] font-semibold text-gray-700 mb-1">Notes history</p>
                <ul class="space-y-1 text-[11px] text-gray-600">
                  <li v-for="note in item.dealerMeta.notes" :key="note._id || note.createdAt">
                    <span class="block">{{ note.text }}</span>
                    <span class="text-[10px] text-gray-400">
                      {{ formatDate(note.createdAt) }}
                      <span v-if="note.createdByEmail">
                        • {{ note.createdByName || note.createdByEmail }}
                      </span>
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Full details modal (read-only like admin) -->
    <ResponseModal
      v-if="selectedResponse"
      :isOpen="isModalOpen"
      :response="selectedResponse"
      @close="closeDetails"
      @statusUpdated="handleStatusUpdated"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { config } from '../config';
import { useDealerAuth } from '../composables/useDealerAuth';
import ResponseModal from '../components/ResponseModal.vue';

const router = useRouter();
const { user, logout, verifyToken } = useDealerAuth();

const dealerUser = computed(() => user.value);
const offers = ref<any[]>([]);
const isLoading = ref(false);
const error = ref<string | null>(null);

const isModalOpen = ref(false);
const selectedResponse = ref<any | null>(null);

const loadOffers = async () => {
  try {
    isLoading.value = true;
    error.value = null;
    const response = await axios.get(`${config.apiUrl}/dealer/offers/rejected`);
    const data = response.data.data || [];

    offers.value = data.map((item: any) => ({
      ...item,
      localInternalStatus: item.dealerMeta?.internalStatus || '',
      newNote: '',
      isSaving: false,
      saveMessage: ''
    }));
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to load rejected offers';
    console.error('Dealer loadOffers error:', err);
  } finally {
    isLoading.value = false;
  }
};

const saveDealerMeta = async (item: any) => {
  try {
    item.isSaving = true;
    item.saveMessage = '';

    await axios.post(`${config.apiUrl}/dealer/offers/${item.response._id}/notes`, {
      internalStatus: item.localInternalStatus || undefined,
      note: item.newNote || undefined
    });

    item.saveMessage = 'Saved';
    item.newNote = '';

    // Refresh dealerMeta by reloading offers for this item only
    await loadOffers();
  } catch (err: any) {
    console.error('Dealer saveDealerMeta error:', err);
    item.saveMessage = err.response?.data?.message || 'Failed to save';
  } finally {
    item.isSaving = false;
  }
};

const openDetails = (response: any) => {
  selectedResponse.value = response;
  isModalOpen.value = true;
};

const closeDetails = () => {
  isModalOpen.value = false;
  selectedResponse.value = null;
};

// Keep local list in sync if status somehow changes (e.g. admin action elsewhere)
const handleStatusUpdated = (updated: any) => {
  const idx = offers.value.findIndex(o => o.response._id === updated._id);
  if (idx !== -1) {
    offers.value[idx].response = updated;
  }
};

const handleLogout = () => {
  logout();
  router.push('/dealer/login');
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const getBusinessName = (response: any) => {
  return response.formData?.legalBusinessName ||
    response.formData?.businessInfo?.businessName ||
    response.mcaId?.company ||
    response.mcaId?.businessName ||
    'Business Application';
};

const getOwnerName = (response: any) => {
  const formData = response.formData;
  const userContact = response.userContact;
  const mcaId = response.mcaId;

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
};

const getEmail = (response: any) => {
  return response.formData?.ownerEmail ||
    response.formData?.businessEmail ||
    response.formData?.ownerInfo?.email ||
    response.userContact?.email ||
    response.mcaId?.email ||
    '';
};

const getRequestedAmount = (response: any) => {
  const amount = response.formData?.amountRequested ||
    response.formData?.businessFunding?.requestedAmount ||
    response.mcaId?.amount;

  if (!amount) return '';

  if (typeof amount === 'string' && amount.includes(',')) {
    return `$${amount}`;
  }

  const numAmount = typeof amount === 'string' ? parseFloat(amount.replace(/,/g, '')) : amount;
  return isNaN(numAmount) ? '' : `$${numAmount.toLocaleString()}`;
};

onMounted(async () => {
  // Ensure dealer token is valid; if not, redirect to login
  const isValid = await verifyToken();
  if (!isValid) {
    router.push('/dealer/login');
    return;
  }

  await loadOffers();
});
</script>


