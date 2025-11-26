<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div class="w-full px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <!-- Logo and Title -->
          <div class="flex items-center">
            <div class="flex items-center justify-center w-10 h-10 bg-indigo-600 rounded-lg mr-3">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h1 class="text-xl font-bold text-gray-900 leading-tight">Admin Dashboard</h1>
              <p class="text-xs text-gray-500 hidden sm:block">Overview</p>
            </div>
          </div>

          <!-- Desktop Navigation & User Menu -->
          <div class="hidden lg:flex lg:items-center lg:space-x-8">
            <nav class="flex space-x-4">
              <router-link
                v-if="adminConfig.pages.overview"
                to="/admin/dashboard"
                class="flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors bg-indigo-50 text-indigo-700"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Overview
              </router-link>
              <router-link
                v-if="adminConfig.pages.applications"
                to="/admin/applications"
                class="flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors text-gray-700 hover:bg-gray-100"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Applications
              </router-link>
            </nav>

            <div class="flex items-center gap-4 pl-6 border-l border-gray-200">
              <div class="text-right">
                <p class="text-sm font-medium text-gray-900">{{ user?.name || user?.email }}</p>
                <p class="text-xs text-gray-500">{{ user?.role }}</p>
              </div>
              <button
                @click="handleLogout"
                class="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                title="Logout"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Mobile Menu Toggle -->
          <div class="flex items-center lg:hidden">
            <button 
              @click="mobileMenuOpen = !mobileMenuOpen" 
              class="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              <span class="sr-only">Open menu</span>
              <svg v-if="!mobileMenuOpen" class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg v-else class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile Menu (Collapsible) -->
      <div v-if="mobileMenuOpen" class="lg:hidden bg-white border-t border-gray-200">
        <div class="pt-2 pb-3 space-y-1 px-4">
          <router-link
            v-if="adminConfig.pages.overview"
            to="/admin/dashboard"
            class="block px-3 py-2 rounded-md text-base font-medium bg-indigo-50 text-indigo-700"
            @click="mobileMenuOpen = false"
          >
            <div class="flex items-center">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Overview
            </div>
          </router-link>
          <router-link
            v-if="adminConfig.pages.applications"
            to="/admin/applications"
            class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            @click="mobileMenuOpen = false"
          >
            <div class="flex items-center">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Applications
            </div>
          </router-link>
        </div>
        <div class="pt-4 pb-4 border-t border-gray-200 px-4">
          <div class="flex items-center mb-4">
            <div class="flex-shrink-0">
              <div class="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-lg">
                {{ (user?.name || user?.email || 'A').charAt(0).toUpperCase() }}
              </div>
            </div>
            <div class="ml-3">
              <div class="text-base font-medium text-gray-800">{{ user?.name || 'Admin User' }}</div>
              <div class="text-sm font-medium text-gray-500">{{ user?.email }}</div>
            </div>
          </div>
          <button
            @click="handleLogout"
            class="w-full flex items-center justify-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Logout
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="w-full px-4 sm:px-6 lg:px-8 py-8">
      <!-- Config Loading State -->
      <div v-if="!isLoaded" class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>

      <!-- Page Disabled State -->
      <div v-else-if="!adminConfig.pages.overview" class="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-200">
        <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
        </svg>
        <h2 class="text-xl font-bold text-gray-900 mb-2">Page Disabled</h2>
        <p class="text-gray-500">The overview dashboard is currently disabled by the administrator configuration.</p>
      </div>

      <div v-else-if="isLoading" class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>

      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p class="text-red-800">{{ error }}</p>
        <button @click="loadStats" class="mt-4 text-red-600 hover:text-red-700 font-medium">Try Again</button>
      </div>

      <div v-else class="space-y-6">
        <!-- Status Stats Cards -->
        <div class="grid grid-cols-2 lg:grid-cols-5 gap-3 lg:gap-6">
          <div @click="navigateToApps('')" class="cursor-pointer transform transition-transform hover:scale-105">
            <StatCard 
              title="Total" 
              :value="dashboardStats.statusCounts.total" 
              icon="collection"
              color="indigo"
            />
          </div>
          <div @click="navigateToApps('pending')" class="cursor-pointer transform transition-transform hover:scale-105">
            <StatCard 
              title="Pending" 
              :value="dashboardStats.statusCounts.pending" 
              icon="clock"
              color="yellow"
            />
          </div>
          <div @click="navigateToApps('submitted')" class="cursor-pointer transform transition-transform hover:scale-105">
            <StatCard 
              title="Submitted" 
              :value="dashboardStats.statusCounts.submitted" 
              icon="document"
              color="blue"
            />
          </div>
          <div @click="navigateToApps('approved')" class="cursor-pointer transform transition-transform hover:scale-105">
            <StatCard 
              title="Approved" 
              :value="dashboardStats.statusCounts.approved" 
              icon="check"
              color="green"
            />
          </div>
          <div @click="navigateToApps('rejected')" class="cursor-pointer transform transition-transform hover:scale-105">
            <StatCard 
              title="Rejected" 
              :value="dashboardStats.statusCounts.rejected" 
              icon="x"
              color="red"
              :isActive="false"
            />
          </div>
        </div>

        <!-- Charts Row 1 -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <StatusChart 
            v-if="adminConfig.charts.statusDistribution"
            :stats="{ total: dashboardStats.statusCounts.total, byStatus: dashboardStats.statusCounts }" 
          />
          
          <!-- Funding chart handles its own navigation -->
          <div 
            v-if="adminConfig.charts.fundingTrend"
            @click="navigateToAppsSort('createdAt')" 
            class="cursor-pointer h-full transition-shadow hover:shadow-md rounded-xl"
          >
            <FundingLineChart :data="dashboardStats.fundingPerDay" />
          </div>
        </div>

        <!-- Charts Row 2 -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AmountStatusChart 
            v-if="adminConfig.charts.amountDistribution"
            :data="dashboardStats.amountStats" 
          />
          <RevenueChart 
            v-if="adminConfig.charts.revenueVsLending"
            :data="dashboardStats.revenueVsLending" 
          />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { useAuth } from '../composables/useAuth';
