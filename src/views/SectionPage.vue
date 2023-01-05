<script setup lang="ts">
import { computed, onBeforeMount, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useTreeNodes } from "@/store/treeNodes";
import AddNodeDialog from "@/components/AddNodeDialog.vue";
import { AddDialog, DialogTypes } from "@/types/dialog";

import type { INode } from "@/types/treeNodes";
import router from "@/router";
import NodeBreadcrumbs from "@/components/NodeBreadcrumbs.vue";

const route = useRoute();

const treeStore = useTreeNodes();
const tree = treeStore.getTree;
const defaultIcons = treeStore.getDefaultIcons;
const dialogType = ref<AddDialog>(DialogTypes.section);
const currentItem = ref<INode>();

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
    :dialog-type="dialogType"
    :is-edit="isEdit"
  />

  <div class="q-pa-sm bg-white">
    <NodeBreadcrumbs />

    <div class="row justify-between bg-white">
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
        <q-btn
          @click="() => showDialog(DialogTypes.item, false)"
          :label="$t('sectionPage.addItem')"
          class="q-mr-sm"
          color="primary"
        />
        <q-btn
          v-show="nestingLevel"
          @click="() => showDialog(DialogTypes.section, false)"
          :label="$t('sectionPage.addPlace')"
          color="primary"
          class="q-mr-sm"
        />
        <q-btn
          @click="showDialog(DialogTypes.section, true)"
          :label="$t('nodePageButtons.edit')"
          color="primary"
          class="q-mr-sm"
        />

        <q-btn
          @click="removeItem"
          :label="$t('nodePageButtons.delete')"
          color="red"
        />
      </div>
    </div>
  </div>
</template>
