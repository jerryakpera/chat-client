<template>
  <q-card-actions>
    <q-space />
    <q-btn
      label="New Chat"
      icon-right="las la-user-plus"
      color="dark"
      size="sm"
      @click="() => $emit('openNewChatDialog')"
    />

    <q-btn
      class="q-mr-sm"
      color="dark"
      push
      label="New group chat"
      icon-right="las la-plus"
      size="sm"
      @click="() => $emit('openNewGroupDialog')"
    />
  </q-card-actions>
</template>

<script setup>
const emit = defineEmits(["openNewChatDialog", "openNewGroupDialog"]);
</script>

<style></style>
