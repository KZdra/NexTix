<template>
  <el-dialog
    v-model="visible"
    title="Survei Kepuasan Layanan (CSAT)"
    width="500px"
    align-center
    destroy-on-close
    class="rounded-2xl"
    :close-on-click-modal="false"
  >
    <template #header>
      <div class="flex items-center space-x-3">
        <div class="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
          <font-awesome-icon icon="fa-solid fa-star" class="text-base" />
        </div>
        <div>
          <h3 class="text-base font-bold text-gray-900">Penilaian Layanan Tiket</h3>
          <p class="text-xs text-gray-500">Beri rating penanganan kendala oleh tim teknisi</p>
        </div>
      </div>
    </template>

    <div class="space-y-5 pt-1 text-center">
      <div class="p-3 bg-blue-50/70 border border-blue-100 rounded-xl text-xs text-blue-900">
        Tiket <strong>#{{ ticketNumber }}</strong> telah selesai. Bagaimana kepuasan Anda terhadap kecepatan & solusi yang diberikan?
      </div>

      <!-- Interactive 5-star rating -->
      <div class="flex items-center justify-center gap-2 py-2">
        <button
          v-for="star in 5"
          :key="star"
          type="button"
          @click="selectedRating = star"
          @mouseenter="hoverRating = star"
          @mouseleave="hoverRating = 0"
          class="p-2 transition-transform hover:scale-125 focus:outline-none"
        >
          <font-awesome-icon
            :icon="(hoverRating || selectedRating) >= star ? 'fa-solid fa-star' : 'fa-regular fa-star'"
            class="text-3xl transition-colors"
            :class="(hoverRating || selectedRating) >= star ? 'text-amber-400 drop-shadow-sm' : 'text-gray-300'"
          />
        </button>
      </div>

      <!-- Rating Label -->
      <div class="text-xs font-bold text-gray-700 h-5">
        {{ ratingLabel }}
      </div>

      <!-- Feedback Textarea -->
      <div class="text-left space-y-1.5">
        <label class="block text-xs font-semibold text-gray-700">Ulasan & Catatan Masukan (Opsional)</label>
        <textarea
          v-model="feedback"
          rows="3"
          placeholder="Ceritakan pengalaman Anda terkait keramahan teknisi, ketepatan solusi, atau saran perbaikan..."
          class="w-full p-3 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-gray-50/50 hover:bg-white transition-colors"
        ></textarea>
      </div>
    </div>

    <template #footer>
      <div class="flex items-center justify-end space-x-3 pt-3 border-t border-gray-100">
        <el-button @click="visible = false" size="large">Nanti Saja</el-button>
        <el-button
          type="primary"
          @click="handleSubmitRating"
          :loading="ratingStore.submitting"
          :disabled="selectedRating === 0"
          size="large"
          class="bg-amber-500 hover:bg-amber-600 border-amber-500 hover:border-amber-600 font-bold"
        >
          Kirim Penilaian
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRatingStore } from "@/stores/ratingStore";
import { ElNotification } from "element-plus";

const props = defineProps<{
  ticketId: number;
  ticketNumber: string;
}>();

const emit = defineEmits(["rated"]);

const ratingStore = useRatingStore();
const visible = ref(false);
const selectedRating = ref(5);
const hoverRating = ref(0);
const feedback = ref("");

const ratingLabel = computed(() => {
  const current = hoverRating.value || selectedRating.value;
  switch (current) {
    case 5:
      return "⭐⭐⭐⭐⭐ Sangat Puas (Pelayanan Luar Biasa)";
    case 4:
      return "⭐⭐⭐⭐ Puas (Solusi Cepat & Tepat)";
    case 3:
      return "⭐⭐⭐ Cukup (Kendala Terselesaikan)";
    case 2:
      return "⭐⭐ Kurang Puas (Penanganan Cukup Lama)";
    case 1:
      return "⭐ Sangat Kecewa (Kendala Belum Tuntas / Lambat)";
    default:
      return "Pilih bintang untuk menilai";
  }
});

const open = () => {
  selectedRating.value = 5;
  hoverRating.value = 0;
  feedback.value = "";
  visible.value = true;
};

const handleSubmitRating = async () => {
  if (selectedRating.value === 0) return;
  try {
    await ratingStore.submitRating(props.ticketId, selectedRating.value, feedback.value);
    ElNotification({
      title: "Terima Kasih!",
      message: "Penilaian dan masukan Anda sangat berharga untuk peningkatan kualitas layanan kami.",
      type: "success",
    });
    visible.value = false;
    emit("rated", { rating: selectedRating.value, feedback: feedback.value });
  } catch (error) {
    console.error(error);
  }
};

defineExpose({ open });
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
