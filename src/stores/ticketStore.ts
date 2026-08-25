import { defineStore } from "pinia";
import { reactive, toRefs } from "vue";
import { errorHandling } from "@/utils/errorHandling";
import { apiService } from "@/utils/apiService";
import axios from "axios";
import dayjs from "dayjs";

export interface Ticket {
  id: number;
  id_ticket?: number;
  user_id: number;
  ticket_number: string;
  ticket_type?: 'incident' | 'service_request' | 'change_request';
  department_id?: number | null;
  department_name?: string | null;
  issue: string;
  status: string;
  clientname: string;
  priority: string;
  assign_by: string;
  kategori_name: string;
  subject: string;
  attachment: string | null;
  attachment_url?: string | null;
  response_due_at?: string | null;
  resolution_due_at?: string | null;
  first_responded_at?: string | null;
  resolved_at?: string | null;
  is_sla_breached?: boolean;
  rating?: number | null;
  created_at: string;
  updated_at: string;
}

export interface TicketQueryParams {
  search?: string;
  page?: number;
  per_page?: number;
  status?: string;
  kategori_id?: number | string;
  priority_id?: number | string;
  department_id?: number | string;
  ticket_type?: string;
}

interface TicketStoreState {
  tickets: Ticket[];
  ticket: Ticket | null;
  total: number;
  currentPage: number;
  lastPage: number;
  perPage: number;
  loading: boolean;
}

export const useTicketStore = defineStore("ticket", () => {
  const state = reactive<TicketStoreState>({
    tickets: [],
    ticket: null,
    total: 0,
    currentPage: 1,
    lastPage: 1,
    perPage: 10,
    loading: false,
  });

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    return dayjs(dateString).format("D MMMM YYYY HH:mm");
  };

  const processTicketList = (data: any) => {
    let items: Ticket[] = [];
    let total = 0;
    let currentPage = 1;
    let lastPage = 1;
    let perPage = 10;

    if (Array.isArray(data)) {
      items = data;
      total = data.length;
    } else if (data && typeof data === 'object') {
      if (Array.isArray(data.data)) {
        items = data.data;
        total = typeof data.total === 'number' ? data.total : data.data.length;
        currentPage = data.current_page || 1;
        lastPage = data.last_page || Math.ceil(total / (data.per_page || 10)) || 1;
        perPage = data.per_page || 10;
      } else if (data.data && Array.isArray(data.data.data)) {
        items = data.data.data;
        total = typeof data.data.total === 'number' ? data.data.total : data.data.data.length;
        currentPage = data.data.current_page || 1;
        lastPage = data.data.last_page || 1;
        perPage = data.data.per_page || 10;
      }
    }

    if (Array.isArray(items)) {
      items.forEach((ticket) => {
        if (ticket.created_at) {
          ticket.created_at = formatDate(ticket.created_at);
        }
      });
    }

    state.tickets = items;
    state.total = total;
    state.currentPage = currentPage;
    state.lastPage = lastPage;
    state.perPage = perPage;
  };

  const fetchTickets = async (params: TicketQueryParams = {}) => {
    state.loading = true;
    try {
      const cleanParams: Record<string, any> = {};
      if (params.search !== undefined && params.search !== '') cleanParams.search = params.search;
      if (params.page) cleanParams.page = params.page;
      if (params.per_page) cleanParams.per_page = params.per_page;
      if (params.status && params.status !== 'all') cleanParams.status = params.status;
      if (params.department_id) cleanParams.department_id = params.department_id;
      if (params.ticket_type && params.ticket_type !== 'all') cleanParams.ticket_type = params.ticket_type;

      const response = await apiService.apiGet("/api/auth/tickets", cleanParams);
      if (response && response.data) {
        processTicketList(response.data);
      }
    } catch (error) {
      errorHandling(error);
    } finally {
      state.loading = false;
    }
  };

  const fetchUserTickets = async (params: TicketQueryParams = {}) => {
    state.loading = true;
    try {
      const cleanParams: Record<string, any> = {};
      if (params.search !== undefined && params.search !== '') cleanParams.search = params.search;
      if (params.page) cleanParams.page = params.page;
      if (params.per_page) cleanParams.per_page = params.per_page;
      if (params.status && params.status !== 'all') cleanParams.status = params.status;
      if (params.department_id) cleanParams.department_id = params.department_id;
      if (params.ticket_type && params.ticket_type !== 'all') cleanParams.ticket_type = params.ticket_type;

      const response = await apiService.apiGet("/api/auth/tickets/user", cleanParams);
      if (response && response.data) {
        processTicketList(response.data);
      }
    } catch (error) {
      errorHandling(error);
    } finally {
      state.loading = false;
    }
  };

  const fetchTicket = async (ticketNumber: string) => {
    try {
      const response = await apiService.apiGet(
        `/api/auth/tickets/${ticketNumber}`
      );
      const ticket = response.data.data || response.data;

      if (ticket && ticket.created_at) {
        ticket.created_at = formatDate(ticket.created_at);
      }

      state.ticket = ticket;
      return response.data;
    } catch (error) {
      errorHandling(error);
    }
  };

  const addTicket = async (
    issue: string,
    subject: string,
    kategori_id: number,
    priority_id: number,
    attachment?: File,
    department_id?: number,
    ticket_type?: string
  ) => {
    try {
      const formData = new FormData();
      formData.append("issue", issue);
      formData.append("subject", subject);
      formData.append("kategori_id", kategori_id.toString());
      formData.append("priority_id", priority_id.toString());
      if (department_id) {
        formData.append("department_id", department_id.toString());
      }
      if (ticket_type) {
        formData.append("ticket_type", ticket_type);
      }
      if (attachment) {
        formData.append("attachment", attachment);
      }

      await apiService.apiPost("/api/auth/tickets", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } catch (error) {
      errorHandling(error);
      throw error;
    }
  };

  const updateTicket = async (ticketNumber: string, status: string) => {
    try {
      await apiService.apiPut(`/api/auth/tickets/${ticketNumber}`, { status });
    } catch (error) {
      errorHandling(error);
      throw error;
    }
  };

  const deleteTicket = async (ticketNumber: string) => {
    try {
      await apiService.apiDelete(`/api/auth/tickets/${ticketNumber}`, {});
      state.tickets = state.tickets.filter(
        (ticket) => ticket.ticket_number !== ticketNumber
      );
    } catch (error) {
      errorHandling(error);
      throw error;
    }
  };

  const downloadAttachment = async (ticketNumber: string) => {
    try {
      const ticket = state.tickets.find(
        (t) => t.ticket_number === ticketNumber
      ) || state.ticket;
      if (!ticket || !ticket.attachment) {
        console.error("Attachment not found for this ticket");
        return;
      }

      await apiService.apiDownload(
        `/api/auth/tickets/download/${ticketNumber}`,
        ticket.attachment
      );
    } catch (error) {
      console.error("Error downloading attachment:", error);
      errorHandling(error);
    }
  };

  const downloadBAP = async (ticketNumber: string) => {
    try {
      const token = localStorage.getItem('token') || '';
      const response = await axios.get(`http://127.0.0.1:8000/api/auth/tickets/${ticketNumber}/export-bap`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
        },
        responseType: 'blob',
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `BAPP_${ticketNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error("Error downloading BAP:", error);
      errorHandling(error);
    }
  };

  return {
    ...toRefs(state),
    fetchTickets,
    fetchTicket,
    fetchUserTickets,
    addTicket,
    updateTicket,
    deleteTicket,
    downloadAttachment,
    downloadBAP,
  };
});
