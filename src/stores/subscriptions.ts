import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { arrayMirrorSubscribeListener, type Doc, type User } from "@bzr/bazaar";

import { bzr } from "@/bazaar";
import {
  DEFAULT_BLOG_COLLECTION_NAME,
  newestFirst,
  useDefaultBlogStore,
} from "./defaultBlog";
import { useAuthStore } from "./auth";
import type { FeedPost, Post } from "@/types";

const SUBSCRIPTIONS_COLLECTION_NAME = "subscriptions";

// A subscription's id is the followed user's id.
type Subscription = Doc;

export const useSubscriptionsStore = defineStore("subscriptions", () => {
  const subscriptions = ref([] as Subscription[]);
  const subscriptionsC = bzr.collection<Subscription>(
    SUBSCRIPTIONS_COLLECTION_NAME,
  );
  let subscriptionsU = undefined as (() => Promise<string>) | undefined;

  // People you follow, by user id
  const subscriptionsMap = ref({} as { [userId: string]: User });

  const blogData = ref({} as { [userId: string]: Post[] });
  const blogUnsubscribe = {} as { [userId: string]: () => Promise<string> };

  // Posts that arrived while the app was open (not part of the initial load)
  const freshIds = ref(new Set<string>());

  const myId = () => useAuthStore().user.id;

  // Known as soon as the subscriptions load, before the users' names do.
  const followCount = computed(
    () => subscriptions.value.filter((s) => s.id !== myId()).length,
  );

  const following = computed(() =>
    Object.values(subscriptionsMap.value).sort((a, b) =>
      (a.name || a.handle).localeCompare(b.name || b.handle),
    ),
  );

  // Home feed: people you follow, plus your own posts.
  const feed = computed((): FeedPost[] => {
    const authStore = useAuthStore();
    const defaultBlogStore = useDefaultBlogStore();
    const posts: FeedPost[] = defaultBlogStore.sortedDefaultBlog.map((p) => ({
      ...p,
      author: authStore.user,
      mine: true,
    }));
    for (const userId in blogData.value) {
      const author = subscriptionsMap.value[userId];
      if (!author) continue;
      for (const p of blogData.value[userId]) {
        posts.push({ ...p, author, mine: false });
      }
    }
    return posts.sort(newestFirst);
  });

  /** Most recent post time of someone you follow, if any. */
  function lastPostTs(userId: string): Post["ts"] | undefined {
    const posts = blogData.value[userId];
    if (!posts || posts.length === 0) return undefined;
    return posts.slice().sort(newestFirst)[0].ts;
  }

  function isFollowing(userId: string): boolean {
    return userId in subscriptionsMap.value;
  }

  async function fetchBlogData(subscription: Subscription): Promise<void> {
    const userId = subscription.id;
    // Older versions let you follow yourself; your own posts are already in the feed.
    if (userId === myId()) return;

    try {
      subscriptionsMap.value[userId] = await bzr.social.getUser({ userId });
    } catch (err) {
      console.log("Cannot load followed user:", err);
      return;
    }

    if (blogUnsubscribe[userId]) {
      return;
    }

    try {
      const ctx = await bzr.createContext({ ownerId: userId });
      const blogC = ctx.collection<Post>(DEFAULT_BLOG_COLLECTION_NAME);
      blogData.value[userId] = [];
      blogUnsubscribe[userId] = await blogC.subscribeAll(
        {},
        arrayMirrorSubscribeListener(blogData.value[userId], {
          onAdd: (doc) => {
            freshIds.value.add(doc.id);
          },
        }),
      );
    } catch (err) {
      // e.g. they have never opened Buzz: nothing to show yet
      console.log("Cannot subscribe to blog:", err);
    }
  }

  async function deleteBlogData(subscription: Subscription): Promise<void> {
    const userId = subscription.id;
    delete subscriptionsMap.value[userId];

    if (blogUnsubscribe[userId]) {
      blogUnsubscribe[userId]();
      delete blogUnsubscribe[userId];
    }
    delete blogData.value[userId];
  }

  async function sync(): Promise<void> {
    if (!subscriptionsU) {
      subscriptions.value = [];
      subscriptionsU = await subscriptionsC.subscribeAll(
        {},
        arrayMirrorSubscribeListener(subscriptions.value, {
          onInitial: fetchBlogData,
          onAdd: fetchBlogData,
          onDelete: deleteBlogData,
        }),
      );
    }
  }

  /** Follows a user. Returns false if it failed. */
  async function subscribe(userId: string): Promise<boolean> {
    if (userId === myId()) return false;
    try {
      await subscriptionsC.insertOne({ id: userId }); // the id makes following twice impossible
      return true;
    } catch (err) {
      console.log("Cannot subscribe:", err);
      return false;
    }
  }

  /** Unfollows a user. Returns false if it failed. */
  async function unsubscribe(userId: string): Promise<boolean> {
    try {
      await subscriptionsC.deleteOne(userId);
      return true;
    } catch (err) {
      console.log("Cannot unsubscribe:", err);
      return false;
    }
  }

  function markSeen() {
    freshIds.value = new Set();
  }

  return {
    // state
    blogData,
    freshIds,

    // getters
    subscriptions,
    subscriptionsMap,
    followCount,
    following,
    feed,

    // actions
    lastPostTs,
    isFollowing,
    sync,
    subscribe,
    unsubscribe,
    markSeen,
  };
});
