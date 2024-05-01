<script setup lang="ts">
import { RouterView } from "vue-router";

import { useAuthStore } from "@/stores/auth";
import { bzr } from "@/bazaar";

const authStore = useAuthStore();
authStore.autoSignIn();

bzr.onLogin(async () => {
  console.log("onLogin is called");
  authStore.autoSignIn();
});
</script>

<template>
  <header class="bg-neutral-700 py-4 text-white">
    <div class="flex place-content-between px-5">
      <RouterLink class="py-2 text-xl font-bold w-1/3" :to="{ name: 'feed' }">
        Bazaar Buzz
      </RouterLink>
      <div v-if="authStore.user.id" class="text-center w-1/3">
        <p class="text-lg">{{ authStore.user.name }}</p>
        <p class="text-xs">@{{ authStore.user.handle }}</p>
      </div>
      <div class="w-1/3 text-right">
        <button
          v-if="authStore.authenticated"
          class="border-2 border-amber-500 px-4 py-2"
          @click="bzr.logOut()"
        >
          Logout
        </button>
        <button
          v-else
          class="border-2 border-amber-500 bg-amber-500 px-4 py-2"
          @click="bzr.login()"
        >
          Login
        </button>
      </div>
    </div>
  </header>
  <RouterView />
</template>

<style scoped lang="scss"></style>
