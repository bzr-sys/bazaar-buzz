<script setup lang="ts">
import { computed, ref } from "vue";

import type { FeedPost, Post } from "@/types";
import UserAvatar from "./UserAvatar.vue";
import RelativeTime from "./RelativeTime.vue";

const props = withDefaults(
  defineProps<{
    post: Post | FeedPost;
    // Hide the author header on a profile, where the author is the page.
    showAuthor?: boolean;
    fresh?: boolean;
  }>(),
  { showAuthor: true, fresh: false },
);

// Long posts are folded to a few lines with a "Show more" button.
const LONG_POST = 360;
const expanded = ref(false);
const isLong = computed(
  () =>
    props.post.text.length > LONG_POST ||
    props.post.text.split("\n").length > 8,
);

const feedPost = computed(() =>
  "author" in props.post ? props.post : undefined,
);
const authorLink = computed(() =>
  feedPost.value?.mine
    ? { name: "profile" }
    : { name: "user", params: { handle: feedPost.value?.author.handle } },
);
</script>

<template>
  <article
    class="grid gap-3.5 rounded-2xl border bg-surface p-4 shadow-sm sm:p-[18px]"
    :class="[
      fresh ? 'border-honey' : 'border-line',
      showAuthor && feedPost ? 'grid-cols-[44px_minmax(0,1fr)]' : 'grid-cols-1',
    ]"
  >
    <RouterLink
      v-if="showAuthor && feedPost"
      :to="authorLink"
      :aria-label="feedPost.author.name || feedPost.author.handle"
      class="rounded-full"
      tabindex="-1"
    >
      <UserAvatar :user="feedPost.author" />
    </RouterLink>
    <div class="flex min-w-0 flex-col gap-1.5">
      <div
        v-if="showAuthor && feedPost"
        class="flex flex-wrap items-baseline gap-x-1.5 text-[15px]"
      >
        <RouterLink :to="authorLink" class="font-bold hover:underline">
          {{ feedPost.author.name || feedPost.author.handle }}
        </RouterLink>
        <span
          v-if="feedPost.mine"
          class="rounded-full bg-inverse px-2 py-px text-[11px] font-bold text-on-inverse"
          >You</span
        >
        <span class="text-muted">
          @{{ feedPost.author.handle }} ·
          <RelativeTime :ts="post.ts" />
        </span>
        <span
          v-if="fresh"
          class="ml-auto rounded-full bg-honey-soft px-2 py-px text-xs font-bold text-honey-text"
          >New</span
        >
      </div>
      <div v-else class="text-sm text-muted">
        <RelativeTime :ts="post.ts" />
      </div>
      <p
        class="whitespace-pre-line text-[17px] leading-relaxed text-body [overflow-wrap:anywhere]"
        :class="{ 'line-clamp-6': isLong && !expanded }"
      >
        {{ post.text }}
      </p>
      <div v-if="isLong">
        <button
          type="button"
          class="min-h-8 text-sm font-bold text-honey-text hover:underline"
          :aria-expanded="expanded"
          @click="expanded = !expanded"
        >
          {{ expanded ? "Show less" : "Show more" }}
        </button>
      </div>
    </div>
  </article>
</template>
