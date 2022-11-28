<script setup lang="ts">
import { useTreeNodes } from "@/store/treeNodes";

const nodes = useTreeNodes().$state.items;
</script>

<template>
  <nav
    class="left-menu bg-white"
    :class="nodes.length > 14 ? 'overflow-y-scroll' : 'overflow-hidden'"
  >
    <PanelMenu class="mt-3" :model="nodes" />
  </nav>
</template>

<style>
.p-panelmenu .p-panelmenu-header .p-panelmenu-header-content {
  border: none;
  background: #fff;
}

.p-panelmenu-header-content {
  border: none !important;
}

.left-menu {
  height: 100%;
  min-width: 400px;
  border-radius: 20px;
}
.left-menu__item {
  padding: 10px;
}
</style>
