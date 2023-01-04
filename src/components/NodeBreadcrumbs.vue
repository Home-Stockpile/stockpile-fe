<script lang="ts" setup>
import { onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { INode } from "@/types/treeNodes";
import { useTreeNodes } from "@/store/treeNodes";

const route = useRoute();
const breadcrumbs = ref<INode[]>([]);
const treeStore = useTreeNodes();
const tree = treeStore.getTree;

onMounted(() => {
  if (route.params.key) {
    breadcrumbs.value = treeStore.getBreadcrumbs(
      tree.items,
      String(route.params.key).split("_"),
      []
    );
  }
});
watch(
  () => route.params.key,
  () => {
    breadcrumbs.value = treeStore.getBreadcrumbs(
      tree.items,
      String(route.params.key).split("_"),
      []
    );
  }
);
</script>
<template>
  <q-breadcrumbs active-color="primary" separator-color="grey" class="q-pb-md">
    <q-breadcrumbs-el label="Home" to="/" />

    <q-breadcrumbs-el
      v-if="breadcrumbs[0]"
      v-for="breadcrumb in breadcrumbs"
      :key="breadcrumb.key"
      :label="breadcrumb.label"
      :to="breadcrumb.to"
    />
  </q-breadcrumbs>
</template>
