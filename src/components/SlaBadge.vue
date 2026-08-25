<template>
  <div class="inline-flex items-center gap-1.5 font-bold text-[11px] rounded-lg px-2.5 py-1 border shadow-2xs" :class="slaStyleClass">
    <font-awesome-icon :icon="slaIcon" :class="{ 'animate-spin': isNearBreach && !isBreached && !isResolved }" />
    <span>{{ slaText }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import duration from "dayjs/plugin/duration";

dayjs.extend(relativeTime);
dayjs.extend(duration);

const props = defineProps<{
  responseDueAt?: string | null;
  resolutionDueAt?: string | null;
  firstRespondedAt?: string | null;
  resolvedAt?: string | null;
  isSlaBreached?: boolean;
  status?: string;
}>();

const isResolved = computed(() => props.status === "closed" || Boolean(props.resolvedAt));
const isBreached = computed(() => Boolean(props.isSlaBreached));

const targetDueAt = computed(() => {
  if (props.status === "open" && !props.firstRespondedAt && props.responseDueAt) {
    return props.responseDueAt;
  }
  return props.resolutionDueAt;
});

const isNearBreach = computed(() => {
  if (isResolved.value || isBreached.value || !targetDueAt.value) return false;
  const now = dayjs();
  const due = dayjs(targetDueAt.value);
  const diffMinutes = due.diff(now, "minute");
  return diffMinutes > 0 && diffMinutes <= 60; // Kurang dari 60 menit
});

const slaText = computed(() => {
  if (isResolved.value) {
    return isBreached.value ? "SLA Breached (Terlambat)" : "SLA Met (Tepat Waktu)";
  }

  if (isBreached.value) {
    return "SLA Melewati Batas";
  }

  if (!targetDueAt.value) {
    return "SLA Reguler";
  }

  const now = dayjs();
  const due = dayjs(targetDueAt.value);
  const diffMinutes = due.diff(now, "minute");

  if (diffMinutes <= 0) {
    return "SLA Overdue";
  }

  if (diffMinutes < 60) {
    return `SLA Sisa ${diffMinutes} mnt`;
  }

  const hours = Math.floor(diffMinutes / 60);
  const mins = diffMinutes % 60;
  return `SLA Sisa ${hours}j ${mins}m`;
});

const slaStyleClass = computed(() => {
  if (isResolved.value) {
    return isBreached.value
      ? "bg-rose-50 text-rose-700 border-rose-200"
      : "bg-emerald-50 text-emerald-700 border-emerald-200";
  }

  if (isBreached.value) {
    return "bg-rose-100/90 text-rose-800 border-rose-300 animate-pulse";
  }

  if (isNearBreach.value) {
    return "bg-amber-100 text-amber-800 border-amber-300";
  }

  return "bg-blue-50 text-blue-700 border-blue-200";
});

const slaIcon = computed(() => {
  if (isResolved.value) {
    return isBreached.value ? "fa-solid fa-triangle-exclamation" : "fa-solid fa-circle-check";
  }
  if (isBreached.value) {
    return "fa-solid fa-clock-rotate-left";
  }
  if (isNearBreach.value) {
    return "fa-solid fa-hourglass-half";
  }
  return "fa-solid fa-stopwatch";
});
</script>
