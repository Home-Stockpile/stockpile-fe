<script setup lang="ts">
import AddItemDialog from "@/components/AddItemDialog.vue";
import { useTreeNodes } from "@/store/treeNodes";
import { ref } from "vue";

const dialogVisibility = ref(false);

const tree = useTreeNodes().$state;

function hideDialog() {
  dialogVisibility.value = false;
}
function showDialog() {
  dialogVisibility.value = true;
}
</script>

<template>
  <nav
    class="left-menu w-25rem p-1 border-round-xl h-full"
    :class="tree.items.length > 14 ? 'overflow-y-scroll' : 'overflow-hidden'"
  >
    <Button
      @click="showDialog"
      class="p-button-outlined w-full h-4rem"
      icon="pi pi-plus"
    />
    <AddItemDialog
      @hide-dialog="hideDialog"
      :dialog-visibility="dialogVisibility"
      dialog-type="ROOT_SECTION"
    />
    <PanelMenu class="border-0 mt-2" :model="tree.items" />
  </nav>
</template>

<style scoped>
.p-button-outlined {
  box-shadow: none !important;
}
.left-menu {
  background-color: var(--surface-a);
}
</style>
