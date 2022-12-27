<script setup lang="ts">
import { onBeforeMount, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useTreeNodes } from "@/store/treeNodes";
import type { IItem } from "@/types/treeNodes";
import DefaultPage from "@/views/DefaultPage.vue";
import { DialogTypes } from "@/types/dialog";
import AddItemDialog from "@/components/AddItemDialog.vue";
import router from "@/router";
import { InputNumberInputEvent } from "primevue/inputnumber";
const route = useRoute();
const treeStore = useTreeNodes();
const tree = treeStore.getTree;
const currentItem = ref<IItem>({});
const dialogVisibility = ref(false);
const defaultIcons = treeStore.getDefaultIcons;

function showDialog(): void {
  dialogVisibility.value = true;
}
function hideDialog(): void {
  dialogVisibility.value = false;
}
function changeQuantity(e: InputNumberInputEvent): void {
  treeStore.editItem({ ...currentItem.value, quantity: Number(e.value) });
}
function removeItem(): void {
  router.go(-1);
  const rootItemPath = currentItem.value.key
    .slice(0, currentItem.value.key.lastIndexOf("_"))
    .split("_");
  treeStore.removeItem(rootItemPath, String(route.params.key));
}
onBeforeMount(() => {
  currentItem.value = treeStore.getItem(
    tree,
    String(route.params.key).split("_")
  );
});
watch(
  () => route.params.key,
  () => {
    currentItem.value = treeStore.getItem(
      tree,
      String(route.params.key).split("_")
    );
  }
);
</script>

<template>
  <AddItemDialog
    @hide-dialog="hideDialog"
    :dialog-visibility="dialogVisibility"
    :current-item="currentItem"
    :dialog-type="DialogTypes.item"
  />

  <div v-if="currentItem">
    <div class="mt-3 mb-1 text-lg">
      Tags:
      <Tag
        v-for="tag in currentItem.tags"
        :key="tag.name"
        class="ml-2 relative"
        :value="tag.name"
      />
    </div>
    <Toolbar class="border-0 p-0 bg-white my-2">
      <template #start>
        <div class="flex align-items-center">
          <Image
            :src="currentItem.icon || defaultIcons.itemIcon"
            width="32"
            height="32"
            imageClass="border-circle inline mr-2"
          />
          <h3 class="text-lg">{{ currentItem.label }}</h3>
        </div>
      </template>

      <template #end>
        <InputNumber
          :model-value="currentItem.quantity"
          @input="changeQuantity"
          showButtons
          buttonLayout="horizontal"
          incrementButtonIcon="pi pi-plus"
          decrementButtonIcon="pi pi-minus"
        />
      </template>
    </Toolbar>
    <div class="mt-2">
      <h3 class="text-lg">Description:</h3>
      <div class="mt-3 text-base">{{ currentItem.description }}</div>
    </div>

    <div class="flex justify-content-end">
      <Button @click="showDialog" label="Edit" class="p-button-success" />

      <Button
        @click="removeItem"
        label="Delete item"
        class="p-button-danger ml-3"
      />
    </div>
  </div>

  <DefaultPage v-else />
</template>

<style scoped>
:deep(.p-inputtext) {
  width: 3.5rem;
}
.p-chip {
  background-color: var(--primary-color);
  color: var(--surface-a);
}
</style>
