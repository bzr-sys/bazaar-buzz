<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";

import { useAuthStore } from "@/stores/auth";
import { useDefaultBlogStore } from "@/stores/defaultBlog";
import { useSubscriptionsStore } from "@/stores/subscriptions";
import AppIcon from "@/components/AppIcon.vue";
import EmptyState from "@/components/EmptyState.vue";
import FindPeopleButton from "@/components/FindPeopleButton.vue";
import LandingPage from "@/components/LandingPage.vue";
import PostCard from "@/components/PostCard.vue";
import PostComposer from "@/components/PostComposer.vue";

const authStore = useAuthStore();
const defaultBlogStore = useDefaultBlogStore();
const subscriptionsStore = useSubscriptionsStore();

const newCount = computed(
  () =>
    subscriptionsStore.feed.filter((p) => subscriptionsStore.freshIds.has(p.id))
      .length,
);

// The "new posts" pill only matters when the top of the feed is out of view.
const scrolledDown = ref(false);
function onScroll() {
  scrolledDown.value = window.scrollY > 200;
}

let seenTimer: ReturnType<typeof setTimeout> | undefined;
function showNewPosts() {
  window.scrollTo({ top: 0, behavior: "smooth" });
  // Keep the highlight long enough to spot the new posts.
  clearTimeout(seenTimer);
  seenTimer = setTimeout(() => subscriptionsStore.markSeen(), 6000);
}

onMounted(() => window.addEventListener("scroll", onScroll, { passive: true }));
onBeforeUnmount(() => {
  window.removeEventListener("scroll", onScroll);
  clearTimeout(seenTimer);
  subscriptionsStore.markSeen();
});
</script>

<template>
  <LandingPage v-if="!authStore.authenticated" />
  <div v-else class="flex flex-col gap-4 px-3 py-4 md:px-0 md:py-7">
    <h1 class="hidden text-[26px] font-extrabold tracking-tight md:block">
      Home
    </h1>
    <div
      class="hidden rounded-2xl border border-line bg-surface p-[18px] shadow-sm focus-within:border-line-strong md:block"
    >
      <PostComposer />
    </div>

    <div
      v-if="newCount > 0 && scrolledDown"
      class="sticky top-[68px] z-10 flex justify-center md:top-4"
    >
      <button
        type="button"
        class="flex min-h-10 items-center gap-2 rounded-full bg-inverse px-[18px] text-sm font-bold text-on-inverse shadow-lg"
        @click="showNewPosts"
      >
        <AppIcon name="arrow-up" :size="14" />
        {{ newCount === 1 ? "1 new post" : `${newCount} new posts` }}
      </button>
    </div>

    <EmptyState
      v-if="subscriptionsStore.followCount === 0"
      :title="
        defaultBlogStore.sortedDefaultBlog.length === 0
          ? 'Your home feed is empty'
          : 'You’re not following anyone yet'
      "
      illustration
    >
      Follow people from Bazaar and their new posts land here, next to your own.
      <template #actions>
        <FindPeopleButton variant="primary" />
      </template>
    </EmptyState>

    <PostCard
      v-for="post in subscriptionsStore.feed"
      :key="post.id"
      :post="post"
      :fresh="subscriptionsStore.freshIds.has(post.id)"
    />

    <p
      v-if="subscriptionsStore.feed.length > 0"
      class="py-4 text-center text-sm text-muted"
    >
      That's everything from the people you follow and you.
    </p>
  </div>
</template>
