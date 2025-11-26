<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <!-- Logo and Title -->
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <div class="flex items-center justify-center w-10 h-10 bg-indigo-600 rounded-lg mr-3">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h1 class="text-xl font-bold text-gray-900">Admin Dashboard</h1>
                <p class="text-sm text-gray-500 hidden sm:block">Applications</p>
              </div>
            </div>
            <!-- Mobile Menu Toggle -->
            <button @click="mobileMenuOpen = !mobileMenuOpen" class="lg:hidden p-2">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
          
          <!-- Navigation Links -->
          <nav :class="['lg:flex items-center gap-6', mobileMenuOpen ? 'flex' : 'hidden']" class="flex-col lg:flex-row gap-2 lg:gap-6">
            <router-link
              to="/admin/dashboard"
              class="flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors text-gray-700 hover:bg-gray-100"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Overview
            </router-link>
            <router-link
              to="/admin/applications"
              class="flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors bg-indigo-50 text-indigo-700"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Applications
            </router-link>
          </nav>

          <!-- User Menu -->
          <div class="flex items-center gap-4">
            <div class="text-right hidden lg:block">
              <p class="text-sm font-medium text-gray-900">{{ user?.name || user?.email }}</p>
              <p class="text-xs text-gray-500">{{ user?.role }}</p>
            </div>
            <button
              @click="handleLogout"
              class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              <svg class="w-4 h-4 lg:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span class="hidden lg:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Filters and Search -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div class="flex flex-col gap-4">
          <!-- Search and Status Filter Row -->
          <div class="flex flex-col sm:flex-row gap-4">
            <div class="flex-1">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Search
              </label>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search by name, email, business, or ID..."
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
              />
            </div>
            <div class="sm:w-48">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Status Filter
              </label>
              <select
                v-model="statusFilter"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="submitted">Submitted</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          <!-- Sort Options Row -->
          <div class="border-t border-gray-200 pt-4">
            <div class="flex items-center justify-between mb-3">
              <label class="text-sm font-medium text-gray-700 flex items-center">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                </svg>
                Sort By
              </label>
              <button
                @click="clearFilters"
                class="inline-flex items-center px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                Clear All
              </button>
            </div>
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
              <button
                v-for="option in sortOptions"
                :key="option.value"
                @click="sortBy = option.value"
                :class="[
                  'px-3 py-2 text-sm font-medium rounded-lg border transition-all',
                  sortBy === option.value
                    ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                ]"
              >
                <svg v-if="option.icon" class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="option.icon" />
                </svg>
                {{ option.label }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading && pagination.page === 1" class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p class="text-red-800">{{ error }}</p>
        <button @click="loadResponses" class="mt-4 text-red-600 hover:text-red-700 font-medium">Try Again</button>
      </div>

      <!-- Empty State -->
      <div v-else-if="responses.length === 0" class="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
        <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p class="text-gray-600 font-medium">No applications found</p>
        <p class="text-gray-500 text-sm mt-2">Try adjusting your filters</p>
      </div>

      <!-- Response Cards Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        <ResponseCard
          v-for="response in responses"
          :key="response._id"
          :response="response"
          @click="openModal(response)"
        />
      </div>

      <!-- Loading More Indicator -->
      <div v-if="isLoadingMore" class="flex items-center justify-center py-8">
        <div class="flex items-center gap-3">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <span class="text-gray-600">Loading more applications...</span>
        </div>
      </div>

      <!-- End of Results -->
      <div v-if="!hasMore && responses.length > 0" class="text-center py-8">
        <p class="text-gray-500">No more applications to load</p>
      </div>

      <!-- Scroll to Top Button -->
      <button
        v-if="showScrollTop"
        @click="scrollToTop"
        class="fixed bottom-8 right-8 p-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg transition-all z-30"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
    </main>

    <!-- Response Modal -->
    <ResponseModal
      :isOpen="isModalOpen"
      :response="selectedResponse"
      @close="closeModal"
      @statusUpdated="handleStatusUpdate"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';
import { useAuth } from '../composables/useAuth';
import ResponseCard from '../components/ResponseCard.vue';
import ResponseModal from '../components/ResponseModal.vue';
import { config } from '../config';

const router = useRouter();
const route = useRoute();
const { user, logout } = useAuth();

const responses = ref<any[]>([]);
const isLoading = ref(false);
const isLoadingMore = ref(false);
const error = ref<string | null>(null);
const mobileMenuOpen = ref(false);
const showScrollTop = ref(false);

const searchQuery = ref('');
const statusFilter = ref((route.query.status as string) || '');
const sortBy = ref((route.query.sortBy as string) || 'createdAt');
const pagination = ref({
  page: 1,
  limit: 20,
  total: 0,
  pages: 0
});

// Initialize active stat filter from query param
const activeStatFilter = ref((route.query.status as string) || ''); 

// Watch for route query changes to update filters
watch(() => route.query, (newQuery) => {
  if (newQuery.status !== undefined) {
    statusFilter.value = (newQuery.status as string) || '';
    activeStatFilter.value = (newQuery.status as string) || '';
  }
  if (newQuery.sortBy !== undefined) {
    sortBy.value = (newQuery.sortBy as string) || 'createdAt';
  }
  // Trigger reload
  pagination.value.page = 1;
  responses.value = [];
  loadResponses();
}, { deep: true });

const hasMore = computed(() => pagination.value.page < pagination.value.pages);
const isModalOpen = ref(false);
const selectedResponse = ref<any>(null);

// Sort options
const sortOptions = [
  { 
    value: 'createdAt', 
    label: 'Newest First',
    icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
  },
  { 
    value: 'createdAt-asc', 
    label: 'Oldest First',
    icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
  },
  { 
    value: 'amount', 
    label: 'Amount',
    icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
  },
  { 
    value: 'revenue', 
    label: 'Revenue',
    icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6'
  },
  { 
    value: 'status', 
    label: 'Status',
    icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'
  },
  { 
    value: 'uniqueId', 
    label: 'ID',
    icon: 'M7 20l4-16m2 16l4-16M6 9h14M4 15h14'
  }
];

// Debounce timer for search
let searchDebounce: any = null;

// Watch for filter changes and reload automatically
watch(searchQuery, () => {
  clearTimeout(searchDebounce);
  searchDebounce = setTimeout(() => {
    pagination.value.page = 1;
    responses.value = [];
    loadResponses();
  }, 300);
});

watch([statusFilter, sortBy], () => {
  pagination.value.page = 1;
  responses.value = [];
  loadResponses();
});

// Methods
const loadResponses = async (append = false) => {
  try {
    if (append) {
      isLoadingMore.value = true;
    } else {
      isLoading.value = true;
    }
    error.value = null;

    const params: any = {
      page: pagination.value.page,
      limit: pagination.value.limit
    };

    if (statusFilter.value) {
      params.status = statusFilter.value;
    }

    // Parse sortBy
    let sortField = 'createdAt';
    let sortOrder = 'desc';
    
    if (sortBy.value.includes('-asc')) {
      sortField = sortBy.value.replace('-asc', '');
      sortOrder = 'asc';
    } else {
      sortField = sortBy.value;
      sortOrder = 'desc';
    }

    params.sortBy = sortField;
    params.sortOrder = sortOrder;

    const response = await axios.get(`${config.apiUrl}/responses`, { params });
    let allResponses = response.data.data;

    // Apply client-side search filter only (backend doesn't have text search)
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      allResponses = allResponses.filter((r: any) => {
        const businessName = r.formData?.legalBusinessName || r.formData?.businessInfo?.businessName || r.mcaId?.company || '';
        const firstName = r.formData?.firstName || r.formData?.ownerInfo?.firstName || r.mcaId?.firstName || '';
        const lastName = r.formData?.lastName || r.formData?.ownerInfo?.lastName || r.mcaId?.lastName || '';
        const email = r.formData?.ownerEmail || r.formData?.businessEmail || r.formData?.ownerInfo?.email || r.userContact?.email || r.mcaId?.email || '';
        const uniqueId = r.uniqueId || '';
        
        return (
          businessName.toLowerCase().includes(query) ||
          firstName.toLowerCase().includes(query) ||
          lastName.toLowerCase().includes(query) ||
          email.toLowerCase().includes(query) ||
          uniqueId.toLowerCase().includes(query) ||
          `${firstName} ${lastName}`.toLowerCase().includes(query)
        );
      });
    }

    if (append) {
      responses.value = [...responses.value, ...allResponses];
    } else {
      responses.value = allResponses;
    }
    
    pagination.value = response.data.pagination;

  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to load responses';
    console.error('Load responses error:', err);
  } finally {
    isLoading.value = false;
    isLoadingMore.value = false;
  }
};

const loadMore = () => {
  if (hasMore.value && !isLoadingMore.value) {
    pagination.value.page += 1;
    loadResponses(true);
  }
};

const clearFilters = () => {
  searchQuery.value = '';
  statusFilter.value = '';
  sortBy.value = 'createdAt';
  pagination.value.page = 1;
  responses.value = [];
};

const openModal = (response: any) => {
  selectedResponse.value = response;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  selectedResponse.value = null;
};

const handleStatusUpdate = (updatedResponse: any) => {
  const index = responses.value.findIndex(r => r._id === updatedResponse._id);
  if (index !== -1) {
    responses.value[index] = updatedResponse;
  }
};

const handleLogout = () => {
  logout();
  router.push('/admin/login');
};

// Infinite Scroll
const handleScroll = () => {
  const scrollY = window.scrollY;
  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;
  
  showScrollTop.value = scrollY > 500;
  
  if (scrollY + windowHeight >= documentHeight - 200) {
    if (!isLoading.value && !isLoadingMore.value && hasMore.value) {
      loadMore();
    }
  }
};

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
  loadResponses();
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

