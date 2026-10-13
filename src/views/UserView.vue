<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { isUserDoesNotExistError, type User } from "@bzr/bazaar";

import { bzr } from "@/bazaar";
import { useAuthStore } from "@/stores/auth";
import { useDefaultBlogStore } from "@/stores/defaultBlog";
import type { Post } from "@/types";
import BuzzLogo from "@/components/BuzzLogo.vue";
import EmptyState from "@/components/EmptyState.vue";
import FindPeopleButton from "@/components/FindPeopleButton.vue";
import FollowButton from "@/components/FollowButton.vue";
import PostCard from "@/components/PostCard.vue";
import ProfileHeader from "@/components/ProfileHeader.vue";

type PageState = "loading" | "ok" | "not-found" | "not-on-buzz" | "error";

const route = useRoute();
const authStore = useAuthStore();
const defaultBlogStore = useDefaultBlogStore();

const handle = computed(() =>
  String(
    Array.isArray(route.params.handle)
      ? route.params.handle[0]
      : route.params.handle,
  ),
);

const state = ref<PageState>("loading");
const user = ref<User>();
const posts = ref<Post[]>([]);
const isMe = computed(
  () => !!user.value && user.value.id === authStore.user.id,
);
const shownPosts = computed(() =>
  isMe.value ? defaultBlogStore.sortedDefaultBlog : posts.value,
);

// Ignore answers for a handle we already navigated away from.
let request = 0;

async function load() {
  if (!authStore.authenticated) return;
  const current = ++request;
  state.value = "loading";
  user.value = undefined;
  posts.value = [];

  let found: User;
  try {
    found = await bzr.social.getUser({ handle: handle.value });
  } catch (err) {
    if (current !== request) return;
    state.value = isUserDoesNotExistError(err) ? "not-found" : "error";
    if (!isUserDoesNotExistError(err)) console.log("Cannot load user:", err);
    return;
  }
  if (current !== request) return;
  user.value = found;

  if (found.id === authStore.user.id) {
    state.value = "ok";
    return;
  }

  const result = await defaultBlogStore.getDefaultBlog(found.id);
  if (current !== request) return;
  if (result.status === "ok") {
    posts.value = result.posts;
    state.value = "ok";
  } else {
    state.value = result.status;
  }
}

// Reload when the handle changes or after logging in on this page.
watch([handle, () => authStore.authenticated], load, { immediate: true });
watch(
  handle,
  (h) => {
    document.title = `@${h} · Bazaar Buzz`;
  },
  { immediate: true },
);

const summary = computed(() => {
  const n = shownPosts.value.length;
  return `${n} ${n === 1 ? "post" : "posts"}`;
});

// Invite someone who has a Bazaar account but hasn't opened Buzz yet.
const inviteState = ref<"idle" | "copied" | "failed">("idle");
const inviteUrl = window.location.origin + window.location.pathname;
async function copyInvite() {
  try {
    await navigator.clipboard.writeText(inviteUrl);
    inviteState.value = "copied";
    setTimeout(() => (inviteState.value = "idle"), 2500);
  } catch {
    inviteState.value = "failed";
  }
}

function login() {
  authStore.login(route.fullPath);
}
</script>

