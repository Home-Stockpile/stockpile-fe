<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { IItem } from "@/types/treeNodes";
import { useTreeNodes } from "@/store/treeNodes";

const props = defineProps({ tagForSearch: String });
const emit = defineEmits(["change-filters"]);

const treeStore = useTreeNodes();
const tree = treeStore.getTree;

const allTags = treeStore.getTags(tree, []);

const tagError = ref("");
const selectedFavTag = ref("");
const selectedTag = ref("");

function filterByTag(
  element: IItem,
  tagForSearch: string,
  searchResult: IItem[]
): IItem[] {
  if (element.tags && element.tags.find((tag) => tag.name === tagForSearch)) {
    searchResult.push(element);
  }
  if (element.items) {
    let item = null;
    for (let i = 0; i < element.items.length; i++) {
      item = filterByTag(element.items[i], tagForSearch, searchResult);
    }
    return item;
  }
  return searchResult;
}

function onApplyFilters(): void {
  let tagForSearch = selectedTag.value || selectedFavTag.value;
  if (tagForSearch) {
    emit("change-filters", filterByTag(tree, tagForSearch, []), tagForSearch);
  } else {
    tagError.value = "Choose favorite or regular tag";
  }
}

function onResetFilters(): void {
  emit("change-filters", null);
  selectedTag.value = "";
  selectedFavTag.value = "";
}

function setPrevFilterValue(): void {
  if (
    allTags &&
    allTags
      .filter((tag) => tag.favorite)
      .find((tag) => tag.name === props.tagForSearch)
  ) {
    selectedFavTag.value = props.tagForSearch;
  } else {
    selectedTag.value = props.tagForSearch;
  }
}

watch(selectedTag, (value) => {
  if (value) {
    selectedFavTag.value = "";
  }
});
watch(selectedFavTag, (value) => {
  if (value) {
    selectedTag.value = "";
  }
});

onMounted(() => {
  setPrevFilterValue();
});
</script>

<template>
  <h3>Filter by favorite tag:</h3>
  <Dropdown
    v-model="selectedFavTag"
    :options="allTags && allTags.filter((tag) => tag.favorite)"
    class="mt-2 w-full"
    optionLabel="name"
    optionValue="name"
    placeholder="Select a Tag"
  >
    <template #option="slotProps">
      <div class="p-dropdown-car-option flex justify-content-between">
        <span class="flex align-items-center">{{ slotProps.option.name }}</span>
        <i
          @click.stop.prevent="
            () =>
              treeStore.addTagToFavorites(tree, {
                name: slotProps.option.name,
                favorite: slotProps.option.favorite,
              })
          "
          class="pi pi-heart text-color p-2 border-circle"
          :class="slotProps.option.favorite ? 'bg-pink-300 ' : 'bg-white'"
        />
      </div>
    </template>
  </Dropdown>

  <h3 class="mt-2">Filter by tag:</h3>
  <Dropdown
    v-model="selectedTag"
    :options="allTags"
    class="mt-2 w-full"
    optionLabel="name"
    optionValue="name"
    placeholder="Select a Tag"
  >
    <template #option="slotProps">
      <div class="p-dropdown-car-option flex justify-content-between">
        <span class="flex align-items-center">{{ slotProps.option.name }}</span>
        <i
          @click.stop.prevent="
            () =>
              treeStore.addTagToFavorites(tree, {
                name: slotProps.option.name,
                favorite: slotProps.option.favorite,
              })
          "
          class="pi pi-heart text-color p-2 border-circle"
          :class="slotProps.option.favorite ? 'bg-pink-300 ' : 'bg-white'"
        />
      </div>
    </template>
  </Dropdown>
  <small class="ml-2 text-xs text-red-600">{{ tagError || "" }}</small>

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
</template>

<style scoped></style>
