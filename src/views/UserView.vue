<script setup lang="ts">
import { ref } from "vue";
import { useRoute } from "vue-router";
import { BazaarError, ErrorTypes, OrderByType, type User } from "@bzr/bazaar";

import { bzr } from "@/bazaar";
import { DEFAULT_BLOG_COLLECTION_NAME } from "@/stores/defaultBlog";
import { useAuthStore } from "@/stores/auth";
import { useSubscriptionsStore } from "@/stores/subscriptions";

const route = useRoute();
const handle = Array.isArray(route.params.handle)
  ? route.params.handle[0]
  : route.params.handle;

const authStore = useAuthStore();
const subscriptionsStore = useSubscriptionsStore();

const user = ref({} as User);
bzr.social.getUser(handle).then((u) => {
  console.log(u);
  user.value = u;
});

const userBlog = ref([] as any[]);
const isUser = ref(false);
bzr
  .collection(DEFAULT_BLOG_COLLECTION_NAME, { userId: handle })
  .getAll({}, { orderBy: { ts: OrderByType.DESC } })
  .then((blog) => {
    userBlog.value = blog;
    isUser.value = true;
  })
  .catch((err) => {
    console.log(err);
    if (err instanceof BazaarError) {
      if (err.type === ErrorTypes.DatabaseDoesNotExist) {
        userBlog.value = [
          {
            text: "User does not use bazaar buzz",
            ts: new Date(),
          },
        ];
      }
    }
    userBlog.value = [
      {
        text: "An error occurred",
        ts: new Date(),
      },
    ];
  });
</script>

<template>
  <!-- Public -->
  <div class="p-4 max-w-2xl m-auto">
    <div v-if="user.id">
      <p class="text-lg">{{ user.name }}</p>
      <p class="text-sm">{{ user.handle }}</p>
      <div v-if="!isUser">
        <p class="pt-5 italic">
          This user does not use Bazaar Buzz (TODO: invite)
        </p>
      </div>
      <div v-else-if="authStore.authenticated" class="py-3">
        <button
          v-if="subscriptionsStore.subscriptionsMap[user.id]"
          @click="subscriptionsStore.unsubscribe(user.id)"
          class="border-2 border-amber-500 bg-amber-500 px-4 py-2 text-white font-semibold"
        >
          Unsubscribe
        </button>
        <button
          v-else
          @click="subscriptionsStore.subscribe(user.id)"
          class="border-2 border-amber-500 bg-amber-500 px-4 py-2 text-white font-semibold"
        >
          Subscribe
        </button>
      </div>
      <div v-else class="py-3">
        <button
          @click="bzr.login()"
          class="border-2 border-amber-500 bg-amber-500 px-4 py-2 text-white font-semibold"
        >
          Log in to subscribe
        </button>
      </div>
    </div>
    <div v-else>User does not exist</div>

    <div v-if="isUser">
      <div v-if="userBlog.length > 0">
        <div v-for="p in userBlog" :key="p.id" class="bg-neutral-200 p-3 my-2">
          <div class="text-right text-xs text-neutral-500">at {{ p.ts }}</div>
          <div class="pt-2">
            {{ p.text }}
          </div>
        </div>
      </div>
      <div v-else class="bg-neutral-200">
        <p class="p-3 italic">No posts</p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
