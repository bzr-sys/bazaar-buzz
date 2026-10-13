<script setup lang="ts">
withDefaults(defineProps<{ size?: number; wordmark?: boolean }>(), {
  size: 32,
  wordmark: true,
});
</script>

<template>
  <span class="flex items-center gap-2.5">
    <svg :width="size" :height="size" viewBox="0 0 34 34" aria-hidden="true">
      <path d="M17 2l13 7.5v15L17 32 4 24.5v-15z" fill="#f2b705" />
      <path
        d="M11 14h12M11 18h12M11 22h8"
        stroke="#15171a"
        stroke-width="2.4"
        stroke-linecap="round"
      />
    </svg>
    <span v-if="wordmark" class="text-2xl font-extrabold tracking-tight"
      >Buzz</span
    >
  </span>
</template>
