<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useTreeNodes } from "@/store/treeNodes";
import { getItem } from "@/functions/getItem";
import { createBreadcrumbs } from "@/functions/createBreadcrumbs";

import type { IItem } from "@/types/nodeTypes";

const route = useRoute();
const store = useTreeNodes();

const items = store.$state;
const breadcrumbs = ref<IItem>([]);
const currentItem = ref<IItem>({});
const nestingLevel = computed(
  () => String(route.params.key).split("_").length < 2
);

onMounted(() => {
  currentItem.value = getItem(items.items, String(route.params.key).split("_"));
  breadcrumbs.value = createBreadcrumbs(
    items.items,
    String(route.params.key).split("_"),
    []
  );
});

watch(
  () => route.params.key,
  () => {
    currentItem.value = getItem(
      items.items,
      String(route.params.key).split("_")
    );
    breadcrumbs.value = createBreadcrumbs(
      items.items,
      String(route.params.key).split("_"),
      []
    );
  }
);
</script>

<template>
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
      <Button label="Add item" class="p-button-success" />
      <Button
        v-show="nestingLevel"
        label="Add subitem"
        class="p-button-success ml-4"
      />
    </template>
  </Toolbar>
</template>

<style scoped></style>
