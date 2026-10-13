<script setup lang="ts">
import type { Person } from "@/types";
import { avatarColor } from "@/utils/avatar";
import UserAvatar from "./UserAvatar.vue";

withDefaults(
  defineProps<{ user: Partial<Person>; summary?: string; you?: boolean }>(),
  {
    summary: "",
    you: false,
  },
);
</script>

<template>
  <header
    class="overflow-hidden bg-surface md:rounded-2xl md:border md:border-line"
  >
    <div
      class="h-20 dark:opacity-60 md:h-24"
      :style="{ backgroundColor: user.id ? avatarColor(user.id) : undefined }"
      aria-hidden="true"
    ></div>
    <div class="flex items-end justify-between gap-3 px-5">
      <span class="-mt-10 rounded-full border-[5px] border-surface">
        <UserAvatar :user="user" size="xl" />
      </span>
      <div class="flex flex-wrap justify-end gap-2 pt-3">
        <slot name="actions" />
      </div>
    </div>
    <div class="px-5 pb-4 pt-2">
      <h1
        class="flex flex-wrap items-center gap-2 text-[22px] font-extrabold leading-tight"
      >
        {{ user.name || user.handle }}
        <span
          v-if="you"
          class="rounded-full bg-inverse px-2 py-0.5 text-xs font-bold text-on-inverse"
          >You</span
        >
      </h1>
      <p class="text-sm text-muted">
        @{{ user.handle }}<template v-if="summary"> · {{ summary }}</template>
      </p>
    </div>
  </header>
</template>
