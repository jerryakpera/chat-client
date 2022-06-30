<template>
  <q-card flat square style="width: 560px">
    <q-toolbar>
      <q-toolbar-title> Contacts </q-toolbar-title>
      <q-space />

      <q-btn
        icon="las la-times"
        @click="() => $emit('close')"
        color="dark"
        size="sm"
        flat
        round
      />
    </q-toolbar>
    <q-card-section class="px-xs">
      <q-input
        color="black"
        dense
        outlined
        rounded
        v-model="search"
        placeholder="search contacts"
        @keyup.enter="handleSearch"
        clearable
      >
        <template v-slot:append>
          <q-btn
            icon="las la-search"
            flat
            round
            color="dark"
            @click="handleSearch"
            size="sm"
          />
          <!-- <q-icon name="las la-search" /> -->
        </template>
      </q-input>
    </q-card-section>
    <q-card-section>
      <q-list separator>
        <q-scroll-area
          :style="$q.screen.lt.lg ? 'height: 200px' : 'height: 300px'"
        >
          <Contact
            v-for="contact in users"
            :key="contact.id"
            :username="contact.username"
            :email="contact.email"
            :newMessage="contact.newMessage"
            :_id="contact._id"
            :date="contact.createdAt"
            @close="() => $emit('close')"
          />
        </q-scroll-area>
      </q-list>
    </q-card-section>
  </q-card>
</template>

<script setup>
import Contact from "./Contact.vue";

import { computed, onMounted, ref, toRef } from "vue";
import { useQuasar } from "quasar";
import { useAxios } from "src/common/composables";
import { useConfirmation } from "src/common/composables/use-confirmation-dialog";
import { useAuthStore } from "src/stores/auth-store";
import { useUserStore } from "src/stores/user-store";
import { useRouter } from "vue-router";

const props = defineProps(["users"]);
const emit = defineEmits(["close"]);

const $q = useQuasar();
const gistAxios = useAxios();
const authStore = useAuthStore();
const userStore = useUserStore();
const router = useRouter();

const search = ref("");
const contacts = [
  {
    id: 1,
    name: "Ruddy Jedrzej",
    email: "rjedrzej0@discuz.net",
    online: true,
    newMessage: false,
  },
  {
    id: 2,
    name: "Mallorie Alessandrini",
    email: "malessandrini1@marketwatch.com",
    online: false,
    newMessage: false,
  },
  {
    id: 3,
    name: "Elisabetta Wicklen",
    email: "ewicklen2@microsoft.com",
    online: false,
    newMessage: true,
  },
  {
    id: 4,
    name: "Seka Fawdrey",
    email: "sfawdrey3@wired.com",
    online: true,
    newMessage: false,
  },
  {
    id: 5,
    name: "Brunhilde Panswick",
    email: "bpanswick4@csmonitor.com",
    online: false,
    newMessage: false,
  },
  {
    id: 6,
    name: "Winfield Stapforth",
    email: "wstapforth5@pcworld.com",
    online: true,
    newMessage: true,
  },
];

const handleSearch = async () => {
  const needle = search.value.toLowerCase();

  if (!needle || needle.trim().length === 0) return;

  $q.loading.show();

  try {
    const { data, message } = await gistAxios.get(`/users?search=${needle}`);

    userStore.users = data.users;
  } catch (err) {
    $q.notify({
      message: err,
      color: "negative",
    });
  }

  $q.loading.hide();
};
</script>

<style lang="scss">
a {
  text-decoration: none;
}
</style>
