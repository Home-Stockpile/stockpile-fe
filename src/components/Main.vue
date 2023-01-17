<script setup lang="ts">
import Header from "@/components/Header.vue";
import TreeDrawer from "@/components/TreeDrawer.vue";
import { ref } from "vue";

const treeDrawerOpen = ref(true);

function toggleTreeDrawer() {
  treeDrawerOpen.value = !treeDrawerOpen.value;
}
</script>
<template>
  <q-layout view="hHh LpR fFf">
    <Header @toggle-tree-drawer="toggleTreeDrawer" />

    <TreeDrawer :treeDrawerOpen="treeDrawerOpen" />
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>
