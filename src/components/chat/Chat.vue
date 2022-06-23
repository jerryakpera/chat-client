<template>
  <q-card class="window-height transparent">
    <div class="column full-height">
      <ChatBox />
      <SendMessage />
    </div>
  </q-card>
</template>

<script setup>
import SendMessage from "./SendMessage.vue";
import ChatBox from "./ChatBox.vue";
</script>
