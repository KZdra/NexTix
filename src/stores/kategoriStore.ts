import { defineStore } from 'pinia';
import { reactive, toRefs } from 'vue';
import { errorHandling } from '@/utils/errorHandling';
import { apiService } from '@/utils/apiService';

// Define an interface for Kategori
interface Kategori {
  id: number;
  nama_kategori: string;
  status: string;
  created_at?: string;
  updated_at?: string;
}

export const useKategoriStore = defineStore('kategori', () => {
  // Use reactive for state
  const state = reactive({
    kategoris: [] as Kategori[],
  });

  const fetchKategoris = async () => {
    try {
      const response = await apiService.apiGet('/api/auth/kategoris'); // Use apiService.apiGet
      state.kategoris = response.data.data;
    } catch (error) {
     errorHandling(error);
    }
  };

  const fetchActiveKategoris = async () => {
    try {
      const response = await apiService.apiGet('/api/auth/kategoris/active'); // Use apiService.apiGet
      state.kategoris = response.data.data;
    } catch (error) {
     errorHandling(error);
    }
  };

  const fetchKategori = async (id: number) => {
    try {
      const response = await apiService.apiGet(`/api/auth/kategoris/${id}`); // Use apiService.apiGet
      return response.data.data;
    } catch (error) {
     errorHandling(error);
    }
  };

  const createKategori = async (nama_kategori: string, status: string) => {
    try {
      await apiService.apiPost('/api/auth/kategoris', { nama_kategori, status }); // Use apiService.apiPost
    } catch (error) {
     errorHandling(error);
    }
  };

  const updateKategori = async (id: number, nama_kategori: string, status: string) => {
    try {
      await apiService.apiPut(`/api/auth/kategoris/${id}`, { nama_kategori, status }); 
    } catch (error) {
     errorHandling(error);
    }
  };

  const deleteKategori = async (id: number) => {
    try {
      await apiService.apiDelete(`/api/auth/kategoris/${id}`, {}); // Use apiService.apiDelete
    } catch (error) {
     errorHandling(error);
    }
  };

  return {
    ...toRefs(state),
    fetchKategoris,
    fetchActiveKategoris,
    fetchKategori,
    createKategori,
    updateKategori,
    deleteKategori,
  };
});
