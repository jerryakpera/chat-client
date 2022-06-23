<template>
  <div class="col q-mb-md">
    <q-card-actions class="q-px-lg">
      <q-input
        label="send message"
        dark
        color="primary"
        style="width: 100%"
        outlined
        @keyup.enter="handleSubmit"
        v-model="message"
        clearable
        autofocus
      >
        <template #append>
          <q-btn label="send" color="primary" @click="handleSubmit" />
        </template>
      </q-input>
    </q-card-actions>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useValidation } from "src/common/composables/use-validation";

const message = ref("");
const { isRequired } = useValidation();

const handleSubmit = async () => {
  let msg = message.value;
  if (msg.trim().length === 0 || !msg) return;

  console.log(msg);
};
</script>

<style></style>
