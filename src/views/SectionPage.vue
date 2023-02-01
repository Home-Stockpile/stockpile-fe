<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useTreeNodes } from "@/store/treeNodes";
import AddNodeDialog from "@/components/AddNodeDialog.vue";
import { AddDialog, DialogTypes } from "@/types/dialog";
import type { INode } from "@/types/treeNodes";
import router from "@/router";
import NodeBreadcrumbs from "@/components/NodeBreadcrumbs.vue";
import { setTreeNodeIcon } from "@/functions/setTreeNodeIcon";
import { useQuasar } from "quasar";
import GearsLoader from "@/components/GearsLoader.vue";
import { i18n } from "@/main";

const route = useRoute();
const treeStore = useTreeNodes();
const $q = useQuasar();

const tree = computed(() => treeStore.getTree);
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
function removedNodeRedirect(rootItemPath: string[]) {
  let rootItemTo = "";
  if (currentItem.value.to.includes("section")) {
    rootItemTo = "/section/" + rootItemPath.join("_");
  } else {
    rootItemTo = "/item/" + rootItemPath.join("_");
  }
  if (rootItemPath[0] === "0") {
    rootItemTo = "/";
  }
  router.push(rootItemTo);
}

function removeNode(removedNodeName): void {
  let rootItemPath: string[] = [];

  if (currentItem.value.key.includes("_")) {
    rootItemPath = currentItem.value.key
      .slice(0, currentItem.value.key.lastIndexOf("_"))
      .split("_");
  } else {
    rootItemPath = ["0"];
  }
  removedNodeRedirect(rootItemPath);
  treeStore.removeNode(rootItemPath, String(route.params.key));
  $q.notify(`${removedNodeName} removed`);
}
function onRemove() {
  const removedNodeName =
    (currentItem.value.to.includes("section")
      ? i18n.global.t("notifications.place")
      : i18n.global.t("notifications.item")) + currentItem.value.label;
  $q.dialog({
    title: i18n.global.t("notifications.confirm"),
    message: `${i18n.global.t(
      "notifications.removeConfirm"
    )} ${removedNodeName} ?`,
    cancel: true,
  }).onOk(() => {
    removeNode(removedNodeName);
  });
}
function toggleFavorites(key: string): void {
  treeStore.toggleFavorites(key.split("_"));
}
function onRowClick(to) {
  router.push(to);
}

onMounted(() => {
  if (Object.keys(tree.value).length) {
    currentItem.value = treeStore.getItem(
      tree.value,
      String(route.params.key).split("_")
    );
  }
});
watch(
  () => tree.value,
  () => {
    currentItem.value = treeStore.getItem(
      tree.value,
      String(route.params.key).split("_")
    );
  }
);
watch(
  () => route.params.key,
  () => {
    currentItem.value = treeStore.getItem(
      tree.value,
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

  <div class="q-pa-sm bg-white full-height">
    <div v-if="currentItem">
      <NodeBreadcrumbs />
      <div class="row justify-between bg-white">
        <div class="row items-center">
          <q-img
            :src="setTreeNodeIcon(currentItem)"
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
            class="q-mr-sm q-mt-sm-xs"
          />
          <q-btn
            @click="showDialog(DialogTypes.section, true)"
            :label="$t('general.edit')"
            color="primary"
            class="q-mr-sm q-my-xs-xs"
          />

          <q-btn
            @click="onRemove"
            :label="$t('general.delete')"
            color="red"
            class="q-my-xs-xs"
          />
        </div>
      </div>

      <q-table
        :rows="currentItem.items"
        :columns="columns"
        :hide-pagination="true"
        :pagination="{ page: 1, rowsPerPage: 0 }"
        v-if="currentItem.items"
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
                :src="setTreeNodeIcon(props.row)"
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
    <div class="row justify-center" v-else><GearsLoader /></div>
  </div>
</template>
