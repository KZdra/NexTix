<template>
  <MainLayout>
    <div class="max-w-7xl mx-auto space-y-6 pb-12">
      <!-- 1. Header Section -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <div class="inline-flex items-center space-x-2 text-xs font-semibold text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full mb-1.5">
            <font-awesome-icon icon="fa-solid fa-shield-halved" class="text-xs" />
            <span>Kepatuhan SPBE & Audit Trail</span>
          </div>
          <h1 class="text-2xl font-black tracking-tight text-gray-900">
            Log Aktivitas & Jejak Audit
          </h1>
          <p class="text-xs text-gray-500 mt-0.5">
            Rekam jejak setiap perubahan status tiket, mutasi data, dan aktivitas sistem untuk keperluan audit resmi
          </p>
        </div>

        <button
          @click="loadLogs"
          class="inline-flex items-center space-x-2 px-4 py-2.5 font-bold text-xs text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all"
        >
          <font-awesome-icon icon="fa-solid fa-rotate" :class="{ 'animate-spin': auditStore.loading }" />
          <span>Segarkan Log</span>
        </button>
      </div>

      <!-- 2. Filter Bar -->
      <div class="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
        <!-- Search -->
        <div class="sm:col-span-4 relative">
          <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
            <font-awesome-icon icon="fa-solid fa-magnifying-glass" class="text-xs" />
          </div>
          <input
            v-model="searchQuery"
            @input="handleSearch"
            type="text"
            placeholder="Cari user, aksi, atau entitas..."
            class="w-full pl-9 pr-4 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 bg-gray-50/50 hover:bg-white transition-colors"
          />
        </div>

        <!-- Action Filter -->
        <div class="sm:col-span-3">
          <select
            v-model="selectedAction"
            @change="loadLogs"
            class="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 bg-gray-50/50 font-semibold"
          >
            <option value="all">Semua Tipe Aksi</option>
            <option value="TICKET_CREATED">TICKET_CREATED</option>
            <option value="STATUS_CHANGED">STATUS_CHANGED</option>
            <option value="COMMENT_ADDED">COMMENT_ADDED</option>
            <option value="DEPARTMENT_CREATED">DEPARTMENT_CREATED</option>
            <option value="RATING_SUBMITTED">RATING_SUBMITTED</option>
          </select>
        </div>

        <!-- Entity Filter -->
        <div class="sm:col-span-3">
          <select
            v-model="selectedEntity"
            @change="loadLogs"
            class="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 bg-gray-50/50 font-semibold"
          >
            <option value="all">Semua Entitas</option>
            <option value="Ticket">Ticket</option>
            <option value="User">User</option>
            <option value="Department">Department</option>
            <option value="Rating">Rating</option>
          </select>
        </div>

        <!-- Per Page -->
        <div class="sm:col-span-2 flex items-center justify-end space-x-2 text-xs text-gray-500">
          <span>Baris:</span>
          <select
            v-model="perPage"
            @change="loadLogs"
            class="px-2 py-1.5 border border-gray-300 rounded-lg text-xs font-semibold bg-white"
          >
            <option :value="10">10</option>
            <option :value="20">20</option>
            <option :value="50">50</option>
          </select>
        </div>
      </div>

      <!-- Audit Log Table -->
      <div class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 text-left text-sm">
            <thead class="bg-gray-50/80 text-gray-600 font-semibold text-xs uppercase tracking-wider">
              <tr>
                <th class="px-6 py-3.5">Waktu</th>
                <th class="px-6 py-3.5">Pengguna</th>
                <th class="px-6 py-3.5">Aksi</th>
                <th class="px-6 py-3.5">Entitas Terkait</th>
                <th class="px-6 py-3.5">IP Address</th>
                <th class="px-6 py-3.5 text-right">Rincian Perubahan</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white">
              <tr
                v-for="log in auditStore.auditLogs"
                :key="log.id"
                class="hover:bg-purple-50/30 transition-colors"
              >
                <!-- Timestamp -->
                <td class="px-6 py-4 whitespace-nowrap text-xs text-gray-500 font-mono">
                  {{ formatDate(log.created_at) }}
                </td>

                <!-- User -->
                <td class="px-6 py-4 whitespace-nowrap text-xs font-bold text-gray-900">
                  <div class="flex items-center space-x-2">
                    <div class="w-6 h-6 rounded-full bg-purple-100 text-purple-700 font-bold text-[10px] flex items-center justify-center">
                      {{ (log.user_name || 'S').charAt(0).toUpperCase() }}
                    </div>
                    <span>{{ log.user_name || 'System Auto' }}</span>
                  </div>
                </td>

                <!-- Action -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-md font-mono text-[11px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
                    {{ log.action }}
                  </span>
                </td>

                <!-- Entity -->
                <td class="px-6 py-4 whitespace-nowrap text-xs">
                  <span class="font-semibold text-gray-800">{{ log.entity_type }}</span>
                  <span class="font-mono text-gray-500 ml-1">#{{ log.entity_id }}</span>
                </td>

                <!-- IP Address -->
                <td class="px-6 py-4 whitespace-nowrap text-xs font-mono text-gray-500">
                  {{ log.ip_address || '127.0.0.1' }}
                </td>

                <!-- Detail button -->
                <td class="px-6 py-4 whitespace-nowrap text-right">
                  <button
                    @click="viewLogDetails(log)"
                    class="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-600 hover:text-white border border-purple-200 hover:border-purple-600 rounded-lg transition-all"
                  >
                    <font-awesome-icon icon="fa-solid fa-code-compare" class="text-xs" />
                    <span>Lihat Nilai</span>
                  </button>
                </td>
              </tr>

              <!-- Empty state -->
              <tr v-if="auditStore.auditLogs.length === 0">
                <td colspan="6" class="py-14 text-center text-gray-400 space-y-2">
                  <font-awesome-icon icon="fa-solid fa-shield-halved" class="text-3xl" />
                  <h4 class="text-sm font-bold text-gray-700">Belum Ada Catatan Audit</h4>
                  <p class="text-xs text-gray-500">Semua aktivitas sistem akan secara otomatis dicatat di sini.</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <span class="text-gray-500">
            Menampilkan {{ auditStore.auditLogs.length }} dari {{ auditStore.total }} log aktivitas
          </span>

          <div class="flex items-center space-x-2">
            <button
              :disabled="auditStore.currentPage <= 1"
              @click="handlePageChange(auditStore.currentPage - 1)"
              class="px-3 py-1.5 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 disabled:opacity-40 transition-colors"
            >
              Sebelumnya
            </button>
            <span class="font-bold text-gray-700 px-2">
              Hal. {{ auditStore.currentPage }} / {{ auditStore.lastPage }}
            </span>
            <button
              :disabled="auditStore.currentPage >= auditStore.lastPage"
              @click="handlePageChange(auditStore.currentPage + 1)"
              class="px-3 py-1.5 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 disabled:opacity-40 transition-colors"
            >
              Selanjutnya
            </button>
          </div>
        </div>
      </div>

      <!-- 4. Log Detail JSON Modal -->
      <el-dialog
        v-model="detailModalVisible"
        title="Rincian Nilai Audit Log"
        width="600px"
        destroy-on-close
        class="rounded-2xl"
      >
        <template #header>
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
              <font-awesome-icon icon="fa-solid fa-code-compare" class="text-base" />
            </div>
            <div>
              <h3 class="text-base font-bold text-gray-900">Perubahan Data (Old vs New)</h3>
              <p class="text-xs text-gray-500">Audit Trail: {{ selectedLog?.action }}</p>
            </div>
          </div>
        </template>

        <div class="space-y-4 pt-1 text-xs">
          <div class="grid grid-cols-2 gap-3 bg-gray-50 p-3 rounded-xl border border-gray-200">
            <div>
              <span class="text-gray-400 block text-[10px]">WAKTU</span>
              <span class="font-bold font-mono">{{ formatDate(selectedLog?.created_at) }}</span>
            </div>
            <div>
              <span class="text-gray-400 block text-[10px]">PENGGUNA</span>
              <span class="font-bold">{{ selectedLog?.user_name || 'System' }}</span>
            </div>
            <div>
              <span class="text-gray-400 block text-[10px]">IP ADDRESS</span>
              <span class="font-bold font-mono">{{ selectedLog?.ip_address || '-' }}</span>
            </div>
            <div>
              <span class="text-gray-400 block text-[10px]">ENTITAS ID</span>
              <span class="font-bold">{{ selectedLog?.entity_type }} #{{ selectedLog?.entity_id }}</span>
            </div>
          </div>

          <div class="space-y-1.5">
            <label class="font-bold text-gray-700">Nilai Sebelum (Old Values):</label>
            <pre class="bg-gray-900 text-emerald-400 p-3 rounded-xl font-mono text-[11px] overflow-x-auto max-h-40">{{ JSON.stringify(selectedLog?.old_values, null, 2) || 'null' }}</pre>
          </div>

          <div class="space-y-1.5">
            <label class="font-bold text-gray-700">Nilai Sesudah (New Values):</label>
            <pre class="bg-gray-900 text-cyan-400 p-3 rounded-xl font-mono text-[11px] overflow-x-auto max-h-40">{{ JSON.stringify(selectedLog?.new_values, null, 2) || 'null' }}</pre>
          </div>
        </div>

        <template #footer>
          <div class="flex justify-end pt-3 border-t border-gray-100">
            <el-button @click="detailModalVisible = false" size="large">Tutup</el-button>
          </div>
        </template>
      </el-dialog>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import MainLayout from "@/components/layouts/MainLayout.vue";
import { ref, onMounted } from "vue";
import { useAuditLogStore, type AuditLog } from "@/stores/auditLogStore";
import dayjs from "dayjs";

const auditStore = useAuditLogStore();

const searchQuery = ref("");
const selectedAction = ref("all");
const selectedEntity = ref("all");
const perPage = ref(15);

const detailModalVisible = ref(false);
const selectedLog = ref<AuditLog | null>(null);

onMounted(() => {
  loadLogs();
});

let debounceTimer: ReturnType<typeof setTimeout> | null = null;
const handleSearch = () => {
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    loadLogs(1);
  }, 400);
};

const handlePageChange = (page: number) => {
  loadLogs(page);
};

const loadLogs = (page: number = 1) => {
  auditStore.fetchAuditLogs({
    search: searchQuery.value,
    action: selectedAction.value,
    entity_type: selectedEntity.value,
    page,
    per_page: perPage.value,
  });
};

const viewLogDetails = (log: AuditLog) => {
  selectedLog.value = log;
  detailModalVisible.value = true;
};

const formatDate = (dateString?: string) => {
  if (!dateString) return "-";
  return dayjs(dateString).format("DD/MM/YYYY HH:mm:ss");
};
</script>

<style scoped>
:deep(.el-dialog) {
  border-radius: 1.25rem !important;
  overflow: hidden;
}
</style>
