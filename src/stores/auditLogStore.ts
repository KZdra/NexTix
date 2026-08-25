import { defineStore } from "pinia";
import { ref } from "vue";
import { apiService } from "@/utils/apiService";
import { errorHandling } from "@/utils/errorHandling";

export interface AuditLog {
  id: number;
  user_id?: number;
  user_name?: string;
  action: string;
  entity_type: string;
  entity_id: number;
  old_values?: any;
  new_values?: any;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

export const useAuditLogStore = defineStore("auditLog", () => {
  const auditLogs = ref<AuditLog[]>([]);
  const loading = ref<boolean>(false);
  const total = ref<number>(0);
  const currentPage = ref<number>(1);
  const lastPage = ref<number>(1);
  const perPage = ref<number>(15);

  const fetchAuditLogs = async (params: {
    search?: string;
    action?: string;
    entity_type?: string;
    start_date?: string;
    end_date?: string;
    page?: number;
    per_page?: number;
  } = {}) => {
    loading.value = true;
    try {
      const response = await apiService.apiGet("/api/auth/audit-logs", {
        search: params.search || undefined,
        action: params.action && params.action !== "all" ? params.action : undefined,
        entity_type: params.entity_type && params.entity_type !== "all" ? params.entity_type : undefined,
        start_date: params.start_date || undefined,
        end_date: params.end_date || undefined,
        page: params.page || 1,
        per_page: params.per_page || 15,
      });

      if (response && response.data) {
        const res = response.data;
        let items: AuditLog[] = [];
        let totalCount = 0;
        let current = 1;
        let last = 1;
        let per = 15;

        if (res.data && typeof res.data === "object" && Array.isArray(res.data.data)) {
          items = res.data.data;
          totalCount = typeof res.data.total === "number" ? res.data.total : items.length;
          current = res.data.current_page || 1;
          last = res.data.last_page || 1;
          per = res.data.per_page || 15;
        } else if (res.data && Array.isArray(res.data)) {
          items = res.data;
          totalCount = res.total || items.length;
          current = res.current_page || 1;
          last = res.last_page || 1;
          per = res.per_page || 15;
        } else if (Array.isArray(res)) {
          items = res;
          totalCount = res.length;
        }

        auditLogs.value = items;
        total.value = totalCount;
        currentPage.value = current;
        lastPage.value = last;
        perPage.value = per;
      }
      return auditLogs.value;
    } catch (error) {
      errorHandling(error);
      return [];
    } finally {
      loading.value = false;
    }
  };

  return {
    auditLogs,
    loading,
    total,
    currentPage,
    lastPage,
    perPage,
    fetchAuditLogs,
  };
});
