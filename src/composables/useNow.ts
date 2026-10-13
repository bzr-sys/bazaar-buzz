import { ref } from "vue";

// One shared clock so relative times ("4m") stay current without a timer per post.
const now = ref(Date.now());
let timer: ReturnType<typeof setInterval> | undefined;

export function useNow() {
  if (!timer) {
    timer = setInterval(() => {
      now.value = Date.now();
    }, 30 * 1000);
  }
  return now;
}
