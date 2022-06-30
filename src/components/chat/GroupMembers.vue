<template>
  <div class="q-mt-lg">
    <div class="text-dark text-body-2 q-pl-sm">Members</div>
    <q-scroll-area
      style="height: 400px; overflow: hidden"
      :thumb-style="thumbStyle"
      :bar-style="barStyle"
    >
      <q-list>
        <GroupMember
          v-for="member in members"
          :key="member._id"
          :member="member"
          :isAdmin="isAdmin"
        />
      </q-list>
      <!-- <div class="row wrap">
      </div> -->
    </q-scroll-area>
  </div>
</template>

<script setup>
import GroupMember from "./GroupMember.vue";

import { computed } from "vue";
import { useChatStore } from "stores/chat-store";
import { useAuthStore } from "stores/auth-store";

const props = defineProps(["members"]);

const chatStore = useChatStore();
const authStore = useAuthStore();

const thumbStyle = {
  right: "4px",
  borderRadius: "5px",
  backgroundColor: "#FFF",
  width: "5px",
  opacity: 0.75,
};

const barStyle = {
  right: "2px",
  borderRadius: "9px",
  backgroundColor: "#027be3",
  width: "9px",
  opacity: 0.2,
};

const isAdmin = computed(() => {
  return String(chatStore.chat.admin._id) === String(authStore.account._id);
});
</script>
