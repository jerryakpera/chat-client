<template>
  <div>
    <q-space />

    <q-btn
      color="primary"
      label="Edit"
      size="sm"
      @click="editGroupDialog = true"
    />

    <q-dialog v-model="editGroupDialog">
      <q-card style="width: 450px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Update group chat</div>
          <q-space />
          <q-btn icon="las la-times" size="sm" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <q-input
            label="Group name"
            v-model="chat.chatname"
            outlined
            :rules="[isRequired]"
            ref="chatnameRef"
            class="q-mb-sm"
          />
          <q-input
            label="Group description"
            v-model="chat.description"
            outlined
            class="q-mb-sm"
            type="textarea"
            autogrow
          />
        </q-card-section>

        <q-card-actions class="q-pa-md">
          <q-space />

          <q-btn
            label="Cancel"
            color="negative"
            v-close-popup
            outline
            unelevated
          />
          <q-btn label="Save" color="primary" @click="updateGroup" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useQuasar } from "quasar";
import { useUserStore } from "stores/user-store";
import { useChatStore } from "stores/chat-store";
import { useValidation } from "src/common/composables/use-validation";
import { useConfirmation } from "src/common/composables/use-confirmation-dialog";
import { useAxios } from "src/common/composables/axios";

const $q = useQuasar();
const gistAxios = useAxios();
const editGroupDialog = ref(false);
const chatname = ref("");
const chatnameRef = ref(null);
const description = ref("");
const selected = ref(null);
const userStore = useUserStore();
const chatStore = useChatStore();
const { isRequired, isLength } = useValidation();

const minDescriptionLength = isLength.min(10);
const maxDescriptionLength = isLength.max(250);

const props = defineProps(["chat"]);

const options = ref([]);

const filterFn = (val, update) => {
  if (val === "") {
    update(() => {
      options.value = userStore.users;

      // here you have access to "ref" which
      // is the Vue reference of the QSelect
    });
    return;
  }

  update(() => {
    const needle = val.toLowerCase();
    options.value = userStore.users.filter((v) => {
      const match =
        v.username.toLowerCase().indexOf(needle) > -1 ||
        v.email.toLowerCase().indexOf(needle) > -1;

      if (match) return v;
    });
  });
};

const updateGroup = async () => {
  chatnameRef.value.validate();

  if (chatnameRef.value.hasError) return;

  const requestObj = {
    chatname: props.chat.chatname,
    description: props.chat.description,
  };

  const confirmed = await useConfirmation($q.dialog, "Update group chat?");
  if (!confirmed) return;

  $q.loading.show();

  try {
    const { data, message } = await gistAxios.put(
      `/chat/groups/${chatStore.chat._id}`,
      requestObj
    );

    const chatIndex = chatStore.chats.findIndex(
      (chat) => String(chat._id) === String(data.chat._id)
    );

    chatStore.chat = data.chat;
    chatStore.chats[chatIndex] = data.chat;

    $q.notify({
      message,
      color: "positive",
    });

    chatname.value = "";
    description.value = "";
    selected.value = null;

    editGroupDialog.value = false;
  } catch (err) {
    console.log(err);
    $q.notify({
      message: err,
      color: "negative",
    });
  }

  $q.loading.hide();
};

onMounted(() => {
  options.value = [...userStore.users];

  selected.value = props.chat.users;
});
</script>
