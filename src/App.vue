<script setup lang="ts">
import { watch } from "vue";
import { RouterView, useRoute, useRouter } from "vue-router";

import { bzr } from "@/bazaar";
import { useAuthStore } from "@/stores/auth";
import { useUiStore } from "@/stores/ui";
import BottomNav from "@/components/BottomNav.vue";
import ComposeDialog from "@/components/ComposeDialog.vue";
import MobileTopBar from "@/components/MobileTopBar.vue";
import RightPanel from "@/components/RightPanel.vue";
import SideNav from "@/components/SideNav.vue";

const authStore = useAuthStore();
const uiStore = useUiStore();
const route = useRoute();
const router = useRouter();

authStore.autoSignIn();

// Leaving the page closes the "New post" dialog.
watch(
  () => route.fullPath,
  () => uiStore.closeCompose(),
);

bzr.onLogin(async () => {
  await authStore.autoSignIn();
  // Go back to the page that asked for a login (see the router guard).
  const redirect = authStore.takeRedirect(route.query.redirect);
  if (redirect && redirect !== route.fullPath) {
    router.replace(redirect);
  } else if (route.query.redirect) {
    router.replace({ name: route.name ?? "home", params: route.params });
  }
});

bzr.onLoginError(async (_bzr, message) => {
  console.log("OnLoginError:", message);
  authStore.failLogin("Logging in with Bazaar didn't work. Please try again.");
});
</script>

<template>
  <div
    v-if="!authStore.loaded"
    class="flex min-h-screen items-center justify-center"
  >
    <p class="text-muted" role="status">Loading Buzz…</p>
  </div>

  <template v-else-if="authStore.authenticated">
    <MobileTopBar />
    <div class="mx-auto flex max-w-[1340px] justify-center gap-8 md:px-6">
      <SideNav />
      <main class="min-w-0 max-w-[640px] flex-1 pb-28 md:pb-10">
        <RouterView />
      </main>
      <RightPanel />
    </div>
    <BottomNav />
    <ComposeDialog v-if="uiStore.composeOpen" />
  </template>

  <!-- Logged out: the welcome page, or the login prompt on a profile link -->
  <RouterView v-else />
</template>
