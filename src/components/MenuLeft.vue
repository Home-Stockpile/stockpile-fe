<script setup lang="ts">
import AddItemDialog from "@/components/AddItemDialog.vue";
import { useTreeNodes } from "@/store/treeNodes";
import { ref } from "vue";
import { IItem } from "@/types/treeNodes";

const dialogVisibility = ref(false);
const tree = useTreeNodes().$state;
const searchQuery = ref("");

function hideDialog() {
  dialogVisibility.value = false;
}
function showDialog() {
  dialogVisibility.value = true;
}
function findElement() {
  console.log(searchItem(tree));
}

function searchItem(element: IItem): IItem | null {
  if (
    element.label &&
    String(element.label).toLowerCase().includes(searchQuery.value)
  ) {
    console.log(element);
  }

  if (element.items !== undefined) {
    let result: IItem | null = null;

    for (let i = 0; result === null && i < element.items.length; i++) {
      result = searchItem(element.items[i]);
    }
    return result;
  }
  return null;
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
    <div class="p-inputgroup mt-1">
      <InputText v-model="searchQuery" placeholder="Keyword" />
      <Button
        @click="findElement"
        icon="pi pi-search"
        class="p-button-warning"
      />
    </div>
    <AddItemDialog
      @hide-dialog="hideDialog"
      :dialog-visibility="dialogVisibility"
      dialog-type="ROOT_SECTION"
    />
    <PanelMenu class="border-0 mt-2" :model="tree.items">
      <template #item="{ item }">
        <RouterLink
          class="w-full flex align-items-center py-2 px-2"
          :to="item.to"
        >
          <Image
            :src="item.icon || tree.defaultIcon"
            width="32"
            height="32"
            imageClass="border-circle inline"
          />
          <div class="ml-2">
            {{ item.label }}
          </div>
        </RouterLink>
      </template>
    </PanelMenu>
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
