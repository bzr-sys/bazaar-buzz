import { ref } from "vue";
import { defineStore } from "pinia";

import { bzr } from "@/bazaar";
import { useDefaultBlogStore } from "./defaultBlog";
import { useSubscriptionsStore } from "./subscriptions";
import type { User } from "@bzr/bazaar";

// Where to go after logging in. Kept in sessionStorage as well as the URL
// because a redirect login (when the popup is blocked) drops the hash.
const REDIRECT_KEY = "buzz:redirect";

function storeRedirect(path: string | undefined) {
  try {
    if (path) sessionStorage.setItem(REDIRECT_KEY, path);
    else sessionStorage.removeItem(REDIRECT_KEY);
  } catch {
    // Storage can be unavailable (private mode); the ?redirect query still works.
  }
}

function takeStoredRedirect(): string | undefined {
  try {
    const path = sessionStorage.getItem(REDIRECT_KEY) ?? undefined;
    sessionStorage.removeItem(REDIRECT_KEY);
    return path;
  } catch {
    return undefined;
  }
}

/** Only follow in-app paths, never another origin. */
export function safeRedirect(path: unknown): string | undefined {
  return typeof path === "string" &&
    path.startsWith("/") &&
    !path.startsWith("//")
    ? path
    : undefined;
}

export const useAuthStore = defineStore("auth", () => {
  const loaded = ref(false);
  const authenticated = ref(false);
  const loggingIn = ref(false);
  const loginError = ref("");
  const user = ref({} as User);

  async function autoSignIn() {
    if (bzr.isLoggedIn()) {
      try {
        user.value = await bzr.social.getUser();

        const defaultBlogStore = useDefaultBlogStore();
        await defaultBlogStore.sync();

        const subscriptionsStore = useSubscriptionsStore();
        await subscriptionsStore.sync();

        authenticated.value = true;
        loggingIn.value = false;
      } catch (e: unknown) {
        console.error("Error during auto signin", e);
      }
    }
    loaded.value = true;
  }

  /**
   * Opens the Bazaar login popup. `redirect` is the in-app path to show
   * afterwards (the current page if omitted).
   */
  async function login(redirect?: string) {
    loginError.value = "";
    loggingIn.value = true;
    storeRedirect(safeRedirect(redirect));
    try {
      await bzr.login();
    } catch (e: unknown) {
      loggingIn.value = false;
      loginError.value =
        "Couldn't open the Bazaar login. Allow pop-ups and try again.";
      console.error("Login failed", e);
      return;
    }
    // The popup takes focus. When it closes without logging in, focus comes
    // back here: reset the button so people can try again.
    window.addEventListener(
      "focus",
      () => {
        setTimeout(() => {
          if (!authenticated.value) loggingIn.value = false;
        }, 1500);
      },
      { once: true },
    );
  }

  function failLogin(message: string) {
    loggingIn.value = false;
    loginError.value = message;
  }

  /** The path to open after a successful login, if one was requested. */
  function takeRedirect(queryRedirect: unknown): string | undefined {
    const stored = takeStoredRedirect();
    return safeRedirect(queryRedirect) ?? safeRedirect(stored);
  }

  function logOut() {
    // Reloads the page.
    bzr.logOut();
  }

  return {
    loaded,
    authenticated,
    loggingIn,
    loginError,
    user,
    autoSignIn,
    login,
    failLogin,
    takeRedirect,
    logOut,
  };
});
