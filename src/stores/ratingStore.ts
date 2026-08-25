import { defineStore } from "pinia";
import { ref } from "vue";
import { apiService } from "@/utils/apiService";
import { errorHandling } from "@/utils/errorHandling";

export interface TicketRating {
  id?: number;
  ticket_id: number;
  user_id?: number;
  user_name?: string;
  rating: number; // 1 - 5
  feedback?: string;
  created_at?: string;
}

export interface CsatReport {
  average_score: number;
  total_reviews: number;
  satisfaction_rate_percent: number;
  distribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  recent_reviews: Array<{
    ticket_number: string;
    client_name: string;
    rating: number;
    feedback: string;
    created_at: string;
  }>;
}

export const useRatingStore = defineStore("rating", () => {
  const currentRating = ref<TicketRating | null>(null);
  const csatReport = ref<CsatReport | null>(null);
  const loading = ref<boolean>(false);
  const submitting = ref<boolean>(false);

  const fetchTicketRating = async (ticketId: number) => {
    loading.value = true;
    try {
      const response = await apiService.apiGet(`/api/auth/tickets/${ticketId}/rating`);
      if (response && response.data) {
        const raw = response.data.data !== undefined ? response.data.data : response.data;
        if (raw && typeof raw === "object" && typeof raw.rating === "number" && raw.rating > 0) {
          currentRating.value = raw;
        } else {
          currentRating.value = null;
        }
      } else {
        currentRating.value = null;
      }
      return currentRating.value;
    } catch (error) {
      currentRating.value = null;
      return null;
    } finally {
      loading.value = false;
    }
  };

  const submitRating = async (ticketId: number, rating: number, feedback?: string) => {
    submitting.value = true;
    try {
      const response = await apiService.apiPost(`/api/auth/tickets/${ticketId}/rate`, {
        rating,
        feedback: feedback || undefined,
      });
      if (response && response.data) {
        const result = response.data.data || { ticket_id: ticketId, rating, feedback };
        currentRating.value = result;
      }
      return response;
    } catch (error) {
      errorHandling(error);
      throw error;
    } finally {
      submitting.value = false;
    }
  };

  const fetchCsatReport = async () => {
    loading.value = true;
    try {
      const response = await apiService.apiGet("/api/auth/report/csat");
      if (response && response.data) {
        csatReport.value = response.data.data || response.data;
      }
      return csatReport.value;
    } catch (error) {
      console.error("Error fetching CSAT report:", error);
      return null;
    } finally {
      loading.value = false;
    }
  };

  return {
    currentRating,
    csatReport,
    loading,
    submitting,
    fetchTicketRating,
    submitRating,
    fetchCsatReport,
  };
});
