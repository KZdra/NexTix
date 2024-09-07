<template>
    <font-awesome-icon
      :icon="getPriorityIcon"
      class="mr-2"
    />
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue';
  
  // Define the type for the ticket prop

  
  // Props
  const props = defineProps();
  
  // Computed property for the icon
  const getPriorityIcon = computed(() => {
    switch (props) {
      case 'Critical':
      case 'Block':
        return ['fas', 'exclamation-triangle'];
      case 'Major':
        return ['fas', 'exclamation-circle'];
      case 'Normal':
        return ['fas', 'info-circle'];
      case 'Minor':
      case 'Trivial':
        return ['fas', 'check-circle'];
      default:
        return ['fas', 'info-circle']; // Default icon if no match
    }
  });
  </script>
  