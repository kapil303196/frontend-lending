import { ref } from 'vue';
import axios from 'axios';
import { config as apiConfig } from '../config';

// Global state
const configState = ref({
  pages: {
    overview: false,
    applications: false
  },
  charts: {
    statusDistribution: false,
    fundingTrend: false,
    amountDistribution: false,
    revenueVsLending: false
  },
  filters: {
    search: false,
    statusDropdown: false,
    sorting: false
  },
  features: {
    allowStatusUpdate: false,
    viewSensitiveInfo: false
  }
});

const isLoaded = ref(false);
const isLoading = ref(false);

export function useAdminConfig() {
  const fetchConfig = async () => {
    // console.log('fetchConfig called', { isLoaded: isLoaded.value, isLoading: isLoading.value });
    
    if (isLoaded.value || isLoading.value) return;
    
    const token = localStorage.getItem('adminToken');
    if (!token) {
      console.warn('No token found, skipping admin config fetch');
      return;
    }

    try {
      isLoading.value = true;
      // console.log('Fetching admin config from API...');
      const response = await axios.get(`${apiConfig.apiUrl}/config`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success && response.data.data) {
        // console.log('Admin config fetched successfully', response.data.data);
        // Merge with default state to ensure structural integrity
        configState.value = { ...configState.value, ...response.data.data };
        isLoaded.value = true;
      }
    } catch (error) {
      console.error('Failed to fetch admin config:', error);
      // Fallback to defaults (all true) is implicit
    } finally {
      isLoading.value = false;
    }
  };

  // Force refresh
  const refreshConfig = async () => {
    isLoaded.value = false;
    await fetchConfig();
  };

  return {
    config: configState,
    fetchConfig,
    refreshConfig,
    isLoaded
  };
}

