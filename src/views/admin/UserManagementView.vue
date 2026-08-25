<template>
  <MainLayout>
    <div class="max-w-7xl mx-auto space-y-6 pb-12">
      <!-- Page Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <div class="inline-flex items-center space-x-2 text-xs font-semibold text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full mb-1.5">
            <font-awesome-icon icon="fa-solid fa-users-gear" class="text-xs" />
            <span>Manajemen Pengguna</span>
          </div>
          <h1 class="text-2xl font-black tracking-tight text-gray-900">
            Daftar Akun Pengguna
          </h1>
          <p class="text-xs text-gray-500 mt-0.5">
            Kelola data pengguna, hak akses peran (Admin, Teknisi / Support, dan Client), serta pembuatan akun baru
          </p>
        </div>

        <button
          @click="openModal(false)"
          class="inline-flex items-center justify-center space-x-2 px-5 py-2.5 font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 active:scale-95 rounded-xl shadow-md shadow-blue-500/20 transition-all duration-150"
        >
          <font-awesome-icon icon="fa-solid fa-user-plus" class="text-base" />
          <span>Tambah Pengguna</span>
        </button>
      </div>

      <!-- Filters & Search Toolbar -->
      <div class="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4">
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
              placeholder="Cari berdasarkan nama pengguna, alamat email, atau role..."
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

      <!-- Users Table -->
      <div class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 text-left text-sm">
            <thead class="bg-gray-50/80 text-gray-600 font-semibold text-xs uppercase tracking-wider">
              <tr>
                <th class="px-6 py-3.5">ID</th>
                <th class="px-6 py-3.5">Nama Pengguna</th>
                <th class="px-6 py-3.5">Email</th>
                <th class="px-6 py-3.5">Role / Peran</th>
                <th class="px-6 py-3.5 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white">
              <tr
                v-for="user in userStore.users"
                :key="user.id"
                class="hover:bg-blue-50/40 transition-colors"
              >
                <!-- User ID -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="font-mono font-bold text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded border border-gray-200">
                    #{{ user.id }}
                  </span>
                </td>

                <!-- User Name with Avatar -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center space-x-3">
                    <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center uppercase shadow-xs">
                      {{ (user.name || 'U').charAt(0) }}
                    </div>
                    <span class="font-bold text-gray-900">{{ user.name }}</span>
                  </div>
                </td>

                <!-- Email -->
                <td class="px-6 py-4 whitespace-nowrap text-xs text-gray-600 font-medium">
                  {{ user.email }}
                </td>

                <!-- Role Badge -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="{
                      'bg-purple-100/80 text-purple-800 border-purple-200': user.role === 'admin',
                      'bg-amber-100/80 text-amber-800 border-amber-200': user.role === 'support',
                      'bg-blue-100/80 text-blue-800 border-blue-200': user.role === 'client' || !user.role,
                    }"
                    class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border"
                  >
                    {{ formatRole(user.role) }}
                  </span>
                </td>

                <!-- Action Buttons -->
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <div class="inline-flex items-center space-x-2">
                    <button
                      @click="editUser(user.id)"
                      class="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-amber-600 hover:text-white bg-amber-50 hover:bg-amber-600 border border-amber-200 hover:border-amber-600 rounded-lg transition-all"
                    >
                      <font-awesome-icon icon="fa-solid fa-pen-to-square" class="text-xs" />
                      <span>Edit</span>
                    </button>
                    <button
                      @click="deleteUser(user.id)"
                      class="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-red-600 hover:text-white bg-red-50 hover:bg-red-600 border border-red-200 hover:border-red-600 rounded-lg transition-all"
                    >
                      <font-awesome-icon icon="fa-solid fa-trash-can" class="text-xs" />
                      <span>Hapus</span>
                    </button>
                  </div>
                </td>
              </tr>

              <!-- Empty state inside table -->
              <tr v-if="userStore.users.length === 0">
                <td colspan="5" class="py-12 text-center text-gray-500">
                  <div class="w-12 h-12 rounded-full bg-gray-100 text-gray-400 mx-auto flex items-center justify-center text-xl mb-3">
                    <font-awesome-icon icon="fa-solid fa-user-slash" />
                  </div>
                  <h4 class="text-sm font-bold text-gray-800">Tidak Ada Pengguna Ditemukan</h4>
                  <p class="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                    Tidak ditemukan data pengguna yang sesuai dengan kata kunci pencarian.
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination Footer (Remote) -->
        <div class="px-6 py-4 bg-gray-50/75 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600">
          <div>
            Menampilkan <span class="font-bold">{{ userStore.users.length > 0 ? (userStore.currentPage - 1) * userStore.perPage + 1 : 0 }}</span> sampai
            <span class="font-bold">{{ (userStore.currentPage - 1) * userStore.perPage + userStore.users.length }}</span> dari
            <span class="font-bold">{{ userStore.total }}</span> pengguna
          </div>

          <div class="flex items-center space-x-1.5">
            <button
              @click="changePage(userStore.currentPage - 1)"
              :disabled="userStore.currentPage <= 1"
              class="px-3 py-1.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:pointer-events-none font-medium transition-colors"
            >
              Sebelumnya
            </button>
            <span class="px-3 py-1.5 font-bold text-gray-800">
              Hal {{ userStore.currentPage }} dari {{ Math.max(userStore.lastPage, 1) }}
            </span>
            <button
              @click="changePage(userStore.currentPage + 1)"
              :disabled="userStore.currentPage >= userStore.lastPage"
              class="px-3 py-1.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:pointer-events-none font-medium transition-colors"
            >
              Berikutnya
            </button>
          </div>
        </div>
      </div>

      <!-- Add/Edit User Dialog Modal -->
      <el-dialog
        v-model="dialogFormVisible"
        :title="isEditing ? 'Perbarui Informasi Pengguna' : 'Tambah Pengguna Baru'"
        width="560px"
        destroy-on-close
        class="rounded-2xl"
      >
        <template #header>
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
              <font-awesome-icon icon="fa-solid fa-user-gear" class="text-base" />
            </div>
            <div>
              <h3 class="text-base font-bold text-gray-900">
                {{ isEditing ? 'Edit Akun Pengguna' : 'Pendaftaran Akun Pengguna' }}
              </h3>
              <p class="text-xs text-gray-500">
                {{ isEditing ? 'Ubah data profil atau peran pengguna' : 'Lengkapi detail akun baru' }}
              </p>
            </div>
          </div>
        </template>

        <el-form :model="userData" label-position="top" class="space-y-4 pt-2">
          <el-form-item label="Nama Lengkap" required>
            <el-input v-model="userData.name" placeholder="Masukkan nama pengguna" size="large" />
          </el-form-item>

          <el-form-item label="Alamat Email" required>
            <el-input v-model="userData.email" type="email" placeholder="nama@email.com" size="large" />
          </el-form-item>

          <el-form-item label="Hak Akses (Role)" required>
            <el-select v-model="userData.role_id" placeholder="Pilih Role" class="w-full" size="large">
              <el-option
                v-for="role in userStore.roles"
                :key="role.id"
                :label="role.name"
                :value="role.id"
              />
            </el-select>
          </el-form-item>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4" v-if="!isEditing">
            <el-form-item label="Kata Sandi" required>
              <el-input
                v-model="userData.password"
                type="password"
                placeholder="Minimal 6 karakter"
                show-password
                size="large"
              />
            </el-form-item>

            <el-form-item label="Konfirmasi Kata Sandi" required>
              <el-input
                v-model="userData.password_confirmation"
                type="password"
                placeholder="Ulangi kata sandi"
                show-password
                size="large"
              />
            </el-form-item>
          </div>
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
              {{ isEditing ? "Simpan Perubahan" : "Daftarkan Pengguna" }}
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
import { useUserStore } from "@/stores/userStore";
import Swal from "sweetalert2";
import { ElNotification } from "element-plus";

