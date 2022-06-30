<template>
  <q-item class="q-mb-sm" style="border: 1px solid grey">
    <q-item-section avatar>
      <q-avatar
        :color="isGroupAdmin ? 'primary' : 'dark'"
        text-color="white"
        size="md"
      >
        {{ initials }}
      </q-avatar>
    </q-item-section>

    <q-item-section>
      <q-item-label class="text-body2">{{ member.username }}</q-item-label>
      <q-item-label caption lines="1" class="text-black">{{
        member.email
      }}</q-item-label>
    </q-item-section>

    <q-item-section side v-if="true">
      <q-btn
        icon="las la-user-minus"
        size="sm"
        color="negative"
        round
        flat
        @click="removeGroupMember"
      />
    </q-item-section>
  </q-item>
  <!-- <q-chip color="primary" size="lg" square>
    <template #default>
      <q-icon
        v-if="isGroupAdmin"
        name="las la-user"
        class="q-mr-sm"
        color="white"
      />
      <span class="text-white"> {{ member.username }} </span>
      <q-btn
        v-if="isAdmin"
        push
        icon="las la-times"
        color="black"
        round
        size="sm"
        class="q-ml-md q-mr-none"
        @click="removeGroupMember"
      />
      <q-tooltip class="text-body1 text-white">
        <div class="text-center">
          {{ member.email }}
          <br />
          {{ isGroupAdmin ? "(Group admin)" : "" }}
        </div>
      </q-tooltip>
    </template>
  </q-chip> -->
</template>

<script setup>
import { computed } from "vue";
import { useQuasar } from "quasar";
import { useAxios } from "src/common/composables/axios";
import { useConfirmation } from "src/common/composables/use-confirmation-dialog";
import { useChatStore } from "stores/chat-store";

const props = defineProps(["member", "isAdmin"]);

const $q = useQuasar();
const gistAxios = useAxios();
const chatStore = useChatStore();

const getConfirmationMsg = (noOfUsers) => {
  if (noOfUsers > 2) {
    return `Remove ${props.member.username} from ${chatStore.chat.chatname}`;
  }
  return `Remove ${props.member.username} and dissolve ${chatStore.chat.chatname}`;
};

const removeGroupMember = async () => {
  const confirmationMessage = getConfirmationMsg(chatStore.chat.users.length);

  const confirmed = await useConfirmation($q.dialog, confirmationMessage);
  const chatID = chatStore.chat._id;

  if (!confirmed) return;

  $q.loading.show();

  try {
    const { data } = await gistAxios.delete(
      `/chat/user/${chatStore.chat._id}/${props.member._id}`
    );

    const chatIndex = chatStore.chats.findIndex(
      (chat) => String(chat._id) === String(chatID)
    );

    if (data.chat) {
      chatStore.chat = data.chat;
      chatStore.chats[chatIndex] = data.chat;
    } else {
      chatStore.chat = null;
      chatStore.chats.splice(chatIndex, 1);
    }
  } catch (err) {
    $q.notify({
      message: err,
      color: "negative",
    });
  }

  $q.loading.hide();
};

const initials = computed(() => {
  const names = props.member.username.split(" ");

  let returnInitials = "";

  names.forEach((name) => (returnInitials += name[0]));

  return returnInitials.toUpperCase();
});

const isGroupAdmin = computed(() => {
  return String(chatStore.chat.admin._id) === String(props.member._id);
});
</script>
