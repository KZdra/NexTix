<template>
  <MainLayout>
    <div class="max-w-4xl mx-auto space-y-6 pb-12">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <div class="inline-flex items-center space-x-2 text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full mb-1.5">
            <font-awesome-icon icon="fa-solid fa-circle-question" class="text-xs" />
            <span>Pusat Informasi & Bantuan</span>
          </div>
          <h1 class="text-2xl font-black tracking-tight text-gray-900">
            Pertanyaan yang Sering Diajukan (FAQ)
          </h1>
          <p class="text-xs text-gray-500 mt-0.5">
            Temukan jawaban cepat seputar penggunaan aplikasi, alur tiket kendala, dan waktu penanganan
          </p>
        </div>

        <button
          v-if="canCreateEditFaqs"
          @click="openModal(false)"
          class="inline-flex items-center justify-center space-x-2 px-5 py-2.5 font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 active:scale-95 rounded-xl shadow-md shadow-blue-500/20 transition-all"
        >
          <font-awesome-icon icon="fa-solid fa-circle-plus" class="text-base" />
          <span>Tambah FAQ</span>
        </button>
      </div>

      <!-- FAQ Accordion List -->
      <div class="space-y-3">
        <Accordion
          v-for="faq in faqs"
          :key="faq.id"
          :id="faq.id"
          :question="faq.question"
          :answer="faq.answer"
          :hasAdmin="canCreateEditFaqs"
          @edit="editFaq(faq.id)"
          @delete="deleteFaq(faq.id)"
        />

        <div v-if="faqs.length === 0" class="bg-white p-12 rounded-2xl border border-gray-200 text-center text-gray-400 space-y-2">
          <font-awesome-icon icon="fa-solid fa-circle-question" class="text-3xl" />
          <h4 class="text-sm font-bold text-gray-700">Belum Ada FAQ</h4>
          <p class="text-xs text-gray-400">Pertanyaan dan panduan bantuan akan ditampilkan di sini.</p>
        </div>
      </div>

      <!-- Modal Add/Edit FAQ -->
      <el-dialog
        v-model="dialogFormVisible"
        :title="isEditing ? 'Perbarui Pertanyaan & Jawaban' : 'Tambah FAQ Baru'"
        width="560px"
        destroy-on-close
        class="rounded-2xl"
      >
        <template #header>
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <font-awesome-icon icon="fa-solid fa-circle-question" class="text-base" />
            </div>
            <div>
              <h3 class="text-base font-bold text-gray-900">
                {{ isEditing ? 'Edit Pertanyaan FAQ' : 'Form FAQ Baru' }}
              </h3>
              <p class="text-xs text-gray-500">Kelola informasi bantuan untuk memudahkan pengguna</p>
            </div>
          </div>
        </template>

        <el-form :model="form" label-position="top" class="space-y-4 pt-2">
          <el-form-item label="Pertanyaan" required>
            <el-input
              v-model="form.question"
              placeholder="Contoh: Berapa lama waktu yang dibutuhkan untuk merespon tiket?"
              size="large"
            />
          </el-form-item>

          <el-form-item label="Jawaban / Solusi" required>
            <el-input
              type="textarea"
              :rows="4"
              v-model="form.answer"
              placeholder="Tuliskan jawaban lengkap dan jelas..."
            />
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
              {{ isEditing ? "Simpan Perubahan" : "Simpan FAQ" }}
            </el-button>
          </div>
        </template>
      </el-dialog>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import Accordion from "@/components/Accordion.vue";
import MainLayout from "@/components/layouts/MainLayout.vue";
import { onMounted, ref, computed, reactive, watch } from "vue";
import { apiService } from "@/utils/apiService";
import { useAuthStore } from "@/stores/authStore";
import { ElNotification } from "element-plus";
import Swal from "sweetalert2";

const authStore = useAuthStore();
const loading = ref(false);
const submitting = ref(false);
const dialogFormVisible = ref(false);
const isEditing = ref(false);
const faqIdToEdit = ref<number>();

type UserRole = "admin" | "support" | "client";
const userRoles = computed<UserRole[]>(() => [authStore.user?.role].filter(Boolean) as UserRole[]);
const canCreateEditFaqs = computed(() => userRoles.value.includes("admin"));

interface Faqs {
  id: number;
  question: string;
  answer: string;
}

const faqs = ref<Faqs[]>([]);

onMounted(() => {
  fetchFaqs();
});

const form = reactive({
  question: "",
  answer: "",
});

watch(dialogFormVisible, (newVal) => {
  if (!newVal) {
    resetForm();
  }
});

const openModal = (isEdit: boolean, faq?: any) => {
  isEditing.value = isEdit;
  if (isEdit && faq) {
    form.question = faq.question;
    form.answer = faq.answer;
    faqIdToEdit.value = faq.id;
  } else {
    resetForm();
  }
  dialogFormVisible.value = true;
};

const fetchFaqs = async () => {
  loading.value = true;
  try {
    const response = await apiService.apiGet("/api/auth/faqs");
    if (response && response.data) {
      faqs.value = Array.isArray(response.data) ? response.data : (response.data.data || []);
    }
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const editFaq = async (id: number) => {
  const fetchedFaq = await apiService.apiGet(`/api/auth/faqs/${id}`);
  if (fetchedFaq) {
    const data = fetchedFaq.data.data || fetchedFaq.data;
    openModal(true, data);
  }
};

const resetForm = () => {
  form.question = "";
  form.answer = "";
};

const submitForm = async () => {
  if (!form.question.trim() || !form.answer.trim()) {
    ElNotification({
      title: "Peringatan",
      message: "Pertanyaan dan jawaban wajib diisi!",
      type: "warning",
    });
    return;
  }

  submitting.value = true;
  try {
    if (isEditing.value && faqIdToEdit.value) {
      await apiService.apiPut(`/api/auth/faqs/${faqIdToEdit.value}`, form);
      ElNotification({
        title: "Sukses",
        message: "FAQ berhasil diperbarui!",
        type: "success",
      });
    } else {
      await apiService.apiPost("/api/auth/faqs", form);
      ElNotification({
        title: "Sukses",
        message: "FAQ baru berhasil ditambahkan!",
        type: "success",
      });
    }

    dialogFormVisible.value = false;
    await fetchFaqs();
  } catch (error) {
    console.error(error);
  } finally {
    submitting.value = false;
  }
};

const deleteFaq = async (id: number) => {
  try {
    await apiService.apiDelete(`/api/auth/faqs/${id}`, {});
    ElNotification({
      title: "Terhapus",
      message: "FAQ telah dihapus.",
      type: "success",
    });
  } catch (error) {
    Swal.fire("Gagal!", "Terjadi kesalahan saat menghapus FAQ.", "error");
  } finally {
    await fetchFaqs();
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

