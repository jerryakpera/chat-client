<template>
  <q-card-actions class="q-pa-md">
    <div class="text-caption">
      <!-- <q-icon name="las la-comment-dots" left size="sm" color="black" /> -->
      <div class="text-weight-bold text-black">
        {{ authStore.account.username }}
      </div>
      {{ authStore.account.email }}
    </div>

    <q-space />

    <q-btn
      class="q-ml-xs"
      icon="las la-sign-out-alt"
      color="dark"
      push
      size="sm"
      @click="handleLogout"
    />
  </q-card-actions>
</template>

<script setup>
import { useQuasar } from "quasar";
import { useAxios } from "src/common/composables";
import { useConfirmation } from "src/common/composables/use-confirmation-dialog";
import { useAuthStore } from "src/stores/auth-store";
import { useRouter } from "vue-router";

const $q = useQuasar();
const gistAxios = useAxios();
const authStore = useAuthStore();
const router = useRouter();

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
