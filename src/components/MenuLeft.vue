<script setup lang="ts">
import AddItemDialog from "@/components/AddItemDialog.vue";
import { useTreeNodes } from "@/store/treeNodes";
import { ref } from "vue";
import { IItem } from "@/types/treeNodes";

const dialogVisibility = ref(false);
const tree = useTreeNodes().$state;
const searchQuery = ref("");
const searchQueryError = ref("");
const searchResult = ref([]);

function hideDialog() {
  dialogVisibility.value = false;
}
function showDialog() {
  dialogVisibility.value = true;
}
function checkSearchQuery(query) {
  if (!query.trim()) {
    return "Field can't be empty";
  }
  return "";
}

function findElement() {
  searchQueryError.value = checkSearchQuery(searchQuery.value);
  if (!searchQueryError.value) {
    searchResult.value = searchItem(tree, []);
    if (!searchResult.value.length) {
      searchQueryError.value = "No results";
    }
  }
}

function searchItem(element: IItem, searchResult: IItem[]): IItem[] {
  if (
    element.label &&
    String(element.label)
      .toLowerCase()
      .includes(searchQuery.value.toLowerCase())
  ) {
    searchResult.push(element);
  }

  if (element.items) {
    let item = null;
    for (let i = 0; i < element.items.length; i++) {
      item = searchItem(element.items[i], searchResult);
    }

    return item;
  }

  return searchResult;
}

function resetResult() {
  searchResult.value = [];
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
      <InputText
        :class="searchQueryError && 'p-invalid'"
        v-model.trim="searchQuery"
        @input="resetResult"
        placeholder="Keyword"
      />
      <Button
        @click="findElement"
        icon="pi pi-search"
        class="p-button-warning"
      />
    </div>
    <small class="text-xs text-red-600" :class="searchQueryError && 'ml-2'">{{
      searchQueryError
    }}</small>
    <AddItemDialog
      @hide-dialog="hideDialog"
      :dialog-visibility="dialogVisibility"
      dialog-type="ROOT_SECTION"
    />
    <PanelMenu
      class="border-0 mt-2"
      :model="searchResult.length && searchQuery ? searchResult : tree.items"
    >
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
:deep(.p-button-warning, .p-button-outlined) {
  box-shadow: none !important;
}
.left-menu {
  background-color: var(--surface-a);
}
</style>