const userStore = useUserStore();

const searchQuery = ref("");
const itemsPerPage = ref(10);
const dialogFormVisible = ref(false);
const isEditing = ref(false);
const userIdToEdit = ref<number | null>(null);
const submitting = ref(false);
let searchDebounceTimer: any = null;

const userData = reactive({
  name: "",
  email: "",
  password: "",
  password_confirmation: "",
  role_id: 3,
});

onMounted(async () => {
  try {
    await executeRemoteFetch(1);
    await userStore.fetchRole();
  } catch (error) {
    console.error(error);
  }
});

const executeRemoteFetch = async (page = 1) => {
  const queryParams = {
    search: searchQuery.value.trim() || undefined,
    page: page,
    per_page: itemsPerPage.value,
  };
  await userStore.fetchUsers(queryParams);
};

const handleSearchInput = () => {
  clearTimeout(searchDebounceTimer);
  searchDebounceTimer = setTimeout(() => {
    executeRemoteFetch(1);
  }, 400);
};

const handlePerPageChange = () => {
  executeRemoteFetch(1);
};

const changePage = (page: number) => {
  if (page < 1 || page > userStore.lastPage) return;
  executeRemoteFetch(page);
};

const formatRole = (role: string) => {
  switch (role) {
    case "admin":
      return "Administrator";
    case "support":
      return "Teknisi / Support";
    case "client":
    default:
      return "User / Client";
  }
};

