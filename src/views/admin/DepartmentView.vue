<template>
  <MainLayout>
    <div class="max-w-7xl mx-auto space-y-6 pb-12">
      <!-- 1. Header Section -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <div class="inline-flex items-center space-x-2 text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full mb-1.5">
            <font-awesome-icon icon="fa-solid fa-building" class="text-xs" />
            <span>Tata Kelola Multi-Unit OPD</span>
          </div>
          <h1 class="text-2xl font-black tracking-tight text-gray-900">
            Manajemen Unit Kerja & Departemen
          </h1>
          <p class="text-xs text-gray-500 mt-0.5">
            Atur struktur dinas, bagian, bidang, atau unit kerja pengaju tiket di lingkungan instansi
          </p>
        </div>

        <button
          @click="openModal(false)"
          class="inline-flex items-center justify-center space-x-2 px-5 py-2.5 font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 active:scale-95 rounded-xl shadow-md shadow-blue-500/20 transition-all"
        >
          <font-awesome-icon icon="fa-solid fa-circle-plus" class="text-base" />
          <span>Tambah Departemen</span>
        </button>
      </div>

      <!-- 2. Search & Toolbar -->
      <div class="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div class="relative flex-1 max-w-md">
          <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
            <font-awesome-icon icon="fa-solid fa-magnifying-glass" class="text-xs" />
          </div>
          <input
            v-model="searchQuery"
            @input="handleSearch"
            type="text"
            placeholder="Cari nama atau kode unit kerja (misal: DISKOMINFO)..."
            class="w-full pl-9 pr-4 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50/50 hover:bg-white transition-colors"
          />
        </div>

        <div class="flex items-center space-x-2 text-xs text-gray-500">
          <span>Tampilkan:</span>
          <select
            v-model="perPage"
            @change="handlePageChange(1)"
            class="px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs font-semibold bg-white"
          >
            <option :value="5">5</option>
            <option :value="10">10</option>
            <option :value="20">20</option>
          </select>
        </div>
      </div>

      <!-- 3. Table Data Section -->
      <div class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 text-left text-sm">
            <thead class="bg-gray-50/80 text-gray-600 font-semibold text-xs uppercase tracking-wider">
              <tr>
                <th class="px-6 py-3.5">Kode Unit</th>
                <th class="px-6 py-3.5">Nama Departemen / OPD</th>
                <th class="px-6 py-3.5">Deskripsi</th>
                <th class="px-6 py-3.5">Status</th>
                <th class="px-6 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white">
              <tr
                v-for="dept in departmentStore.departments"
                :key="dept.id"
                class="hover:bg-blue-50/30 transition-colors"
              >
                <!-- Code -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="font-mono font-bold text-xs text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200/60">
                    {{ dept.code }}
                  </span>
                </td>

                <!-- Name -->
                <td class="px-6 py-4 whitespace-nowrap font-bold text-gray-900 text-xs">
                  {{ dept.name }}
                </td>

                <!-- Description -->
                <td class="px-6 py-4 text-xs text-gray-500 max-w-sm">
                  {{ dept.description || '-' }}
                </td>

                <!-- Status -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="dept.is_active ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-gray-100 text-gray-600 border-gray-200'"
                    class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border"
                  >
                    <span class="w-1.5 h-1.5 rounded-full" :class="dept.is_active ? 'bg-emerald-500' : 'bg-gray-400'"></span>
                    <span>{{ dept.is_active ? 'Aktif' : 'Nonaktif' }}</span>
                  </span>
                </td>

                <!-- Actions -->
                <td class="px-6 py-4 whitespace-nowrap text-right space-x-2">
                  <button
                    @click="openModal(true, dept)"
                    class="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-blue-600 hover:text-white bg-blue-50 hover:bg-blue-600 border border-blue-200 hover:border-blue-600 rounded-lg transition-all"
                  >
                    <font-awesome-icon icon="fa-solid fa-pen-to-square" class="text-xs" />
                    <span>Edit</span>
                  </button>
                  <button
                    @click="handleDelete(dept)"
                    class="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-red-600 hover:text-white bg-red-50 hover:bg-red-600 border border-red-200 hover:border-red-600 rounded-lg transition-all"
                  >
                    <font-awesome-icon icon="fa-solid fa-trash-can" class="text-xs" />
                    <span>Hapus</span>
                  </button>
                </td>
              </tr>

              <!-- Empty State -->
              <tr v-if="departmentStore.departments.length === 0">
                <td colspan="5" class="py-12 text-center text-gray-400 space-y-2">
                  <font-awesome-icon icon="fa-solid fa-building" class="text-3xl" />
                  <h4 class="text-sm font-bold text-gray-700">Belum Ada Unit Kerja</h4>
                  <p class="text-xs text-gray-500">Klik "Tambah Departemen" untuk mendaftarkan struktur unit baru.</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <span class="text-gray-500">
            Menampilkan {{ departmentStore.departments.length }} dari {{ departmentStore.total }} unit kerja
          </span>

          <div class="flex items-center space-x-2">
            <button
              :disabled="departmentStore.currentPage <= 1"
              @click="handlePageChange(departmentStore.currentPage - 1)"
              class="px-3 py-1.5 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 disabled:opacity-40 transition-colors"
            >
              Sebelumnya
            </button>
            <span class="font-bold text-gray-700 px-2">
              Hal. {{ departmentStore.currentPage }} / {{ departmentStore.lastPage }}
            </span>
            <button
              :disabled="departmentStore.currentPage >= departmentStore.lastPage"
              @click="handlePageChange(departmentStore.currentPage + 1)"
              class="px-3 py-1.5 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 disabled:opacity-40 transition-colors"
            >
              Selanjutnya
            </button>
          </div>
        </div>
      </div>

      <!-- 4. Add/Edit Modal Dialog -->
      <el-dialog
        v-model="dialogVisible"
        :title="isEditing ? 'Edit Unit Kerja / Departemen' : 'Tambah Unit Kerja Baru'"
        width="540px"
        destroy-on-close
        class="rounded-2xl"
      >
        <template #header>
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <font-awesome-icon icon="fa-solid fa-building" class="text-base" />
            </div>
            <div>
              <h3 class="text-base font-bold text-gray-900">
                {{ isEditing ? 'Edit Data Departemen' : 'Form Unit Kerja Baru' }}
              </h3>
              <p class="text-xs text-gray-500">Daftarkan OPD atau divisi pengaju layanan</p>
            </div>
          </div>
        </template>

        <el-form label-position="top" class="space-y-3 pt-2">
          <el-form-item label="Nama Unit Kerja / Departemen" required>
            <el-input v-model="form.name" placeholder="Contoh: Dinas Komunikasi dan Informatika" size="large" />
          </el-form-item>

          <el-form-item label="Kode Singkatan / Akronim" required>
            <el-input v-model="form.code" placeholder="Contoh: DISKOMINFO" size="large" />
          </el-form-item>

          <el-form-item label="Deskripsi / Keterangan Unit">
            <el-input type="textarea" :rows="3" v-model="form.description" placeholder="Penjelasan tugas atau bidang unit..." />
          </el-form-item>

          <el-form-item label="Status Keaktifan">
            <el-switch v-model="form.is_active" active-text="Aktif" inactive-text="Nonaktif" />
          </el-form-item>
        </el-form>

        <template #footer>
          <div class="flex items-center justify-end space-x-3 pt-3 border-t border-gray-100">
            <el-button @click="dialogVisible = false" size="large">Batal</el-button>
            <el-button
              type="primary"
              @click="submitForm"
              :loading="submitting"
              size="large"
              class="bg-blue-600 hover:bg-blue-700 font-bold"
            >
              {{ isEditing ? 'Simpan Perubahan' : 'Simpan Departemen' }}
            </el-button>
          </div>
        </template>
      </el-dialog>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import MainLayout from "@/components/layouts/MainLayout.vue";
