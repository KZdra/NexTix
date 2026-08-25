<template>
  <MainLayout>
    <div class="max-w-7xl mx-auto space-y-6 pb-12">
      <!-- Page Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <div class="inline-flex items-center space-x-2 text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full mb-1.5">
            <font-awesome-icon icon="fa-solid fa-ticket" class="text-xs" />
            <span>{{ isClient ? 'Tiket Pengaduan Mandiri' : 'Helpdesk Queue' }}</span>
          </div>
          <h1 class="text-2xl font-black tracking-tight text-gray-900">
            {{ isClient ? 'Daftar Tiket Anda' : 'Semua Tiket Masuk' }}
          </h1>
          <p class="text-xs text-gray-500 mt-0.5">
            {{ isClient ? 'Pantau seluruh tiket yang pernah Anda ajukan dan kelanjutan solusinya' : 'Kelola tiket pengaduan, pantau SLA, dan koordinasikan penanganan dengan teknisi' }}
          </p>
        </div>

        <button
          @click="openAddDialog"
          class="inline-flex items-center justify-center space-x-2 px-5 py-2.5 font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 active:scale-95 rounded-xl shadow-md shadow-blue-500/20 transition-all duration-150"
        >
          <font-awesome-icon icon="fa-solid fa-circle-plus" class="text-base" />
          <span>Ajukan Tiket Baru</span>
        </button>
      </div>

      <!-- Filters & Search Toolbar -->
      <div class="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4">
        <!-- Status Filter Tabs -->
        <div class="flex flex-wrap items-center gap-2 border-b border-gray-100 pb-4">
          <button
            @click="handleStatusChange('')"
            :class="selectedStatus === '' ? 'bg-gray-900 text-white font-bold' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 font-medium'"
            class="px-3.5 py-1.5 rounded-lg text-xs transition-all flex items-center gap-1.5"
          >
            <span>Semua Tiket</span>
          </button>

          <button
            @click="handleStatusChange('open')"
            :class="selectedStatus === 'open' ? 'bg-blue-600 text-white font-bold' : 'bg-blue-50 text-blue-700 hover:bg-blue-100 font-medium'"
            class="px-3.5 py-1.5 rounded-lg text-xs transition-all flex items-center gap-1.5"
          >
            <span class="w-1.5 h-1.5 rounded-full bg-current"></span>
            <span>Open (Menunggu)</span>
          </button>

          <button
            @click="handleStatusChange('in_progress')"
            :class="selectedStatus === 'in_progress' ? 'bg-amber-600 text-white font-bold' : 'bg-amber-50 text-amber-700 hover:bg-amber-100 font-medium'"
            class="px-3.5 py-1.5 rounded-lg text-xs transition-all flex items-center gap-1.5"
          >
            <span class="w-1.5 h-1.5 rounded-full bg-current"></span>
            <span>In Progress (Diproses)</span>
          </button>

          <button
            @click="handleStatusChange('closed')"
            :class="selectedStatus === 'closed' ? 'bg-emerald-600 text-white font-bold' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-medium'"
            class="px-3.5 py-1.5 rounded-lg text-xs transition-all flex items-center gap-1.5"
          >
            <span class="w-1.5 h-1.5 rounded-full bg-current"></span>
            <span>Closed (Selesai)</span>
          </button>
        </div>

        <!-- Search & Secondary Filters -->
        <div class="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          <!-- Search input -->
          <div class="sm:col-span-5 relative">
            <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <font-awesome-icon icon="fa-solid fa-magnifying-glass" class="text-xs" />
            </div>
            <input
              type="text"
              v-model="searchQuery"
              @input="handleSearchInput"
              @keyup.enter="executeRemoteFetch(1)"
              placeholder="Cari no tiket, subjek, pelapor..."
              class="w-full pl-9 pr-16 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50/50 hover:bg-white transition-colors"
            />
            <button
              @click="executeRemoteFetch(1)"
              class="absolute right-1 top-1 bottom-1 px-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors"
            >
              Cari
            </button>
          </div>

          <!-- Department Filter -->
          <div class="sm:col-span-3">
            <select
              v-model="selectedDepartment"
              @change="executeRemoteFetch(1)"
              class="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-semibold bg-gray-50 hover:bg-white transition-colors"
            >
              <option value="">Semua Unit OPD</option>
              <option
                v-for="dept in departmentStore.activeDepartments"
                :key="dept.id"
                :value="dept.id"
              >
                {{ dept.code }} - {{ dept.name }}
              </option>
            </select>
          </div>

          <!-- Ticket Type Filter -->
          <div class="sm:col-span-2">
            <select
              v-model="selectedType"
              @change="executeRemoteFetch(1)"
              class="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-semibold bg-gray-50 hover:bg-white transition-colors"
            >
              <option value="all">Semua Tipe</option>
              <option value="incident">Incident (Kendala)</option>
              <option value="service_request">Permintaan Layanan</option>
              <option value="change_request">Change Request</option>
            </select>
          </div>

          <!-- Per Page Selector -->
          <div class="sm:col-span-2 flex items-center justify-end space-x-1.5">
            <span class="text-xs text-gray-500">Baris:</span>
            <select
              v-model="itemsPerPage"
              @change="handlePerPageChange"
              class="px-2.5 py-1.5 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-semibold bg-gray-50 hover:bg-white transition-colors"
            >
              <option :value="5">5</option>
              <option :value="10">10</option>
              <option :value="20">20</option>
              <option :value="50">50</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Data Table -->
      <div class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 text-left text-sm">
            <thead class="bg-gray-50/80 text-gray-600 font-semibold text-xs uppercase tracking-wider">
              <tr>
                <th class="px-6 py-3.5">No. Tiket</th>
                <th class="px-6 py-3.5">Subjek & Tipe</th>
                <th class="px-6 py-3.5">Unit / OPD</th>
                <th class="px-6 py-3.5">Prioritas & SLA</th>
                <th class="px-6 py-3.5">Status</th>
                <th class="px-6 py-3.5" v-if="!isClient">Pelapor</th>
                <th class="px-6 py-3.5">Teknisi</th>
                <th class="px-6 py-3.5 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white">
              <tr
                v-for="ticket in ticketStore.tickets"
                :key="ticket.id"
                class="hover:bg-blue-50/40 transition-colors"
              >
                <!-- Ticket Number -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="font-mono font-bold text-xs text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200/60">
                    #{{ ticket.ticket_number }}
                  </span>
                </td>

                <!-- Subject & Type preview -->
                <td class="px-6 py-4 max-w-xs">
                  <div class="font-bold text-gray-900 truncate text-xs" :title="ticket.subject">
                    {{ ticket.subject }}
                  </div>
                  <div class="flex items-center gap-1.5 mt-1">
                    <span class="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 border border-gray-200">
                      {{ formatTicketType(ticket.ticket_type) }}
                    </span>
                    <span class="text-[11px] text-gray-400 truncate">{{ ticket.kategori_name }}</span>
                  </div>
                </td>

                <!-- Department -->
                <td class="px-6 py-4 whitespace-nowrap text-xs">
                  <span class="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                    {{ ticket.department_name || 'Umum' }}
                  </span>
                </td>

                <!-- Priority & SLA Badge -->
                <td class="px-6 py-4 whitespace-nowrap space-y-1.5">
                  <div class="flex items-center space-x-1.5">
                    <PriorityIcon :props="ticket.priority" />
                    <span class="text-xs font-bold text-gray-800">{{ ticket.priority || 'Normal' }}</span>
                  </div>
                  <div>
                    <SlaBadge
                      :response-due-at="ticket.response_due_at"
                      :resolution-due-at="ticket.resolution_due_at"
                      :first-responded-at="ticket.first_responded_at"
                      :resolved-at="ticket.resolved_at"
                      :is-sla-breached="ticket.is_sla_breached"
                      :status="ticket.status"
                    />
                  </div>
                </td>

                <!-- Status -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="{
                      'bg-blue-50 text-blue-700 border-blue-200': ticket.status === 'open',
                      'bg-amber-50 text-amber-700 border-amber-200': ticket.status === 'in_progress',
                      'bg-emerald-50 text-emerald-700 border-emerald-200': ticket.status === 'closed',
                    }"
                    class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border"
                  >
                    <span
                      class="w-1.5 h-1.5 rounded-full"
                      :class="{
                        'bg-blue-600': ticket.status === 'open',
                        'bg-amber-600': ticket.status === 'in_progress',
                        'bg-emerald-600': ticket.status === 'closed',
                      }"
                    ></span>
                    <span>{{ formatStatus(ticket.status) }}</span>
                  </span>
                </td>

                <!-- Client Name -->
                <td class="px-6 py-4 whitespace-nowrap text-xs font-semibold text-gray-800" v-if="!isClient">
                  {{ ticket.clientname || '-' }}
                </td>

                <!-- Assign By -->
                <td class="px-6 py-4 whitespace-nowrap text-xs text-gray-600">
                  <span v-if="ticket.assign_by" class="font-medium text-gray-800 flex items-center gap-1">
                    <font-awesome-icon icon="fa-solid fa-user-gear" class="text-blue-500 text-[11px]" />
                    {{ ticket.assign_by }}
                  </span>
                  <span v-else class="text-gray-400 italic">Belum Ditugaskan</span>
                </td>

                <!-- Actions -->
                <td class="px-6 py-4 whitespace-nowrap text-center space-x-1.5">
                  <router-link
                    :to="{ name: 'detailticket', params: { ticketNumber: ticket.ticket_number } }"
                    class="inline-flex items-center justify-center space-x-1 px-3 py-1.5 text-xs font-bold text-blue-600 hover:text-white bg-blue-50 hover:bg-blue-600 border border-blue-200 hover:border-blue-600 rounded-lg transition-all"
                  >
                    <font-awesome-icon icon="fa-solid fa-arrow-up-right-from-square" class="text-[11px]" />
                    <span>Detail</span>
                  </router-link>

                  <button
                    v-if="userRole === 'admin'"
                    @click="deleteTicket(ticket.ticket_number)"
                    class="inline-flex items-center justify-center p-1.5 text-xs font-bold text-red-600 hover:text-white bg-red-50 hover:bg-red-600 border border-red-200 hover:border-red-600 rounded-lg transition-all"
                    title="Hapus Tiket"
                  >
                    <font-awesome-icon icon="fa-solid fa-trash-can" />
                  </button>
                </td>
              </tr>

              <!-- Empty State -->
              <tr v-if="ticketStore.tickets.length === 0">
                <td colspan="8" class="py-14 text-center text-gray-400 space-y-3">
                  <div class="w-12 h-12 rounded-full bg-gray-100 text-gray-400 mx-auto flex items-center justify-center text-xl">
                    <font-awesome-icon icon="fa-solid fa-ticket" />
                  </div>
                  <div class="space-y-1">
                    <h4 class="text-sm font-bold text-gray-700">Tidak Ada Tiket yang Ditemukan</h4>
                    <p class="text-xs text-gray-500">
                      {{ searchQuery ? 'Tidak ada tiket yang cocok dengan kata kunci pencarian Anda.' : 'Belum ada tiket pada filter status ini.' }}
                    </p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Remote Pagination Footer -->
        <div class="px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div class="text-gray-500 font-medium">
            Menampilkan {{ ticketStore.tickets.length }} dari {{ ticketStore.total }} tiket
          </div>

          <div class="flex items-center space-x-2">
            <button
              @click="changePage(ticketStore.currentPage - 1)"
              :disabled="ticketStore.currentPage <= 1"
              class="px-3 py-1.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:pointer-events-none font-medium transition-colors"
            >
              Sebelumnya
            </button>
            <span class="px-3 py-1.5 font-bold text-gray-800">
              Hal {{ ticketStore.currentPage }} dari {{ Math.max(ticketStore.lastPage, 1) }}
            </span>
            <button
              @click="changePage(ticketStore.currentPage + 1)"
              :disabled="ticketStore.currentPage >= ticketStore.lastPage"
              class="px-3 py-1.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:pointer-events-none font-medium transition-colors"
            >
              Berikutnya
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Ticket Modal Dialog -->
    <el-dialog
      v-model="dialogFormVisible"
      title="Ajukan Tiket Bantuan Baru"
      width="580px"
      align-center
      destroy-on-close
      class="rounded-2xl"
    >
      <template #header>
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
            <font-awesome-icon icon="fa-solid fa-ticket" class="text-base" />
          </div>
          <div>
            <h3 class="text-base font-bold text-gray-900">Form Pengajuan Tiket Bantuan</h3>
            <p class="text-xs text-gray-500">Jelaskan kendala dengan detail agar tim teknisi dapat segera membantu</p>
          </div>
        </div>
      </template>

      <el-form :model="form" label-position="top" class="space-y-3 pt-1">
        <el-form-item label="Judul / Subjek Kendala" required class="!mb-2.5">
          <el-input
            v-model="form.subject"
            placeholder="Contoh: Error koneksi printer & aplikasi dinas"
            size="large"
          />
        </el-form-item>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 !mb-2.5">
          <el-form-item label="Kategori Kendala" required class="!mb-0">
            <el-select
              v-model="form.kategori_id"
              placeholder="Pilih Kategori"
              class="w-full"
              size="large"
            >
              <el-option
                v-for="category in kategoriStore.kategoris"
                :key="category.id"
                :label="category.nama_kategori"
                :value="category.id"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="Tingkat Prioritas" required class="!mb-0">
            <el-select
              v-model="form.priority_id"
              placeholder="Pilih Prioritas"
              class="w-full"
              size="large"
            >
              <el-option
                v-for="p in priorityStore.priority"
                :key="p.id"
                :label="p.priority_name"
                :value="p.id"
              />
            </el-select>
          </el-form-item>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 !mb-2.5">
          <el-form-item label="Tipe Pengajuan (ITIL)" class="!mb-0">
            <el-select v-model="form.ticket_type" class="w-full" size="large">
              <el-option label="Incident (Kendala)" value="incident" />
              <el-option label="Permintaan Layanan" value="service_request" />
              <el-option label="Change Request" value="change_request" />
            </el-select>
          </el-form-item>

          <el-form-item label="Unit OPD (Opsional)" class="!mb-0">
            <el-select v-model="form.department_id" placeholder="Pilih OPD / Unit" class="w-full" size="large" clearable>
              <el-option
                v-for="dept in departmentStore.activeDepartments"
                :key="dept.id"
                :label="dept.code + ' - ' + dept.name"
                :value="dept.id"
              />
            </el-select>
          </el-form-item>
        </div>

        <el-form-item label="Deskripsi Detail Masalah" required class="!mb-2.5">
          <el-input
            v-model="form.issue"
            type="textarea"
            :rows="3"
            placeholder="Tuliskan kronologi error, pesan error yang muncul, atau rincian masalah..."
          />
        </el-form-item>

        <el-form-item label="Lampiran / Bukti Screenshot (Opsional)" class="!mb-0">
          <div class="w-full border-2 border-dashed border-gray-300 hover:border-blue-500 rounded-xl p-3 transition-colors text-center cursor-pointer bg-gray-50 hover:bg-blue-50/40 relative">
            <input
              type="file"
              @change="handleFileUpload"
              class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div class="space-y-0.5">
              <font-awesome-icon icon="fa-solid fa-cloud-arrow-up" class="text-xl text-blue-500" />
              <div class="text-xs font-semibold text-gray-700">
                {{ selectedFileName || 'Klik atau tarik file gambar / dokumen ke sini' }}
              </div>
              <p class="text-[10px] text-gray-400">PNG, JPG, PDF (Maksimal 5MB)</p>
            </div>
          </div>
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="flex items-center justify-end space-x-3 pt-4 border-t border-gray-100">
          <el-button @click="dialogFormVisible = false" size="large">Batal</el-button>
          <el-button
            type="primary"
            @click="handleSubmit"
            :loading="submitting"
            size="large"
            class="bg-blue-600 hover:bg-blue-700"
          >
            Kirim Tiket
          </el-button>
        </div>
      </template>
    </el-dialog>
  </MainLayout>
