import { createRouter, createWebHashHistory } from "vue-router";

import HomeView from "@/views/HomeView.vue";
import ProfileView from "@/views/ProfileView.vue";
import FollowingView from "@/views/FollowingView.vue";
import UserView from "@/views/UserView.vue";

import { bzr } from "@/bazaar";

declare module "vue-router" {
  interface RouteMeta {
    title?: string;
    requiresAuth?: boolean;
  }
}

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      // The feed when logged in, the welcome page when not
      path: "/",
      name: "home",
      component: HomeView,
      meta: { title: "Home" },
    },
    {
      path: "/profile",
      name: "profile",
      component: ProfileView,
      meta: { title: "Profile", requiresAuth: true },
    },
    {
      path: "/following",
      name: "following",
      component: FollowingView,
      meta: { title: "Following", requiresAuth: true },
    },
    {
      // Public profile; the view itself asks logged-out visitors to log in
      path: "/u/:handle",
      name: "user",
      component: UserView,
    },
    {
      path: "/:pathMatch(.*)*",
      redirect: { name: "home" },
    },
  ],
  scrollBehavior() {
    return { top: 0 };
  },
});

router.beforeEach((to) => {
  if (to.meta.requiresAuth && !bzr.isLoggedIn()) {
    // Show the welcome page, then come back here after logging in.
    return { name: "home", query: { redirect: to.fullPath } };
  }
});

router.afterEach((to) => {
  document.title = to.meta.title
    ? `${to.meta.title} · Bazaar Buzz`
    : "Bazaar Buzz";
});

export default router;
