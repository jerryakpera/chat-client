import { defineStore } from "pinia";

export const useChatStore = defineStore("chat", {
  state: () => ({
    chats: [],
    chat: null,
    groups: [],
  }),

  getters: {
    messages: (state) => state.chat.messages,
  },

  actions: {
    addChat(chat) {
      const chatIndex = this.chats.findIndex(
        (ch) => String(ch._id) === String(chat._id)
      );

      if (chatIndex < 0) this.chats.push(chat);
      else {
        this.chats[chatIndex] = chat;
      }
    },
  },
});