</template>

<script setup lang="ts">
import MainLayout from "@/components/layouts/MainLayout.vue";
import PriorityIcon from "@/components/PriorityIcon.vue";
import SlaBadge from "@/components/SlaBadge.vue";
import { ref, computed, onMounted, reactive } from "vue";
import { useTicketStore } from "@/stores/ticketStore";
import { useAuthStore } from "@/stores/authStore";
import { useKategoriStore } from "@/stores/kategoriStore";
import { usePriorityStore } from "@/stores/priorityStore";
import { useDepartmentStore } from "@/stores/departmentStore";
import { ElNotification } from "element-plus";
import Swal from "sweetalert2";

type UserRole = "admin" | "support" | "client";

const authStore = useAuthStore();
const ticketStore = useTicketStore();
const kategoriStore = useKategoriStore();
const priorityStore = usePriorityStore();
const departmentStore = useDepartmentStore();

const userRole = computed<UserRole>(() => (authStore.user?.role as UserRole) || "client");
const isClient = computed(() => userRole.value === "client");

const submitting = ref(false);
const dialogFormVisible = ref(false);
const selectedFileName = ref("");

const searchQuery = ref("");
const selectedStatus = ref("");
const selectedDepartment = ref("");
const selectedType = ref("all");
const itemsPerPage = ref(10);

