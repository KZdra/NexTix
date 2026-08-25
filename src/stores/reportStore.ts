import { defineStore } from 'pinia';
import { ref } from 'vue';
import { apiService } from '@/utils/apiService';
import { errorHandling } from '@/utils/errorHandling';
import axios from 'axios';
import dayjs from 'dayjs';

interface Report {
  assign_by: string;
  clientname: string;
  created_at: string;
  id_ticket: number;
  issue: string;
  kategori_id: number;
  kategori_name: string;
  status: string;
  subject: string;
  ticket_number: string;
  updated_at: string;
  user_id: number;
}

export interface ReportFilter {
  startDate?: string;
  endDate?: string;
  categoryId?: number;
  status?: string;
}

export const useReportStore = defineStore('report', () => {
  const reports = ref<Report[]>([]);
  const loading = ref<boolean>(false);
  const exporting = ref<boolean>(false);

  const fetchReports = async (filters: ReportFilter = {}) => {
    loading.value = true;
    try {
      const response = await apiService.apiGet('/api/auth/report', {
        start_date: filters.startDate || undefined,
        end_date: filters.endDate || undefined,
        category_id: filters.categoryId && filters.categoryId > 0 ? filters.categoryId : undefined,
        status: filters.status && filters.status !== 'all' ? filters.status : undefined,
      });

      if (response && response.data) {
        reports.value = Array.isArray(response.data.data)
          ? response.data.data
          : Array.isArray(response.data)
          ? response.data
          : [];
      }
      return reports.value;
    } catch (error) {
      errorHandling(error);
      return [];
    } finally {
      loading.value = false;
    }
  };

  const exportReport = async (type: 'pdf' | 'excel', filters: ReportFilter = {}) => {
    exporting.value = true;
    try {
      const endpoint = type === 'pdf' 
        ? '/api/auth/report/export/pdf' 
        : '/api/auth/report/export/excel';

      const token = localStorage.getItem('token') || '';

      const response = await axios.get(`http://127.0.0.1:8000${endpoint}`, {
        params: {
          start_date: filters.startDate || undefined,
          end_date: filters.endDate || undefined,
          category_id: filters.categoryId && filters.categoryId > 0 ? filters.categoryId : undefined,
          status: filters.status && filters.status !== 'all' ? filters.status : undefined,
        },
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
        },
        responseType: 'blob',
      });

      // Trigger download di browser
      const blob = new Blob([response.data]);
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `Laporan_Tiket_${Date.now()}.${type === 'pdf' ? 'pdf' : 'xlsx'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error(`Gagal mengekspor ${type}:`, error);
      errorHandling(error);
    } finally {
      exporting.value = false;
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return dayjs(dateString).format('D MMMM YYYY');
  };

  return {
    reports,
    loading,
    exporting,
    fetchReports,
    exportReport,
    formatDate,
  };
});
