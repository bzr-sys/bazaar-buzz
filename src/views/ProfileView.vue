<script setup lang="ts">
import { computed } from "vue";

import { useAuthStore } from "@/stores/auth";
import { useDefaultBlogStore } from "@/stores/defaultBlog";
import { useSubscriptionsStore } from "@/stores/subscriptions";
import EmptyState from "@/components/EmptyState.vue";
import PostCard from "@/components/PostCard.vue";
import PostComposer from "@/components/PostComposer.vue";
import ProfileHeader from "@/components/ProfileHeader.vue";

const authStore = useAuthStore();
const defaultBlogStore = useDefaultBlogStore();
const subscriptionsStore = useSubscriptionsStore();

const posts = computed(() => defaultBlogStore.sortedDefaultBlog);
const summary = computed(() => {
  const n = posts.value.length;
  return `${n} ${n === 1 ? "post" : "posts"} · following ${subscriptionsStore.followCount}`;
});
</script>

<template>
  <div class="flex flex-col gap-4 pb-4 md:py-7">
    <ProfileHeader :user="authStore.user" :summary="summary" you>
      <template #actions>
        <RouterLink
          :to="{ name: 'user', params: { handle: authStore.user.handle } }"
          class="inline-flex min-h-10 items-center rounded-full border border-line-strong bg-surface px-4 text-[13px] font-bold hover:bg-subtle"
        >
          View public page
        </RouterLink>
      </template>
    </ProfileHeader>

    <div class="flex flex-col gap-4 px-3 md:px-0">
      <div
        class="rounded-2xl border border-line bg-surface p-4 shadow-sm focus-within:border-line-strong"
      >
        <PostComposer />
      </div>

      <EmptyState
        v-if="posts.length === 0"
        title="Say hello with your first post"
        label="Profile"
      >
        It's public: anyone with a Bazaar login can read it on your profile.
      </EmptyState>
      <PostCard
        v-for="post in posts"
        :key="post.id"
        :post="post"
        :show-author="false"
      />
    </div>
  </div>
</template>