const form = reactive({
  issue: "",
  subject: "",
  kategori_id: null as number | null,
  priority_id: null as number | null,
  department_id: null as number | null,
  ticket_type: "incident",
  attachment: undefined as File | undefined,
});

onMounted(async () => {
  await Promise.all([
    kategoriStore.fetchActiveKategoris(),
    priorityStore.fetchPriority(),
    departmentStore.fetchActiveDepartments(),
  ]);
  executeRemoteFetch(1);
});

const executeRemoteFetch = (page: number = 1) => {
  const queryParams = {
    search: searchQuery.value.trim(),
    status: selectedStatus.value,
    department_id: selectedDepartment.value || undefined,
    ticket_type: selectedType.value !== "all" ? selectedType.value : undefined,
    page: page,
    per_page: itemsPerPage.value,
  };

  if (isClient.value) {
    ticketStore.fetchUserTickets(queryParams);
  } else {
    ticketStore.fetchTickets(queryParams);
  }
};

let debounceTimer: ReturnType<typeof setTimeout> | null = null;
const handleSearchInput = () => {
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    executeRemoteFetch(1);
  }, 400);
};

const handleStatusChange = (status: string) => {
  selectedStatus.value = status;
  executeRemoteFetch(1);
};

const handlePerPageChange = () => {
  executeRemoteFetch(1);
};

