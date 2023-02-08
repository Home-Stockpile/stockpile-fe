<script setup lang="ts">
import Header from "@/components/Header.vue";
import TreeDrawer from "@/components/TreeDrawer.vue";
import { computed, ref, watch } from "vue";
import { useTreeNodes } from "@/store/treeNodes";

const treeStore = useTreeNodes();
const treeDrawerOpen = ref(false);
const tree = computed(() => treeStore.getTree);

function toggleTreeDrawer() {
  treeDrawerOpen.value = !treeDrawerOpen.value;
}
watch(
  () => tree.value,
  () => {
    if (tree.value && sessionStorage.getItem("uid")) {
      treeDrawerOpen.value = true;
    } else {
      treeDrawerOpen.value = false;
    }
  }
);
</script>
<template>
  <q-layout view="hHh LpR fFf">
    <Header @toggle-tree-drawer="toggleTreeDrawer" />

    <TreeDrawer :treeDrawerOpen="treeDrawerOpen" />
    <q-page-container class="q-pa-xs-none window-height">
      <router-view />
    </q-page-container>
  </q-layout>
</template>
