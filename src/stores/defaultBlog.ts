import { ref, computed } from "vue";
import { defineStore } from "pinia";

import { bzr } from "@/bazaar";
import {
  PermissionType,
  GranteeType,
  OrderByType,
  arrayMirrorSubscribeListener,
  isUserDoesNotExistError,
  BazaarError,
  ErrorTypes,
} from "@bzr/bazaar";
import type { Post } from "@/types";
import { toDate } from "@/utils/time";

export const DEFAULT_BLOG_COLLECTION_NAME = "default_blog";

export function newestFirst<T extends Pick<Post, "ts">>(a: T, b: T) {
  return toDate(b.ts).getTime() - toDate(a.ts).getTime();
}

/** Result of reading someone else's posts. */
export type BlogResult =
  | { status: "ok"; posts: Post[] }
  | { status: "not-on-buzz" }
  | { status: "not-found" }
  | { status: "error" };

export const useDefaultBlogStore = defineStore("defaultBlog", () => {
  // Your own public posts
  const defaultBlog = ref([] as Post[]);
  const sortedDefaultBlog = computed(() =>
    defaultBlog.value.slice().sort(newestFirst),
  );

  const defaultBlogC = bzr.collection<Post>(DEFAULT_BLOG_COLLECTION_NAME, {
    onCreate: async () => {
      await bzr.permissions.create({
        collectionName: DEFAULT_BLOG_COLLECTION_NAME,
        granteeType: GranteeType.ANY,
        types: [PermissionType.READ],
      });
    },
  });
  let defaultBlogU = undefined as (() => Promise<string>) | undefined;

  async function sync(): Promise<void> {
    if (!defaultBlogU) {
      defaultBlog.value = [];
      defaultBlogU = await defaultBlogC.subscribeAll(
        {},
        arrayMirrorSubscribeListener(defaultBlog.value),
      );
    }
  }

  /** Posts to your public blog. Returns false if it failed. */
  async function postDefaultBlog(text: string): Promise<boolean> {
    const trimmed = text.trim();
    if (!trimmed) {
      return false;
    }
    try {
      await defaultBlogC.insertOne({ text: trimmed, ts: new Date() });
      return true;
    } catch (err) {
      console.log("Cannot post to default blog:", err);
      return false;
    }
  }

  /** Reads another user's public posts, newest first. */
  async function getDefaultBlog(userId: string): Promise<BlogResult> {
    try {
      const ctx = await bzr.createContext({ ownerId: userId });
      const posts = await ctx
        .collection<Post>(DEFAULT_BLOG_COLLECTION_NAME)
        .getAll({}, { orderBy: { ts: OrderByType.DESC } });
      return { status: "ok", posts };
    } catch (err) {
      if (
        err instanceof BazaarError &&
        err.type === ErrorTypes.DatabaseDoesNotExist
      ) {
        return { status: "not-on-buzz" };
      }
      if (
        err instanceof BazaarError &&
        err.type === ErrorTypes.CollectionDoesNotExist
      ) {
        // Opened Buzz but never posted
        return { status: "ok", posts: [] };
      }
      if (isUserDoesNotExistError(err)) {
        return { status: "not-found" };
      }
      console.log("Cannot read blog:", err);
      return { status: "error" };
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