const changePage = (page: number) => {
  executeRemoteFetch(page);
};

const formatStatus = (status: string) => {
  switch (status) {
    case "open":
      return "Open";
    case "in_progress":
      return "In Progress";
    case "closed":
      return "Closed";
    default:
      return status || "Open";
  }
};

const formatTicketType = (type?: string) => {
  switch (type) {
    case "service_request":
      return "Layanan";
    case "change_request":
      return "Change";
    case "incident":
    default:
      return "Incident";
  }
};

const openAddDialog = () => {
  resetForm();
  dialogFormVisible.value = true;
};

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    form.attachment = target.files[0];
    selectedFileName.value = target.files[0].name;
  }
};

const resetForm = () => {
  form.issue = "";
  form.subject = "";
  form.kategori_id = null;
  form.priority_id = null;
  form.department_id = null;
  form.ticket_type = "incident";
  form.attachment = undefined;
  selectedFileName.value = "";
};

const handleSubmit = async () => {
  if (!form.subject.trim() || !form.issue.trim() || !form.kategori_id || !form.priority_id) {
    ElNotification({
      title: "Peringatan",
      message: "Harap lengkapi semua kolom yang wajib diisi!",
      type: "warning",
    });
    return;
  }

  submitting.value = true;
  try {
    await ticketStore.addTicket(
      form.issue,
      form.subject,
      form.kategori_id,
      form.priority_id,
      form.attachment,
      form.department_id || undefined,
      form.ticket_type
    );
    dialogFormVisible.value = false;
    resetForm();
    ElNotification({
      title: "Tiket Berhasil Dibuat",
      message: "Tiket Anda telah terdaftar dan target waktu SLA telah dihitung.",
      type: "success",
    });
    executeRemoteFetch(1);
  } catch (error) {
    console.error(error);
  } finally {
    submitting.value = false;
  }
};

