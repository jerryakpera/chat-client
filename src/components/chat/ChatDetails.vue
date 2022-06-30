<template>
  <q-card-actions class="q-pa-md">
    <q-space />

    <q-btn
      :icon="chatDetailsDialog ? 'las la-angle-right' : 'las la-angle-left'"
      color="primary"
      push
      @click="chatDetailsDialog = true"
    />

    <q-dialog v-model="chatDetailsDialog" position="right" square>
      <q-card style="width: 370px" class="full-height q-mr-md">
        <q-card-actions class="q-px-md">
          <q-space />

          <q-btn
            push
            icon="las la-times"
            round
            size="sm"
            flat
            color="dark"
            v-close-popup
          />
        </q-card-actions>
        <q-separator />

        <q-card-actions
          class="q-px-md"
          v-if="
            chat.group &&
            String(chat.admin._id) === String(authStore.account._id)
          "
        >
          <q-space />

          <EditGroupChat :chat="chat" class="q-mr-sm" />

          <AddMember :chat="chat" />
        </q-card-actions>

        <q-card-section class="q-pt-lg" v-if="chat.group">
          <div class="text-h5 text-center text-weight-bold">
            {{ chat.chatname }}
          </div>
          <q-separator spaced="" />
          <div class="text-body2 text-center q-mb-xl">
            {{ chat.description }}
          </div>
          <GroupMembers :members="chat.users" />
        </q-card-section>

        <q-card-section class="q-pt-lg text-center" v-else>
          <div class="text-h5 text-center text-weight-bold">Personal Chat</div>
          <q-separator spaced="" />
          <div class="text-h6">
            {{ chat.users[0].username }}
          </div>
          <div class="text-body-2">
            {{ chat.users[0].email }}
          </div>
          <!-- <GroupMembers :members="chat.users" /> -->
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-card-actions>
</template>

<script setup>
import GroupMembers from "./GroupMembers.vue";
import EditGroupChat from "./EditGroupChat.vue";
import AddMember from "./AddMember.vue";

import { ref, computed } from "vue";
import { useChatStore } from "stores/chat-store";
import { useAuthStore } from "stores/auth-store";

const chatDetailsDialog = ref(false);
const chatStore = useChatStore();
const authStore = useAuthStore();

const chat = computed(() => chatStore.chat);
</script>

<style></style>
