<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useTreeNodes } from "@/store/treeNodes";
import AddItemDialog from "@/components/AddNodeDialog.vue";
import { AddDialog, DialogTypes } from "@/types/dialog";

import type { IItem } from "@/types/treeNodes";
import DefaultPage from "@/views/DefaultPage.vue";
import router from "@/router";

const route = useRoute();

const treeStore = useTreeNodes();
const tree = treeStore.getTree;
const defaultIcons = treeStore.getDefaultIcons;
const dialogType = ref<AddDialog>(DialogTypes.section);
const currentItem = ref<IItem>({});

const nestingLevel = computed(
  () => String(route.params.key).split("_").length < 3
);
const dialogVisibility = ref(false);

const isEdit = ref(false);

function showDialog(type: AddDialog, isEditDialog: boolean): void {
  dialogType.value = type;
  dialogVisibility.value = true;
  isEdit.value = isEditDialog;
}

function hideDialog(): void {
  dialogVisibility.value = false;
}

function removeItem(): void {
  router.go(-1);
  let rootItemPath: string[] = [];
  if (currentItem.value.key.includes("_")) {
    rootItemPath = currentItem.value.key
      .slice(0, currentItem.value.key.lastIndexOf("_"))
      .split("_");
  } else {
    rootItemPath = ["0"];
  }

  treeStore.removeItem(rootItemPath, String(route.params.key));
}

onMounted(() => {
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
    v-if="dialogVisibility"
    @hide-dialog="hideDialog"
    :current-item="currentItem"
    :dialog-type="dialogType"
    :is-edit="isEdit"
  />

  <div v-if="currentItem">
    <Toolbar class="border-0 p-2">
      <template #start>
        <div class="flex align-items-center">
          <Image
            :src="currentItem.icon || defaultIcons.itemIcon"
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
          @click="() => showDialog(DialogTypes.item, false)"
        />
        <Button
          v-show="nestingLevel"
          @click="() => showDialog(DialogTypes.section, false)"
          label="Add place"
          class="p-button-success ml-4"
        />
        <Button
          @click="showDialog(DialogTypes.section, true)"
          label="Edit"
          class="p-button-success ml-3"
        />

        <Button
          @click="removeItem"
          label="Delete place"
          class="p-button-danger ml-3"
        />
      </template>
    </Toolbar>
  </div>
  <DefaultPage v-else />
</template>
