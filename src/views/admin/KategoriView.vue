<template>
    <MainLayout>
        <div class="px-4 py-6 max-w-8xl sm:px-6 lg:px-8">
          <div class="flex items-center justify-between">
            <h1 class="text-3xl font-bold text-gray-900">Kategori</h1>

            <div class="flex">
              <input
                type="text"
                v-model="searchQuery"
                placeholder="Cari..."
                class="relative inline-block px-4 py-2 border-2 border-gray-300 rounded-l-lg"
              />
              <select
                v-model="filterStatus"
                class="relative inline-block px-4 py-2 border-2 border-gray-300 rounded-none"
              >
                <option value="">Semua</option>
                <option value="active">Aktif</option>
                <option value="inactive">Tidak Aktif</option>
              </select>
              <button
                @click="performSearch"
                class="relative inline-block px-6 py-2 font-medium text-white transition duration-300 bg-green-600 border-2 border-green-600 rounded-r-lg hover:bg-green-700"
              >
                Cari
              </button>
            </div>

            <button
              @click="openModal(false)"
              class="relative inline-block px-6 py-3 font-medium text-green-600 transition duration-300 bg-white border-2 border-green-600 rounded-lg group hover:bg-green-600 hover:text-white"
            >
              <span class="relative flex items-center"><span><AddKategoriIcon class="w-5 h-5 mr-2"/></span>Tambah</span>
            </button>
            <el-dialog v-model="dialogFormVisible" :title="isEditing ? 'Update Kategori' : 'Add Kategori'" width="600px">
          <el-form :model="form">
            <el-form-item label="NamaKategori" :label-width="formLabelWidth">
              <el-input
                v-model="form.kategori"
                placeholder="Tuliskan Kategori"
              />
            </el-form-item>
            <el-form-item label="Status" v-if="isEditing" :label-width="formLabelWidth">
              <el-select
                  v-model="form.status"
                  placeholder="Select a Role"
                >
                  <el-option
                label="Active"
                value="active"
                  />
                  <el-option
                label="Non-Active"
                value="nonactive"
                  />
                </el-select>
            </el-form-item>
          </el-form>
          <template #footer>
            <div class="dialog-footer">
              <el-button @click="dialogFormVisible = false">Cancel</el-button>
              <el-button type="primary" @click="submitForm">
                {{ isEditing ? 'Update' : 'Submit' }}
              </el-button>
            </div>
          </template>
        </el-dialog>
          </div>
        </div>

        <!-- Tabel Data -->
        <div class="overflow-x-auto bg-white rounded-lg shadow-lg">
          <table class="min-w-full bg-white border">
            <thead class="bg-gray-200">
              <tr>
                <th class="px-6 py-3 text-left cursor-pointer" @click="sortTable('id')">
                  <div class="flex items-center">
                    ID
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="w-4 h-4 ml-2"
                      :class="sortKey === 'id' && sortOrder === 'asc' ? 'transform rotate-180' : ''"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </th>
                <th class="px-6 py-3 text-left">Nama Kategori</th>
                <th class="px-6 py-3 text-left">Status</th>
                <th class="px-6 py-3 text-left">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="kategori in paginatedKategoris"
                :key="kategori.id"
                class="transition-colors duration-300 border-t hover:bg-gray-100"
              >
                <td class="px-6 py-4">{{ kategori.id }}</td>
                <td class="px-6 py-4">{{ kategori.nama_kategori }}</td>
                <td class="px-6 py-4">{{ kategori.status }}</td>
                <td class="px-6 py-4 ">
                  <button
                    @click="editKategori(kategori.id)"
                    class="relative inline-block px-6 py-3 font-medium text-yellow-600 transition duration-300 bg-white border-2 border-yellow-600 rounded-lg group hover:bg-yellow-600 hover:text-white"
                  >
                    <span class="relative flex items-center"><span><EditKategoriIcon class="w-5 h-5 mr-2"/></span>Edit</span>
                  </button>
                  <button
                    @click="deleteKategori(kategori.id)"
                    class="relative inline-block px-6 py-3 font-medium text-red-600 transition duration-300 bg-white border-2 border-red-600 rounded-lg group hover:bg-red-600 hover:text-white"
                  >
                    <span class="relative flex items-center"><span><DeleteKategoriIcon class="w-5 h-5 mr-2"/></span>Hapus</span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="flex justify-center mt-4">
          <button
            @click="previousPage"
            :disabled="currentPage === 1"
            class="px-4 py-2 mx-1 bg-gray-200 border rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Sebelumnya
          </button>
          <button
            @click="nextPage"
            :disabled="currentPage === totalPages"
            class="px-4 py-2 mx-1 bg-gray-200 border rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Selanjutnya
          </button>
        </div>
    </MainLayout>
</template>