import { ref, reactive, onMounted } from "vue";
import { useDepartmentStore, type Department } from "@/stores/departmentStore";
import { ElNotification } from "element-plus";
import Swal from "sweetalert2";

const departmentStore = useDepartmentStore();

const searchQuery = ref("");
const perPage = ref(10);
const dialogVisible = ref(false);
const isEditing = ref(false);
const selectedId = ref<number | null>(null);
const submitting = ref(false);

const form = reactive({
  name: "",
  code: "",
  description: "",
  is_active: true,
});

onMounted(() => {
  departmentStore.fetchDepartments();
});

let debounceTimer: ReturnType<typeof setTimeout> | null = null;
const handleSearch = () => {
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    departmentStore.fetchDepartments({ search: searchQuery.value, page: 1, per_page: perPage.value });
  }, 400);
};

const handlePageChange = (page: number) => {
  departmentStore.fetchDepartments({ search: searchQuery.value, page, per_page: perPage.value });
};

const openModal = (editing: boolean, dept?: Department) => {
  isEditing.value = editing;
  if (editing && dept) {
    selectedId.value = dept.id;
    form.name = dept.name;
    form.code = dept.code;
    form.description = dept.description || "";
    form.is_active = dept.is_active;
  } else {
    selectedId.value = null;
    form.name = "";
    form.code = "";
    form.description = "";
    form.is_active = true;
  }
  dialogVisible.value = true;
};

const submitForm = async () => {
  if (!form.name.trim() || !form.code.trim()) {
    ElNotification({
      title: "Peringatan",
      message: "Nama dan Kode Departemen wajib diisi!",
      type: "warning",
    });
    return;
  }

  submitting.value = true;
  try {
    if (isEditing.value && selectedId.value) {
      await departmentStore.updateDepartment(selectedId.value, { ...form });
      ElNotification({
        title: "Sukses",
        message: "Data departemen berhasil diperbarui.",
        type: "success",
      });
    } else {
      await departmentStore.createDepartment({ ...form });
      ElNotification({
        title: "Sukses",
        message: "Departemen baru berhasil ditambahkan.",
        type: "success",
      });
    }
    dialogVisible.value = false;
  } catch (error) {
    console.error(error);
  } finally {
    submitting.value = false;
  }
};

const handleDelete = async (dept: Department) => {
  const result = await Swal.fire({
    title: `Hapus ${dept.name}?`,
    text: "Unit kerja yang dihapus tidak akan dapat dipilih kembali pada tiket baru.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#dc2626",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Ya, Hapus!",
    cancelButtonText: "Batal",
  });

  if (result.isConfirmed) {
    try {
      await departmentStore.deleteDepartment(dept.id);
      ElNotification({
        title: "Terhapus",
        message: "Departemen telah berhasil dihapus.",
        type: "success",
      });
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
</style>
