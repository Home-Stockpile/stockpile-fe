<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useTreeNodes } from "@/store/treeNodes";
import { IItem } from "@/types/treeNodes";

const route = useRoute();
const treeStore = useTreeNodes();
const tree = treeStore.getTree;
const emit = defineEmits(["toggle-navigation-drawer", "toggle-tree-drawer"]);

const breadcrumbs = ref<IItem[]>([]);
function toggleNavigationDrawer() {
  emit("toggle-navigation-drawer");
}
function toggleTreeDrawer() {
  emit("toggle-tree-drawer");
}
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
  <q-header elevated class="bg-primary text-white">
    <q-toolbar>
      <q-btn dense flat round icon="menu" @click="toggleTreeDrawer" />

      <q-toolbar-title> Home stockpile </q-toolbar-title>

      <q-btn dense flat round icon="menu" @click="toggleNavigationDrawer" />
    </q-toolbar>
    <q-toolbar class="bg-white">
      <q-breadcrumbs
        active-color="primary"
        separator-color="grey"
        class="q-pa-xs"
      >
        <q-breadcrumbs-el label="Home" to="/" />

        <q-breadcrumbs-el
          v-if="breadcrumbs[0]"
          v-for="breadcrumb in breadcrumbs"
          :key="breadcrumb.key"
          :label="breadcrumb.label"
          :to="breadcrumb.to"
        />
      </q-breadcrumbs>
    </q-toolbar>
  </q-header>
</template>
