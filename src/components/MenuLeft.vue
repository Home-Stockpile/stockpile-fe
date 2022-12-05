<script setup lang="ts">
import { useTreeNodes } from "@/store/treeNodes";

const nodes = useTreeNodes().$state.items;
</script>

<template>
  <nav
    class="left-menu w-3 p-1 border-round-xl h-full"
    :class="nodes.length > 14 ? 'overflow-y-scroll' : 'overflow-hidden'"
  >
    <PanelMenu class="border-0" :model="nodes" />
  </nav>
</template>

<style scoped>
.left-menu {
  background-color: var(--surface-a);
}
</style>
