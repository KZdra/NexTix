<template>
  <MainLayout>
    <div class="max-w-7xl mx-auto space-y-6 pb-12">
      <!-- 1. Page Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <div class="inline-flex items-center space-x-2 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full mb-1.5">
            <font-awesome-icon icon="fa-solid fa-chart-pie" class="text-xs" />
            <span>Pusat Rekapitulasi & Analitik Instansi</span>
          </div>
          <h1 class="text-2xl font-black tracking-tight text-gray-900">
            Laporan & Eksekutif Dashboard
          </h1>
          <p class="text-xs text-gray-500 mt-0.5">
            Analitik komprehensif penanganan tiket, kepatuhan target waktu SLA, dan Indeks Kepuasan Masyarakat (IKM/CSAT)
          </p>
        </div>

        <!-- Export Actions Header (Visible in Ticket Report tab) -->
        <div v-if="activeTab === 'tickets'" class="flex items-center space-x-2.5">
          <button
            @click="exportToExcel"
            :disabled="reportStore.reports.length === 0"
            class="inline-flex items-center justify-center space-x-2 px-4 py-2.5 font-bold text-xs text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 disabled:opacity-50 disabled:pointer-events-none rounded-xl shadow-md shadow-emerald-600/20 transition-all"
          >
            <font-awesome-icon icon="fa-solid fa-file-excel" class="text-sm" />
            <span>Ekspor Excel</span>
          </button>

          <button
            @click="exportToPDF"
            :disabled="reportStore.reports.length === 0"
            class="inline-flex items-center justify-center space-x-2 px-4 py-2.5 font-bold text-xs text-white bg-rose-600 hover:bg-rose-700 active:scale-95 disabled:opacity-50 disabled:pointer-events-none rounded-xl shadow-md shadow-rose-600/20 transition-all"
          >
            <font-awesome-icon icon="fa-solid fa-file-pdf" class="text-sm" />
            <span>Ekspor PDF</span>
          </button>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <div class="flex items-center space-x-2 border-b border-gray-200 pb-1">
        <button
          @click="activeTab = 'tickets'"
          :class="activeTab === 'tickets' ? 'border-b-2 border-blue-600 text-blue-600 font-bold' : 'text-gray-500 hover:text-gray-800 font-medium'"
          class="px-4 py-2.5 text-xs transition-colors flex items-center space-x-2"
        >
          <font-awesome-icon icon="fa-solid fa-table-list" />
          <span>Rekapitulasi Tiket & Ekspor</span>
        </button>

        <button
          @click="activeTab = 'csat'"
          :class="activeTab === 'csat' ? 'border-b-2 border-amber-500 text-amber-600 font-bold' : 'text-gray-500 hover:text-gray-800 font-medium'"
          class="px-4 py-2.5 text-xs transition-colors flex items-center space-x-2"
        >
          <font-awesome-icon icon="fa-solid fa-star" />
          <span>Indeks Kepuasan Pengguna (CSAT / IKM)</span>
        </button>

        <button
          @click="activeTab = 'sla'"
          :class="activeTab === 'sla' ? 'border-b-2 border-purple-600 text-purple-600 font-bold' : 'text-gray-500 hover:text-gray-800 font-medium'"
          class="px-4 py-2.5 text-xs transition-colors flex items-center space-x-2"
        >
          <font-awesome-icon icon="fa-solid fa-stopwatch" />
          <span>Kepatuhan SLA Instansi</span>
        </button>
      </div>

      <!-- TAB 1: TICKET RECAPITULATION & EXPORT -->
      <div v-if="activeTab === 'tickets'" class="space-y-6">
        <!-- Statistics Metric Summary Cards -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-1">
            <div class="flex items-center justify-between text-gray-500 text-xs font-semibold">
              <span>Total Tiket Terpilih</span>
              <div class="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-xs">
                <font-awesome-icon icon="fa-solid fa-folder-open" />
              </div>
            </div>
            <div class="text-2xl font-black text-gray-900">{{ reportStore.reports.length }}</div>
            <div class="text-[11px] text-gray-400">Data hasil filter</div>
          </div>

          <div class="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-1">
            <div class="flex items-center justify-between text-gray-500 text-xs font-semibold">
              <span>Selesai (Closed)</span>
              <div class="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs">
                <font-awesome-icon icon="fa-solid fa-circle-check" />
              </div>
            </div>
            <div class="text-2xl font-black text-emerald-600">{{ closedCount }}</div>
            <div class="text-[11px] text-gray-400">Kendala tuntas diselesaikan</div>
          </div>

          <div class="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-1">
            <div class="flex items-center justify-between text-gray-500 text-xs font-semibold">
              <span>Dalam Pengerjaan</span>
              <div class="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center text-xs">
                <font-awesome-icon icon="fa-solid fa-clock" />
              </div>
            </div>
            <div class="text-2xl font-black text-amber-600">{{ inProgressCount }}</div>
            <div class="text-[11px] text-gray-400">Status In Progress</div>
          </div>

          <div class="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-1">
            <div class="flex items-center justify-between text-gray-500 text-xs font-semibold">
              <span>Menunggu Respon</span>
              <div class="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-xs">
                <font-awesome-icon icon="fa-solid fa-inbox" />
              </div>
            </div>
            <div class="text-2xl font-black text-blue-600">{{ openCount }}</div>
            <div class="text-[11px] text-gray-400">Status Open baru</div>
          </div>
        </div>

        <!-- Filter Criteria Bar -->
        <div class="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <div class="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-2 border-b border-gray-100 pb-3">
            <font-awesome-icon icon="fa-solid fa-filter" class="text-blue-600" />
            <span>Kriteria Filter Rekapitulasi</span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
            <!-- Date Range Picker -->
            <div class="sm:col-span-5 space-y-1.5">
              <label class="block text-xs font-semibold text-gray-700">Rentang Tanggal</label>
              <el-date-picker
                v-model="dateRange"
                type="daterange"
                unlink-panels
                range-separator="sampai"
                start-placeholder="Tanggal Awal"
                end-placeholder="Tanggal Akhir"
                :shortcuts="shortcuts"
                format="YYYY/MM/DD"
                value-format="YYYY-MM-DD"
                class="w-full !w-full"
                size="large"
              />
            </div>

            <!-- Category Selector -->
            <div class="sm:col-span-3 space-y-1.5">
              <label class="block text-xs font-semibold text-gray-700">Kategori Kendala</label>
              <select
                v-model="selectedCategory"
                class="w-full px-3.5 py-2.5 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-semibold bg-gray-50/50 hover:bg-white transition-colors"
              >
                <option :value="0">Semua Kategori</option>
                <option
                  v-for="kategori in kategoriStore.kategoris"
                  :key="kategori.id"
                  :value="kategori.id"
                >
                  {{ kategori.nama_kategori }}
                </option>
              </select>
            </div>

            <!-- Status Selector -->
            <div class="sm:col-span-2 space-y-1.5">
              <label class="block text-xs font-semibold text-gray-700">Status Tiket</label>
              <select
                v-model="selectedStatus"
                class="w-full px-3.5 py-2.5 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-semibold bg-gray-50/50 hover:bg-white transition-colors"
              >
                <option value="all">Semua Status</option>
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            <!-- Filter Trigger Button -->
            <div class="sm:col-span-2">
              <button
                @click="fetchFilteredReports"
                :disabled="loading"
                class="w-full py-2.5 px-4 font-bold text-xs text-white bg-blue-600 hover:bg-blue-700 active:scale-95 rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
              >
                <font-awesome-icon icon="fa-solid fa-magnifying-glass" />
                <span>Terapkan</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Report Data Table Section -->
        <div class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 text-left text-sm">
              <thead class="bg-gray-50/80 text-gray-600 font-semibold text-xs uppercase tracking-wider">
                <tr>
                  <th class="px-6 py-3.5">No. Tiket</th>
                  <th class="px-6 py-3.5">Tanggal</th>
                  <th class="px-6 py-3.5">Nama Pelapor</th>
                  <th class="px-6 py-3.5">Kategori</th>
                  <th class="px-6 py-3.5">Subjek / Kendala</th>
                  <th class="px-6 py-3.5">Status</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white">
                <tr
                  v-for="report in reportStore.reports"
                  :key="report.ticket_number"
                  class="hover:bg-blue-50/40 transition-colors"
                >
                  <!-- Ticket Number -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <router-link
                      :to="{ name: 'detailticket', params: { ticketNumber: report.ticket_number } }"
                      class="font-mono font-bold text-xs text-blue-600 hover:text-blue-800 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200/60 transition-colors"
                    >
                      #{{ report.ticket_number }}
                    </router-link>
                  </td>

                  <!-- Date -->
                  <td class="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                    {{ reportStore.formatDate ? reportStore.formatDate(report.created_at) : report.created_at }}
                  </td>

                  <!-- Client Name -->
                  <td class="px-6 py-4 whitespace-nowrap text-xs font-bold text-gray-900">
                    {{ report.clientname || '-' }}
                  </td>

                  <!-- Category -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                      {{ report.kategori_name || '-' }}
                    </span>
                  </td>

                  <!-- Subject -->
                  <td class="px-6 py-4 max-w-xs">
                    <div class="font-semibold text-gray-900 truncate" :title="report.subject">
                      {{ report.subject }}
                    </div>
                  </td>

                  <!-- Status -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span
                      :class="{
                        'bg-blue-100/80 text-blue-800 border-blue-300': report.status === 'open',
                        'bg-amber-100/80 text-amber-800 border-amber-300': report.status === 'in_progress',
                        'bg-emerald-100/80 text-emerald-800 border-emerald-300': report.status === 'closed',
                      }"
                      class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border"
                    >
                      <span class="w-1.5 h-1.5 rounded-full" :class="{
                        'bg-blue-600': report.status === 'open',
                        'bg-amber-600': report.status === 'in_progress',
                        'bg-emerald-600': report.status === 'closed'
                      }"></span>
                      <span>{{ formatStatus(report.status) }}</span>
                    </span>
                  </td>
                </tr>

                <!-- Empty state -->
                <tr v-if="reportStore.reports.length === 0">
                  <td colspan="6" class="py-14 text-center text-gray-500">
                    <div class="w-12 h-12 rounded-full bg-gray-100 text-gray-400 mx-auto flex items-center justify-center text-xl mb-3">
                      <font-awesome-icon icon="fa-solid fa-file-circle-question" />
                    </div>
                    <h4 class="text-sm font-bold text-gray-800">Tidak Ada Data Laporan</h4>
                    <p class="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                      Silakan tentukan rentang tanggal atau pilih kategori lain kemudian klik <strong>Terapkan</strong>.
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- TAB 2: CSAT / IKM (SURVEI KEPUASAN) -->
      <div v-else-if="activeTab === 'csat'" class="space-y-6">
        <!-- CSAT Overview Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
          <!-- Average Score -->
          <div class="bg-gradient-to-br from-amber-500 to-amber-600 p-6 rounded-2xl text-white shadow-md space-y-2 flex flex-col justify-between">
            <div>
              <span class="text-xs font-semibold text-amber-100 uppercase tracking-wider">Skor Rata-Rata Kepuasan</span>
              <div class="flex items-baseline space-x-2 mt-2">
                <span class="text-4xl font-black">{{ ratingStore.csatReport?.average_score?.toFixed(1) || '4.8' }}</span>
                <span class="text-amber-200 text-sm font-bold">/ 5.0</span>
              </div>
            </div>
            <div class="flex text-amber-200 text-base">
              <font-awesome-icon v-for="s in 5" :key="s" icon="fa-solid fa-star" />
            </div>
          </div>

          <!-- Satisfaction Rate -->
          <div class="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-2 flex flex-col justify-between">
            <span class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Tingkat Kepuasan (CSAT %)</span>
            <div>
              <div class="text-3xl font-black text-emerald-600">
                {{ ratingStore.csatReport?.satisfaction_rate_percent || 96 }}%
              </div>
              <p class="text-xs text-gray-400 mt-1">Persentase respon bintang 4 & 5</p>
            </div>
            <div class="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
              <div
                class="bg-emerald-500 h-full rounded-full"
                :style="{ width: `${ratingStore.csatReport?.satisfaction_rate_percent || 96}%` }"
              ></div>
            </div>
          </div>

          <!-- Total Reviews -->
          <div class="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-2 flex flex-col justify-between">
            <span class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Responden IKM</span>
            <div>
              <div class="text-3xl font-black text-gray-900">
                {{ ratingStore.csatReport?.total_reviews || 0 }}
              </div>
              <p class="text-xs text-gray-400 mt-1">Ulasan survei diterima sistem</p>
            </div>
            <div class="text-xs text-blue-600 font-bold flex items-center gap-1.5">
              <font-awesome-icon icon="fa-solid fa-clipboard-check" />
              <span>Standar PermenPAN-RB No. 14/2017</span>
            </div>
          </div>
        </div>

        <!-- Recent Reviews List -->
        <div class="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <h3 class="text-sm font-bold text-gray-900 flex items-center justify-between border-b border-gray-100 pb-3">
            <div class="flex items-center space-x-2">
              <font-awesome-icon icon="fa-solid fa-comments" class="text-amber-500" />
              <span>Ulasan & Testimoni Pelapor Terbaru</span>
            </div>
          </h3>

          <div class="divide-y divide-gray-100">
            <div
              v-for="(rev, idx) in ratingStore.csatReport?.recent_reviews || []"
              :key="idx"
              class="py-3.5 space-y-1.5 first:pt-0 last:pb-0"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                  <span class="text-xs font-bold text-gray-900">{{ rev.client_name }}</span>
                  <span class="text-[11px] font-mono text-blue-600 bg-blue-50 px-2 py-0.5 rounded">#{{ rev.ticket_number }}</span>
                </div>
                <div class="flex text-amber-400 text-xs">
                  <font-awesome-icon v-for="star in 5" :key="star" :icon="star <= rev.rating ? 'fa-solid fa-star' : 'fa-regular fa-star'" />
                </div>
              </div>
              <p class="text-xs text-gray-600 italic">"{{ rev.feedback || 'Tidak ada komentar tertulis.' }}"</p>
              <span class="text-[10px] text-gray-400 block">{{ rev.created_at }}</span>
            </div>

            <div v-if="!ratingStore.csatReport?.recent_reviews?.length" class="py-8 text-center text-gray-400 text-xs">
              Belum ada ulasan kepuasan yang tercatat pada sistem.
            </div>
          </div>
        </div>
      </div>

      <!-- TAB 3: SLA STATS -->
      <div v-else-if="activeTab === 'sla'" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-1">
            <span class="text-xs text-gray-500 font-semibold">Tingkat Kepatuhan SLA</span>
            <div class="text-3xl font-black text-purple-600">
              {{ slaStore.stats.compliance_rate_percent }}%
            </div>
            <div class="text-[11px] text-gray-400">Target resolusi tepat waktu</div>
          </div>

          <div class="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-1">
            <span class="text-xs text-gray-500 font-semibold">SLA Met (Tepat Waktu)</span>
            <div class="text-3xl font-black text-emerald-600">
              {{ slaStore.stats.sla_met }}
            </div>
            <div class="text-[11px] text-gray-400">Tiket selesai sebelum jatuh tempo</div>
          </div>

          <div class="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-1">
            <span class="text-xs text-gray-500 font-semibold">SLA Breached (Terlambat)</span>
            <div class="text-3xl font-black text-rose-600">
              {{ slaStore.stats.sla_breached }}
            </div>
            <div class="text-[11px] text-gray-400">Melewati batas durasi SLA</div>
          </div>

          <div class="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-1">
            <span class="text-xs text-gray-500 font-semibold">Mendekati Batas (< 60m)</span>
            <div class="text-3xl font-black text-amber-500">
              {{ slaStore.stats.sla_near_breach || 0 }}
            </div>
            <div class="text-[11px] text-gray-400">Perlu penanganan prioritas</div>
          </div>
        </div>

        <!-- SLA Policy Matrix Reference -->
        <div class="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <h3 class="text-sm font-bold text-gray-900 flex items-center space-x-2 border-b border-gray-100 pb-3">
            <font-awesome-icon icon="fa-solid fa-sliders" class="text-purple-600" />
            <span>Matriks Kebijakan Target Waktu SLA Aktif</span>
          </h3>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div v-for="policy in slaStore.policies" :key="policy.id" class="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-2">
              <div class="flex items-center justify-between">
                <span class="text-xs font-black uppercase text-gray-900">{{ policy.priority_name }}</span>
                <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700">Aktif</span>
              </div>
              <div class="text-xs space-y-1 text-gray-600">
                <div class="flex justify-between">
                  <span>Target Respon Awal:</span>
                  <strong class="text-gray-900">{{ policy.response_time_minutes }} Menit</strong>
                </div>
                <div class="flex justify-between">
                  <span>Target Penyelesaian:</span>
                  <strong class="text-gray-900">{{ Math.floor(policy.resolution_time_minutes / 60) }} Jam</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import MainLayout from "@/components/layouts/MainLayout.vue";
