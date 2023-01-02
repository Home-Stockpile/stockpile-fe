<script setup lang="ts">
import AddNodeDialog from "@/components/AddNodeDialog.vue";
import { useTreeNodes } from "@/store/treeNodes";
import { computed, onUpdated, ref } from "vue";
import { IItem } from "@/types/treeNodes";
import Filters from "@/components/Filters.vue";
import { DialogTypes } from "@/types/dialog";
import { storeToRefs } from "pinia";

const props = defineProps({ treeDrawerOpen: Boolean });
const treeStore = storeToRefs(useTreeNodes());
const tree = treeStore.getTree;
const favorites = treeStore.getFavorites;
const defaultIcons = treeStore.getDefaultIcons;

const addNodeVisibility = ref(false);
const searchQuery = ref("");
const options = ref({ all: "All", favorites: "Favorites" });
const isFavoriteCategory = ref(false);
const searchResults = ref<IItem[]>([]);
const tagForSearch = ref("");
const isFilter = ref(false);

const currentTree = computed(() => {
  if (tagForSearch.value) {
    return searchResults.value;
  }
  if (isFavoriteCategory.value) {
    return favorites.value;
  }

  return tree.value.items;
});

function hideDialog(): void {
  addNodeVisibility.value = false;
}

function showDialog(): void {
  addNodeVisibility.value = true;
}

function switchFavorites(e): void {
  isFilter.value = false;
  searchResults.value = [];
  isFavoriteCategory.value = e.target.innerHTML === options.value.favorites;

  searchQuery.value = "";
  tagForSearch.value = "";
}

function toggleFavorites(key: string): void {
  useTreeNodes().toggleFavorites(key.split("_"));
}

function onFilter(): void {
  isFilter.value = !isFilter.value;
}

function changeFilters(value: IItem[], tag): void {
  tagForSearch.value = tag;
  searchQuery.value = "";
  if (value) {
    searchResults.value = value;
  } else {
    searchResults.value = [];
  }
  onFilter();
}
</script>

<template>
  <AddNodeDialog
    v-if="addNodeVisibility"
    @hide-dialog="hideDialog"
    :dialog-type="DialogTypes.root"
    :is-edit="false"
  />
  <q-drawer
    :model-value="isFilter"
    side="left"
    behavior="mobile"
    @hide="() => (isFilter = false)"
    overlay
  >
    <Filters @change-filters="changeFilters" :tag-for-search="tagForSearch" />
  </q-drawer>

  <q-drawer :model-value="props.treeDrawerOpen" side="left" bordered>
    <q-input
      ref="inputRef"
      filled
      v-model.trim="searchQuery"
      placeholder="Keyword"
      clearable
    >
      <template v-slot:append>
        <q-icon name="search" />
      </template>
    </q-input>

    <div class="row items-center justify-between q-pa-sm">
      <div class="row text-subtitle1">
        <div
          @click="switchFavorites"
          :class="!isFavoriteCategory && 'underline'"
          class="q-pr-xs cursor-pointer"
        >
          {{ options.all }}
        </div>
        <div>|</div>
        <div
          @click="switchFavorites"
          :class="isFavoriteCategory && 'underline'"
          class="q-pl-xs cursor-pointer"
        >
          {{ options.favorites }}
        </div>
      </div>
      <div class="row">
        <q-btn @click="onFilter" size="sm" color="primary" icon="filter_alt" />
        <q-btn
          @click="showDialog"
          class="q-ml-sm"
          size="sm"
          color="primary"
          icon="add"
        />
      </div>
    </div>
    <div v-show="tagForSearch">Filtered by tag: {{ tagForSearch }}</div>
    <q-scroll-area class="q-pa-sm">
      <q-tree
        :nodes="currentTree"
        :filter="searchQuery"
        node-key="key"
        children-key="items"
        class="q-pt-sm overflow-auto"
      >
        <template v-slot:default-header="item">
          <RouterLink class="row justify-between full-width" :to="item.node.to">
            <div class="row items-center">
              <q-img
                :src="
                  item.node.icon ||
                  (item.node.items
                    ? defaultIcons.folderIcon
                    : defaultIcons.itemIcon)
                "
                width="30px"
                height="30px"
                ratio="1"
              />

              <div class="q-ml-sm">
                {{ item.node.label }}
              </div>
            </div>
            <div
              class="row items-center"
              @click.stop.prevent="() => toggleFavorites(item.key)"
            >
              <q-icon v-if="item.node.favorites" name="favorite" />
              <q-icon v-else name="favorite_border" />
            </div>
          </RouterLink>
        </template> </q-tree
    ></q-scroll-area>
  </q-drawer>
</template>

<style scoped>
.underline {
  text-decoration: underline;
}
:deep(.q-scrollarea) {
  height: calc(100% - 100px);
}
</style>
