<template>
  <q-chat-message
    :name="startOfStream ? name : ''"
    :text="[msg.text]"
    :stamp="moment(msg.createdAt).startOf('minute').fromNow()"
    :sent="sent"
    :bg-color="currentColor.bg"
    :text-color="currentColor.text"
    class="text-body1 text-white"
    style="margin-top: 0; margin-bottom: 1px; border-radius: 0 !important"
    :style="endOfStream ? 'margin-bottom: 8px' : ''"
  />
</template>

<script setup>
import moment from "moment";

import { computed } from "vue";
import { useAuthStore } from "stores/auth-store";
import { useChatStore } from "src/stores/chat-store";

const props = defineProps(["msg", "index"]);

const authStore = useAuthStore();
const chatStore = useChatStore();

const sent = computed(
  () => String(props.msg.sender._id) === String(authStore.account._id)
);

const name = computed(() => {
  if (String(props.msg.sender._id) === String(authStore.account._id)) {
    return "me";
  }

  return props.msg.sender.username;
});

const endOfStream = computed(() => {
  if (!chatStore.messages[props.index + 1]) return true;
  const nextMsg = chatStore.messages[props.index + 1];

  const sender = props.msg.sender._id;
  const nextSender = nextMsg.sender._id;

  if (sender === nextSender) return false;
  return true;
});

const startOfStream = computed(() => {
  if (props.index === 0) return true;
  const prevMsg = chatStore.messages[props.index - 1];

  const sender = props.msg.sender._id;
  const prevSender = prevMsg.sender._id;

  if (sender === prevSender) return false;
  return true;
});

const colors = [
  {
    bg: "blue",
    text: "white",
  },
  {
    bg: "red",
    text: "white",
  },
  {
    bg: "indigo",
    text: "white",
  },
];

const currentColor = computed(() => {
  const users = chatStore.chat.users.map((user) => String(user._id));
  const sender = String(props.msg.sender._id);

  if (sender === String(authStore.account._id)) {
    return { bg: "white", text: "black" };
  }

  let userIndex = users.findIndex(
    (user) => String(user) === String(props.msg.sender._id)
  );

  if (userIndex >= colors.length) {
    userIndex = userIndex % colors.length;
  }

  return colors[userIndex];
});
</script>

<style></style>
