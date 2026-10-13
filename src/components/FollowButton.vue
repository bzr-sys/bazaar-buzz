<script setup lang="ts">
import { computed, ref } from "vue";

import { useSubscriptionsStore } from "@/stores/subscriptions";

const props = withDefaults(
  defineProps<{ userId: string; size?: "sm" | "md" }>(),
  {
    size: "md",
  },
);

const subscriptionsStore = useSubscriptionsStore();
const following = computed(() => subscriptionsStore.isFollowing(props.userId));
const busy = ref(false);
// "Following" turns into "Unfollow" while hovered or focused.
const armed = ref(false);

async function toggle() {
  busy.value = true;
  if (following.value) {
    await subscriptionsStore.unsubscribe(props.userId);
  } else {
    await subscriptionsStore.subscribe(props.userId);
  }
  busy.value = false;
  armed.value = false;
}
</script>

<template>
  <button
    type="button"
    :disabled="busy"
    :aria-pressed="following"
    class="shrink-0 rounded-full border font-extrabold transition-colors disabled:cursor-wait disabled:opacity-70"
    :class="[
      size === 'sm' ? 'min-h-9 px-3.5 text-[13px]' : 'min-h-11 px-5 text-sm',
      !following
        ? 'border-honey bg-honey text-on-honey hover:brightness-95'
        : armed
          ? 'border-danger-line bg-danger-soft text-danger'
          : 'border-line-strong bg-surface text-ink',
    ]"
    @mouseenter="armed = true"
    @mouseleave="armed = false"
    @focus="armed = true"
    @blur="armed = false"
    @click="toggle"
  >
    <template v-if="!following">Follow</template>
    <template v-else-if="armed">Unfollow</template>
    <template v-else>Following</template>
  </button>
</template>
