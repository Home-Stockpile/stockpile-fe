<script setup lang="ts">
const emit = defineEmits(["toggle-navigation-drawer", "toggle-tree-drawer"]);

function toggleNavigationDrawer() {
  emit("toggle-navigation-drawer");
}
function toggleTreeDrawer() {
  emit("toggle-tree-drawer");
}
</script>
<template>
  <q-header bordered class="bg-primary text-white">
    <q-toolbar>
      <q-btn dense flat round icon="menu" @click="toggleTreeDrawer" />

      <q-toolbar-title> Home stockpile </q-toolbar-title>

      <q-btn dense flat round icon="menu" @click="toggleNavigationDrawer" />
    </q-toolbar>
  </q-header>
</template>
