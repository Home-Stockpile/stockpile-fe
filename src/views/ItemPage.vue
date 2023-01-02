<script setup lang="ts">
import { onBeforeMount, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useTreeNodes } from "@/store/treeNodes";
import type { IItem } from "@/types/treeNodes";
import DefaultPage from "@/views/DefaultPage.vue";
import { DialogTypes } from "@/types/dialog";
import AddNodeDialog from "@/components/AddNodeDialog.vue";
import router from "@/router";
import { validateQuantity } from "@/functions/validateQuantity";
const route = useRoute();
const treeStore = useTreeNodes();
const tree = treeStore.getTree;
const currentItem = ref<IItem>({});
const dialogVisibility = ref(false);
const defaultIcons = treeStore.getDefaultIcons;
const errorQuantity = ref("");

function showDialog(): void {
  dialogVisibility.value = true;
}
function hideDialog(): void {
  dialogVisibility.value = false;
}
function changeQuantity(e): void {
  if (validateQuantity(e.target.value)) {
    errorQuantity.value = validateQuantity(e.target.value);
  } else {
    treeStore.editItem({ ...currentItem.value, quantity: Number(e.value) });
  }
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
  <AddNodeDialog
    v-if="dialogVisibility"
    @hide-dialog="hideDialog"
    :current-item="currentItem"
    :dialog-type="DialogTypes.item"
    :is-edit="true"
  />
  <div class="q-pa-sm bg-white">
    <div>
      Tags:
      <q-chip
        v-for="tag in currentItem.tags"
        :key="tag.name"
        color="primary"
        text-color="white"
      >
        {{ tag.name }}
      </q-chip>
    </div>

    <div class="row items-center justify-between">
      <div class="row items-center">
        <q-img
          :src="currentItem.icon || defaultIcons.itemIcon"
          width="32px"
          height="32px"
          ratio="1"
        />
        <div class="q-ml-sm">{{ currentItem.label }}</div>
      </div>

      <div>
        <q-input
          v-model="currentItem.quantity"
          :error="!!errorQuantity"
          @input="changeQuantity"
          type="number"
        >
          <template v-slot:error>
            {{ errorQuantity }}
          </template>
        </q-input>
      </div>
    </div>

    <div class="q-mt-sm">
      <h6>Description:</h6>
      <div class="q-mt-sm">{{ currentItem.description }}</div>
    </div>

    <div class="row justify-end">
      <q-btn @click="showDialog" label="Edit" color="primary" class="q-mr-sm" />
      <q-btn @click="removeItem" label="Delete place" color="red" />
    </div>
  </div>
</template>

<style scoped>
:deep(.p-inputtext) {
  width: 3.5rem;
}
</style>
