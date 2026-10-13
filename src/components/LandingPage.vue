<script setup lang="ts">
import { useRoute } from "vue-router";

import { useAuthStore } from "@/stores/auth";
import BuzzLogo from "./BuzzLogo.vue";

const authStore = useAuthStore();
const route = useRoute();

function login() {
  authStore.login(
    typeof route.query.redirect === "string" ? route.query.redirect : undefined,
  );
}

const facts = [
  {
    title: "Post",
    text: "Short public updates anyone on Bazaar can read.",
    tone: "bg-honey-soft",
  },
  {
    title: "Follow",
    text: "People you know from Bazaar, in one live feed.",
    tone: "bg-subtle",
  },
  {
    title: "Own it",
    text: "Your posts stay in your own Bazaar database.",
    tone: "bg-subtle",
  },
];
</script>

<template>
  <main
    class="mx-auto flex min-h-screen max-w-3xl flex-col justify-center gap-8 px-4 py-12 sm:px-8"
  >
    <BuzzLogo :size="40" />
    <h1
      class="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl"
    >
      Short posts that live in your own Bazaar account.
    </h1>
    <ul class="grid gap-3 sm:grid-cols-3">
      <li
        v-for="fact in facts"
        :key="fact.title"
        class="rounded-2xl p-4"
        :class="fact.tone"
      >
        <strong class="block text-base font-extrabold">{{ fact.title }}</strong>
        <span class="text-[15px] leading-snug text-body">{{ fact.text }}</span>
      </li>
    </ul>
    <div class="flex flex-col gap-3">
      <div class="flex flex-wrap items-center gap-3">
        <button
          type="button"
          class="min-h-12 rounded-full bg-honey px-6 text-base font-extrabold text-on-honey hover:brightness-95"
          @click="login"
        >
          {{
            authStore.loggingIn ? "Waiting for Bazaar…" : "Log in with Bazaar"
          }}
        </button>
        <span class="text-sm text-muted"
          >Opens a Bazaar login window. New here? You can sign up there.</span
        >
      </div>
      <p
        v-if="authStore.loginError"
        class="text-sm font-semibold text-danger"
        role="alert"
      >
        {{ authStore.loginError }}
      </p>
    </div>
  </main>
</template>
