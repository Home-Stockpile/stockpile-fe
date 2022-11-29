<script setup lang="ts">
import { useTreeNodes } from "@/store/treeNodes";

const nodes = useTreeNodes().$state.items;
</script>

<template>
  <nav
    class="left-menu border-round-xl"
    :class="nodes.length > 14 ? 'overflow-y-scroll' : 'overflow-hidden'"
  >
    <PanelMenu class="border-0" :model="nodes" />
  </nav>
</template>

<style>
.left-menu {
  height: 100%;
  min-width: 400px;
  background-color: var(--surface-a);
}
</style>
