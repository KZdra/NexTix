<template>
  <div class="mb-4">
    <button
      @click="toggle"
      class="w-full text-left px-4 py-2 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:bg-gray-300 rounded"
    >
      <div class="flex justify-between items-center">
        <span class="text-lg font-medium text-gray-800">{{ question }}</span>
        <svg
          :class="{ 'transform rotate-180': isOpen }"
          class="w-5 h-5 transition-transform duration-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          ></path>
        </svg>
      </div>
    </button>
    <div v-if="isOpen" class="px-4 py-2">
      <p class="text-gray-700">{{ answer }}</p>
      <div class="flex justify-end mt-2 gap-2" v-if="hasAdmin">
        <button
        @click="handleEdit"
          class="relative inline-block px-6 py-3 font-medium text-yellow-600 transition duration-300 bg-white border-2 border-yellow-600 rounded-lg group hover:bg-yellow-600 hover:text-white"
        >
          <span class="relative flex items-center"
            ><span> <EditKategoriIcon class="w-5 h-5 mr-2" /> </span>Edit</span
          >
        </button>
        <button
        @click="handleDelete"
          class="relative inline-block px-6 py-3 font-medium text-red-600 transition duration-300 bg-white border-2 border-red-600 rounded-lg group hover:bg-red-600 hover:text-white"
        >
          <span class="relative flex items-center"
            ><span> <DeleteKategoriIcon class="w-5 h-5 mr-2" /> </span
            >Hapus</span
          >
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import EditKategoriIcon from "./icons/EditKategoriIcon.vue";
import DeleteKategoriIcon from "./icons/DeleteKategoriIcon.vue";
import Swal from "sweetalert2";

const props = defineProps<{
  id:number
  question: string;
  answer: string;
  hasAdmin:boolean;
}>();
const emits = defineEmits(['edit', 'delete']);

function handleEdit() {
  emits('edit', props.id); 
}

async function handleDelete() {
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  });

  if (result.isConfirmed) {
    emits('delete', props.id); 
    Swal.fire(
      'Deleted!',
      'FAQ has been deleted.',
      'success'
    );
  }
}
const isOpen = ref(false);

const toggle = () => {
  isOpen.value = !isOpen.value;
};
</script>

<style scoped>
/* Add additional styles if needed */
</style>
