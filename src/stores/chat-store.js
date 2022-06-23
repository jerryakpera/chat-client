import { defineStore } from "pinia";

export const useChatStore = defineStore("chat", {
  state: () => ({
    chats: [],
    chat: null,
    groups: [],
  }),
});
