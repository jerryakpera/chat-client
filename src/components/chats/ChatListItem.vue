<template>
  <q-card>
    <q-item
      class="q-mb-sm rounded-borders"
      clickable
      :style="active ? 'border: 1px solid black' : 'border: 1px solid grey'"
      v-ripple
      @click="getChat"
      :class="active ? 'bg-blue-8' : 'bg-grey-4'"
    >
      <q-item-section>
        <q-item-label
          class="text-body2"
          :class="active ? 'text-weight-bold text-white' : ''"
        >
          {{ chatname }}
        </q-item-label>
        <q-item-label
          v-if="latestMessage"
          caption
          lines="2"
          :class="active ? 'text-weight-bold text-white' : ''"
        >
          {{ latestMessage }}
        </q-item-label>
      </q-item-section>

      <q-item-section side>
        <span
          class="text-caption"
          :class="active ? 'text-weight-bold text-white' : ''"
        >
          {{ moment(date).startOf("minute").fromNow() }}
        </span>
        <q-badge
          v-if="notify"
          class="q-mr-sm q-mt-sm"
          floating
          color="primary"
          :label="notifications"
        />
      </q-item-section>
    </q-item>
  </q-card>
</template>

<script setup>
import moment from "moment";
import { computed, toRef, watch } from "vue";
import { useQuasar } from "quasar";
import { useAxios } from "src/common/composables/axios";
import { useChatStore } from "stores/chat-store";
import { useSocketStore } from "stores/socket-store";

const props = defineProps([
  "_id",
  "chatname",
  "description",
  "members",
  "group",
  "date",
  "latestMessage",
  "notify",
]);

const $q = useQuasar();
const gistAxios = useAxios();
const chatStore = useChatStore();
const socketStore = useSocketStore();

const initials = computed(() => {
  const [first, last] = props.chatname.split(" ");

  return `${first[0]}${last[0]}`;
});

const active = computed(() => {
  return chatStore.chat && String(chatStore.chat._id) === String(props._id);
});

const notifications = computed(() => {
  const notificationIndex = socketStore.notifications.findIndex(
    (notification) => String(notification.id) === String(props._id)
  );

  if (notificationIndex < 0) return null;
  return socketStore.notifications[notificationIndex].no;
});

const getChat = async () => {
  if (chatStore.chat && String(chatStore.chat._id) === String(props._id)) {
    return;
  }

  $q.loading.show();

  try {
    const { data } = await gistAxios.get(`/chat/${props._id}`);

    chatStore.chat = data.chat;

    const chatIndex = chatStore.chats.findIndex(
      (ch) => String(ch._id) === String(data.chat._id)
    );
    chatStore.chats[chatIndex].notify = false;
    socketStore.removeNotification(data.chat._id);

    socketStore.socket.emit("join chat", data.chat._id);
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