<template>
  <!-- Logged out: we can't read anything without a Bazaar session -->
  <main
    v-if="authStore.loaded && !authStore.authenticated"
    class="mx-auto flex min-h-screen max-w-xl flex-col gap-6 px-4 py-8"
  >
    <RouterLink
      :to="{ name: 'home' }"
      class="self-start rounded-full"
      aria-label="Buzz home"
    >
      <BuzzLogo />
    </RouterLink>
    <section class="overflow-hidden rounded-2xl border border-line bg-surface">
      <div class="h-16 bg-honey-soft" aria-hidden="true"></div>
      <div class="flex flex-col gap-2 px-5 pb-5">
        <span
          class="-mt-8 flex h-16 w-16 items-center justify-center rounded-full border-4 border-surface bg-subtle text-lg font-extrabold text-muted"
          aria-hidden="true"
          >@</span
        >
        <h1 class="text-lg font-extrabold [overflow-wrap:anywhere]">
          @{{ handle }}
        </h1>
        <p class="text-sm leading-relaxed text-body">
          Log in with Bazaar to read @{{ handle }}'s posts and follow them.
        </p>
        <div class="flex flex-wrap items-center gap-3 pt-1">
          <button
            type="button"
            class="min-h-11 rounded-full bg-honey px-5 text-[15px] font-extrabold text-on-honey hover:brightness-95"
            @click="login"
          >
            {{ authStore.loggingIn ? "Waiting for Bazaar…" : "Log in to read" }}
          </button>
        </div>
        <p
          v-if="authStore.loginError"
          class="text-sm font-semibold text-danger"
          role="alert"
        >
          {{ authStore.loginError }}
        </p>
      </div>
    </section>
  </main>

  <div v-else class="flex flex-col gap-4 pb-4 md:py-7">
    <!-- Loading -->
    <div
      v-if="state === 'loading' || !authStore.loaded"
      class="flex flex-col gap-4 px-3 py-4 md:px-0 md:py-0"
      aria-busy="true"
    >
      <span class="sr-only">Loading @{{ handle }}…</span>
      <div
        class="flex items-center gap-4 rounded-2xl border border-line bg-surface p-5"
        aria-hidden="true"
      >
        <span class="h-16 w-16 animate-pulse rounded-full bg-subtle"></span>
        <div class="flex flex-col gap-2">
          <span class="h-4 w-40 animate-pulse rounded-full bg-subtle"></span>
          <span class="h-3 w-24 animate-pulse rounded-full bg-subtle"></span>
        </div>
      </div>
    </div>

    <!-- No such handle -->
    <div v-else-if="state === 'not-found'" class="px-3 py-4 md:px-0 md:py-0">
      <EmptyState title="This account doesn't exist">
        <span class="[overflow-wrap:anywhere]"
          >No one on Bazaar has the handle @{{ handle }}.</span
        >
        <template #actions>
          <FindPeopleButton variant="primary" />
        </template>
      </EmptyState>
    </div>

    <!-- Something else went wrong -->
    <div v-else-if="state === 'error'" class="px-3 py-4 md:px-0 md:py-0">
      <EmptyState title="Couldn't load this profile">
        Something went wrong while loading @{{ handle }}. Check your connection
        and try again.
        <template #actions>
          <button
            type="button"
            class="min-h-11 rounded-full bg-honey px-[18px] text-sm font-extrabold text-on-honey"
            @click="load"
          >
            Try again
          </button>
        </template>
      </EmptyState>
    </div>

    <template v-else-if="user">
      <ProfileHeader
        :user="user"
        :summary="state === 'ok' ? summary : ''"
        :you="isMe"
      >
        <template #actions>
          <FollowButton v-if="state === 'ok' && !isMe" :user-id="user.id" />
          <RouterLink
            v-if="isMe"
            :to="{ name: 'profile' }"
            class="inline-flex min-h-10 items-center rounded-full border border-line-strong bg-surface px-4 text-[13px] font-bold hover:bg-subtle"
          >
            Write a post
          </RouterLink>
        </template>
      </ProfileHeader>

      <div class="flex flex-col gap-3 px-3 md:px-0">
        <p v-if="isMe" class="text-sm text-muted">
          This is how others see your page. You can't follow yourself.
        </p>

        <!-- Has a Bazaar account but has never opened Buzz -->
        <EmptyState
          v-if="state === 'not-on-buzz'"
          :title="`${user.name || user.handle} isn't on Buzz yet`"
        >
          They have a Bazaar account but haven't opened Buzz, so there's nothing
          to read or follow yet. Send them a link to Buzz.
          <template #actions>
            <button
              type="button"
              class="min-h-11 rounded-full border border-line-strong bg-surface px-4 text-sm font-extrabold hover:bg-subtle"
              @click="copyInvite"
            >
              {{
                inviteState === "copied" ? "Link copied" : "Copy invite link"
              }}
            </button>
            <span
              v-if="inviteState === 'failed'"
              class="self-center text-sm text-body"
            >
              Copy this link: <span class="font-semibold">{{ inviteUrl }}</span>
            </span>
          </template>
        </EmptyState>

        <template v-else>
          <EmptyState
            v-if="shownPosts.length === 0"
            :title="isMe ? 'You haven’t posted yet' : 'No posts yet'"
          >
            {{
              isMe
                ? "Your posts show up here for everyone with a Bazaar login."
                : "Follow to catch the first one in your Home feed."
            }}
          </EmptyState>
          <PostCard
            v-for="post in shownPosts"
            :key="post.id"
            :post="post"
            :show-author="false"
          />
        </template>
      </div>
    </template>
  </div>
</template>
