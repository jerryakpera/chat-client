<template>
  <!-- <q-layout view="lHh lpR lFr" class="bg-dark"> -->
  <q-layout view="hhh lpR fFf" class="bg-dark">
    <!-- <Navbar /> -->

    <q-drawer
      elevated
      show-if-above
      v-model="leftDrawerOpen"
      side="left"
      :width="$q.screen.lt.lg ? 360 : 500"
      class="bg-primary"
    >
      <Navbar v-if="authStore.account" />
      <ChatsList :chats="chatStore.chats" class="q-py-md" />
      <ContactList :users="userStore.users" />
    </q-drawer>

    <q-page-container>
      <Chat />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import ContactList from "src/components/contact-list/ContactList.vue";
import Navbar from "src/components/navigation/Navbar.vue";
import Chat from "components/chat/Chat.vue";
import ChatsList from "components/chats/ChatsList.vue";
import socketConn from "src/common/socket";

import { onMounted, ref } from "vue";
import { useQuasar } from "quasar";
import { useAxios } from "src/common/composables/axios";
import { useAuthStore } from "stores/auth-store";
import { useUserStore } from "stores/user-store";
import { useChatStore } from "stores/chat-store";

const $q = useQuasar();
const gistAxios = useAxios();
const authStore = useAuthStore();
const userStore = useUserStore();
const chatStore = useChatStore();

const leftDrawerOpen = ref(true);

const getChatData = async () => {
  $q.loading.show();

  try {
    const usersResponse = await gistAxios.get("/users");
    const chatsResponse = await gistAxios.get("/chat");

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
});
</script>