const deleteTicket = async (ticketNumber: string) => {
  const result = await Swal.fire({
    title: "Hapus Tiket?",
    text: `Tiket #${ticketNumber} beserta riwayat diskusinya akan dihapus permanen.`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#dc2626",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Ya, Hapus!",
    cancelButtonText: "Batal",
  });

  if (result.isConfirmed) {
    try {
      await ticketStore.deleteTicket(ticketNumber);
      ElNotification({
        title: "Tiket Terhapus",
        message: `Tiket #${ticketNumber} berhasil dihapus.`,
        type: "success",
      });
      executeRemoteFetch(ticketStore.currentPage);
    } catch (error) {
      console.error(error);
    }
  }
};
</script>

<style scoped>
:deep(.el-dialog) {
  border-radius: 1.25rem !important;
  overflow: hidden;
}
:deep(.el-dialog__header) {
  padding: 1.25rem 1.5rem 1rem 1.5rem;
  margin-right: 0;
  border-bottom: 1px solid #f3f4f6;
}
:deep(.el-dialog__body) {
  padding: 1.25rem 1.5rem;
}
:deep(.el-form-item__label) {
  font-size: 0.8125rem !important;
  font-weight: 600 !important;
  color: #374151 !important;
  padding-bottom: 4px !important;
}
</style>