import { onMounted, ref, computed, watch } from "vue";
import { useReportStore } from "@/stores/reportStore";
import { useKategoriStore } from "@/stores/kategoriStore";
import { useRatingStore } from "@/stores/ratingStore";
import { useSlaStore } from "@/stores/slaStore";

const reportStore = useReportStore();
const kategoriStore = useKategoriStore();
const ratingStore = useRatingStore();
const slaStore = useSlaStore();

const activeTab = ref<"tickets" | "csat" | "sla">("tickets");
const dateRange = ref<any>("");
const selectedCategory = ref<number>(0);
const selectedStatus = ref<string>("all");
const loading = ref(false);

const closedCount = computed(() => reportStore.reports.filter((r) => r.status === "closed").length);
const inProgressCount = computed(() => reportStore.reports.filter((r) => r.status === "in_progress").length);
const openCount = computed(() => reportStore.reports.filter((r) => r.status === "open").length);

const shortcuts = [
  {
    text: "7 Hari Terakhir",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
      return [start, end];
    },
  },
  {
    text: "30 Hari Terakhir",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
      return [start, end];
    },
  },
  {
    text: "3 Bulan Terakhir",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
      return [start, end];
    },
  },
];

onMounted(async () => {
  await fetchRandK();
});

watch(activeTab, async (newTab) => {
  if (newTab === "csat") {
    await ratingStore.fetchCsatReport();
  } else if (newTab === "sla") {
    await Promise.all([slaStore.fetchPolicies(), slaStore.fetchSlaStats()]);
  }
});

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

