<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useTreeNodes } from "@/store/treeNodes";
import type { IItem } from "@/types/treeNodes";
import DefaultPage from "@/views/DefaultPage.vue";

const route = useRoute();
const state = useTreeNodes();
const tree = state.getTree;

const breadcrumbs = ref<IItem[]>([]);
const currentItem = ref<IItem>({});

onMounted(() => {
  currentItem.value = state.getItem(tree, String(route.params.key).split("_"));
  breadcrumbs.value = state.getBreadcrumbs(
    tree.items,
    String(route.params.key).split("_"),
    []
  );
});

watch(
  () => route.params.key,
  () => {
    currentItem.value = state.getItem(
      tree,
      String(route.params.key).split("_")
    );
    breadcrumbs.value = state.getBreadcrumbs(
      tree.items,
      String(route.params.key).split("_"),
      []
    );
  }
);
</script>

<template>
  <div v-if="currentItem">
    <Breadcrumb
      class="overflow-x-scroll md:overflow-hidden"
      :home="tree"
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
    <Toolbar class="border-0 p-2">
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
  </div>
  <DefaultPage v-else />
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