const resetForm = () => {
  userData.name = "";
  userData.email = "";
  userData.password = "";
  userData.password_confirmation = "";
  userData.role_id = 3;
};

const openModal = async (isEdit: boolean, user?: any) => {
  await userStore.fetchRole();
  isEditing.value = isEdit;
  if (isEdit && user) {
    userData.name = user.name;
    userData.email = user.email;
    userData.role_id = user.role_id || 3;
    userIdToEdit.value = user.id;
  } else {
    resetForm();
  }
  dialogFormVisible.value = true;
};

const editUser = async (id: number) => {
  const user = await userStore.fetchUserById(id);
  if (user) {
    openModal(true, user);
  }
};

const deleteUser = async (id: number) => {
  const result = await Swal.fire({
    title: "Hapus Pengguna?",
    text: "Akun pengguna ini akan dihapus secara permanen dari sistem.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#dc2626",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Ya, Hapus!",
    cancelButtonText: "Batal",
  });

  if (result.isConfirmed) {
    try {
      await userStore.deleteUser(id);
      ElNotification({
        title: "Terhapus",
        message: "Pengguna berhasil dihapus.",
        type: "success",
      });
      await executeRemoteFetch(userStore.currentPage);
    } catch (error) {
      Swal.fire("Gagal!", "Terjadi kesalahan saat menghapus pengguna.", "error");
    }
  }
};

const handleSubmit = async () => {
  if (!userData.name.trim() || !userData.email.trim()) {
    ElNotification({
      title: "Peringatan",
      message: "Nama dan email wajib diisi!",
      type: "warning",
    });
    return;
  }

  submitting.value = true;
  try {
    if (isEditing.value && userIdToEdit.value) {
      await userStore.updateUser(userIdToEdit.value, userData);
      ElNotification({
        title: "Sukses",
        message: `Data pengguna ${userData.name} berhasil diperbarui!`,
        type: "success",
      });
    } else {
      if (!userData.password || userData.password !== userData.password_confirmation) {
        ElNotification({
          title: "Error",
          message: "Konfirmasi kata sandi tidak cocok atau kosong!",
          type: "error",
        });
        submitting.value = false;
        return;
      }

      await userStore.registerUser(userData);
      ElNotification({
        title: "Sukses",
        message: "Pengguna baru berhasil didaftarkan!",
        type: "success",
      });
    }

    dialogFormVisible.value = false;
    await executeRemoteFetch(userStore.currentPage);
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

