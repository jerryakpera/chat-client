<template>
  <div>
    <q-list separator>
      <q-scroll-area :style="listHeight" class="q-px-sm">
        <ChatListItem
          v-for="chat in chats"
          :key="chat._id"
          :_id="chat._id"
          :chatname="chat.group ? chat.chatname : chat.users[0].username"
          :description="chat.group ? chat.description : chat.users[0].email"
          :members="chat.users.length"
          :group="chat.group"
          :latestMessage="chat.latestMessage ? chat.latestMessage.text : ''"
          :date="chat.updatedAt"
          :notify="chat && chat.notify"
        />
      </q-scroll-area>
    </q-list>
  </div>
</template>

<script setup>
import ChatListItem from "./ChatListItem.vue";
import ContactList from "../contact-list/ContactList.vue";

import { computed, ref } from "vue";
import { useUserStore } from "stores/user-store";
import { useChatStore } from "stores/chat-store";
import { useQuasar } from "quasar";

const props = defineProps(["chats"]);
const search = ref("");
const newChatDialog = ref(false);
const userStore = useUserStore();
const chatStore = useChatStore();

const listHeight = computed(() => {
  const height = $q.screen.height - 170;

  return `height: ${height}px`;
});

const $q = useQuasar();
</script>
