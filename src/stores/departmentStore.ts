import { defineStore } from "pinia";
import { ref } from "vue";
import { apiService } from "@/utils/apiService";
import { errorHandling } from "@/utils/errorHandling";

export interface Department {
  id: number;
  name: string;
  code: string;
  description?: string;
  is_active: boolean;
  tickets_count?: number;
  created_at?: string;
  updated_at?: string;
}

export const useDepartmentStore = defineStore("department", () => {
  const departments = ref<Department[]>([]);
  const activeDepartments = ref<Department[]>([]);
  const department = ref<Department | null>(null);
  const loading = ref<boolean>(false);
  const total = ref<number>(0);
  const currentPage = ref<number>(1);
  const lastPage = ref<number>(1);
  const perPage = ref<number>(10);

  const fetchDepartments = async (params: { search?: string; page?: number; per_page?: number } = {}) => {
    loading.value = true;
    try {
      const response = await apiService.apiGet("/api/auth/departments", {
        search: params.search || undefined,
        page: params.page || 1,
        per_page: params.per_page || 10,
      });

      if (response && response.data) {
        const res = response.data;
        let items: Department[] = [];
        let totalCount = 0;
        let current = 1;
        let last = 1;
        let per = 10;

        if (res.data && typeof res.data === "object" && Array.isArray(res.data.data)) {
          items = res.data.data;
          totalCount = typeof res.data.total === "number" ? res.data.total : items.length;
          current = res.data.current_page || 1;
          last = res.data.last_page || 1;
          per = res.data.per_page || 10;
        } else if (res.data && Array.isArray(res.data)) {
          items = res.data;
          totalCount = res.total || items.length;
          current = res.current_page || 1;
          last = res.last_page || 1;
          per = res.per_page || 10;
        } else if (Array.isArray(res)) {
          items = res;
          totalCount = res.length;
        }

        departments.value = items;
        total.value = totalCount;
        currentPage.value = current;
        lastPage.value = last;
        perPage.value = per;
      }
      return departments.value;
    } catch (error) {
      errorHandling(error);
      return [];
    } finally {
      loading.value = false;
    }
  };

  const fetchActiveDepartments = async () => {
    try {
      const response = await apiService.apiGet("/api/auth/departments/active");
      if (response && response.data) {
        activeDepartments.value = Array.isArray(response.data.data)
          ? response.data.data
          : Array.isArray(response.data)
          ? response.data
          : [];
      }
      return activeDepartments.value;
    } catch (error) {
      errorHandling(error);
      return [];
    }
  };

  const fetchDepartment = async (id: number) => {
    loading.value = true;
    try {
      const response = await apiService.apiGet(`/api/auth/departments/${id}`);
      if (response && response.data) {
        department.value = response.data.data || response.data;
      }
      return department.value;
    } catch (error) {
      errorHandling(error);
      return null;
    } finally {
      loading.value = false;
    }
  };

  const createDepartment = async (payload: { name: string; code: string; description?: string; is_active?: boolean }) => {
    try {
      const response = await apiService.apiPost("/api/auth/departments", payload);
      await fetchDepartments();
      return response;
    } catch (error) {
      errorHandling(error);
      throw error;
    }
  };

  const updateDepartment = async (id: number, payload: { name: string; code: string; description?: string; is_active?: boolean }) => {
    try {
      const response = await apiService.apiPut(`/api/auth/departments/${id}`, payload);
      await fetchDepartments();
      return response;
    } catch (error) {
      errorHandling(error);
      throw error;
    }
  };

  const deleteDepartment = async (id: number) => {
    try {
      const response = await apiService.apiDelete(`/api/auth/departments/${id}`, {});
      await fetchDepartments();
      return response;
    } catch (error) {
      errorHandling(error);
      throw error;
    }
  };

  return {
    departments,
    activeDepartments,
    department,
    loading,
    total,
    currentPage,
    lastPage,
    perPage,
    fetchDepartments,
    fetchActiveDepartments,
    fetchDepartment,
    createDepartment,
    updateDepartment,
    deleteDepartment,
  };
});
