<script setup lang="ts">
import { useFindPeople } from "@/stores/ui";
import AppIcon from "./AppIcon.vue";

// "search": the wide search-field look; "primary"/"secondary": a normal button.
withDefaults(defineProps<{ variant?: "search" | "primary" | "secondary" }>(), {
  variant: "secondary",
});

const findPeople = useFindPeople();
</script>

<template>
  <button
    v-if="variant === 'search'"
    type="button"
    class="flex min-h-12 w-full items-center gap-2.5 rounded-full border border-line bg-surface px-[18px] text-left text-[15px] text-muted hover:border-line-strong"
    @click="findPeople"
  >
    <AppIcon name="search" :size="18" />
    Find people on Bazaar
  </button>
  <button
    v-else
    type="button"
    class="inline-flex min-h-11 items-center gap-2 rounded-full px-[18px] text-sm font-extrabold"
    :class="
      variant === 'primary'
        ? 'bg-honey text-on-honey hover:brightness-95'
        : 'border border-line-strong bg-surface text-ink hover:bg-subtle'
    "
    @click="findPeople"
  >
    <AppIcon name="search" :size="16" />
    Find people
  </button>
</template>
