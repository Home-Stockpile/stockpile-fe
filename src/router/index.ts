import { createRouter, createWebHistory } from "vue-router";
import ItemPage from "../views/ItemPage.vue";
import DefaultPage from "../views/DefaultPage.vue";
import SectionPage from "../views/SectionPage.vue";
import { useTreeNodes } from "@/store/treeNodes";

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
    {
      path: "/section/:key",
      name: "sectionPage",
      component: SectionPage,
    },
  ],
});
router.beforeEach((to) => {
  const treeStore = useTreeNodes();
  const currentItem = treeStore.getItem(
    treeStore.tree,
    String(to.params.key).split("_")
  );
  if (!currentItem && to.fullPath !== "/") {
    return "/";
  }
});
export default router;
