<script setup lang="ts">
import { computed, onBeforeMount, ref, watch } from "vue";
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
const columns = [
  {
    label: "icon",
    align: "left",
  },
  {
    label: "name",
    align: "left",
  },
  {
    label: "favorites",
    align: "left",
  },
];
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

function toggleFavorites(key: string): void {
  treeStore.toggleFavorites(key.split("_"));
}
function onRowClick(to) {
  router.push(to);
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
          :label="$t('general.edit')"
          color="primary"
          class="q-mr-sm"
        />

        <q-btn @click="removeItem" :label="$t('general.delete')" color="red" />
      </div>
    </div>

    <q-table
      :rows="currentItem.items"
      :columns="columns"
      :hide-pagination="true"
      :pagination="{ page: 1, rowsPerPage: 0 }"
      row-key="key"
      bordered
      class="q-mt-sm no-box-shadow"
    >
      <template v-slot:body="props">
        <q-tr
          @click="() => onRowClick(props.row.to)"
          :props="props"
          class="text-subtitle1 cursor-pointer"
        >
          <q-td auto-width>
            <q-img
              :src="
                props.row.icon ||
                (props.row.items
                  ? defaultIcons.folderIcon
                  : defaultIcons.itemIcon)
              "
              width="30px"
              height="30px"
              ratio="1"
            />
          </q-td>
          <q-td> {{ props.row.label }}</q-td>
          <q-td auto-width>
            <div
              class="row items-center justify-center text-h5"
              @click.stop.prevent="() => toggleFavorites(props.row.key)"
            >
              <q-icon v-if="props.row.favorites" name="favorite" />
              <q-icon v-else name="favorite_border" /></div
          ></q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>
