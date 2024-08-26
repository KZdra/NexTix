import { ref } from 'vue';
import { defineStore } from 'pinia';
import { apiService } from '@/utils/apiService';

interface User {
  id: number;
  name: string;
  role_id:number;
  role: string;
  email: string;
}
interface Role {
  id:number;
  name:string;
}

export const useUserStore = defineStore('user', () => {
  const users = ref<User[]>([]); 
  const user = ref<User | null>(null); 
  const roles = ref<Role[]>([]);

  const fetchUsers = async () => {
    try {
      const response = await apiService.apiGet('/api/auth/users');
      users.value = response.data;
    } catch (error) {
      console.error('Failed to fetch users', error);
    }
  };

  const fetchUserById = async (id: number) => {
    try {
      const response = await apiService.apiGet(`/api/auth/users/${id}`);
      user.value = response.data;
      return response.data;
    } catch (error) {
      console.error('Failed to fetch user', error);
    }
  };

  const registerUser = async (newUser: { name: string; email: string; role_id: number ; password: string }) => {
    try {
      const response = await apiService.apiPost('/api/auth/register', newUser); // Use apiService.apiPost
      if (response.data.message === 'Registrasi Sukses') {
        await fetchUsers(); 
      }
      return response.data.message;
    } catch (error) {
      console.error('Failed to register user', error);
      return 'Failed to register user';
    }
  };

  // Update a user by ID
  const updateUser = async (id: number, updatedUser: { name: string; email: string; role_id: number; password?: string }) => {
    try {
      const response = await apiService.apiPut(`/api/auth/users/${id}`, updatedUser); // Use apiService.apiPut
      if (response.data.message === 'User updated successfully') {
        await fetchUsers(); 
      }
      return response.data.message;
    } catch (error) {
      console.error('Failed to update user', error);
      return 'Failed to update user';
    }
  };

  // Delete a user by ID
  const deleteUser = async (id: number) => {
    try {
      const response = await apiService.apiDelete(`/api/auth/users/${id}`, {}); 
      if (response.data.message === 'USER DELETED!') {
        await fetchUsers(); 
      }
      return response.data.message;
    } catch (error) {
      console.error('Failed to delete user', error);
      return 'Failed to delete user';
    }
  };

  const fetchRole = async () => {
    try {
      const response = await apiService.apiGet("/api/auth/users/roles");
      roles.value = response.data;
    } catch (error) {
      console.error(error);
    }
    
  }

  return {
    users,
    roles,
    user,
    fetchUsers,
    fetchUserById,
    fetchRole,
    registerUser,
    updateUser,
    deleteUser,
  };
});
