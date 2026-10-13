<script setup lang="ts">
import { computed, onMounted, ref, useId } from "vue";

import { useAuthStore } from "@/stores/auth";
import { useDefaultBlogStore } from "@/stores/defaultBlog";
import UserAvatar from "./UserAvatar.vue";
import AppIcon from "./AppIcon.vue";

const props = withDefaults(
  defineProps<{ autofocus?: boolean; rows?: number }>(),
  {
    autofocus: false,
    rows: 2,
  },
);
const emit = defineEmits<{ posted: [] }>();

const authStore = useAuthStore();
const defaultBlogStore = useDefaultBlogStore();

const id = useId();
const textarea = ref<HTMLTextAreaElement>();
const text = ref("");
const posting = ref(false);
const failed = ref(false);
const canPost = computed(() => text.value.trim().length > 0 && !posting.value);

async function post() {
  if (!canPost.value) return;
  posting.value = true;
  failed.value = false;
  const ok = await defaultBlogStore.postDefaultBlog(text.value);
  posting.value = false;
  if (ok) {
    text.value = "";
    emit("posted");
  } else {
    failed.value = true;
  }
}

function onKeydown(e: KeyboardEvent) {
  // Ctrl/Cmd + Enter posts
  if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
    e.preventDefault();
    post();
  }
}

onMounted(() => {
  if (props.autofocus) textarea.value?.focus();
});
</script>

<template>
  <form
    class="grid grid-cols-[44px_minmax(0,1fr)] gap-3.5"
    @submit.prevent="post"
  >
    <UserAvatar :user="authStore.user" />
    <div class="flex min-w-0 flex-col gap-3">
      <label :for="id" class="sr-only">New post</label>
      <textarea
        :id="id"
        ref="textarea"
        v-model="text"
        :rows="rows"
        placeholder="What's buzzing?"
        class="w-full resize-none border-0 bg-transparent py-2 text-lg text-ink placeholder:text-muted focus:outline-none focus-visible:outline-none"
        @keydown="onKeydown"
      ></textarea>
      <p v-if="failed" class="text-sm font-semibold text-danger" role="alert">
        Couldn't post. Check your connection and try again.
      </p>
      <div
        class="flex items-center justify-between gap-3 border-t border-line pt-3"
      >
        <span class="flex items-center gap-1.5 text-[13px] text-muted">
          <AppIcon name="globe" :size="14" />
          Public · saved in your Bazaar database
        </span>
        <button
          type="submit"
          :disabled="!canPost"
          class="min-h-10 shrink-0 rounded-full px-5 text-[15px] font-extrabold transition-colors"
          :class="
            canPost
              ? 'bg-honey text-on-honey hover:brightness-95'
              : 'cursor-not-allowed bg-honey-disabled text-on-honey-disabled'
          "
        >
          {{ posting ? "Posting…" : "Post" }}
        </button>
      </div>
    </div>
  </form>
</template>
