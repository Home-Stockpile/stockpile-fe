<script lang="ts" setup>
import { computed, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { INode } from "@/types/treeNodes";
import { useTreeNodes } from "@/store/treeNodes";
import { getOwner } from "@/functions/getOwner";

const route = useRoute();
const breadcrumbs = ref<INode[]>([]);
const treeStore = useTreeNodes();
const tree = computed(() => treeStore.getTree);

function getBreadcrumbs() {
  if (route.params.key) {
    if (route.query.owner === sessionStorage.getItem("uid")) {
      breadcrumbs.value = treeStore.getBreadcrumbs(
        tree.value.items,
        String(route.params.key).split("_"),
        []
      );
    } else {
      breadcrumbs.value = treeStore.getBreadcrumbs(
        treeStore.getSharedTrees.find((item) => item.key === route.query.owner)
          .items,
        String(route.params.key).split("_"),
        []
      );
    }
  }
}
function getParentPath() {
  if (route.query.owner === sessionStorage.getItem("uid")) {
    return { path: "/" };
  }
  return { path: "/section/0", query: { owner: route.query.owner } };
}
onMounted(() => {
  getBreadcrumbs();
});
watch(
  () => route.params.key,
  () => {
    getBreadcrumbs();
  }
);
watch(
  () => tree.value,
  () => {
    getBreadcrumbs();
  }
);
</script>
<template>
  <q-breadcrumbs active-color="primary" separator-color="grey" class="q-pb-md">
    <q-breadcrumbs-el label="Home" :to="getParentPath()" />
    <q-breadcrumbs-el
      v-if="breadcrumbs[0]"
      v-for="breadcrumb in breadcrumbs"
      :key="breadcrumb.key"
      :label="breadcrumb.label"
      :to="{
        path: breadcrumb.to,
        query: { owner: getOwner(breadcrumb.roles) },
      }"
    />
  </q-breadcrumbs>
</template>
