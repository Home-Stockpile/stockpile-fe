<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useTreeNodes } from "@/store/treeNodes";
import { getItem } from "@/functions/getItem";
import { createBreadcrumbs } from "@/functions/createBreadcrumbs";

import type { IItem } from "@/types/treeNodes";

const route = useRoute();
const store = useTreeNodes();
const breadcrumbs = ref<IItem>([]);

const items = store.$state;
const currentItem = ref<IItem>({});

onMounted(() => {
  breadcrumbs.value = createBreadcrumbs(
    items.items,
    String(route.params.key).split("_"),
    []
  );
  currentItem.value = getItem(items.items, String(route.params.key).split("_"));
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

  <div class="flex align-items-center mt-3 mb-1 ml-3">
    <div>
      Tags:
      <Chip
        v-for="tag in currentItem.tags"
        :key="tag"
        :label="tag"
        class="ml-3 relative"
        removable
      />
    </div>
    <Button
      icon="pi pi-plus"
      class="ml-4 p-button-rounded p-button-text h-2rem w-2rem"
    />
  </div>
  <Toolbar class="border-0 px-4">
    <template #start>
      <div class="mt-2">{{ currentItem.label }}</div>
      <InputNumber
        class="ml-4"
        :model-value="currentItem.quantity"
        showButtons
        buttonLayout="horizontal"
        decrementButtonClass="p-button-danger"
        incrementButtonClass="p-button-success"
        incrementButtonIcon="pi pi-plus"
        decrementButtonIcon="pi pi-minus"
      />
    </template>

    <template #end>
      <Button label="Save changes" class="p-button-success" />
      <Button label="Delete item" class="p-button-danger ml-4" />
    </template>
  </Toolbar>
  <div class="mt-2">
    <Textarea
      placeholder="Add your description"
      :value="currentItem.description"
      class="w-full"
      :autoResize="true"
      rows="5"
      cols="30"
    />
  </div>
</template>

<style scoped>
:deep(.p-menuitem-link) {
  box-shadow: none !important;
}
:deep(.p-inputtext) {
  width: 3.5rem;
}
.p-chip {
  background-color: var(--primary-color);
  color: var(--surface-a);
}
</style>
