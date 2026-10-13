<script setup lang="ts">
import { useFindPeople, useUiStore } from "@/stores/ui";
import type { IconName } from "@/types";
import AppIcon from "./AppIcon.vue";

const uiStore = useUiStore();
const findPeople = useFindPeople();

const links: { to: string; label: string; icon: IconName }[] = [
  { to: "home", label: "Home", icon: "home" },
  { to: "profile", label: "Profile", icon: "user" },
  { to: "following", label: "Following", icon: "users" },
];
</script>

<template>
  <!-- Phones only: compose button and bottom tab bar -->
  <div class="md:hidden">
    <button
      type="button"
      aria-label="New post"
      class="fixed bottom-[88px] right-4 z-20 flex h-14 w-14 items-center justify-center rounded-full bg-honey text-on-honey shadow-lg"
      @click="uiStore.openCompose()"
    >
      <AppIcon name="plus" :size="24" />
    </button>
    <nav
      aria-label="Main"
      class="fixed inset-x-0 bottom-0 z-20 grid h-[72px] grid-cols-4 border-t border-line bg-surface pb-[env(safe-area-inset-bottom)]"
    >
      <RouterLink
        v-slot="{ href, navigate, isExactActive }"
        :to="{ name: links[0].to }"
        custom
      >
        <a
          :href="href"
          :aria-current="isExactActive ? 'page' : undefined"
          class="flex flex-col items-center justify-center gap-0.5 text-[11px]"
          :class="
            isExactActive
              ? 'font-extrabold text-ink'
              : 'font-semibold text-muted'
          "
          @click="navigate"
        >
          <AppIcon :name="links[0].icon" />{{ links[0].label }}
        </a>
      </RouterLink>
      <button
        type="button"
        class="flex flex-col items-center justify-center gap-0.5 text-[11px] font-semibold text-muted"
        @click="findPeople"
      >
        <AppIcon name="search" />Find
      </button>
      <RouterLink
        v-for="link in links.slice(1)"
        :key="link.to"
        v-slot="{ href, navigate, isExactActive }"
        :to="{ name: link.to }"
        custom
      >
        <a
          :href="href"
          :aria-current="isExactActive ? 'page' : undefined"
          class="flex flex-col items-center justify-center gap-0.5 text-[11px]"
          :class="
            isExactActive
              ? 'font-extrabold text-ink'
              : 'font-semibold text-muted'
          "
          @click="navigate"
        >
          <AppIcon :name="link.icon" />{{ link.label }}
        </a>
      </RouterLink>
    </nav>
  </div>
</template>