<script setup lang="ts">
import MainLayout from '@/components/layouts/MainLayout.vue';
import AddKategoriIcon from '@/components/icons/AddKategoriIcon.vue';
import EditKategoriIcon from '@/components/icons/EditKategoriIcon.vue';
import DeleteKategoriIcon from '@/components/icons/DeleteKategoriIcon.vue';
import { ref, computed, onMounted, reactive, watch } from 'vue';
import { useKategoriStore } from '@/stores/kategoriStore';
import Swal from 'sweetalert2';
import { ElLoading, ElNotification } from 'element-plus';
interface Form {
  kategori: string;
  status: string;
}

const kategoriStore = useKategoriStore();
const searchQuery = ref('');
const filterStatus = ref('');
const currentPage = ref(1);
const itemsPerPage = ref(10); 
const sortKey = ref<'id' | 'nama_kategori' | 'status'>('id');
const sortOrder = ref('asc');


onMounted(() => {
fetchAndLoadCategories();
});

const dialogFormVisible = ref(false);
const formLabelWidth = "120px";
const isEditing = ref(false);
const kategoriIdToEdit = ref<number | null>(null);
const loading = ref(null);

const fetchAndLoadCategories = async () => {
      openFullScreen();
      try {
        await kategoriStore.fetchKategoris(); 
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        closeFullScreen();
      }
    };


    const closeFullScreen = () => {
      if (loading.value) {
        loading.value.close();
        loading.value = null;
      }
    };

const openModal = async (isEdit: boolean, kategori?: any) => {
  isEditing.value = isEdit;
  if (isEdit && kategori) {
    form.kategori = kategori.nama_kategori
    form.status = kategori.status
    kategoriIdToEdit.value =kategori.id; // Store user ID for editing
  } else {
    resetForm();
  }
  dialogFormVisible.value = true;
};
// Define the form using reactive
const form = reactive<Form>({
  kategori: '',
  status: 'active',
});



watch(dialogFormVisible, (newVal) => {
  if (!newVal) {
    resetForm();
  }
});

// Function to reset the form fields
const resetForm = () => {
  form.kategori=''
};

const filteredKategoris = computed(() => {
  let kategoris = kategoriStore.kategoris;

  if (searchQuery.value) {
    kategoris = kategoris.filter(kategori =>
      kategori.nama_kategori?.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }

  if (filterStatus.value) {
    kategoris = kategoris.filter(kategori =>
      kategori.status === filterStatus.value
    );
  }

  if (sortKey.value) {
    kategoris = kategoris.sort((a, b) => {
      let result = 0;
      if (a[sortKey.value] < b[sortKey.value]) {
        result = -1;
      } else if (a[sortKey.value] > b[sortKey.value]) {
        result = 1;
      }
      return sortOrder.value === 'asc' ? result : -result;
    });
  }

  return kategoris;
});

const paginatedKategoris = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredKategoris.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(filteredKategoris.value.length / itemsPerPage.value);
});

const openFullScreen = () => {
      loading.value = ElLoading.service({
        lock: true,
        text: 'Loading',
        background: 'rgba(0, 0, 0, 0.7)',
      });
    };

const submitForm = async () => {
  if (isEditing.value && kategoriIdToEdit.value) {
    
    await kategoriStore.updateKategori(kategoriIdToEdit.value, form.kategori,form.status);
    ElNotification({
      title: "Success",
      message: `Kategori ${form.kategori} updated successfully!`,
      type: "success",
    });
  } else {
    // Adding a new Kategori
    await kategoriStore.createKategori(form.kategori,form.status);
    ElNotification({
      title: "Success",
      message: "Kategori added successfully!",
      type: "success",
    });
  }

  dialogFormVisible.value = false;
  fetchAndLoadCategories();
};

const editKategori = async (id: number) => {
  const fetchedKategori = await kategoriStore.fetchKategori(id);
  if(fetchedKategori){
    openModal(true,fetchedKategori)
  }
};

const deleteKategori = async (id: number) => {
  const result = await Swal.fire({
    title: 'Apakah Anda yakin?',
    text: "Anda tidak akan bisa mengembalikan data ini!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Ya, hapus!',
    cancelButtonText: 'Batal'
  });

  if (result.isConfirmed) {
    try {
      await kategoriStore.deleteKategori(id);
      Swal.fire(
        'Terhapus!',
        'Kategori telah dihapus.',
        'success'
      );
    } catch (error) {
      Swal.fire(
        'Gagal!',
        'Terjadi kesalahan saat menghapus kategori.',
        'error'
      );
    }
  }
};


const sortTable = (key: string) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortKey.value = key;
    sortOrder.value = 'asc';
  }
};

const performSearch = () => {
  currentPage.value = 1;
  kategoriStore.fetchKategoris();
};

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};
</script>