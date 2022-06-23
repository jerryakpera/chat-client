const routes = [
  {
    path: "/",
    component: () => import("layouts/LandingLayout.vue"),
    // children: [{ path: "", component: () => import("pages/IndexPage.vue") }],
    meta: {
      auth: false,
    },
  },

  {
    path: "/chat",
    component: () => import("layouts/MainLayout.vue"),
    // children: [{ path: "", component: () => import("pages/IndexPage.vue") }],
    meta: {
      auth: true,
    },
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
