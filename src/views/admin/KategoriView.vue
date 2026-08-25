<template>
  <MainLayout>
    <div class="max-w-7xl mx-auto space-y-6 pb-12">
      <!-- Page Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <div class="inline-flex items-center space-x-2 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full mb-1.5">
            <font-awesome-icon icon="fa-solid fa-list-check" class="text-xs" />
            <span>Manajemen Kategori</span>
          </div>
          <h1 class="text-2xl font-black tracking-tight text-gray-900">
            Daftar Kategori Kendala
          </h1>
          <p class="text-xs text-gray-500 mt-0.5">
            Kelola kategori tiket keluhan agar pengelompokan masalah teknis lebih terstruktur dan mudah ditugaskan
          </p>
        </div>

        <button
          @click="openModal(false)"
          class="inline-flex items-center justify-center space-x-2 px-5 py-2.5 font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 active:scale-95 rounded-xl shadow-md shadow-blue-500/20 transition-all duration-150"
        >
          <font-awesome-icon icon="fa-solid fa-circle-plus" class="text-base" />
          <span>Tambah Kategori</span>
        </button>
      </div>

      <!-- Filters & Search Toolbar -->
      <div class="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4">
        <!-- Status Filter Tabs -->
        <div class="flex flex-wrap items-center gap-2 border-b border-gray-100 pb-4">
          <button
            @click="handleStatusChange('')"
            :class="filterStatus === '' ? 'bg-gray-900 text-white font-bold' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 font-medium'"
            class="px-3.5 py-1.5 rounded-lg text-xs transition-all flex items-center gap-1.5"
          >
            <span>Semua Kategori</span>
          </button>

          <button
            @click="handleStatusChange('active')"
            :class="filterStatus === 'active' ? 'bg-emerald-600 text-white font-bold' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-medium'"
            class="px-3.5 py-1.5 rounded-lg text-xs transition-all flex items-center gap-1.5"
          >
            <span class="w-1.5 h-1.5 rounded-full bg-current"></span>
            <span>Aktif (Active)</span>
          </button>

          <button
            @click="handleStatusChange('nonactive')"
            :class="filterStatus === 'nonactive' || filterStatus === 'inactive' ? 'bg-gray-700 text-white font-bold' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 font-medium'"
            class="px-3.5 py-1.5 rounded-lg text-xs transition-all flex items-center gap-1.5"
          >
            <span class="w-1.5 h-1.5 rounded-full bg-current"></span>
            <span>Nonaktif (Inactive)</span>
          </button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <!-- Search input -->
          <div class="sm:col-span-8 relative">
            <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <font-awesome-icon icon="fa-solid fa-magnifying-glass" class="text-xs" />
            </div>
            <input
              type="text"
              v-model="searchQuery"
              @input="handleSearchInput"
              @keyup.enter="executeRemoteFetch(1)"
              placeholder="Cari nama kategori..."
              class="w-full pl-9 pr-20 py-2.5 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50/50 hover:bg-white transition-colors"
            />
            <button
              @click="executeRemoteFetch(1)"
              class="absolute right-1.5 top-1.5 bottom-1.5 px-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors"
            >
              Cari
            </button>
          </div>

          <!-- Per Page Selector -->
          <div class="sm:col-span-4 flex items-center justify-end space-x-2">
            <span class="text-xs text-gray-500 font-medium">Tampilkan:</span>
            <select
              v-model="itemsPerPage"
              @change="handlePerPageChange"
              class="px-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-semibold bg-gray-50 hover:bg-white transition-colors"
            >
              <option :value="5">5 data</option>
              <option :value="10">10 data</option>
              <option :value="20">20 data</option>
              <option :value="50">50 data</option>
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
                <th class="px-6 py-3.5">ID</th>
                <th class="px-6 py-3.5">Nama Kategori</th>
                <th class="px-6 py-3.5">Status</th>
                <th class="px-6 py-3.5 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white">
              <tr
                v-for="kategori in kategoriStore.kategoris"
                :key="kategori.id"
                class="hover:bg-blue-50/40 transition-colors"
              >
                <!-- ID -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="font-mono font-bold text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded border border-gray-200">
                    #{{ kategori.id }}
                  </span>
                </td>

                <!-- Category Name -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center space-x-2.5">
                    <div class="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs">
                      <font-awesome-icon icon="fa-solid fa-folder" />
                    </div>
                    <span class="font-bold text-gray-900">{{ kategori.nama_kategori }}</span>
                  </div>
                </td>

                <!-- Status Badge -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="kategori.status === 'active' ? 'bg-emerald-100/80 text-emerald-800 border-emerald-200' : 'bg-gray-100 text-gray-700 border-gray-200'"
                    class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border"
                  >
                    <span class="w-1.5 h-1.5 rounded-full" :class="kategori.status === 'active' ? 'bg-emerald-600' : 'bg-gray-500'"></span>
                    <span>{{ kategori.status === 'active' ? 'Aktif' : 'Non-Aktif' }}</span>
                  </span>
                </td>

                <!-- Action Buttons -->
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <div class="inline-flex items-center space-x-2">
                    <button
                      @click="editKategori(kategori.id)"
                      class="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-amber-600 hover:text-white bg-amber-50 hover:bg-amber-600 border border-amber-200 hover:border-amber-600 rounded-lg transition-all"
                    >
                      <font-awesome-icon icon="fa-solid fa-pen-to-square" class="text-xs" />
                      <span>Edit</span>
                    </button>
                    <button
                      @click="deleteKategori(kategori.id)"
                      class="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-red-600 hover:text-white bg-red-50 hover:bg-red-600 border border-red-200 hover:border-red-600 rounded-lg transition-all"
                    >
                      <font-awesome-icon icon="fa-solid fa-trash-can" class="text-xs" />
                      <span>Hapus</span>
                    </button>
                  </div>
                </td>
              </tr>

              <!-- Empty state inside table -->
              <tr v-if="kategoriStore.kategoris.length === 0">
                <td colspan="4" class="py-12 text-center text-gray-500">
                  <div class="w-12 h-12 rounded-full bg-gray-100 text-gray-400 mx-auto flex items-center justify-center text-xl mb-3">
                    <font-awesome-icon icon="fa-solid fa-folder-open" />
                  </div>
                  <h4 class="text-sm font-bold text-gray-800">Tidak Ada Kategori Ditemukan</h4>
                  <p class="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                    Tidak ditemukan data kategori yang cocok dengan pencarian atau filter yang dipilih.
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination Footer (Remote) -->
        <div class="px-6 py-4 bg-gray-50/75 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600">
          <div>
            Menampilkan <span class="font-bold">{{ kategoriStore.kategoris.length > 0 ? (kategoriStore.currentPage - 1) * kategoriStore.perPage + 1 : 0 }}</span> sampai
            <span class="font-bold">{{ (kategoriStore.currentPage - 1) * kategoriStore.perPage + kategoriStore.kategoris.length }}</span> dari
            <span class="font-bold">{{ kategoriStore.total }}</span> kategori
          </div>

          <div class="flex items-center space-x-1.5">
            <button
              @click="changePage(kategoriStore.currentPage - 1)"
              :disabled="kategoriStore.currentPage <= 1"
              class="px-3 py-1.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:pointer-events-none font-medium transition-colors"
            >
              Sebelumnya
            </button>
            <span class="px-3 py-1.5 font-bold text-gray-800">
              Hal {{ kategoriStore.currentPage }} dari {{ Math.max(kategoriStore.lastPage, 1) }}
            </span>
            <button
              @click="changePage(kategoriStore.currentPage + 1)"
              :disabled="kategoriStore.currentPage >= kategoriStore.lastPage"
              class="px-3 py-1.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:pointer-events-none font-medium transition-colors"
            >
              Berikutnya
            </button>
          </div>
        </div>
      </div>

      <!-- Add/Edit Category Modal Dialog -->
      <el-dialog
        v-model="dialogFormVisible"
        :title="isEditing ? 'Perbarui Kategori' : 'Tambah Kategori Baru'"
        width="540px"
        destroy-on-close
        class="rounded-2xl"
      >
        <template #header>
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <font-awesome-icon icon="fa-solid fa-folder-plus" class="text-base" />
            </div>
            <div>
              <h3 class="text-base font-bold text-gray-900">
                {{ isEditing ? 'Edit Data Kategori' : 'Form Kategori Baru' }}
              </h3>
              <p class="text-xs text-gray-500">
                {{ isEditing ? 'Perbarui nama atau status keaktifan kategori' : 'Masukkan nama kategori kendala' }}
              </p>
            </div>
          </div>
        </template>

        <el-form :model="form" label-position="top" class="space-y-4 pt-2">
          <el-form-item label="Nama Kategori" required>
            <el-input v-model="form.kategori" placeholder="Contoh: Hardware / Komputer" size="large" />
          </el-form-item>

          <el-form-item label="Status Kategori" required>
            <el-select v-model="form.status" placeholder="Pilih Status" class="w-full" size="large">
              <el-option label="Aktif (Active)" value="active" />
              <el-option label="Non-Aktif (Nonactive)" value="nonactive" />
            </el-select>
          </el-form-item>
        </el-form>

        <template #footer>
          <div class="flex items-center justify-end space-x-3 pt-4 border-t border-gray-100">
            <el-button @click="dialogFormVisible = false" size="large">Batal</el-button>
            <el-button
              type="primary"
              @click="submitForm"
              :loading="submitting"
              size="large"
              class="bg-blue-600 hover:bg-blue-700"
            >
              {{ isEditing ? "Simpan Perubahan" : "Simpan Kategori" }}
            </el-button>
          </div>
        </template>
      </el-dialog>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import MainLayout from "@/components/layouts/MainLayout.vue";
