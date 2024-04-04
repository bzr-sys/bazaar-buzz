import { ref } from "vue";
import { defineStore } from "pinia";

import { bzr } from "@/bazaar";
import { useDefaultBlogStore } from "./defaultBlog";
import { useSubscriptionsStore } from "./subscriptions";
import type { User } from "@bzr/bazaar";

export const useAuthStore = defineStore("auth", () => {
  const loaded = ref(false);
  const authenticated = ref(false);
  const user = ref({} as User);

  async function autoSignIn() {
    console.log("autosignin:", bzr.isLoggedIn());
    if (bzr.isLoggedIn()) {
      try {
        user.value = await bzr.social.getUser();

        const defaultBlogStore = useDefaultBlogStore();
        await defaultBlogStore.sync();

        const subscriptionsStore = useSubscriptionsStore();
        await subscriptionsStore.sync();

        authenticated.value = true;
        loaded.value = true;
      } catch (e: unknown) {
        console.error("Error during auto signin", e);
      }
    } else {
      loaded.value = true;
    }
  }

  return { loaded, authenticated, user, autoSignIn };
});
