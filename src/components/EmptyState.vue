<script setup lang="ts">
withDefaults(
  defineProps<{ title: string; label?: string; illustration?: boolean }>(),
  {
    illustration: false,
  },
);
</script>

<template>
  <section
    class="flex items-center gap-5 rounded-2xl border border-line bg-surface p-6"
  >
    <svg
      v-if="illustration"
      class="hidden shrink-0 sm:block"
      width="74"
      height="70"
      viewBox="0 0 74 70"
      aria-hidden="true"
    >
      <path d="M20 4l14 8v16l-14 8-14-8V12z" fill="#ffe08a" />
      <path d="M50 18l14 8v16l-14 8-14-8V26z" fill="#f2b705" />
      <path d="M24 36l14 8v16l-14 8-14-8V44z" fill="#fff3c4" />
    </svg>
    <div class="flex flex-col gap-1.5">
      <p v-if="label" class="text-[13px] font-bold text-muted">{{ label }}</p>
      <h2 class="text-[19px] font-extrabold">{{ title }}</h2>
      <div class="text-sm leading-relaxed text-body"><slot /></div>
      <div v-if="$slots.actions" class="mt-1.5 flex flex-wrap gap-2">
        <slot name="actions" />
      </div>
    </div>
  </section>
</template>
