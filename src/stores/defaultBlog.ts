import { ref, computed } from "vue";
import { defineStore } from "pinia";

import { bzr, mirrorAll } from "@/bazaar";
import {
  PermissionType,
  type BazaarMessage,
  BazaarError,
  ErrorTypes,
} from "@bzr/bazaar";

export const DEFAULT_BLOG_COLLECTION_NAME = "default_blog";

export const useDefaultBlogStore = defineStore("defaultBlog", () => {
  // public blogs
  const defaultBlog = ref([] as any[]);
  const sortedDefaultBlog = computed(() => {
    return defaultBlog.value.slice().reverse();
  });
  const defaultBlogC = bzr.collection(DEFAULT_BLOG_COLLECTION_NAME, {
    onCreate: async () => {
      await bzr.permissions.create({
        collectionName: DEFAULT_BLOG_COLLECTION_NAME,
        userId: "*",
        types: [PermissionType.READ],
      });
    },
  });
  let defaultBlogU = undefined as (() => Promise<BazaarMessage>) | undefined;

  async function sync(): Promise<void> {
    if (!defaultBlogU) {
      defaultBlog.value = [];
      defaultBlogU = await mirrorAll({}, defaultBlogC, defaultBlog.value);
    }
  }

  async function postDefaultBlog(post: { text: string; ts?: Date }) {
    try {
      if (!post.text) {
        return;
      }
      post.ts = new Date();
      console.log("got post", post);
      await defaultBlogC.insertOne(post);
    } catch (err) {
      console.log("Cannot post to default blog:", err);
    }
  }

  async function getDefaultBlog(userId: string) {
    try {
      return await bzr
        .collection(DEFAULT_BLOG_COLLECTION_NAME, { userId: userId })
        .getAll();
    } catch (err) {
      if (err instanceof BazaarError) {
        if (err.type === ErrorTypes.DatabaseDoesNotExist) {
          return [
            {
              text: "User does not use bazaar buzz",
              ts: new Date(),
            },
          ];
        }
      }
      return [
        {
          text: "An error occurred",
          ts: new Date(),
        },
      ];
    }
  }

  return {
    // state
    sortedDefaultBlog,

    // actions
    sync,
    postDefaultBlog,
    getDefaultBlog,
  };
});
