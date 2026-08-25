import { ref } from 'vue';
import { defineStore } from 'pinia';
import { apiService } from '@/utils/apiService';

export interface User {
  id: number;
  name: string;
  role_id: number;
  role: string;
  email: string;
}

export interface Role {
  id: number;
  name: string;
}

export interface UserQueryParams {
  search?: string;
  page?: number;
  per_page?: number;
}

export const useUserStore = defineStore('user', () => {
  const users = ref<User[]>([]);
  const user = ref<User | null>(null);
  const roles = ref<Role[]>([]);
  const total = ref(0);
  const currentPage = ref(1);
  const lastPage = ref(1);
  const perPage = ref(10);
  const loading = ref(false);

  const processUserList = (data: any) => {
    let items: User[] = [];
    let tot = 0;
    let curr = 1;
    let last = 1;
    let per = 10;

    if (Array.isArray(data)) {
      items = data;
      tot = data.length;
    } else if (data && typeof data === 'object') {
      if (Array.isArray(data.data)) {
        items = data.data;
        tot = typeof data.total === 'number' ? data.total : data.data.length;
        curr = data.current_page || 1;
        last = data.last_page || Math.ceil(tot / (data.per_page || 10)) || 1;
        per = data.per_page || 10;
      } else if (data.data && Array.isArray(data.data.data)) {
        items = data.data.data;
        tot = typeof data.data.total === 'number' ? data.data.total : data.data.data.length;
        curr = data.data.current_page || 1;
        last = data.data.last_page || 1;
        per = data.data.per_page || 10;
      }
    }

    users.value = items;
    total.value = tot;
    currentPage.value = curr;
    lastPage.value = last;
    perPage.value = per;
  };

  const fetchUsers = async (params: UserQueryParams = {}) => {
    loading.value = true;
    try {
      const cleanParams: Record<string, any> = {};
      if (params.search !== undefined && params.search !== '') cleanParams.search = params.search;
      if (params.page) cleanParams.page = params.page;
      if (params.per_page) cleanParams.per_page = params.per_page;

      const response = await apiService.apiGet('/api/auth/users', cleanParams);
      if (response && response.data) {
        processUserList(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch users', error);
    } finally {
      loading.value = false;
    }
  };

  const fetchUserById = async (id: number) => {
    try {
      const response = await apiService.apiGet(`/api/auth/users/${id}`);
      user.value = response.data.data || response.data;
      return user.value;
    } catch (error) {
      console.error('Failed to fetch user', error);
    }
  };

  const registerUser = async (newUser: { name: string; email: string; role_id: number; password: string }) => {
    try {
      const response = await apiService.apiPost('/api/auth/register', newUser);
      if (response?.data?.message === 'Registrasi Sukses' || response?.status === 200 || response?.status === 201) {
        await fetchUsers({ page: currentPage.value, per_page: perPage.value });
      }
      return response?.data?.message || 'Registrasi Sukses';
    } catch (error) {
      console.error('Failed to register user', error);
      return 'Failed to register user';
    }
  };

  const updateUser = async (id: number, updatedUser: { name: string; email: string; role_id: number; password?: string }) => {
    try {
      const response = await apiService.apiPut(`/api/auth/users/${id}`, updatedUser);
      if (response?.data?.message === 'User updated successfully' || response?.status === 200) {
        await fetchUsers({ page: currentPage.value, per_page: perPage.value });
      }
      return response?.data?.message || 'User updated successfully';
    } catch (error) {
      console.error('Failed to update user', error);
      return 'Failed to update user';
    }
  };

  const deleteUser = async (id: number) => {
    try {
      const response = await apiService.apiDelete(`/api/auth/users/${id}`, {});
      await fetchUsers({ page: currentPage.value, per_page: perPage.value });
      return response?.data?.message || 'USER DELETED!';
    } catch (error) {
      console.error('Failed to delete user', error);
      return 'Failed to delete user';
    }
  };

  const fetchRole = async () => {
    try {
      const response = await apiService.apiGet("/api/auth/users/roles");
      roles.value = response.data.data || response.data;
    } catch (error) {
      console.error(error);
    }
  };

  return {
    users,
    roles,
    user,
    total,
    currentPage,
    lastPage,
    perPage,
    loading,
    fetchUsers,
    fetchUserById,
    fetchRole,
    registerUser,
    updateUser,
    deleteUser,
  };
});

