import { useAxios } from "src/common/composables/axios";
import { useAuthStore } from "src/stores/auth-store";

const authStore = useAuthStore();

const gistAxios = useAxios();

export default async ({ app, router }) => {
  router.beforeEach(async (to, from, next) => {
    try {
      const { data } = await gistAxios.get("/auth/account");

      const { user } = data;

      authStore.isAuthenticated = true;
      authStore.account = user;

      if (to.meta.auth) return next();
      else return next({ path: "/chat" });
    } catch (err) {
      authStore.isAuthenticated = false;
      authStore.account = null;

      if (to.meta.auth) return next({ path: "/" });
      else return next();
    }
  });
};
