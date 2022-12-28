<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useTreeNodes } from "@/store/treeNodes";
import { IItem } from "@/types/treeNodes";

const route = useRoute();
const treeStore = useTreeNodes();
const tree = treeStore.getTree;

const breadcrumbs = ref<IItem[]>([]);

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
    if (route.params.key) {
      breadcrumbs.value = treeStore.getBreadcrumbs(
        tree.items,
        String(route.params.key).split("_"),
        []
      );
    }
  }
);
</script>
<template>
  <header class="header border-round-xl">
    <Breadcrumb
      class="overflow-x-scroll md:overflow-hidden border-0 pt-3"
      :home="tree"
      :model="breadcrumbs"
      aria-label="breadcrumb"
    />
  </header>
</template>
<style scoped>
.header {
  background-color: var(--surface-a);
}
</style>
