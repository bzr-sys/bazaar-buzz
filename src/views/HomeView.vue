<script setup lang="ts">
import { RouterLink, RouterView, useRouter } from "vue-router";
import { ref } from "vue";

import { useAuthStore } from "@/stores/auth";
import { bzr } from "@/bazaar";

const authStore = useAuthStore();

const router = useRouter();
let current_tab = ref(router.currentRoute.value.name);
</script>

<template>
  <main>
    <div v-if="authStore.authenticated" class="max-w-2xl m-auto">
      <div class="bg-amber-500 flex">
        <RouterLink
          :to="{ name: 'feed' }"
          class="w-1/3 p-3 text-white text-center font-medium"
          :class="{ 'bg-amber-600': current_tab == 'feed' }"
          @click="current_tab = 'feed'"
        >
          Feed
        </RouterLink>
        <RouterLink
          :to="{ name: 'profile' }"
          class="w-1/3 p-3 text-white text-center font-medium"
          :class="{ 'bg-amber-600': current_tab == 'profile' }"
          @click="current_tab = 'profile'"
        >
          Profile
        </RouterLink>
        <RouterLink
          :to="{ name: 'following' }"
          class="w-1/3 p-3 text-white text-center font-medium"
          :class="{ 'bg-amber-600': current_tab == 'following' }"
          @click="current_tab = 'following'"
        >
          Following
        </RouterLink>
      </div>

      <div v-if="!authStore.loaded">Loading...</div>
      <RouterView v-else />
    </div>
    <div v-else class="text-center">
      <h1 class="text-lg py-3">Welcome to Bazaar Buzz</h1>
      <button
        @click="bzr.login()"
        class="border-2 border-amber-500 bg-amber-500 px-4 py-2 text-white font-semibold"
      >
        Log in
      </button>
    </div>
  </main>
</template>

<style scoped lang="scss">
.content {
  max-width: min(800px, 90vw);
  margin: auto;
}

.tabs {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 1rem;
}

.tab {
  padding-inline: 1rem;
  padding-block: 0.7rem;
  border-color: burlywood;
  border-width: 3px;
  border-style: solid;
  border-radius: 5px;
  color: hsl(34, 57%, 20%); // burlywood but 50% darker;
  text-decoration: none;

  &:hover {
    background-color: hsl(34, 57%, 90%); // burlywood but 20% lighter
  }
}

.current_tab {
  background-color: burlywood;

  &:hover {
    background-color: burlywood;
  }
}
</style>
