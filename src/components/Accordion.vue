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
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </div>
      </button>
      <div v-if="isOpen" class="px-4 py-2">
        <p class="text-gray-700">{{ answer }}</p>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  
  const props = defineProps<{
    question: string;
    answer: string;
  }>();
  
  const isOpen = ref(false);
  
  const toggle = () => {
    isOpen.value = !isOpen.value;
  };
  </script>
  
  <style scoped>
  /* Add additional styles if needed */
  </style>
  