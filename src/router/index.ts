import { createRouter, createWebHashHistory } from "vue-router";

import HomeView from "@/views/HomeView.vue";
import FeedView from "@/views/FeedView.vue";
import ProfileView from "@/views/ProfileView.vue";
import FollowingView from "@/views/FollowingView.vue";
import UserView from "@/views/UserView.vue";

import { bzr } from "@/bazaar";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
      meta: {
        requiresAuth: false,
      },
      children: [
        {
          path: "",
          name: "feed",
          component: FeedView,
        },
        {
          path: "profile",
          name: "profile",
          component: ProfileView,
        },
        {
          path: "following",
          name: "following",
          component: FollowingView,
        },
      ],
    },
    {
      path: "/u/:handle",
      name: "user",
      component: UserView,
      meta: {
        requiresAuth: false,
      },
    },
  ],
});

router.beforeEach((to, from) => {
  document.title = (to.meta.title as string) || "Bazaar Buzz";

  console.log("auth:", to.meta.requiresAuth !== false);
  // Check if route requires auth
  if (to.meta.requiresAuth !== false) {
    console.log("login:", !bzr.isLoggedIn());
    if (!bzr.isLoggedIn()) {
      return { name: "home", query: { redirect: to.name as string } };
    }
  }
});

export default router;
