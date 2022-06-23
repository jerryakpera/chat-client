<template>
  <q-item class="q-mb-sm" clickable v-ripple @click="getChat">
    <q-item-section avatar class="pa-xs ma-xs">
      <q-avatar color="dark" text-color="white" size="md">
        <q-icon
          :name="group ? 'las la-users' : 'las la-user-friends'"
          color="white"
          size="md"
        />
        <!-- <q-badge :color="online ? 'green-8' : 'grey'" rounded floating /> -->
      </q-avatar>
    </q-item-section>

    <q-item-section>
      <q-item-label class="text-body2">{{ chatname }}</q-item-label>
      <q-item-label caption lines="1" class="text-black">{{
        description
      }}</q-item-label>
    </q-item-section>

    <q-item-section side>
      <span class="text-caption text-black">
        {{ moment(date).startOf("minute").fromNow() }}
      </span>
    </q-item-section>
  </q-item>
</template>

<script setup>
import moment from "moment";
import { computed } from "vue";
import { useQuasar } from "quasar";
import { useAxios } from "src/common/composables/axios";
import { useChatStore } from "stores/chat-store";

const props = defineProps([
  "_id",
  "chatname",
  "description",
  "members",
  "group",
  "date",
]);

const $q = useQuasar();
const gistAxios = useAxios();
const chatStore = useChatStore();

const initials = computed(() => {
  const [first, last] = props.chatname.split(" ");

  return `${first[0]}${last[0]}`;
});

const getChat = async () => {
  $q.loading.show();

  try {
    const { data } = await gistAxios.get(`/chat/chat/${props._id}`);

    chatStore.chat = data.chat;

    // const chatExists = chatStore.chats.find(
    //   (chat) => String(chat._id) === String(data.chat._id)
    // );

    // if (!chatExists) chatStore.chats.push(data.chat);
  } catch (err) {
    $q.notify({
      message: err,
      color: "negative",
    });
  }

  $q.loading.hide();
};
</script>

<style></style>
