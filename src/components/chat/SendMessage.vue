<template>
  <div>
    <q-spinner-comment v-if="socketStore.isTyping" color="primary" size="2em" />
    <q-card-actions class="q-pa-none q-ma-none q-mt-sm">
      <q-input
        @keyup.enter="handleSubmit"
        label="send message"
        dark
        color="primary"
        style="width: 100%"
        outlined
        v-model="message"
        clearable
        autofocus
        @keyup="(e) => handleTyping(e)"
      >
        <template #append>
          <q-btn label="send" color="primary" @click="handleSubmit" />
        </template>
      </q-input>
    </q-card-actions>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import { useQuasar, throttle } from "quasar";
import { useChatStore } from "stores/chat-store";
import { useAxios } from "src/common/composables/axios";
import { useSocketStore } from "src/stores/socket-store";

const emit = defineEmits(["msgSent"]);

const $q = useQuasar();
const message = ref("");
const gistAxios = useAxios();
const chatStore = useChatStore();
const socketStore = useSocketStore();
const isTyping = ref(false);

const handleSubmit = async () => {
  let msg = message.value;
  if (msg.trim().length === 0 || !msg) return;

  const requestObj = {
    chat: chatStore.chat._id,
    text: msg.trim(),
  };

  $q.loading.show();

  message.value = "";
  try {
    const { data } = await gistAxios.post("/message", requestObj);

    chatStore.addChat(data.chat);
    chatStore.chat = data.chat;

    socketStore.socket.emit("new message", data.msg);
    socketStore.socket.emit("stop typing", chatStore.chat._id);
  } catch (err) {
    $q.notify({
      message: err,
      color: "negative",
    });
  }

  setTimeout(() => {
    emit("msgSent");
  }, 500);

  $q.loading.hide();
};

const stopTyping = throttle(() => {
  socketStore.socket.emit("stop typing", chatStore.chat._id);
}, 3000);

const handleTyping = () => {
  socketStore.socket.emit("typing", chatStore.chat._id);

  setTimeout(() => {
    stopTyping();
  }, 1500);
};
</script>

<style></style>
