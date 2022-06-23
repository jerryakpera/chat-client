<template>
  <div>
    <q-card flat class="transparent" dark square>
      <q-toolbar class="bg-dark">
        <q-toolbar-title> Contacts </q-toolbar-title>
      </q-toolbar>
      <!-- {{ users }} -->
      <q-card-section class="px-xs">
        <q-input
          color="black"
          dense
          outlined
          rounded
          v-model="search"
          placeholder="search contacts"
        >
          <template v-slot:append>
            <q-icon name="las la-search" />
          </template>
        </q-input>
      </q-card-section>
    </q-card>

    <q-list separator>
      <Contact
        v-for="contact in users"
        :key="contact.id"
        :username="contact.username"
        :email="contact.email"
        :newMessage="contact.newMessage"
        :_id="contact._id"
      />
    </q-list>
  </div>
</template>

<script setup>
import Contact from "./Contact.vue";
import Navbar from "../navigation/Navbar.vue";

import { ref } from "vue";
import { useQuasar } from "quasar";
import { useAxios } from "src/common/composables";
import { useConfirmation } from "src/common/composables/use-confirmation-dialog";
import { useAuthStore } from "src/stores/auth-store";
import { useRouter } from "vue-router";

const props = defineProps(["users"]);

const $q = useQuasar();
const gistAxios = useAxios();
const authStore = useAuthStore();
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

const handleLogout = async () => {
  const confirmed = await useConfirmation($q.dialog, "Log out?");

  if (!confirmed) return;

  $q.loading.show();

  try {
    const { data, message } = await gistAxios.post("/auth/logout");

    authStore.isAuthenticated = false;
    authStore.account = null;

    router.push({ path: "/" });

    $q.notify({
      message,
      color: "positive",
      icon: "las la-thumbs-up",
    });
  } catch (err) {
    $q.notify({
      message: err,
      color: "negative",
      icon: "las la-exclamation",
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
