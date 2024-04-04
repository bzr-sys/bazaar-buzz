import { ref, computed } from "vue";
import { defineStore } from "pinia";
import type { BazaarMessage, User } from "@bzr/bazaar";

import { bzr, mirrorAll } from "@/bazaar";
import { DEFAULT_BLOG_COLLECTION_NAME } from "./defaultBlog";

const SUBSCRIPTIONS_COLLECTION_NAME = "subscriptions";

export const useSubscriptionsStore = defineStore("subscriptions", () => {
  // subscriptions
  const subscriptions = ref([] as any[]);
  const subscriptionsC = bzr.collection(SUBSCRIPTIONS_COLLECTION_NAME);
  let subscriptionsU = undefined as (() => Promise<BazaarMessage>) | undefined;

  const subscriptionsMap = ref({} as { [key: string]: User });

  const blogData = ref({} as { [key: string]: any });
  const blogUnsubscribe = {} as { [key: string]: any };

  const feed = computed(() => {
    console.log("execute feed computed");
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
    console.log("fetch blog", subscription);
    const userId = subscription.id;
    console.log("fetch user");
    subscriptionsMap.value[userId] = await bzr.social.getUser(userId);

    console.log("fetch blog data from", userId);

    if (blogUnsubscribe[userId]) {
      console.log("cannot fetch if subscribed");
      return;
    }

    const blogC = bzr.collection(DEFAULT_BLOG_COLLECTION_NAME, {
      userId: userId,
    });
    blogData.value[userId] = [];
    blogUnsubscribe[userId] = await mirrorAll(
      // TODO we should probably not get the whole blog
      {},
      blogC,
      blogData.value[userId],
    );
  }

  async function deleteBlogData(subscription: any): Promise<void> {
    console.log("delete blog", subscription);
    const userId = subscription.id;
    console.log("fetch user");
    delete subscriptionsMap.value[userId];

    console.log("fetch blog data from", userId);

    if (blogUnsubscribe[userId]) {
      blogUnsubscribe[userId]();
      delete blogUnsubscribe[userId];
    }
    delete blogData.value[userId];
  }

  async function sync(): Promise<void> {
    if (!subscriptionsU) {
      subscriptions.value = [];
      subscriptionsU = await mirrorAll(
        {},
        subscriptionsC,
        subscriptions.value,
        {
          onAdd: fetchBlogData,
          onDelete: deleteBlogData,
        },
      );
    }
  }

  async function subscribe(userId: string) {
    console.log("Subscribe to", userId);
    try {
      await subscriptionsC.insertOne({ id: userId }); // make sure we cannot subscribe twice to same blog
    } catch (err) {
      console.log("Cannot subscribe:", err);
    }
  }

  async function unsubscribe(userId: string) {
    console.log("Unsubscribe from", userId);
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
