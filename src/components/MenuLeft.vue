<script setup lang="ts">
import AddItemDialog from "@/components/AddItemDialog.vue";
import { useTreeNodes } from "@/store/treeNodes";
import { onMounted, ref } from "vue";
import { IItem } from "@/types/treeNodes";
import { useAllTags } from "@/store/tags";

const tree = useTreeNodes().getTree;
const allTags = useAllTags().getTags;
const dialogVisibility = ref(false);
const searchQuery = ref("");
const searchQueryError = ref("");
const options = ref({ all: "All", favorites: "Favorites" });
const isFavoriteCategory = ref(false);
const panelMenu = ref<IItem[]>(tree.items);
const filterVisible = ref(false);
const selectedTag = ref();

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

function resetResult() {
  if (!searchQuery.value) {
    panelMenu.value = tree.items;
  }
}

function searchFavorites(element: IItem, searchResult: IItem[]): IItem[] {
  if (element.favorites) {
    searchResult.push(element);
  }

  if (element.items) {
    let item = null;
    for (let i = 0; i < element.items.length; i++) {
      item = searchFavorites(element.items[i], searchResult);
    }

    return item;
  }

  return searchResult;
}

function switchFavorites(e) {
  if (e.target.innerHTML === options.value.favorites) {
    isFavoriteCategory.value = true;
    panelMenu.value = searchFavorites(tree, []);
  } else {
    isFavoriteCategory.value = false;
    panelMenu.value = tree.items;
  }
  searchQueryError.value = "";
  searchQuery.value = "";
}

function addTag(key) {
  useTreeNodes().addToFavorites(key.split("_"));
}

function onFilter() {
  filterVisible.value = !filterVisible.value;
}

function filterByTag(element: IItem, searchResult: IItem[]): IItem[] {
  if (element.tags && element.tags.find((tag) => tag === selectedTag.value)) {
    searchResult.push(element);
  }

  if (element.items) {
    let item = null;
    for (let i = 0; i < element.items.length; i++) {
      item = filterByTag(element.items[i], searchResult);
    }

    return item;
  }

  return searchResult;
}

function onApplyFilters() {
  if (selectedTag.value) {
    panelMenu.value = filterByTag(tree, []);
    onFilter();
  }
}
function onResetFilters() {
  panelMenu.value = tree.items;
  selectedTag.value = "";
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

    <Sidebar v-model:visible="filterVisible" :baseZIndex="2">
      <h3>Filter by Tag:</h3>
      <Dropdown
        v-model="selectedTag"
        :options="allTags"
        class="mt-2 w-full"
        optionLabel="name"
        optionValue="name"
        placeholder="Select a Tag"
      />
      <div class="flex justify-content-between mt-4">
        <Button
          label="Reset"
          icon="pi pi-times"
          @click="onResetFilters"
          class="p-button-text ml-2"
        />
        <Button
          label="Apply"
          icon="pi pi-check"
          @click="onApplyFilters"
          autofocus
          class="mr-2"
        />
      </div>
    </Sidebar>

    <AddItemDialog
      @hide-dialog="hideDialog"
      :dialog-visibility="dialogVisibility"
      dialog-type="ROOT_SECTION"
    />
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
    <div
      class="mt-2 text-red-600"
      v-if="isFavoriteCategory && !panelMenu.length"
    >
      No favs
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
            class="absolute border-circle border-1 heart"
          >
            <i
              class="pi pi-heart text-color p-2 border-circle"
              :class="item.favorites ? 'bg-pink-300 ' : 'bg-white'"
            ></i>
          </div>
        </RouterLink>
      </template>
    </PanelMenu>
  </nav>
</template>

<style scoped>
:deep(.p-button, .p-button-warning, .p-button-outlined) {
  box-shadow: none !important;
}
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
