<script setup lang="ts">
import { useRouter } from "vue-router";

import { useSubscriptionsStore } from "@/stores/subscriptions";
import { bzr } from "@/bazaar";

const subscriptionsStore = useSubscriptionsStore();

const router = useRouter();

async function openProfile(userId: string) {
  const user = await bzr.social.getUser({ userId: userId });
  gotoProfile(user.handle);
}

function gotoProfile(handle: string) {
  router.push({ name: "user", params: { handle: handle } });
}
</script>

<template>
  <button
    @click="bzr.social.openModal(openProfile)"
    class="p-3 my-2 bg-neutral-500 border-2 border-amber-500 text-white"
    data-size="small"
  >
    Find user
  </button>

  <div
    v-for="(user, userId) in subscriptionsStore.subscriptionsMap"
    :key="userId"
    class="bg-neutral-200 p-3 my-2 flex justify-between items-center"
  >
    <p>{{ user.name }}</p>

    <div>
      <button
        @click="gotoProfile(user.handle)"
        class="border-2 border-amber-500 bg-amber-500 px-4 py-2 text-white font-semibold text-sm"
        data-size="small"
      >
        View
      </button>
      <button
        @click="subscriptionsStore.unsubscribe(userId as string)"
        class="p-2 ml-2 bg-neutral-500 border-2 border-amber-500 text-white text-sm"
        data-size="small"
      >
        Unsubscribe
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