import { ref, onMounted, reactive } from "vue";
import { useKategoriStore } from "@/stores/kategoriStore";
import Swal from "sweetalert2";
import { ElNotification } from "element-plus";

const kategoriStore = useKategoriStore();

const searchQuery = ref("");
const filterStatus = ref("");
const itemsPerPage = ref(10);
const dialogFormVisible = ref(false);
const isEditing = ref(false);
const kategoriIdToEdit = ref<number | null>(null);
const submitting = ref(false);
let searchDebounceTimer: any = null;

const form = reactive({
  kategori: "",
  status: "active",
});

onMounted(async () => {
  try {
    await executeRemoteFetch(1);
  } catch (error) {
    console.error(error);
  }
});

const executeRemoteFetch = async (page = 1) => {
  const queryParams = {
    search: searchQuery.value.trim() || undefined,
    page: page,
    per_page: itemsPerPage.value,
    status: filterStatus.value || undefined,
  };
  await kategoriStore.fetchKategoris(queryParams);
};

const handleSearchInput = () => {
  clearTimeout(searchDebounceTimer);
  searchDebounceTimer = setTimeout(() => {
    executeRemoteFetch(1);
  }, 400);
};

const handleStatusChange = (status: string) => {
  filterStatus.value = status;
  executeRemoteFetch(1);
};

