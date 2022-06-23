<template>
  <q-card flat bordered class="transparent">
    <q-card-section>
      <div class="text-h3 text-white text-weight-light q-mb-lg">Signin</div>
    </q-card-section>
    <q-card-section>
      <q-input
        dark
        outlined
        v-model="email"
        label="email"
        class="q-mb-md"
        color="white"
        :rules="[isRequired, isEmail]"
        ref="emailRef"
        clearable
      >
        <template #prepend>
          <q-icon name="las la-user" />
        </template>
      </q-input>

      <q-input
        dark
        outlined
        v-model="password"
        :type="isPwd ? 'password' : 'text'"
        label="password"
        class="q-mb-sm"
        color="white"
        :rules="[isRequired]"
        ref="passwordRef"
        clearable
      >
        <template #prepend>
          <q-icon name="las la-lock" />
        </template>

        <template #append>
          <q-icon
            name="las la-eye"
            @click="() => (isPwd = !isPwd)"
            style="cursor: pointer"
            :color="isPwd ? 'grey' : 'primary'"
          />
        </template>
      </q-input>
    </q-card-section>
    <q-card-actions class="q-px-md">
      <q-btn
        class="full-width"
        label="Sign in"
        color="secondary"
        @click="handleSignin"
      />

      <a
        class="full-width q-mt-sm"
        href="http://localhost:3044/gist/api/v1/auth/google"
      >
        <q-btn
          class="full-width q-mt-sm"
          label="Signin with Google"
          color="primary"
        />
      </a>
    </q-card-actions>
  </q-card>
</template>

<script setup>
import { ref } from "vue";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
import { useValidation, useAxios } from "src/common/composables";
import { useAuthStore } from "stores/auth-store";

import { useConfirmation } from "src/common/composables/use-confirmation-dialog";

const $q = useQuasar();
const gistAxios = useAxios();
const authStore = useAuthStore();
const router = useRouter();

const emailRef = ref(null);
const email = ref("jta11developer@gmail.com");
const password = ref("Password@1");
const passwordRef = ref(null);
const isPwd = ref(true);

const { isRequired, isEmail } = useValidation();

const handleSignin = async () => {
  emailRef.value.validate();
  passwordRef.value.validate();

  if (emailRef.value.hasError || passwordRef.value.hasError) return;

  const confirmed = await useConfirmation($q.dialog, "Sign in?");
  if (!confirmed) return;

  const requestObj = {
    email: email.value,
    password: password.value,
  };

  $q.loading.show();

  try {
    const { data, message } = await gistAxios.post("/auth/login", requestObj);

    authStore.account = data.user;
    authStore.isAuthenticated = true;

    router.push({ path: "/chat" });

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

<style></style>
