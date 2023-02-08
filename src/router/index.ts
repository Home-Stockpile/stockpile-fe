import { createRouter, createWebHistory } from "vue-router";
import ItemPage from "../views/ItemPage.vue";
import DefaultPage from "../views/DefaultPage.vue";
import SectionPage from "../views/SectionPage.vue";
import { useTreeNodes } from "@/store/treeNodes";
import { computed, watch } from "vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: DefaultPage,
      meta: {
        requiresAuth: false,
      },
    },
    {
      path: "/item/:key",
      name: "itemPage",
      component: ItemPage,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/section/:key",
      name: "sectionPage",
      component: SectionPage,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/:pathMatch(.*)*",
      name: "NotFound",
      component: DefaultPage,
      meta: {
        requiresAuth: false,
      },
    },
  ],
});
router.beforeEach((to) => {
  const treeStore = useTreeNodes();
  const currentItem = computed(() =>
    treeStore.getItem(treeStore.tree, String(to.params.key).split("_"))
  );
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

  if (requiresAuth) {
    if (!sessionStorage.getItem("uid")) {
      router.push("/");
    }
    watch(
      () => treeStore.treeLoading,
      () => {
        if (!currentItem.value) {
          router.push("/");
        }
      }
    );
  } else {
    return;
  }
});
export default router;
