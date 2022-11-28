<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useTreeNodes } from "@/store/treeNodes";
import type { IItem } from "@/types/nodeTypes";

const route = useRoute();
const breadcrumbs = ref<IItem>([]);

const items = useTreeNodes().$state;
const currentItem = ref<IItem>({});

function addBreadcrumb(element: IItem): void {
  if ("label" in element && element.key !== "0") {
    breadcrumbs.value.push(element);
  }
}
function removeBreadcrumbs(): void {
  breadcrumbs.value = [];
}
function filterBreadcrumbs(): void {
  breadcrumbs.value = breadcrumbs.value.filter(
    (breadcrumb) =>
      rootSectionKey(breadcrumb.key) === rootSectionKey(currentItem.value.key)
  );
}
function rootSectionKey(nodeKey: string): string {
  if (!nodeKey.includes("_")) return nodeKey;
  return nodeKey.slice(0, nodeKey.indexOf("_"));
}

function searchItem(element: IItem): IItem | null {
  if (element.key === route.params.key) {
    addBreadcrumb(element);
    return element;
  } else if (element.items !== undefined) {
    addBreadcrumb(element);
    let result: IItem | null = null;
    for (let i = 0; result === null && i < element.items.length; i++) {
      result = searchItem(element.items[i]);
    }
    return result;
  }
  return null;
}

onMounted(() => {
  currentItem.value = searchItem(items);
  rootSectionKey(currentItem.value.key);
  filterBreadcrumbs();
});

watch(
  () => route.params.key,
  () => {
    removeBreadcrumbs();
    currentItem.value = searchItem(items);
    filterBreadcrumbs();
  }
);
</script>

<template>
  <Breadcrumb
    class="bg-white overflow-x-scroll md:overflow-hidden"
    :home="items"
    :model="breadcrumbs"
    aria-label="breadcrumb"
  />

  <div class="tags mt-2 ml-3">
    <div>
      Tags:
      <Tag
        v-for="tag in currentItem.tags"
        :key="tag"
        value="Tag"
        class="ml-3 relative"
      >
        <span>{{ tag }}</span>
        <Button
          icon="pi pi-trash"
          class="close-button p-button-rounded p-button-text"
        />
      </Tag>
    </div>
    <Button
      icon="pi pi-plus"
      class="add-button ml-3 p-button-rounded p-button-text"
    />
  </div>
  <Toolbar class="bg-white border-0 mt-4 px-4">
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
  <div class="px-4">
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

<style>
.p-menuitem-link {
  box-shadow: none !important;
}
.p-inputnumber-input {
  width: 50px;
}
.close-button {
  position: absolute;
  top: -10px;
  right: -10px;
  color: white !important;
  background-color: #dc3545 !important ;
  width: 1.2rem !important;
  height: 1.2rem !important;
}
.close-button span {
  font-size: 0.55rem;
}
.tags {
  display: flex;
  align-items: center;
}
</style>
