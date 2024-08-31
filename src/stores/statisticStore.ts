import { defineStore } from 'pinia';
import { reactive, toRefs } from 'vue';
import { apiService } from '@/utils/apiService';

// Define an interface for TicketStats and UserStats
interface TicketStats {
  open?: number;
  in_progress?:number
  closed?: number;
}

interface UserStats {
  UserRegistered?: number;
}

export const useStatisticStore = defineStore('statistic', () => {
  const state = reactive({
    ticketStats: {} as TicketStats,
    userStats: {} as UserStats,
  });

  const fetchTicketStats = async () => {
    try {
      const response = await apiService.apiGet('/api/auth/statistics/tickets');
      state.ticketStats = response.data.data.Ticket;
    } catch (error) {
      console.error('Error fetching ticket stats:', error);
    }
  };

  const fetchUsersStats= async () => {
    try {
        const response = await apiService.apiGet('/api/auth/statistics/users');
        state.userStats = response.data.data;
    } catch (error) {
        console.error('Error fetching ticket stats:', error);
    }
  };

  const fetchTicketStatsPerUser = async () => {
    try {
        const response = await apiService.apiGet('/api/auth/statistics/usertickets');
        state.ticketStats = response.data.data.Ticket;
      } catch (error) {
        console.error('Error fetching ticket stats:', error);
      }
  }

  return {
    ...toRefs(state),
    fetchTicketStats,
    fetchUsersStats,
    fetchTicketStatsPerUser,
  };
});
