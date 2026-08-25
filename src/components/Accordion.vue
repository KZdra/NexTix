<template>
  <div class="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-xs transition-all hover:border-blue-300">
    <button
      @click="toggle"
      class="w-full text-left px-5 py-4 bg-white hover:bg-gray-50/80 flex items-center justify-between transition-colors focus:outline-none"
    >
      <span class="text-sm font-bold text-gray-900 pr-4">{{ question }}</span>
      <div
        class="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 transition-transform duration-200 flex-shrink-0"
        :class="{ 'rotate-180 bg-blue-50 text-blue-600': isOpen }"
      >
        <font-awesome-icon icon="fa-solid fa-chevron-down" class="text-xs" />
      </div>
    </button>
    <div v-if="isOpen" class="px-5 pb-5 pt-1 text-xs text-gray-600 leading-relaxed border-t border-gray-100 space-y-3 bg-gray-50/40">
      <p class="whitespace-pre-line">{{ answer }}</p>
      
      <div class="flex items-center justify-end gap-2 pt-2 border-t border-gray-200/60" v-if="hasAdmin">
        <button
          @click="handleEdit"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-amber-600 hover:text-white bg-amber-50 hover:bg-amber-600 border border-amber-200 hover:border-amber-600 rounded-lg transition-all"
        >
          <font-awesome-icon icon="fa-solid fa-pen-to-square" class="text-xs" />
          <span>Edit</span>
        </button>
        <button
          @click="handleDelete"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-red-600 hover:text-white bg-red-50 hover:bg-red-600 border border-red-200 hover:border-red-600 rounded-lg transition-all"
        >
          <font-awesome-icon icon="fa-solid fa-trash-can" class="text-xs" />
          <span>Hapus</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Swal from "sweetalert2";

const props = defineProps<{
  id: number;
  question: string;
  answer: string;
  hasAdmin: boolean;
}>();
const emits = defineEmits(["edit", "delete"]);

function handleEdit() {
  emits("edit", props.id);
}

async function handleDelete() {
  const result = await Swal.fire({
    title: "Hapus FAQ?",
    text: "Pertanyaan ini akan dihapus dari daftar pusat bantuan.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#dc2626",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Ya, Hapus!",
    cancelButtonText: "Batal",
  });

  if (result.isConfirmed) {
    emits("delete", props.id);
  }
}

const isOpen = ref(false);

const toggle = () => {
  isOpen.value = !isOpen.value;
};
</script>

<style scoped>
/* Scoped styles */
</style>

