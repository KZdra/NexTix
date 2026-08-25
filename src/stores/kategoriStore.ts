import { defineStore } from 'pinia';
import { reactive, toRefs } from 'vue';
import { errorHandling } from '@/utils/errorHandling';
import { apiService } from '@/utils/apiService';

export interface Kategori {
  id: number;
  nama_kategori: string;
  status: string;
  created_at?: string;
  updated_at?: string;
}

export interface KategoriQueryParams {
  search?: string;
  page?: number;
  per_page?: number;
  status?: string;
}

interface KategoriStoreState {
  kategoris: Kategori[];
  total: number;
  currentPage: number;
  lastPage: number;
  perPage: number;
  loading: boolean;
}

export const useKategoriStore = defineStore('kategori', () => {
  const state = reactive<KategoriStoreState>({
    kategoris: [],
    total: 0,
    currentPage: 1,
    lastPage: 1,
    perPage: 10,
    loading: false,
  });

  const processKategoriList = (data: any) => {
    let items: Kategori[] = [];
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

    state.kategoris = items;
    state.total = tot;
    state.currentPage = curr;
    state.lastPage = last;
    state.perPage = per;
  };

  const fetchKategoris = async (params: KategoriQueryParams = {}) => {
    state.loading = true;
    try {
      const cleanParams: Record<string, any> = {};
      if (params.search !== undefined && params.search !== '') cleanParams.search = params.search;
      if (params.page) cleanParams.page = params.page;
      if (params.per_page) cleanParams.per_page = params.per_page;
      if (params.status) cleanParams.status = params.status;

      const response = await apiService.apiGet('/api/auth/kategoris', cleanParams);
      if (response && response.data) {
        processKategoriList(response.data);
      }
    } catch (error) {
      errorHandling(error);
    } finally {
      state.loading = false;
    }
  };

  const fetchActiveKategoris = async () => {
    try {
      const response = await apiService.apiGet('/api/auth/kategoris/active');
      if (response && response.data) {
        const items = Array.isArray(response.data)
          ? response.data
          : (Array.isArray(response.data.data) ? response.data.data : []);
        state.kategoris = items;
      }
    } catch (error) {
      errorHandling(error);
    }
  };

  const fetchKategori = async (id: number) => {
    try {
      const response = await apiService.apiGet(`/api/auth/kategoris/${id}`);
      return response.data.data || response.data;
    } catch (error) {
      errorHandling(error);
    }
  };

  const createKategori = async (nama_kategori: string, status: string) => {
    try {
      await apiService.apiPost('/api/auth/kategoris', { nama_kategori, status });
      await fetchKategoris({ page: state.currentPage, per_page: state.perPage });
    } catch (error) {
      errorHandling(error);
    }
  };

  const updateKategori = async (id: number, nama_kategori: string, status: string) => {
    try {
      await apiService.apiPut(`/api/auth/kategoris/${id}`, { nama_kategori, status });
      await fetchKategoris({ page: state.currentPage, per_page: state.perPage });
    } catch (error) {
      errorHandling(error);
    }
  };

  const deleteKategori = async (id: number) => {
    try {
      await apiService.apiDelete(`/api/auth/kategoris/${id}`, {});
      await fetchKategoris({ page: state.currentPage, per_page: state.perPage });
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
