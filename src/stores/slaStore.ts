import { defineStore } from "pinia";
import { ref } from "vue";
import { apiService } from "@/utils/apiService";
import { errorHandling } from "@/utils/errorHandling";

export interface SlaPolicy {
  id: number;
  priority_id?: number;
  priority_name: string;
  response_time_minutes: number;
  resolution_time_minutes: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface SlaStats {
  total: number;
  active: number;
  sla_met: number;
  sla_breached: number;
  sla_near_breach?: number;
  compliance_rate_percent: number;
}

export const useSlaStore = defineStore("sla", () => {
  const policies = ref<SlaPolicy[]>([]);
  const stats = ref<SlaStats>({
    total: 0,
    active: 0,
    sla_met: 0,
    sla_breached: 0,
    sla_near_breach: 0,
    compliance_rate_percent: 100,
  });
  const loading = ref<boolean>(false);

  const fetchPolicies = async () => {
    loading.value = true;
    try {
      const response = await apiService.apiGet("/api/auth/sla/policies");
      if (response && response.data) {
        policies.value = Array.isArray(response.data.data)
          ? response.data.data
          : Array.isArray(response.data)
          ? response.data
          : [];
      }
      return policies.value;
    } catch (error) {
      errorHandling(error);
      return [];
    } finally {
      loading.value = false;
    }
  };

  const updatePolicy = async (id: number, payload: { response_time_minutes: number; resolution_time_minutes: number; is_active?: boolean }) => {
    try {
      const response = await apiService.apiPut(`/api/auth/sla/policies/${id}`, payload);
      await fetchPolicies();
      return response;
    } catch (error) {
      errorHandling(error);
      throw error;
    }
  };

  const fetchSlaStats = async () => {
    try {
      const response = await apiService.apiGet("/api/auth/tickets/sla-stats");
      if (response && response.data) {
        const raw = response.data.data || response.data;
        stats.value = {
          total: raw.total || 0,
          active: raw.active || 0,
          sla_met: raw.sla_met || 0,
          sla_breached: raw.sla_breached || 0,
          sla_near_breach: raw.sla_near_breach || 0,
          compliance_rate_percent: raw.compliance_rate_percent !== undefined ? raw.compliance_rate_percent : 100,
        };
      }
      return stats.value;
    } catch (error) {
      console.error("Error fetching SLA stats:", error);
      return stats.value;
    }
  };

  return {
    policies,
    stats,
    loading,
    fetchPolicies,
    updatePolicy,
    fetchSlaStats,
  };
});
