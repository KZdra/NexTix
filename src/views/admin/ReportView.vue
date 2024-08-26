<template>
<MainLayout>
    <div class="max-w-8xl py-6 px-4 sm:px-6 lg:px-8 bg-white rounded-lg shadow-lg border border-gray-300">
          <h1 class="text-3xl font-bold text-gray-900 mb-6 text-center">Report</h1>

          <!-- Filter Criteria Section -->
          <table class="w-full border-collapse">
            <tbody>
              <!-- Removed "all" option for brevity -->
              <tr class="bg-white">
                <td class="py-3 px-6 border-b border-gray-200">
                  <label class="inline-flex items-center">
                    <input type="radio" v-model="selectedOption" value="date" class="form-radio text-indigo-600" />
                    <span class="ml-2">Tanggal</span>
                  </label>
                  <div class="mt-4">
                    <div class="flex space-x-4">
                      <div class="w-1/2">
                        <label class="block text-gray-700">Dari Tanggal:</label>
                        <input
                          type="date"
                          v-model="startDate"
                          :disabled="selectedOption !== 'date'"
                          class="mt-1 mb-2 block w-full border-2 border-gray-300 rounded-lg p-2"
                        />
                      </div>
                      <div class="w-1/2">
                        <label class="block text-gray-700">Sampai Tanggal:</label>
                        <input
                          type="date"
                          v-model="endDate"
                          :disabled="selectedOption !== 'date'"
                          class="mt-1 block w-full border-2 border-gray-300 rounded-lg p-2"
                        />
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
              <tr class="bg-gray-100">
                <td class="py-3 px-6">
                  <label class="inline-flex items-center">
                    <input type="radio" v-model="selectedOption" value="category" class="form-radio text-indigo-600" />
                    <span class="ml-2">Pencarian Kode Kategori</span>
                  </label>
                  <div class="mt-4">
                    <label class="block text-gray-700">Pilih Kategori:</label>
                    <select
                      v-model="selectedCategory"
                      :disabled="selectedOption !== 'category'"
                      class="mt-1 block w-full border-2 border-gray-300 rounded-lg p-2"
                    >
                      <option value="" disabled>-- Pilih kategori --</option>
                      <option v-for="kategori in kategoriStore.kategoris" :key="kategori.id" :value="kategori.id">
                        {{ kategori.nama_kategori }}
                      </option>
                    </select>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <div class="mt-6 flex justify-end">
            <button
              @click="fetchFilteredReports"
              class="px-6 py-3 font-medium text-white bg-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Filter
            </button>
          </div>

          <!-- Report Data Table Section -->
          <div v-loading="loading">
            <div v-if="reportStore.reports.length > 0" class="mt-6">
              <div class="p-2">
                <button @click="exportToExcel" class="bg-green-500 px-6 py-3 font-medium text-white rounded hover:bg-green-600">
                  Export to Excel
                </button>
                <button @click="exportToPDF" class="ml-2 bg-red-500 px-6 py-3 font-medium text-white rounded hover:bg-red-600">
                  Export to PDF
                </button>
              </div>
              <table class="w-full border-collapse mt-4">
                <thead>
                  <tr>
                    <th class="py-3 px-6 text-left border-b border-gray-200">Ticket Number</th>
                    <th class="py-3 px-6 text-left border-b border-gray-200">Date</th>
                    <th class="py-3 px-6 text-left border-b border-gray-200">Client Name</th>
                    <th class="py-3 px-6 text-left border-b border-gray-200">Kategori</th>
                    <th class="py-3 px-6 text-left border-b border-gray-200">Subject</th>
                    <th class="py-3 px-6 text-left border-b border-gray-200">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="report in reportStore.reports" :key="report.ticket_number" class="hover:bg-gray-100">
                    <td class="py-3 px-6 border-b border-gray-200">{{ report.ticket_number }}</td>
                    <td class="py-3 px-6 border-b border-gray-200">{{ new Date(report.created_at).toLocaleDateString() }}</td>
                    <td class="py-3 px-6 border-b border-gray-200">{{ report.clientname }}</td>
                    <td class="py-3 px-6 border-b border-gray-200">{{ report.kategori_name }}</td>
                    <td class="py-3 px-6 border-b border-gray-200">{{ report.subject }}</td>
                    <td class="py-3 px-6 border-b border-gray-200">{{ report.status }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-else class="mt-6 text-center text-gray-500">Tidak ada data yang ditemukan.</div>
          </div>
        </div>
</MainLayout>
</template>

<script setup lang="ts">
import MainLayout from '@/components/layouts/MainLayout.vue';
import { onMounted, ref } from 'vue';
import { useReportStore } from '@/stores/reportStore';
import { useKategoriStore } from '@/stores/kategoriStore';

const reportStore = useReportStore();
const kategoriStore = useKategoriStore();
const selectedOption = ref('all');
const startDate = ref('');
const endDate = ref('');
const selectedCategory = ref('');
const loading = ref(false);

onMounted(async () => {
  await fetchRandK();
});

const fetchRandK = async () => {
  loading.value = true;
  try {
    await kategoriStore.fetchActiveKategoris();
    await reportStore.fetchReports(); 
  } catch (error) {
    console.error('Failed to fetch');
  } finally {
    loading.value = false;
  }
};

const fetchFilteredReports = async () => {
  loading.value = true;
  try {
    await reportStore.fetchReports(startDate.value, endDate.value, selectedCategory.value);
  } catch (error) {
    console.error('Failed to fetch');
  } finally {
    loading.value = false;
  }
};

const exportToExcel = async () => {
  await reportStore.exportToExcel(selectedOption.value, startDate.value, endDate.value, selectedCategory.value);
};

const exportToPDF = () => {
  reportStore.exportToPDF(selectedOption.value, startDate.value, endDate.value, selectedCategory.value);
};

</script>