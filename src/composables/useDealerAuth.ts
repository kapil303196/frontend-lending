import { ref, computed } from 'vue';
import axios from 'axios';
import { config } from '../config';

interface DealerUser {
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
    user: DealerUser;
    token: string;
  };
  message?: string;
}

const user = ref<DealerUser | null>(null);
const token = ref<string | null>(null);
const isLoading = ref(false);
const error = ref<string | null>(null);

// Initialize from localStorage
const initAuth = () => {
  const storedToken = localStorage.getItem('dealerToken');
  const storedUser = localStorage.getItem('dealerUser');

  if (storedToken && storedUser) {
    token.value = storedToken;
    user.value = JSON.parse(storedUser);

    axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
  }
};

// Initialize on load
initAuth();

export const useDealerAuth = () => {
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

        // Ensure this is a dealer account
        if (userData.role !== 'dealer') {
          throw new Error('This login is for dealer accounts only.');
        }

        user.value = userData;
        token.value = authToken;

        localStorage.setItem('dealerToken', authToken);
        localStorage.setItem('dealerUser', JSON.stringify(userData));

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
    user.value = null;
    token.value = null;
    error.value = null;

    localStorage.removeItem('dealerToken');
    localStorage.removeItem('dealerUser');

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

      if (response.data.success && response.data.data.user.role === 'dealer') {
        user.value = response.data.data.user;
        return true;
      } else {
        logout();
        return false;
      }
    } catch {
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


