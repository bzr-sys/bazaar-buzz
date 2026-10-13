<script setup lang="ts">
import { computed } from "vue";

import type { Person } from "@/types";
import { avatarColor, initials } from "@/utils/avatar";

const props = withDefaults(
  defineProps<{ user?: Partial<Person>; size?: "sm" | "md" | "lg" | "xl" }>(),
  { user: () => ({}), size: "md" },
);

const sizeClass = computed(
  () =>
    ({
      sm: "h-9 w-9 text-xs",
      md: "h-11 w-11 text-sm",
      lg: "h-16 w-16 text-xl",
      xl: "h-20 w-20 text-2xl",
    })[props.size],
);
</script>

<template>
  <span
    class="flex shrink-0 select-none items-center justify-center rounded-full font-bold text-[#15171a]"
    :class="sizeClass"
    :style="{ backgroundColor: user.id ? avatarColor(user.id) : undefined }"
    aria-hidden="true"
  >
    <template v-if="user.id">{{ initials(user.name, user.handle) }}</template>
    <span v-else class="h-full w-full rounded-full bg-subtle"></span>
  </span>
</template>
