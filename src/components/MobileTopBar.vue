<script setup lang="ts">
import { useAuthStore } from "@/stores/auth";
import AppIcon from "./AppIcon.vue";
import BuzzLogo from "./BuzzLogo.vue";
import UserAvatar from "./UserAvatar.vue";

const authStore = useAuthStore();
</script>

<template>
  <!-- Phones only -->
  <header
    class="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-line bg-surface px-3 md:hidden"
  >
    <RouterLink
      :to="{ name: 'profile' }"
      class="flex h-11 w-11 items-center justify-center rounded-full"
      aria-label="Your profile"
    >
      <UserAvatar :user="authStore.user" size="sm" />
    </RouterLink>
    <RouterLink
      :to="{ name: 'home' }"
      aria-label="Buzz home"
      class="rounded-full"
    >
      <BuzzLogo :size="28" :wordmark="false" />
    </RouterLink>
    <button
      type="button"
      class="flex h-11 w-11 items-center justify-center rounded-full text-muted"
      aria-label="Log out"
      title="Log out"
      @click="authStore.logOut()"
    >
      <AppIcon name="logout" :size="20" />
    </button>
  </header>
</template>
