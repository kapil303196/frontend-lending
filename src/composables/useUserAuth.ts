import { ref, computed } from 'vue';
import axios from 'axios';
import { config } from '../config';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  businessName?: string;
  phone?: string;
  isFirstLogin?: boolean;
  lastLogin?: string;
}

interface UserApplication {
  _id: string;
  uniqueId: string;
  status: string;
  formData: {
    businessName?: string;
    ownerName?: string;
    amountRequested?: number;
    monthlyRevenue?: number;
    [key: string]: any;
  };
  bankStatements?: any[];
  createdAt: string;
  updatedAt: string;
  mcaId?: any;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthResponse {
  success: boolean;
  data: {
    user: User;
    token: string;
  };
  message?: string;
}

interface ApplicationResponse {
  success: boolean;
  data: {
    applications: UserApplication[]; // Changed to array
    user: User;
  };
  message?: string;
}

const user = ref<User | null>(null);
const token = ref<string | null>(null);
const applications = ref<UserApplication[]>([]); // Changed to array
const isLoading = ref(false);
const error = ref<string | null>(null);

// Initialize from localStorage
const initAuth = () => {
  const storedToken = localStorage.getItem('userToken');
  const storedUser = localStorage.getItem('user');
  
  if (storedToken && storedUser) {
    token.value = storedToken;
    user.value = JSON.parse(storedUser);
    
    // Set default axios header
    axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
  }
};

// Initialize on load
initAuth();

export const useUserAuth = () => {
  const isAuthenticated = computed(() => !!token.value && !!user.value);
  
  const login = async (credentials: LoginCredentials) => {
    try {
      isLoading.value = true;
      error.value = null;
      
      const response = await axios.post<AuthResponse>(
        `${config.apiUrl}/auth/login`,
        credentials
      );
      
      if (response.data.success) {
        const { user: userData, token: authToken } = response.data.data;
        
        // Store in state
        user.value = userData;
        token.value = authToken;
        
        // Store in localStorage
        localStorage.setItem('userToken', authToken);
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Set default axios header
        axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
        
        return { success: true, user: userData };
      } else {
        throw new Error(response.data.message || 'Login failed');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Login failed';
      error.value = errorMessage;
      return { success: false, error: errorMessage };
    } finally {
      isLoading.value = false;
    }
  };
  
  const logout = () => {
    // Clear state
    user.value = null;
    token.value = null;
    applications.value = [];
    error.value = null;
    
    // Clear localStorage
    localStorage.removeItem('userToken');
    localStorage.removeItem('user');
    
    // Remove axios default header
    delete axios.defaults.headers.common['Authorization'];
  };
  
  const verifyToken = async () => {
    try {
      if (!token.value) {
        logout();
        return false;
      }
      
      const response = await axios.get(`${config.apiUrl}/auth/verify`, {
        headers: {
          Authorization: `Bearer ${token.value}`
        }
      });
      
      if (response.data.success) {
        user.value = response.data.data.user;
        return true;
      } else {
        logout();
        return false;
      }
    } catch (err) {
      logout();
      return false;
    }
  };
  
  const fetchUserApplication = async () => {
    try {
      isLoading.value = true;
      error.value = null;
      
      if (!token.value) {
        throw new Error('Not authenticated');
      }
      
      const response = await axios.get<ApplicationResponse>(
        `${config.apiUrl}/auth/my-application`,
        {
          headers: {
            Authorization: `Bearer ${token.value}`
          }
        }
      );
      
      if (response.data.success) {
        applications.value = response.data.data.applications;
        user.value = response.data.data.user;
        return { success: true, applications: response.data.data.applications };
      } else {
        throw new Error(response.data.message || 'Failed to fetch application');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch application';
      error.value = errorMessage;
      return { success: false, error: errorMessage };
    } finally {
      isLoading.value = false;
    }
  };
  
  return {
    user: computed(() => user.value),
    token: computed(() => token.value),
    applications: computed(() => applications.value),
    isAuthenticated,
    isLoading: computed(() => isLoading.value),
    error: computed(() => error.value),
    login,
    logout,
    verifyToken,
    fetchUserApplication
  };
};
