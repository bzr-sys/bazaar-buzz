import { ref } from "vue";
import { defineStore } from "pinia";
import { useRouter } from "vue-router";

import { bzr } from "@/bazaar";

export const useUiStore = defineStore("ui", () => {
  // The "New post" dialog (a bottom sheet on phones)
  const composeOpen = ref(false);

  function openCompose() {
    composeOpen.value = true;
  }

  function closeCompose() {
    composeOpen.value = false;
  }

  return { composeOpen, openCompose, closeCompose };
});

/**
 * Opens Bazaar's user search popup; picking someone opens their profile.
 */
export function useFindPeople() {
  const router = useRouter();
  return function findPeople() {
    bzr.social.openPopup(async (userId: string) => {
      try {
        const user = await bzr.social.getUser({ userId });
        router.push({ name: "user", params: { handle: user.handle } });
      } catch (err) {
        console.log("Cannot open profile:", err);
      }
    });
  };
}
