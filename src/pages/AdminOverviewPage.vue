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
                <p class="text-sm text-gray-500 hidden sm:block">Overview</p>
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
              class="flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors bg-indigo-50 text-indigo-700"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Overview
            </router-link>
            <router-link
              to="/admin/applications"
              class="flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors text-gray-700 hover:bg-gray-100"
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
      <div v-if="isLoading" class="flex items-center justify-center py-12">
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
          <StatusChart :stats="{ total: dashboardStats.statusCounts.total, byStatus: dashboardStats.statusCounts }" />
          
          <!-- Funding chart handles its own navigation -->
          <div @click="navigateToAppsSort('createdAt')" class="cursor-pointer h-full transition-shadow hover:shadow-md rounded-xl">
            <FundingLineChart :data="dashboardStats.fundingPerDay" />
          </div>
        </div>

        <!-- Charts Row 2 -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AmountStatusChart :data="dashboardStats.amountStats" />
          <RevenueChart :data="dashboardStats.revenueVsLending" />
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
import { config } from '../config';
import StatusChart from '../components/StatusChart.vue';
import FundingLineChart from '../components/charts/FundingLineChart.vue';
import AmountStatusChart from '../components/charts/AmountStatusChart.vue';
import RevenueChart from '../components/charts/RevenueChart.vue';
import { StatCard } from '../pages/AdminDashboardPage.vue'; // Reuse StatCard component

const router = useRouter();
const { user, logout } = useAuth();
const mobileMenuOpen = ref(false);
const isLoading = ref(false);
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
  loadStats();
});
</script>

