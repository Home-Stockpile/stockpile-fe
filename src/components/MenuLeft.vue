<script setup lang="ts">
import AddItemDialog from "@/components/AddItemDialog.vue";
import { useTreeNodes } from "@/store/treeNodes";
import { ref } from "vue";
import { IItem } from "@/types/treeNodes";
import Filters from "@/components/Filters.vue";
import { DialogTypes } from "@/types/dialog";

const treeStore = useTreeNodes();
const tree = treeStore.getTree;
const dialogVisibility = ref(false);
const searchQuery = ref("");
const searchQueryError = ref("");
const options = ref({ all: "All", favorites: "Favorites" });
const isFavoriteCategory = ref(false);
const panelMenu = ref<IItem[]>(tree.items);
const filtersVisibility = ref(false);
const tagForSearch = ref("");

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
    panelMenu.value = searchItem(tree, []);
    if (!panelMenu.value.length) {
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

function resetSearchResult() {
  if (!searchQuery.value && !isFavoriteCategory.value) {
    panelMenu.value = tree.items;
  }
  if (!searchQuery.value && isFavoriteCategory.value) {
    panelMenu.value = treeStore.getFavorites(tree, []);
  }
}

function switchFavorites(e) {
  if (e.target.innerHTML === options.value.favorites) {
    isFavoriteCategory.value = true;
    panelMenu.value = treeStore.getFavorites(tree, []);
  } else {
    isFavoriteCategory.value = false;
    panelMenu.value = tree.items;
  }
  searchQueryError.value = "";
  searchQuery.value = "";
  tagForSearch.value = "";
}

function addTag(key) {
  useTreeNodes().addToFavorites(key.split("_"));
}

function onFilter() {
  filtersVisibility.value = !filtersVisibility.value;
}

function changeFilters(value: IItem[], tag) {
  tagForSearch.value = tag;
  searchQueryError.value = "";
  searchQuery.value = "";
  if (value) {
    panelMenu.value = value;
    onFilter();
  } else {
    if (isFavoriteCategory.value) {
      panelMenu.value = treeStore.getFavorites(tree, []);
    } else {
      panelMenu.value = tree.items;
    }
  }
}
</script>

<template>
  <AddItemDialog
    @hide-dialog="hideDialog"
    :dialog-visibility="dialogVisibility"
    :dialog-type="DialogTypes.root"
  />
  <Sidebar v-model:visible="filtersVisibility" :baseZIndex="2">
    <Filters @change-filters="changeFilters" :tag-for-search="tagForSearch" />
  </Sidebar>

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
        @input="resetSearchResult"
        placeholder="Keyword"
      />
      <Button @click="onFilter" icon="pi pi-filter" class="p-button-error" />
      <Button
        @click="findElement"
        icon="pi pi-search"
        class="p-button-warning"
      />
    </div>
    <small class="text-xs text-red-600" :class="searchQueryError && 'ml-2'">{{
      searchQueryError
    }}</small>

    <div class="mt-2 cursor-pointer select-none">
      <span @click="switchFavorites" :class="!isFavoriteCategory && 'underline'"
        >{{ options.all }}
      </span>
      <span> | </span>
      <span
        @click="switchFavorites"
        :class="isFavoriteCategory && 'underline'"
        >{{ options.favorites }}</span
      >
    </div>
    <div v-show="tagForSearch" class="mt-2">
      Filtered by tag: {{ tagForSearch }}
    </div>

    <PanelMenu class="border-0 mt-2" :model="panelMenu">
      <template #item="{ item }">
        <RouterLink
          class="w-full flex align-items-center py-2 px-2 relative"
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
          <div
            @click.stop.prevent="() => addTag(item.key)"
            class="absolute border-circle` heart"
          >
            <i
              class="pi pi-heart text-color p-2 border-circle"
              :class="item.favorites ? 'bg-pink-300 ' : 'bg-white'"
            />
          </div>
        </RouterLink>
      </template>
    </PanelMenu>
    <div
      v-if="!panelMenu.length"
      class="text-2xl text-red-600 flex justify-content-center"
    >
      No items
    </div>
  </nav>
</template>

<style scoped>
:deep(.p-selectbutton > .p-button.p-component) {
  border-radius: 50%;
  padding: 0.5rem;
}

.left-menu {
  background-color: var(--surface-a);
}

.heart {
  right: 1rem;
}
</style>
