<template>
  <div
    class="q-my-md q-mr-md"
    :style="$q.screen.lt.lg ? 'height: 94%' : 'height: 95%'"
  >
    <q-card
      class="full-height transparent q-ml-none q-pa-md column no-wrap"
      bordered
      style="border: 3px solid white"
      flat
      v-if="chatStore.chat"
    >
      <ChatDetails />
      <q-scroll-area
        :style="$q.screen.lt.lg ? 'height: 74%' : 'height: 82%'"
        ref="scrollAreaRef"
      >
        <ChatMessage
          v-for="(msg, i) in chatStore.messages"
          :key="msg._id"
          :msg="msg"
          :index="i"
        />
      </q-scroll-area>
      <SendMessage @msgSent="scrollToBottom" />
    </q-card>
  </div>
</template>

<script setup>
import GroupMembers from "./GroupMembers.vue";
import EditGroupChat from "./EditGroupChat.vue";
import AddMember from "./AddMember.vue";
import ChatDetails from "./ChatDetails.vue";
import ChatMessage from "./ChatMessage.vue";
import SendMessage from "./SendMessage.vue";

import { computed, onMounted, ref, toRef, watch } from "vue";
const scrollAreaRef = ref(null);
import { useChatStore } from "stores/chat-store";
import { useQuasar } from "quasar";
import { useSocketStore } from "src/stores/socket-store";

const props = defineProps(["newMsg"]);

const chatStore = useChatStore();
const socketStore = useSocketStore();
const $q = useQuasar();
const chat = computed(() => chatStore.chat);
const messages = computed(() => chatStore.messages);
const newMsg = toRef(props, "newMsg");

const chatHeight = computed(() => {
  const height = $q.screen.height - 50;

  return `height: ${height}px`;
});

const scrollToBottom = () => {
  scrollAreaRef.value.setScrollPercentage("vertical", 1, 150);
};

watch(chat, (current, old) => {
  setTimeout(scrollToBottom, 5);
});

watch(newMsg, (current, old) => {
  setTimeout(scrollToBottom, 5);
});

onMounted(() => {});
</script>
