<template>
  <q-item class="q-mb-sm" clickable v-ripple @click="getChat">
    <q-item-section avatar class="pa-xs ma-xs">
      <q-avatar color="dark" text-color="white" size="md">
        {{ initials }}
      </q-avatar>
    </q-item-section>

    <q-item-section>
      <q-item-label class="text-body2">{{ username }}</q-item-label>
      <q-item-label caption lines="1" class="text-black">{{
        email
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

const props = defineProps(["username", "email", "_id", "date"]);
const emit = defineEmits([close]);

const $q = useQuasar();
const gistAxios = useAxios();
const chatStore = useChatStore();

const initials = computed(() => {
  const names = props.username.split(" ");

  let returnInitials = "";

  names.forEach((name) => (returnInitials += name[0]));

  return returnInitials;
});

const getChat = async () => {
  $q.loading.show();

  try {
    const { data } = await gistAxios.get(`/users/chat/${props._id}`);

    chatStore.addChat(data.chat);
    chatStore.chat = data.chat;

    emit("close");
  } catch (err) {
    console.log(err);
    $q.notify({
      message: err,
      color: "negative",
    });
  }

  $q.loading.hide();
};
</script>
