import { ref, computed } from "vue";
import { defineStore } from "pinia";
import {
  arrayMirrorSubscribeListener,
  type User,
} from "@bzr/bazaar";

import { bzr } from "@/bazaar";
import { DEFAULT_BLOG_COLLECTION_NAME } from "./defaultBlog";

const SUBSCRIPTIONS_COLLECTION_NAME = "subscriptions";

export const useSubscriptionsStore = defineStore("subscriptions", () => {
  // subscriptions
  const subscriptions = ref([] as any[]);
  const subscriptionsC = bzr.collection(SUBSCRIPTIONS_COLLECTION_NAME);
  let subscriptionsU = undefined as (() => Promise<string>) | undefined;

  const subscriptionsMap = ref({} as { [key: string]: User });

  const blogData = ref({} as { [key: string]: any });
  const blogUnsubscribe = {} as { [key: string]: any };

  const feed = computed(() => {
    const feed = [];
    for (const userId in blogData.value) {
      const posts = blogData.value[userId].map((p: any) => {
        p.user = subscriptionsMap.value[userId].name;
        return p;
      });
      feed.push(...posts);
    }
    feed.sort((a, b) => {
      return new Date(b.ts).getTime() - new Date(a.ts).getTime();
    });
    return feed;
  });

  async function fetchBlogData(subscription: any): Promise<void> {
    const userId = subscription.id;
    subscriptionsMap.value[userId] = await bzr.social.getUser({
      userId: userId,
    });

    if (blogUnsubscribe[userId]) {
      return;
    }

    const ctx = await bzr.createContext({ ownerId: userId });
    const blogC = ctx.collection(DEFAULT_BLOG_COLLECTION_NAME);
    blogData.value[userId] = [];
    blogUnsubscribe[userId] = await blogC.subscribeAll(
      {},
      arrayMirrorSubscribeListener(blogData.value[userId]),
    );
  }

  async function deleteBlogData(subscription: any): Promise<void> {
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

  async function subscribe(userId: string) {
    try {
      await subscriptionsC.insertOne({ id: userId }); // make sure we cannot subscribe twice to same blog
    } catch (err) {
      console.log("Cannot subscribe:", err);
    }
  }

  async function unsubscribe(userId: string) {
    try {
      await subscriptionsC.deleteOne(userId);
    } catch (err) {
      console.log("Cannot unsubscribe:", err);
    }
  }

  return {
    // state
    blogData,

    // getters
    subscriptions,
    subscriptionsMap,
    feed,

    // actions
    sync,
    subscribe,
    unsubscribe,
  };
});
