<template>
  <div>
    <q-card flat class="transparent" dark square>
      <q-toolbar class="bg-dark">
        <q-toolbar-title> Available Rooms </q-toolbar-title>
      </q-toolbar>
      <q-card-section class="px-xs" v-if="chats.length > 0">
        <q-input
          color="black"
          dense
          outlined
          rounded
          v-model="search"
          placeholder="search groups"
        >
          <template v-slot:append>
            <q-icon name="las la-search" />
          </template>
        </q-input>
      </q-card-section>
      <AddGroup v-if="userStore.users.length > 0" />
    </q-card>

    <q-list separator>
      <ChatListItem
        v-for="chat in chats"
        :key="chat._id"
        :_id="chat._id"
        :chatname="chat.chatname"
        :description="chat.description"
        :members="chat.users.length"
        :group="chat.group"
        :date="chat.updatedAt"
      />
      <!-- :newMessage="chat.newMessage" -->
    </q-list>
  </div>
</template>

<script setup>
import ChatListItem from "./ChatListItem.vue";
import AddGroup from "./AddGroup.vue";

import { ref } from "vue";
import { useUserStore } from "stores/user-store";
import { useChatStore } from "stores/chat-store";

const props = defineProps(["chats"]);

const search = ref("");
const userStore = useUserStore();
const chatStore = useChatStore();
</script>
