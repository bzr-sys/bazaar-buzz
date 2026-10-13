<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";

import { useUiStore } from "@/stores/ui";
import PostComposer from "./PostComposer.vue";

const uiStore = useUiStore();
const dialog = ref<HTMLElement>();
let lastFocus: Element | null = null;

function onKeydown(e: KeyboardEvent) {
  if (e.key === "Escape") uiStore.closeCompose();
}

onMounted(() => {
  lastFocus = document.activeElement;
  document.body.style.overflow = "hidden";
});

onBeforeUnmount(() => {
  document.body.style.overflow = "";
  if (lastFocus instanceof HTMLElement) lastFocus.focus();
});
</script>

<template>
  <!-- A bottom sheet on phones, a centred dialog on larger screens -->
  <div
    class="fixed inset-0 z-30 flex items-end justify-center md:items-start md:pt-[12vh]"
  >
    <div
      class="absolute inset-0 bg-backdrop/50"
      aria-hidden="true"
      @click="uiStore.closeCompose()"
    ></div>
    <div
      ref="dialog"
      role="dialog"
      aria-modal="true"
      aria-labelledby="compose-title"
      class="relative flex w-full flex-col gap-3.5 rounded-t-[22px] bg-surface px-4 pb-6 pt-3.5 shadow-xl md:max-w-[600px] md:rounded-[22px] md:p-5"
      @keydown="onKeydown"
    >
      <div
        class="h-[5px] w-10 self-center rounded bg-line-strong md:hidden"
        aria-hidden="true"
      ></div>
      <div class="flex items-center justify-between">
        <h2 id="compose-title" class="text-lg font-extrabold">New post</h2>
        <button
          type="button"
          class="min-h-11 px-1.5 text-[15px] font-semibold text-muted hover:text-ink"
          @click="uiStore.closeCompose()"
        >
          Cancel
        </button>
      </div>
      <PostComposer autofocus :rows="5" @posted="uiStore.closeCompose()" />
    </div>
  </div>
</template>
