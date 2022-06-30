import { defineStore } from "pinia";

export const useSocketStore = defineStore("socket", {
  state: () => ({
    socket: null,
    connected: false,
    isTyping: false,
    notifications: [],
  }),

  getters: {
    notify: (state) => state.notifications.length > 0,
  },

  actions: {
    getNotificationIndex(id) {
      return this.notifications.findIndex(
        (notification) => String(notification.id) === String(id)
      );
    },

    addNotification(id) {
      const notificationIndex = this.getNotificationIndex(id);
      console.log(this.notifications);
      if (notificationIndex < 0) {
        const notification = {
          id,
          no: 1,
        };

        this.notifications.push(notification);
        return;
      }

      this.notifications[notificationIndex].no += 1;
    },

    removeNotification(id) {
      console.log(this.notifications);
      const notificationIndex = this.getNotificationIndex(id);
      if (notificationIndex < 0) return;

      this.notifications.splice(notificationIndex, 1);
    },
  },
});
