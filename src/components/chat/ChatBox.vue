<template>
  <div class="q-px-xl q-pt-xl row justify-center col-11">
    <div style="width: 100%">
      <q-scroll-area style="height: 100%">
        <h5 class="text-white" v-if="chatStore.chat">
          {{ chatStore.chat.users.map((user) => user.username) }}
        </h5>
        <div v-for="i in 10" :key="i">
          <q-chat-message
            name="me"
            :text="['hey, how are you?']"
            stamp="7 minutes ago"
            sent
            bg-color="primary"
            text-color="black"
            class="text-body1 text-white"
          >
            <template #avatar class="bg-red">
              <q-avatar
                color="white"
                text-color="black"
                size="md"
                class="q-ma-md"
              >
                JA
              </q-avatar>
            </template>
          </q-chat-message>
          <q-chat-message
            name="Jane"
            avatar="https://cdn.quasar.dev/img/avatar5.jpg"
            :text="[
              'doing fine, how r you?',
              'I just feel like typing a really, really, REALLY long message to annoy you...',
            ]"
            size="6"
            stamp="4 minutes ago"
            text-color="white"
            bg-color="secondary"
            class="text-body1 text-white"
          >
            <template #avatar class="bg-red">
              <q-avatar
                color="white"
                text-color="black"
                size="md"
                class="q-ma-md"
              >
                JT
              </q-avatar>
            </template>
          </q-chat-message>
          <q-chat-message
            name="Jane"
            avatar="https://cdn.quasar.dev/img/avatar5.jpg"
            :text="['Did it work?']"
            stamp="1 minutes ago"
            size="8"
            text-color="white"
            bg-color="secondary"
            class="text-body1 text-white"
          >
            <template #avatar class="bg-red">
              <q-avatar
                color="white"
                text-color="black"
                size="md"
                class="q-ma-md"
              >
                JT
              </q-avatar>
            </template>
          </q-chat-message>
        </div>
      </q-scroll-area>
    </div>
  </div>
</template>

<script setup>
import { useChatStore } from "stores/chat-store";

const chatStore = useChatStore();
</script>
