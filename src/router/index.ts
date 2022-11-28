import { createRouter, createWebHistory } from "vue-router";
import ItemPage from "../views/ItemPage.vue";
import DefaultPage from "../views/DefaultPage.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: DefaultPage,
    },
    {
      path: "/item/:key",
      name: "itemPage",
      component: ItemPage,
    },
  ],
});

export default router;
