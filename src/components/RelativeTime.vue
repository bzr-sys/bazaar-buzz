<script setup lang="ts">
import { computed } from "vue";

import { useNow } from "@/composables/useNow";
import { fullTime, relativeTime, toDate } from "@/utils/time";

const props = defineProps<{ ts: string | Date }>();
const now = useNow();

const label = computed(() => relativeTime(props.ts, now.value));
const iso = computed(() => {
  const date = toDate(props.ts);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
});
</script>

<template>
  <time :datetime="iso" :title="fullTime(ts)">{{ label }}</time>
</template>
