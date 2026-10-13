<script setup lang="ts">
import { useSubscriptionsStore } from "@/stores/subscriptions";
import EmptyState from "@/components/EmptyState.vue";
import FindPeopleButton from "@/components/FindPeopleButton.vue";
import RelativeTime from "@/components/RelativeTime.vue";
import UserAvatar from "@/components/UserAvatar.vue";

const subscriptionsStore = useSubscriptionsStore();
</script>

<template>
  <div class="flex flex-col gap-3.5 px-3 py-4 md:px-0 md:py-7">
    <h1 class="text-2xl font-extrabold tracking-tight">Following</h1>
    <FindPeopleButton variant="search" />
    <p class="text-[13px] text-muted">
      Search Bazaar by name, handle or email. Picking someone opens their
      profile.
    </p>

    <EmptyState
      v-if="subscriptionsStore.followCount === 0"
      title="Nobody here yet"
      label="Following"
    >
      Follow people to see their posts on Home.
      <template #actions>
        <FindPeopleButton variant="primary" />
      </template>
    </EmptyState>

    <ul class="flex flex-col gap-3">
      <li
        v-for="user in subscriptionsStore.following"
        :key="user.id"
        class="flex items-center gap-3 rounded-2xl border border-line bg-surface px-4 py-3.5"
      >
        <RouterLink
          :to="{ name: 'user', params: { handle: user.handle } }"
          tabindex="-1"
          class="rounded-full"
        >
          <UserAvatar :user="user" />
        </RouterLink>
        <div class="flex min-w-0 flex-1 flex-col leading-snug">
          <RouterLink
            :to="{ name: 'user', params: { handle: user.handle } }"
            class="truncate text-base font-extrabold hover:underline"
          >
            {{ user.name || user.handle }}
          </RouterLink>
          <span class="truncate text-sm text-muted">
            @{{ user.handle }}
            <template v-if="subscriptionsStore.lastPostTs(user.id)">
              · last post
              <RelativeTime :ts="subscriptionsStore.lastPostTs(user.id)!" />
            </template>
          </span>
        </div>
        <button
          type="button"
          class="min-h-10 shrink-0 rounded-full border border-line-strong bg-surface px-4 text-sm font-bold hover:bg-subtle"
          :aria-label="`Unfollow ${user.name || user.handle}`"
          @click="subscriptionsStore.unsubscribe(user.id)"
        >
          Unfollow
        </button>
      </li>
    </ul>
  </div>
</template>
