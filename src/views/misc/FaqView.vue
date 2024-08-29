<template>
  <MainLayout>
    <div class="bg-white p-6 rounded-lg shadow-lg" v-loading="loading">
      <div class="flex justify-between  items-center">
        <h1 class="text-3xl font-bold text-gray-800 mb-4">FAQ</h1>
         <button v-if="canCreateEditFaqs" @click="openModal(false)"
          class="relative inline-block px-6 py-3 font-medium text-green-600 transition duration-300 bg-white border-2 border-green-600 rounded-lg group hover:bg-green-600 hover:text-white"
        >
          <span class="relative flex items-center">
            <AddIcon class="w-5 h-5 mr-2" />
            <span>Add</span>
          </span>
        </button>
      </div>
      <!-- modal -->
      <el-dialog v-model="dialogFormVisible" :title="isEditing ? 'Update FAQ' : 'Add FAQ'" width="600px">
          <el-form :model="form">
            <el-form-item label="question" :label-width="formLabelWidth">
              <el-input
                v-model="form.question"
                placeholder="isi pertanyaan"
              />
            </el-form-item>
            <el-form-item label="answer" :label-width="formLabelWidth">
              <el-input
                type="textarea"
                v-model="form.answer"
                placeholder="isi jawaban"
              />
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
    <!-- End Modal -->
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
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import Accordion from "@/components/Accordion.vue";
import MainLayout from "@/components/layouts/MainLayout.vue";
import { onMounted, ref,computed, reactive, watch } from "vue";
import { apiService } from "@/utils/apiService";
import { useAuthStore } from "@/stores/authStore";
import AddIcon from "@/components/icons/AddIcon.vue";
import { ElNotification } from "element-plus";
import Swal from "sweetalert2";
const authStore = useAuthStore();
const loading = ref(false);
const dialogFormVisible = ref(false);
const formLabelWidth = "120px";
const isEditing = ref(false);
const faqIdToEdit = ref<number>();

type UserRole = "admin" | "support" | "client";
const userRoles = computed<UserRole[]>( () => [authStore.user?.role].filter(Boolean) as UserRole[]);

// Role-based access control
const canCreateEditFaqs = computed(  () => userRoles.value.includes("admin") );

interface Faqs{
  id:number
  question:string
  answer:string
}

interface Form {
  question:string
  answer:string
}

const faqs = ref<Faqs[]>([])

onMounted(()=>{
 fetchFaqs();
})

const form = reactive<Form>({
  question: '',
  answer: '',
});

watch(dialogFormVisible, (newVal) => {
  if (!newVal) {
    resetForm();
  }
});

const openModal = async (isEdit: boolean, faq?: any) => {
  isEditing.value = isEdit;
  if (isEdit && faq) {
    form.question = faq.question
    form.answer = faq.answer
    faqIdToEdit.value = faq.id
  } else {
    resetForm();
  }
  dialogFormVisible.value = true;
};

const fetchFaqs = async () => {
  loading.value = true;
  try {
  const response= await apiService.apiGet('/api/auth/faqs');
  faqs.value = response.data.data;
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false;
  }
}

const editFaq = async (id: number) => {
  const fetchedFaq = await apiService.apiGet(`/api/auth/faqs/${id}`);
  if(fetchedFaq){
    openModal(true,fetchedFaq.data.data)
  }
};

// Function to reset the form fields
const resetForm = () => {
  form.question= '',
  form.answer= ''
};

const submitForm = async () => {
  if (isEditing.value) {
    await apiService.apiPut(`/api/auth/faqs/${faqIdToEdit.value}`, form);
    ElNotification({
      title: "Success",
      message: `FAQ updated successfully!`,
      type: "success",
    });
  } else {
    // Adding a new Kategori
    await apiService.apiPost('/api/auth/faqs', form);
    ElNotification({
      title: "Success",
      message: "FAQ added successfully!",
      type: "success",
    });
  }

  dialogFormVisible.value = false;
  fetchFaqs();
};


const deleteFaq = async (id: number) => {
  try {
     await apiService.apiDelete(`/api/auth/faqs/${id}`,{});
    } catch (error) {
      Swal.fire(
        'Gagal!',
        'Terjadi kesalahan saat menghapus kategori.',
        'error'
      );
    } finally {
      await fetchFaqs();
    }
  }
</script>

<style scoped>
/* Tambahkan style tambahan jika diperlukan */
</style>
