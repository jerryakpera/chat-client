import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    isAuthenticated: true,
    account: {
      username: "jta11developer",
      email: "jta11developer@gmail.com",
    },
    connected: false,
  }),
});
