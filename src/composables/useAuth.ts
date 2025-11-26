import { ref, computed } from 'vue';
import axios from 'axios';
import { config } from '../config';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  lastLogin?: string;
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

const user = ref<User | null>(null);
const token = ref<string | null>(null);
const isLoading = ref(false);
const error = ref<string | null>(null);

// Initialize from localStorage
const initAuth = () => {
  const storedToken = localStorage.getItem('adminToken');
  const storedUser = localStorage.getItem('adminUser');
  
  if (storedToken && storedUser) {
    token.value = storedToken;
    user.value = JSON.parse(storedUser);
    
    // Set default axios header
    axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
  }
};

// Initialize on load
initAuth();

export const useAuth = () => {
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
        localStorage.setItem('adminToken', authToken);
        localStorage.setItem('adminUser', JSON.stringify(userData));
        
        // Set default axios header
        axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
        
        return { success: true };
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
    error.value = null;
    
    // Clear localStorage
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    
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
  
  return {
    user: computed(() => user.value),
    token: computed(() => token.value),
    isAuthenticated,
    isLoading: computed(() => isLoading.value),
    error: computed(() => error.value),
    login,
    logout,
    verifyToken
  };
};

