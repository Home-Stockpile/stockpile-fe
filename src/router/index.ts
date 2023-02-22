import { createRouter, createWebHistory } from "vue-router";
import ItemPage from "../views/ItemPage.vue";
import DefaultPage from "../views/DefaultPage.vue";
import SectionPage from "../views/SectionPage.vue";
import { useTreeNodes } from "@/store/treeNodes";
import { computed, watch } from "vue";
import ShoppingListPage from "@/views/ShoppingListPage.vue";
import SharedNodes from "@/components/SharedNodes.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      redirect: `/section/0?owner=${sessionStorage.getItem("uid")}`,
    },
    {
      path: "/shoppingList",
      name: "shoppingList",
      component: ShoppingListPage,
      meta: {
        requiresAuth: true,
        requiresNode: false,
      },
    },
    {
      path: "/sharedNodes",
      name: "sharedNodes",
      component: SharedNodes,
      meta: {
        requiresAuth: true,
        requiresNode: false,
      },
    },
    {
      path: "/item/:key",
      name: "itemPage",
      component: ItemPage,
      meta: {
        requiresAuth: true,
        requiresNode: true,
      },
    },
    {
      path: "/section/:key",
      name: "sectionPage",
      component: SectionPage,
      meta: {
        requiresAuth: true,
        requiresNode: true,
      },
    },
    {
      path: "/:pathMatch(.*)*",
      name: "NotFound",
      redirect: `/section/0?owner=${sessionStorage.getItem("uid")}`,
      meta: {
        requiresAuth: false,
        requiresNode: false,
      },
    },
  ],
});
router.beforeEach((to) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const requiresNode = to.matched.some((record) => record.meta.requiresNode);

  if (!requiresAuth) {
    return;
  }
  if (!requiresNode) {
    return;
  }
  const treeStore = useTreeNodes();
  const currentItem = computed(() =>
    treeStore.getItem(treeStore.tree, String(to.params.key).split("_"))
  );

  if (!sessionStorage.getItem("uid")) {
    router.push("/");
    return;
  }
  watch(
    () => treeStore.treeLoading,
    () => {
      if (!currentItem.value) {
        router.push("/");
      }
    }
  );
});
export default router;
