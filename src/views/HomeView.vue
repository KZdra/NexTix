<template>
  <MainLayout>
    <div class="max-w-8xl">
      <div class="flex items-center">
        <h1 class="text-xl font-bold text-gray-500">
          Hello,<span>{{ authStore.user?.name }}</span>
        </h1>
      </div>
      <div class="mt-2">
        <h1 v-if="canSeeAllTickets" class="text-3xl font-bold text-gray-900 mb-2">Statistik</h1>
        <h1 v-else class="text-3xl font-bold text-gray-900 mb-2">Ticket Anda</h1>
        <el-row :gutter="16">
          <el-col :span="8">
            <div class="statistic-card">
              <el-statistic :value="statisticStore.ticketStats.open">
                <template #title>
                  <div style="display: inline-flex; align-items: center">
                    Ticket Open
                  </div>
                </template>
              </el-statistic>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="statistic-card">
              <el-statistic :value="statisticStore.ticketStats.closed">
                <template #title>
                  <div style="display: inline-flex; align-items: center">
                    Ticket Closed
                  </div>
                </template>
              </el-statistic>
            </div>
          </el-col>
          <el-col :span="8" v-if="canSeeUsersRegistered">
            <div class="statistic-card">
              <el-statistic :value="statisticStore.userStats.UserRegistered">
                <template #title>
                  <div style="display: inline-flex; align-items: center">
                    User Registered
                  </div>
                </template>
              </el-statistic>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </MainLayout>
</template>
<script setup lang="ts">
import MainLayout from "@/components/layouts/MainLayout.vue";
import { useAuthStore } from "@/stores/authStore";
import { useStatisticStore } from "@/stores/statisticStore";
import { computed, onMounted } from "vue";
const authStore = useAuthStore();
const statisticStore = useStatisticStore();
type UserRole = "admin" | "support" | "client";
const userRoles = computed<UserRole[]>( () => [authStore.user?.role].filter(Boolean) as UserRole[]);
// Role-based access control
const canSeeUsersRegistered = computed(() => userRoles.value.includes("admin"));
const canSeeAllTickets = computed(() =>userRoles.value.includes("admin")|| userRoles.value.includes("support"));
const canSeeOwnTickets = computed(() => userRoles.value.includes("client"));
onMounted(async () => {
  try {
    await authStore.refreshToken();
    if(canSeeAllTickets.value){
       await statisticStore.fetchTicketStats();
    } 
    if(canSeeUsersRegistered.value){
        await statisticStore.fetchTicketStats();
        await statisticStore.fetchUsersStats();
    } 
    if(canSeeOwnTickets.value){
        await statisticStore.fetchTicketStatsPerUser();
    }

    console.log(canSeeAllTickets.value,canSeeOwnTickets.value,canSeeUsersRegistered.value);
  } catch (error) {
    console.error(error);
  }
});

</script>
<style scoped>
:global(h2#card-usage ~ .example .example-showcase) {
  background-color: var(--el-fill-color) !important;
}

.el-statistic {
  --el-statistic-content-font-size: 28px;
}

.statistic-card {
  height: 100%;
  padding: 20px;
  border-radius: 4px;
  background-color: var(--el-bg-color-overlay);
}

.statistic-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  font-size: 12px;
  color: var(--el-text-color-regular);
  margin-top: 16px;
}

.statistic-footer .footer-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.statistic-footer .footer-item span:last-child {
  display: inline-flex;
  align-items: center;
  margin-left: 4px;
}

.green {
  color: var(--el-color-success);
}
.red {
  color: var(--el-color-error);
}
</style>
