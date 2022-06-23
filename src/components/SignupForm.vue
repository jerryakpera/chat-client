<template>
  <q-card flat bordered class="transparent">
    <q-card-section>
      <div class="text-h3 text-white text-weight-light q-mb-lg">Signup</div>
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
          <q-icon name="las la-at" />
        </template>
      </q-input>

      <q-input
        dark
        outlined
        v-model="username"
        label="username"
        class="q-mb-sm"
        color="white"
        :rules="[isRequired]"
        ref="usernameRef"
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
        :rules="[isRequired, passwordMinLength, passwordMaxLength]"
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

      <q-input
        dark
        outlined
        v-model="confirmpassword"
        :type="isConfirmPwd ? 'password' : 'text'"
        label="password"
        class="q-mb-sm"
        color="white"
        clearable
        :rules="[isRequired, passwordMinLength, passwordMaxLength]"
        ref="confirmpasswordRef"
      >
        <template #prepend>
          <q-icon name="las la-lock" />
        </template>

        <template #append>
          <q-icon
            name="las la-eye"
            @click="() => (isConfirmPwd = !isConfirmPwd)"
            style="cursor: pointer"
            :color="isConfirmPwd ? 'grey' : 'primary'"
          />
        </template>
      </q-input>
    </q-card-section>
    <q-card-actions class="q-px-md">
      <q-btn
        class="full-width"
        label="Sign up"
        color="secondary"
        @click="handleSignup"
      />
      <a
        class="full-width q-mt-sm"
        href="http://localhost:3044/gist/api/v1/auth/google"
      >
        <q-btn
          class="full-width q-mt-sm"
          label="Signup with Google"
          color="primary"
        />
      </a>
    </q-card-actions>
  </q-card>
</template>

<script setup>
import { ref } from "vue";
import { useQuasar } from "quasar";
import { useValidation, useAxios } from "src/common/composables";

import { useConfirmation } from "src/common/composables/use-confirmation-dialog";

const $q = useQuasar();
const gistAxios = useAxios();

const email = ref("jta11developer@gmail.com");
const emailRef = ref(null);
const username = ref("jta11developer");
const usernameRef = ref(null);
const password = ref("Password@1");
const passwordRef = ref(null);
const isPwd = ref(true);

const confirmpassword = ref("Password@1");
const confirmpasswordRef = ref(null);
const isConfirmPwd = ref(true);

const { isRequired, isEmail, isLength } = useValidation();
const passwordMinLength = isLength.min(8);
const passwordMaxLength = isLength.max(64);

const handleSignup = async () => {
  emailRef.value.validate();
  usernameRef.value.validate();
  passwordRef.value.validate();
  confirmpasswordRef.value.validate();

  if (emailRef.value.hasError || passwordRef.value.hasError) return;

  const confirmed = await useConfirmation($q.dialog, "Sign up?");
  if (!confirmed) return;

  const requestObj = {
    email: email.value,
    username: username.value,
    password: password.value,
    confirmpassword: confirmpassword.value,
  };

  $q.loading.show();

  try {
    const { data, message } = await gistAxios.post(
      "/auth/register",
      requestObj
    );

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