const handlePerPageChange = () => {
  executeRemoteFetch(1);
};

const changePage = (page: number) => {
  if (page < 1 || page > kategoriStore.lastPage) return;
  executeRemoteFetch(page);
};

const resetForm = () => {
  form.kategori = "";
  form.status = "active";
};

const openModal = (isEdit: boolean, item?: any) => {
  isEditing.value = isEdit;
  if (isEdit && item) {
    form.kategori = item.nama_kategori;
    form.status = item.status;
    kategoriIdToEdit.value = item.id;
  } else {
    resetForm();
  }
  dialogFormVisible.value = true;
};

const editKategori = async (id: number) => {
  const item = await kategoriStore.fetchKategori(id);
  if (item) {
    openModal(true, item);
  }
};

const deleteKategori = async (id: number) => {
  const result = await Swal.fire({
    title: "Hapus Kategori?",
    text: "Kategori ini akan dihapus dari sistem.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#dc2626",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Ya, Hapus!",
    cancelButtonText: "Batal",
  });

  if (result.isConfirmed) {
    try {
      await kategoriStore.deleteKategori(id);
      ElNotification({
        title: "Terhapus",
        message: "Kategori berhasil dihapus.",
        type: "success",
      });
      await executeRemoteFetch(kategoriStore.currentPage);
    } catch (error) {
      Swal.fire("Gagal!", "Terjadi kesalahan saat menghapus kategori.", "error");
    }
  }
};

const submitForm = async () => {
  if (!form.kategori.trim()) {
    ElNotification({
      title: "Peringatan",
      message: "Nama kategori wajib diisi!",
      type: "warning",
    });
    return;
  }

  submitting.value = true;
  try {
    if (isEditing.value && kategoriIdToEdit.value) {
      await kategoriStore.updateKategori(kategoriIdToEdit.value, form.kategori, form.status);
      ElNotification({
        title: "Sukses",
        message: "Kategori berhasil diperbarui!",
        type: "success",
      });
    } else {
      await kategoriStore.createKategori(form.kategori, form.status);
      ElNotification({
        title: "Sukses",
        message: "Kategori baru berhasil ditambahkan!",
        type: "success",
      });
    }

    dialogFormVisible.value = false;
    await executeRemoteFetch(kategoriStore.currentPage);
  } catch (error) {
    console.error(error);
  } finally {
    submitting.value = false;
  }
};
</script>

<style scoped>
:deep(.el-dialog) {
  border-radius: 1rem !important;
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