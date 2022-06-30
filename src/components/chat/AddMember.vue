<template>
  <div>
    <q-space />

    <q-btn color="primary" label="Add Member" size="sm" @click="openDialog" />

    <q-dialog v-model="addMemberDialog">
      <q-card style="width: 450px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Update group chat</div>
          <q-space />
          <q-btn icon="las la-times" size="sm" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <q-select
            outlined
            v-model="selected"
            multiple
            use-input
            input-debounce="0"
            :options="options"
            use-chips
            stack-label
            @filter="filterFn"
            label="Select users to add to group"
            option-label="username"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey"> No results </q-item-section>
              </q-item>
            </template>
          </q-select>
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
          <q-btn label="Save" color="primary" @click="handleAddMembers" />
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
import { useConfirmation } from "src/common/composables/use-confirmation-dialog";
import { useAxios } from "src/common/composables/axios";

const $q = useQuasar();
const gistAxios = useAxios();
const addMemberDialog = ref(false);
const selected = ref(null);
const users = ref(null);
const userStore = useUserStore();
const chatStore = useChatStore();

const props = defineProps(["chat"]);

const options = ref([]);

const filterFn = (val, update) => {
  if (val === "") {
    update(() => {
      options.value = users.value;

      // here you have access to "ref" which
      // is the Vue reference of the QSelect
    });
    return;
  }

  update(() => {
    const needle = val.toLowerCase();
    options.value = users.value.filter((v) => {
      const match =
        v.username.toLowerCase().indexOf(needle) > -1 ||
        v.email.toLowerCase().indexOf(needle) > -1;

      if (match) return v;
    });
  });
};

const getValidUsers = () => {
  const chatUsers = props.chat.users.map((user) => String(user._id));

  return userStore.users.filter((user) => {
    if (!chatUsers.includes(user._id)) return user;
  });
};

const handleAddMembers = async () => {
  const requestObj = {
    users: selected.value.map((user) => user._id),
  };

  const confirmed = await useConfirmation($q.dialog, "Add users?");

  if (!confirmed) return;

  $q.loading.show();

  try {
    const { data, message } = await gistAxios.post(
      `/chat/users/${chatStore.chat._id}`,
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

    getValidUsers();

    selected.value = null;
    options.value = null;
    users.value = null;
    addMemberDialog.value = false;
  } catch (err) {
    console.log(err);
    $q.notify({
      message: err,
      color: "negative",
    });
  }

  $q.loading.hide();
};

const setOptions = () => {
  users.value = getValidUsers();

  options.value = [...users.value];
};

const openDialog = () => {
  addMemberDialog.value = true;
  setOptions();
};
</script>
