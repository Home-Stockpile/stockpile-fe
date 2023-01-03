<script setup lang="ts">
import Header from "@/components/Header.vue";
import TreeDrawer from "@/components/TreeDrawer.vue";
import NavigationDrawer from "@/components/NavigationDrawer.vue";
import { ref } from "vue";

const treeDrawerOpen = ref(true);
const navigationDrawerOpen = ref(false);

function toggleNavigationDrawer() {
  navigationDrawerOpen.value = !navigationDrawerOpen.value;
}
function toggleTreeDrawer() {
  treeDrawerOpen.value = !treeDrawerOpen.value;
}
</script>
<template>
  <q-layout view="hHh LpR fFf">
    <Header
      @toggle-navigation-drawer="toggleNavigationDrawer"
      @toggle-tree-drawer="toggleTreeDrawer"
    />

    <NavigationDrawer :navigationDrawerOpen="navigationDrawerOpen" />
    <TreeDrawer :treeDrawerOpen="treeDrawerOpen" />
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>
