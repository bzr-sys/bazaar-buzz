<script setup lang="ts">
import { ref } from "vue";

import { useDefaultBlogStore } from "@/stores/defaultBlog";

const defaultBlogStore = useDefaultBlogStore();

const blogPost = ref("");
const postingBlog = ref(false);
function postToPubBlog() {
  if (!blogPost.value) {
    return;
  }
  postingBlog.value = true;
  defaultBlogStore.postDefaultBlog({ text: blogPost.value }).then(() => {
    blogPost.value = "";
    postingBlog.value = false;
  });
}
</script>

<template>
  <div class="flex">
    <textarea
      rows="3"
      v-model="blogPost"
      placeholder="What's buzzing?"
      class="w-full p-3 my-2 border-2"
    ></textarea>
    <button
      @click="postToPubBlog"
      class="p-3 my-2 bg-neutral-500 border-2 border-amber-500 text-white"
      data-size="small"
    >
      post
    </button>
  </div>

  <div
    v-for="p in defaultBlogStore.sortedDefaultBlog"
    :key="p.id"
    class="bg-neutral-200 p-3 my-2"
  >
    <div class="text-right text-xs text-neutral-500">at {{ p.ts }}</div>
    <div class="pt-2">
      {{ p.text }}
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
