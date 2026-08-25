<template>
  <span :class="['inline-flex items-center', priorityColorClass]">
    <font-awesome-icon :icon="priorityIcon" class="mr-1.5" />
    <span v-if="showLabel" class="text-xs font-semibold">{{ priorityName }}</span>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    priority?: string;
    props?: string; // fallback for backwards compatibility
    showLabel?: boolean;
  }>(),
  {
    priority: '',
    props: '',
    showLabel: false,
  }
);

const priorityName = computed(() => props.priority || props.props || 'Normal');

const priorityIcon = computed(() => {
  const p = priorityName.value.toLowerCase();
  switch (p) {
    case 'critical':
    case 'block':
      return ['fas', 'triangle-exclamation'];
    case 'major':
      return ['fas', 'circle-exclamation'];
    case 'minor':
    case 'trivial':
      return ['fas', 'circle-check'];
    case 'normal':
    default:
      return ['fas', 'circle-info'];
  }
});

const priorityColorClass = computed(() => {
  const p = priorityName.value.toLowerCase();
  switch (p) {
    case 'critical':
    case 'block':
      return 'text-red-600';
    case 'major':
      return 'text-amber-600';
    case 'minor':
    case 'trivial':
      return 'text-emerald-600';
    case 'normal':
    default:
      return 'text-blue-600';
  }
});
</script>
  