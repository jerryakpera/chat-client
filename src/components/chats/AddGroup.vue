<template>
  <q-card style="width: 450px">
    <q-card-section class="row items-center q-pb-none">
      <div class="text-h6">Create a new group chat</div>
      <q-space />
      <q-btn icon="las la-times" size="sm" flat round dense v-close-popup />
    </q-card-section>

    <q-card-section>
      <q-input
        autofocus
        label="Group name"
        v-model="chatname"
        outlined
        :rules="[isRequired]"
        ref="chatnameRef"
        class="q-mb-sm"
      />
      <q-input
        label="Group description"
        v-model="description"
        outlined
        class="q-mb-sm"
        type="textarea"
        autogrow
      />
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

      <q-btn label="Cancel" color="negative" v-close-popup outline unelevated />
      <q-btn label="Create" color="primary" @click="createGroup" />
    </q-card-actions>
  </q-card>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useQuasar } from "quasar";
import { useUserStore } from "stores/user-store";
import { useChatStore } from "stores/chat-store";
import { useValidation } from "src/common/composables/use-validation";
import { useConfirmation } from "src/common/composables/use-confirmation-dialog";
import { useAxios } from "src/common/composables/axios";

const emit = defineEmits(['close']);

const $q = useQuasar();
const gistAxios = useAxios();
const chatname = ref("");
const chatnameRef = ref(null);
const description = ref("");
const selected = ref(null);
const userStore = useUserStore();
const chatStore = useChatStore();
const { isRequired, isLength } = useValidation();

const minDescriptionLength = isLength.min(10);
const maxDescriptionLength = isLength.max(250);

const options = ref([]);

const filterFn = (val, update) => {
  if (val === "") {
    update(() => {
      options.value = userStore.allUsers;

      // here you have access to "ref" which
      // is the Vue reference of the QSelect
    });
    return;
  }

  update(() => {
    const needle = val.toLowerCase();
    options.value = userStore.allUsers.filter((v) => {
      const match =
        v.username.toLowerCase().indexOf(needle) > -1 ||
        v.email.toLowerCase().indexOf(needle) > -1;

      if (match) return v;
    });
  });
};

const createGroup = async () => {
  chatnameRef.value.validate();

  if (chatnameRef.value.hasError) return;
  if (selected.value.length === 0) return;

  const requestObj = {
    chatname: chatname.value,
    description: description.value,
    users: [...selected.value].map((user) => user._id),
  };

  const confirmed = await useConfirmation($q.dialog, "Create new group chat?");
  if (!confirmed) return;

  $q.loading.show();

  try {
    const { data, message } = await gistAxios.post("/chat/groups", requestObj);

    chatStore.chat = data.chat;
    chatStore.addChat(data.chat);

    $q.notify({
      message,
      color: "positive",
    });

    chatname.value = "";
    description.value = "";
    selected.value = null;

    emit("close");
  } catch (err) {
    $q.notify({
      message: err,
      color: "negative",
    });
  }

  $q.loading.hide();
};

onMounted(() => {
  options.value = [...userStore.allUsers];
});
</script>
