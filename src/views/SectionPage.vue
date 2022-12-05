<script setup lang="ts">
import { computed, onMounted, onUpdated, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useTreeNodes } from "@/store/treeNodes";
import { getItem } from "@/functions/getItem";
import { createBreadcrumbs } from "@/functions/createBreadcrumbs";
import AddItemDialog from "@/components/AddItemDialog.vue";
import { DialogTypes } from "@/types/dialog";

import type { IItem } from "@/types/nodeTypes";

const route = useRoute();
const store = useTreeNodes();

const items = store.$state;
const breadcrumbs = ref<IItem>([]);
const currentItem = ref<IItem>({});

const nestingLevel = computed(
  () => String(route.params.key).split("_").length < 2
);
const dialogVisibility = ref(false);
const dialogType = ref(DialogTypes.section);

function showDialog(type) {
  console.log("show", type);
  dialogType.value = type;
  dialogVisibility.value = true;
}
function hideDialog() {
  dialogVisibility.value = false;
}
onMounted(() => {
  currentItem.value = getItem(items, String(route.params.key).split("_"));
  breadcrumbs.value = createBreadcrumbs(
    items.items,
    String(route.params.key).split("_"),
    []
  );
});

watch(
  () => route.params.key,
  () => {
    currentItem.value = getItem(items, String(route.params.key).split("_"));
    breadcrumbs.value = createBreadcrumbs(
      items.items,
      String(route.params.key).split("_"),
      []
    );
  }
);
onMounted(() => {
  console.log("Page1", dialogType.value);
});
onUpdated(() => {
  console.log("Page", dialogType.value);
});
</script>

<template>
  <AddItemDialog
    @hide-dialog="hideDialog"
    :dialog-visibility="dialogVisibility"
    :dialog-type="dialogType"
  />
  <Breadcrumb
    class="overflow-x-scroll md:overflow-hidden"
    :home="items"
    :model="breadcrumbs"
    aria-label="breadcrumb"
  />

  <Toolbar class="mt-3 border-0">
    <template #start>
      <div class="mt-2">{{ currentItem.label }}</div>
    </template>

    <template #end>
      <Button
        label="Add item"
        class="p-button-success"
        @click="() => showDialog(DialogTypes.item)"
      />
      <Button
        v-show="nestingLevel"
        @click="() => showDialog(DialogTypes.section)"
        label="Add subsection"
        class="p-button-success ml-4"
      />
    </template>
  </Toolbar>
</template>