import { useAdminConfig } from '../composables/useAdminConfig';
import { config } from '../config';
import StatusChart from '../components/StatusChart.vue';
import FundingLineChart from '../components/charts/FundingLineChart.vue';
import AmountStatusChart from '../components/charts/AmountStatusChart.vue';
import RevenueChart from '../components/charts/RevenueChart.vue';
import { StatCard } from '../pages/AdminDashboardPage.vue'; // Reuse StatCard component

const router = useRouter();
const { user, logout } = useAuth();
const { config: adminConfig, fetchConfig, isLoaded } = useAdminConfig();
const mobileMenuOpen = ref(false);
const isLoading = ref(false); // This is for stats loading, not config
const error = ref<string | null>(null);

const dashboardStats = ref({
  statusCounts: {
    total: 0,
    pending: 0,
    submitted: 0,
    approved: 0,
    rejected: 0
  },
  fundingPerDay: [],
  amountStats: {
    totalAsked: 0,
    totalApproved: 0,
    totalRejected: 0
  },
  revenueVsLending: {
    totalRevenue: 0,
    totalLending: 0
  }
});

const loadStats = async () => {
  try {
    isLoading.value = true;
    error.value = null;
    const response = await axios.get(`${config.apiUrl}/responses/dashboard-stats`);
    dashboardStats.value = response.data.data;
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to load dashboard statistics';
    console.error('Load stats error:', err);
  } finally {
    isLoading.value = false;
  }
};

const navigateToApps = (status: string) => {
  router.push({
    path: '/admin/applications',
    query: { status }
  });
};

const navigateToAppsSort = (sortBy: string) => {
  router.push({
    path: '/admin/applications',
    query: { sortBy }
  });
};

const handleLogout = () => {
  logout();
  router.push('/admin/login');
};

onMounted(() => {
  fetchConfig();
  loadStats();
});
</script>

