<script setup lang="ts">
import { computed, onUpdated, ref, watch } from "vue";
import { INode } from "@/types/treeNodes";
import { useTreeNodes } from "@/store/treeNodes";
interface IProps {
  tagForSearch: string;
  isFilter: boolean;
}
interface IEmits {
  (e: "change-filters", value?: INode[], tag?: string): void;
}
const props = defineProps<IProps>();
const emit = defineEmits<IEmits>();

const treeStore = useTreeNodes();
const tree = computed(() => treeStore.getTree);

const allTags = computed(() => treeStore.getTags);
const favoriteTags = treeStore.getFavoriteTags;
const tagError = ref("");
const selectedFavTag = ref("");
const selectedTag = ref(null);

function filterByTag(
  element: INode,
  tagForSearch: string,
  searchResult: INode[]
): INode[] {
  if (element.tags && element.tags.find((tag) => tag.name === tagForSearch)) {
    searchResult.push(element);
  }
  if (element.items) {
    let item = null;
    for (let node of element.items) {
      item = filterByTag(node, tagForSearch, searchResult);
    }
    return item;
  }
  return searchResult;
}

function onApplyFilters(): void {
  let tagForSearch = selectedTag.value || selectedFavTag.value;
  if (tagForSearch) {
    emit(
      "change-filters",
      filterByTag(tree.value, tagForSearch, []),
      tagForSearch
    );
  } else {
    tagError.value = "Choose favorite or regular tag";
  }
}

function onResetFilters(): void {
  emit("change-filters", [], "");
  selectedTag.value = "";
  selectedFavTag.value = "";
}
function onHideFilters(): void {
  emit("change-filters");
  tagError.value = "";
}

function setPrevFilterValue(): void {
  if (favoriteTags.value.find((tag) => tag.name === props.tagForSearch)) {
    selectedFavTag.value = props.tagForSearch;
  } else {
    selectedTag.value = props.tagForSearch;
  }
}
function toggleFavorites(name, value) {
  treeStore.toggleTagFavorites(tree.value, {
    name: name,
    favorite: value,
  });
}
onUpdated(() => {
  setPrevFilterValue();
});
watch(selectedTag, (value) => {
  if (value) {
    selectedFavTag.value = "";
  }
  tagError.value = "";
});

watch(selectedFavTag, (value) => {
  if (value) {
    selectedTag.value = "";
  }
  tagError.value = "";
});
</script>

<template>
  <q-drawer
    :model-value="isFilter"
    @hide="onHideFilters"
    behavior="mobile"
    side="left"
    overlay
  >
    <q-card v-if="isFilter" class="q-pa-md full-height">
      <q-card-section>
        <h6>{{ $t("filters.tags") }}</h6>
        <q-select
          filled
          v-model="selectedTag"
          :options="allTags"
          :error="!!tagError"
          name="name"
          label="Select tag"
          color="teal"
          option-value="name"
          option-label="name"
          options-selected-class="text-deep-orange"
          clearable
          emit-value
          map-options
          bottom-slots
        >
          <template v-slot:option="scope">
            <q-item v-bind="scope.itemProps">
              <q-item-section>
                <q-item-label>{{ scope.opt.name }}</q-item-label>
              </q-item-section>
              <q-item-section avatar>
                <div
                  class="row items-center text-h6"
                  @click.stop.prevent="
                    () => toggleFavorites(scope.opt.name, scope.opt.favorite)
                  "
                >
                  <q-icon v-if="scope.opt.favorite" name="favorite" />
                  <q-icon v-else name="favorite_border" />
                </div>
              </q-item-section>
            </q-item>
          </template>
          <template v-slot:error>
            {{ tagError }}
          </template>
        </q-select>
      </q-card-section>

      <q-card-section>
        <h6>{{ $t("filters.favoriteTags") }}</h6>
        <q-select
          filled
          v-model="selectedFavTag"
          :options="favoriteTags"
          :error="!!tagError"
          name="name"
          label="Select tag"
          color="teal"
          option-value="name"
          option-label="name"
          options-selected-class="text-deep-orange"
          clearable
          emit-value
          map-options
          bottom-slots
        >
          <template v-slot:option="scope">
            <q-item v-bind="scope.itemProps">
              <q-item-section>
                <q-item-label>{{ scope.opt.name }}</q-item-label>
              </q-item-section>
              <q-item-section avatar>
                <div
                  class="row items-center"
                  @click.stop.prevent="
                    () => toggleFavorites(scope.opt.name, scope.opt.favorite)
                  "
                >
                  <q-icon v-if="scope.opt.favorite" name="favorite" />
                  <q-icon v-else name="favorite_border" />
                </div>
              </q-item-section>
            </q-item>
          </template>
          <template v-slot:error>
            {{ tagError }}
          </template>
        </q-select>
      </q-card-section>

      <q-card-actions class="justify-end">
        <q-btn
          :label="$t('general.resetButton')"
          icon="close"
          @click="onResetFilters"
        />
        <q-btn
          :label="$t('general.applyButton')"
          icon="check"
          @click="onApplyFilters"
        />
      </q-card-actions>
    </q-card>
  </q-drawer>
</template>
