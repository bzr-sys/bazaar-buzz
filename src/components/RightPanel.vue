<script setup lang="ts">
import { computed } from "vue";

import { useSubscriptionsStore } from "@/stores/subscriptions";
import FindPeopleButton from "./FindPeopleButton.vue";
import UserAvatar from "./UserAvatar.vue";

const subscriptionsStore = useSubscriptionsStore();
const shown = computed(() => subscriptionsStore.following.slice(0, 5));
</script>

<template>
  <!-- Wide screens only -->
  <aside
    class="sticky top-0 hidden h-fit w-[340px] shrink-0 flex-col gap-4 py-7 xl:flex"
  >
    <FindPeopleButton variant="search" />
    <section
      class="flex flex-col gap-3.5 rounded-2xl border border-line bg-surface p-[18px]"
    >
      <div class="flex items-baseline justify-between">
        <h2 class="text-lg font-extrabold">Following</h2>
        <RouterLink
          v-if="subscriptionsStore.following.length > 0"
          :to="{ name: 'following' }"
          class="text-sm font-semibold text-honey-text hover:underline"
        >
          See all {{ subscriptionsStore.following.length }}
        </RouterLink>
      </div>
      <p v-if="shown.length === 0" class="text-sm leading-relaxed text-body">
        You're not following anyone yet. Find people from Bazaar to fill your
        feed.
      </p>
      <div v-for="user in shown" :key="user.id" class="flex items-center gap-3">
        <RouterLink
          :to="{ name: 'user', params: { handle: user.handle } }"
          tabindex="-1"
          class="rounded-full"
        >
          <UserAvatar :user="user" size="sm" />
        </RouterLink>
        <div class="flex min-w-0 flex-1 flex-col leading-snug">
          <RouterLink
            :to="{ name: 'user', params: { handle: user.handle } }"
            class="truncate text-[15px] font-bold hover:underline"
          >
            {{ user.name || user.handle }}
          </RouterLink>
          <span class="truncate text-[13px] text-muted"
            >@{{ user.handle }}</span
          >
        </div>
        <button
          type="button"
          class="min-h-9 shrink-0 rounded-full border border-line-strong bg-surface px-3.5 text-[13px] font-bold hover:bg-subtle"
          :aria-label="`Unfollow ${user.name || user.handle}`"
          @click="subscriptionsStore.unsubscribe(user.id)"
        >
          Unfollow
        </button>
      </div>
    </section>
    <section class="flex flex-col gap-2 rounded-2xl bg-honey-soft p-[18px]">
      <h2 class="text-[15px] font-extrabold">Your posts are yours</h2>
      <p class="text-sm leading-relaxed text-body">
        Each post lives in its author's Bazaar database; Buzz only reads them.
        Home shows people you follow and your own posts.
      </p>
    </section>
  </aside>
</template>