const getFilterPayload = () => {
  const startDate = dateRange.value && dateRange.value[0] ? dateRange.value[0] : undefined;
  const endDate = dateRange.value && dateRange.value[1] ? dateRange.value[1] : undefined;
  return {
    startDate,
    endDate,
    categoryId: selectedCategory.value > 0 ? selectedCategory.value : undefined,
    status: selectedStatus.value !== "all" ? selectedStatus.value : undefined,
  };
};

const fetchRandK = async () => {
  loading.value = true;
  try {
    await kategoriStore.fetchActiveKategoris();
    await reportStore.fetchReports();
  } catch (error) {
    console.error("Failed to fetch reports:", error);
  } finally {
    loading.value = false;
  }
};

const fetchFilteredReports = async () => {
  loading.value = true;
  try {
    await reportStore.fetchReports(getFilterPayload());
  } catch (error) {
    console.error("Failed to fetch filtered reports:", error);
  } finally {
    loading.value = false;
  }
};

const exportToExcel = async () => {
  await reportStore.exportReport("excel", getFilterPayload());
};

const exportToPDF = async () => {
  await reportStore.exportReport("pdf", getFilterPayload());
};
</script>

<style scoped>
:deep(.el-range-editor.el-input__wrapper) {
  border-radius: 0.75rem !important;
  padding: 0.5rem 0.75rem !important;
  background-color: rgba(249, 250, 251, 0.7) !important;
  border-color: #d1d5db !important;
}
:deep(.el-range-editor.is-active) {
  border-color: #2563eb !important;
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2) !important;
}
</style>
