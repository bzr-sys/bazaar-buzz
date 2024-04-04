<script setup lang="ts">
import { useSubscriptionsStore } from "@/stores/subscriptions";

const subscriptionsStore = useSubscriptionsStore();
</script>

<template>
  <div v-if="subscriptionsStore.feed.length > 0">
    <div
      v-for="p in subscriptionsStore.feed"
      :key="p.id"
      class="bg-neutral-200 p-3 my-2"
    >
      <div class="text-right text-xs text-neutral-500">at {{ p.ts }}</div>
      <div class="pt-2">
        {{ p.text }}
      </div>
      <div class="text-sm text-neutral-500">by {{ p.user }}</div>
    </div>
  </div>
  <div v-else class="bg-neutral-200 p-3 my-2">
    <p class="p-3 italic">Nothing here. Follow people to see their posts.</p>
  </div>
</template>

<style scoped lang="scss"></style>
