<template>
  <q-layout view="hhh lpR fFf" class="bg-dark">
    <q-page class="row">
      <div class="q-pa-md" :class="$q.screen.lt.lg ? 'col-4' : 'col-3'">
        <q-card class="bg-white" bordered style="border: 3px solid white" flat>
          <Navbar v-if="authStore.account" />
          <!-- New chat buttons -->
          <ChatButtons
            @openNewChatDialog="newChatDialog = true"
            @openNewGroupDialog="newGroupDialog = true"
          />

          <q-dialog v-model="newGroupDialog">
            <AddGroup @close="newGroupDialog = false" />
          </q-dialog>

          <ChatsList :chats="chatStore.chats" class="q-py-md" />

          <q-dialog v-model="newChatDialog">
            <ContactList
              :users="userStore.users"
              @close="newChatDialog = false"
            />
          </q-dialog>
          <!-- <ContactList :users="userStore.users" /> -->
        </q-card>
      </div>
      <div :class="$q.screen.lt.lg ? 'col-8 q-pa-none' : 'col-9 q-pa-none'">
        <Chat :newMsg="newMsg" />
      </div>
    </q-page>
  </q-layout>
</template>

<script setup>
import ChatButtons from "../components/navigation/ChatButtons.vue";
import ContactList from "src/components/contact-list/ContactList.vue";
import Navbar from "src/components/navigation/Navbar.vue";
import Chat from "components/chat/Chat.vue";
import ChatsList from "components/chats/ChatsList.vue";
import AddGroup from "../components/chats/AddGroup.vue";

import { io } from "socket.io-client";

import { onMounted, ref } from "vue";
import { useQuasar } from "quasar";
import { useAxios } from "src/common/composables/axios";
import { useAuthStore } from "stores/auth-store";
import { useUserStore } from "stores/user-store";
import { useChatStore } from "stores/chat-store";
import { useSocketStore } from "stores/socket-store";

const $q = useQuasar();
const gistAxios = useAxios();
const authStore = useAuthStore();
const userStore = useUserStore();
const chatStore = useChatStore();
const socketStore = useSocketStore();

const newMsg = ref(null);
const typing = ref(false);
const leftDrawerOpen = ref(true);
const newChatDialog = ref(false);
const newGroupDialog = ref(false);

const getChatData = async () => {
  $q.loading.show();

  try {
    const usersResponse = await gistAxios.get("/users");
    const chatsResponse = await gistAxios.get("/chat");

    userStore.allUsers = usersResponse.data.users;
    userStore.users = usersResponse.data.users;

    chatStore.chats = chatsResponse.data.chats;
  } catch (err) {
    $q.notify({
      message: err,
      color: "negative",
    });
  }

  $q.loading.hide();
};

onMounted(async () => {
  await getChatData();

  socketStore.socket = io.connect("http://localhost:3044/");
  socketStore.socket.emit("setup", authStore.account);

  socketStore.socket.on("connected", () => {
    socketStore.connected = true;
  });

  socketStore.socket.on("message received", (msg) => {
    const { chat } = msg;

    if (!chatStore.chat || String(chatStore.chat._id) !== String(chat._id)) {
      const chatIndex = chatStore.chats.findIndex(
        (ch) => String(ch._id) === String(chat._id)
      );

      chatStore.chats[chatIndex].latestMessage = msg;
      chatStore.chats[chatIndex].updatedAt = chat.updatedAt;
      chatStore.chats[chatIndex].notify = true;

      socketStore.addNotification(chat._id);

      return;
    }

    newMsg.value = msg;
    chatStore.chat.messages.push(msg);
  });

  socketStore.socket.on("typing", () => (typing.value = true));
  socketStore.socket.on("stop typing", () => (typing.value = false));

  socketStore.socket.on("typing", (chat) => {
    if (String(chat) === String(chatStore.chat._id)) {
      socketStore.isTyping = true;
    }
  });

  socketStore.socket.on("stop typing", (chat) => {
    if (String(chat) === String(chatStore.chat._id)) {
      socketStore.isTyping = false;
    }
  });
});
</script>
