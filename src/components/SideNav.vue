<script setup lang="ts">
import { useAuthStore } from "@/stores/auth";
import { useFindPeople, useUiStore } from "@/stores/ui";
import type { IconName } from "@/types";
import AppIcon from "./AppIcon.vue";
import BuzzLogo from "./BuzzLogo.vue";
import UserAvatar from "./UserAvatar.vue";

const authStore = useAuthStore();
const uiStore = useUiStore();
const findPeople = useFindPeople();

const links: { to: string; label: string; icon: IconName }[] = [
  { to: "home", label: "Home", icon: "home" },
  { to: "profile", label: "Profile", icon: "user" },
  { to: "following", label: "Following", icon: "users" },
];
</script>

<template>
  <!-- An icon rail on tablets, the full menu from lg up -->
  <aside
    class="sticky top-0 hidden h-screen w-16 shrink-0 flex-col justify-between py-7 md:flex lg:w-[260px]"
  >
    <div class="flex flex-col items-center gap-7 lg:items-stretch">
      <RouterLink
        :to="{ name: 'home' }"
        class="rounded-full px-1 lg:px-3"
        aria-label="Buzz home"
      >
        <span class="lg:hidden"><BuzzLogo :wordmark="false" /></span>
        <span class="hidden lg:block"><BuzzLogo :size="34" /></span>
      </RouterLink>
      <nav aria-label="Main" class="flex flex-col gap-1">
        <RouterLink
          v-for="link in links"
          :key="link.to"
          v-slot="{ href, navigate, isExactActive }"
          :to="{ name: link.to }"
          custom
        >
          <a
            :href="href"
            :aria-current="isExactActive ? 'page' : undefined"
            :title="link.label"
            class="flex min-h-12 items-center justify-center gap-3.5 rounded-full px-3.5 text-[17px] lg:justify-start"
            :class="
              isExactActive
                ? 'bg-surface font-bold text-ink shadow-sm'
                : 'font-medium text-muted hover:bg-surface/60 hover:text-ink'
            "
            @click="navigate"
          >
            <AppIcon :name="link.icon" />
            <span class="sr-only lg:not-sr-only">{{ link.label }}</span>
          </a>
        </RouterLink>
        <button
          type="button"
          title="Find people"
          class="flex min-h-12 items-center justify-center gap-3.5 rounded-full px-3.5 text-[17px] font-medium text-muted hover:bg-surface/60 hover:text-ink lg:justify-start"
          @click="findPeople"
        >
          <AppIcon name="search" />
          <span class="sr-only lg:not-sr-only">Find people</span>
        </button>
      </nav>
      <button
        type="button"
        class="flex min-h-12 items-center justify-center rounded-full bg-honey font-extrabold text-on-honey hover:brightness-95 lg:mx-3"
        title="New post"
        @click="uiStore.openCompose()"
      >
        <span class="lg:hidden"><AppIcon name="plus" /></span>
        <span class="sr-only lg:not-sr-only">New post</span>
      </button>
    </div>

    <div
      class="flex flex-col items-center gap-2 rounded-2xl lg:flex-row lg:bg-surface lg:px-3 lg:py-2.5 lg:shadow-sm"
    >
      <RouterLink
        :to="{ name: 'profile' }"
        class="rounded-full"
        aria-label="Your profile"
      >
        <UserAvatar :user="authStore.user" size="sm" />
      </RouterLink>
      <div class="hidden min-w-0 flex-1 flex-col leading-tight lg:flex">
        <span class="truncate text-[15px] font-bold">{{
          authStore.user.name
        }}</span>
        <span class="truncate text-[13px] text-muted"
          >@{{ authStore.user.handle }}</span
        >
      </div>
      <button
        type="button"
        class="flex min-h-9 items-center justify-center gap-1.5 rounded-full border border-line bg-page px-3 text-[13px] font-semibold text-ink hover:bg-subtle"
        title="Log out"
        @click="authStore.logOut()"
      >
        <span class="lg:hidden"><AppIcon name="logout" :size="18" /></span>
        <span class="sr-only lg:not-sr-only">Log out</span>
      </button>
    </div>
  </aside>
</template>
