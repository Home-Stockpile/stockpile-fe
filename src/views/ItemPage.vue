<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useTreeNodes } from "@/store/treeNodes";
import type { IItem } from "@/types/nodeTypes";

const route = useRoute();
const store = useTreeNodes();
const breadcrumbs = ref<IItem>([]);

const items = store.$state;
const currentItem = ref<IItem>({});

function getCurrentEvent(item: IItem, path: string[]): IItem {
  const arrIndex = Number(path.shift()) - 1;
  if (path.length === 0) {
    return item[arrIndex];
  } else {
    return getCurrentEvent(item[arrIndex].items, path);
  }
}

function createBreadcrumbs(item: IItem, path: string[], breadcrumbs) {
  const arrIndex = Number(path.shift()) - 1;
  breadcrumbs = [...breadcrumbs, item[arrIndex]];
  if (path.length === 0) {
    return breadcrumbs;
  } else {
    return createBreadcrumbs(item[arrIndex].items, path, breadcrumbs);
  }
}

onMounted(() => {
  breadcrumbs.value = createBreadcrumbs(
    items.items,
    String(route.params.key).split("_"),
    []
  );
  currentItem.value = getCurrentEvent(
    items.items,
    String(route.params.key).split("_")
  );
  console.log(breadcrumbs.value);
});

watch(
  () => route.params.key,
  () => {
    currentItem.value = getCurrentEvent(
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
      <Tag
        v-for="tag in currentItem.tags"
        :key="tag"
        value="Tag"
        class="ml-3 relative"
      >
        <span>{{ tag }}</span>
        <Button
          @click="() => store.removeTag(currentItem.key, tag)"
          icon="pi pi-trash"
          class="close-button p-button-rounded p-button-text bg-red-700 text-white"
        />
      </Tag>
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
.close-button {
  position: absolute;
  top: -0.9rem;
  right: -0.9rem;
  height: 0.5rem !important;
  width: 1.5rem !important;
}
.close-button > span {
  font-size: 0.55rem;
}
</style>
