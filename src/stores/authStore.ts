import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import router from '@/router';
import Cookies from 'js-cookie';
import  { errorHandling }  from '@/utils/errorHandling'; 
import { apiService } from '@/utils/apiService'; 

interface User {
  id: number; 
  name: string;
  email: string;
  role: string;
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') as string) : null);
  const token = ref<string>(Cookies.get('token') || '');

  const setToken = (newToken: string) => {
    token.value = newToken;
    Cookies.set('token', newToken, { expires: 2 });
  };

  const setUser = (newUser: User) => {
    user.value = newUser;
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const clearToken = () => {
    token.value = '';
    Cookies.remove('token');
    localStorage.removeItem('user');
  };

  const login = async (credentials: { email: string; password: string }) => {
    try {
      const response = await apiService.apiPost('/api/auth/login', credentials); // Menggunakan apiService.apiPost
      setToken(response.data.access_token);
      setUser(response.data.user);
      router.push({ name: 'home' });
    } catch (error) {
      errorHandling(error); 
    }
  };

  const register = async (credentials: { name: string; email: string; password: string }) => {
    try {
      await apiService.apiPost('/api/auth/register', credentials); // Menggunakan apiService.apiPost
      await login(credentials);
    } catch (error) {
      errorHandling(error); 
    }
  };

  const logout = async () => {
    try {
      await apiService.apiPost('/api/auth/logout', {}); // Menggunakan apiService.apiPost
      clearToken();
      router.push({ name: 'login' });
    } catch (error) {
      errorHandling(error); 
    }
  };

  const fetchUser = async () => {
    try {
      const response = await apiService.apiPost('/api/auth/me', {}); // Menggunakan apiService.apiPost
      const { id, name, email, role } = response.data;
      setUser({ id, name, email, role });
    } catch (error) {
      errorHandling(error); 
      logout();
    }
  };

  const refreshToken = async () => {
    try {
      const response = await apiService.apiPost('/api/auth/refresh', {}, {
        headers: {
          Accept: 'application/json',
        },
      }); 
      setToken(response.data.access_token);
      setUser(response.data.user);
    } catch (error) {
      errorHandling(error); 
      logout();
    }
  };

  const isAuthenticated = computed(() => !!token.value);

  return { user, token, login, register, logout, fetchUser, refreshToken, isAuthenticated, clearToken };
});
