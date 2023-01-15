<script setup lang="ts">
import AddNodeDialog from "@/components/AddNodeDialog.vue";
import { useTreeNodes } from "@/store/treeNodes";
import { computed, onMounted, ref } from "vue";
import { INode } from "@/types/treeNodes";
import Filters from "@/components/Filters.vue";
import { DialogTypes } from "@/types/dialog";
import { storeToRefs } from "pinia";
interface IProps {
  treeDrawerOpen: boolean;
}

const props = defineProps<IProps>();
const treeStore = storeToRefs(useTreeNodes());
const tree = treeStore.getTree;
const favorites = treeStore.getFavorites;
const defaultIcons = treeStore.getDefaultIcons;

const addNodeVisibility = ref(false);
const searchQuery = ref("");
const options = ref({ all: "All", favorites: "Favorites" });
const isFavoriteCategory = ref(false);
const searchResults = ref<INode[]>([]);
const tagForSearch = ref("");
const isFilter = ref(false);

const currentTree = computed(() => {
  if (tagForSearch.value) {
    return searchResults.value;
  }
  if (isFavoriteCategory.value) {
    return favorites.value;
  }

  return tree.value.items || [];
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
  isFavoriteCategory.value = e.target.value === options.value.favorites;
  searchQuery.value = "";
  tagForSearch.value = "";
}

function toggleFavorites(key: string): void {
  useTreeNodes().toggleFavorites(key.split("_"));
}

function showFilter(): void {
  isFilter.value = true;
}
function hideFilter(): void {
  isFilter.value = false;
}
function changeFilters(value: INode[], tag): void {
  if (value) {
    tagForSearch.value = tag;
    searchQuery.value = "";
    searchResults.value = value;
  }

  hideFilter();
}
onMounted(() => {
  console.log("curr", currentTree.value);
});
</script>

<template>
  <AddNodeDialog
    v-if="addNodeVisibility"
    @hide-dialog="hideDialog"
    :dialog-type="DialogTypes.root"
    :is-edit="false"
  />
  <Filters
    @change-filters="changeFilters"
    :tag-for-search="tagForSearch"
    :is-filter="isFilter"
  />

  <q-drawer :model-value="props.treeDrawerOpen" side="left" bordered>
    <q-input
      ref="inputRef"
      filled
      v-model.trim="searchQuery"
      :placeholder="$t('treeDrawer.search')"
      clearable
    >
      <template v-slot:append>
        <q-icon name="search" />
      </template>
    </q-input>

    <div class="row items-center justify-between q-pa-sm">
      <div class="row text-subtitle1">
        <data
          @click="switchFavorites"
          :class="!isFavoriteCategory && 'underline'"
          :value="options.all"
          class="q-pr-xs cursor-pointer"
        >
          {{ $t("treeDrawer.all") }}
        </data>
        <div>|</div>
        <data
          @click="switchFavorites"
          :class="isFavoriteCategory && 'underline'"
          :value="options.favorites"
          class="q-pl-xs cursor-pointer"
        >
          {{ $t("treeDrawer.favorites") }}
        </data>
      </div>
      <div class="row">
        <q-btn
          @click="showFilter"
          size="sm"
          color="primary"
          icon="filter_alt"
        />
        <q-btn
          @click="showDialog"
          class="q-ml-sm"
          size="sm"
          color="primary"
          icon="add"
        />
      </div>
    </div>

    <q-scroll-area class="q-pa-sm">
      <div v-show="tagForSearch">
        {{ $t("treeDrawer.filter") }} {{ tagForSearch }}
      </div>
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
