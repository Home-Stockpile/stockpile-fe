<script setup lang="ts">
import { computed, onMounted, onUpdated, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useTreeNodes } from "@/store/treeNodes";
import { getItem } from "@/functions/getItem";
import { createBreadcrumbs } from "@/functions/createBreadcrumbs";
import AddItemDialog from "@/components/AddItemDialog.vue";
import { DialogTypes } from "@/types/dialog";

import type { IItem } from "@/types/treeNodes";

const route = useRoute();
const tree = useTreeNodes().$state;

const breadcrumbs = ref<IItem[]>([]);
const currentItem = ref<IItem>({});

const nestingLevel = computed(
  () => String(route.params.key).split("_").length < 2
);
const dialogVisibility = ref(false);
const dialogType = ref(DialogTypes.section);

function showDialog(type) {
  dialogType.value = type;
  dialogVisibility.value = true;
}
function hideDialog() {
  dialogVisibility.value = false;
}
onMounted(() => {
  currentItem.value = getItem(tree, String(route.params.key).split("_"));
  breadcrumbs.value = createBreadcrumbs(
    tree.items,
    String(route.params.key).split("_"),
    []
  );
});

watch(
  () => route.params.key,
  () => {
    currentItem.value = getItem(tree, String(route.params.key).split("_"));
    breadcrumbs.value = createBreadcrumbs(
      tree.items,
      String(route.params.key).split("_"),
      []
    );
  }
);
</script>

<template>
  <AddItemDialog
    @hide-dialog="hideDialog"
    :dialog-visibility="dialogVisibility"
    :dialog-type="dialogType"
  />
  <Breadcrumb
    class="overflow-x-scroll md:overflow-hidden"
    :home="tree"
    :model="breadcrumbs"
    aria-label="breadcrumb"
  />

  <Toolbar class="mt-3 border-0 p-2">
    <template #start>
      <div class="flex align-items-center">
        <Image
          :src="currentItem.icon || tree.defaultIcon"
          width="32"
          height="32"
          imageClass="border-circle inline mr-2"
        />
        <div>{{ currentItem.label }}</div>
      </div>
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
