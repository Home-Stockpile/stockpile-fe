<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { INode } from "@/types/treeNodes";
import { useTreeNodes } from "@/store/treeNodes";
import { useRoute } from "vue-router";
import { setTreeNodeIcon } from "@/functions/setTreeNodeIcon";
import router from "@/router";
import { useQuasar } from "quasar";
import { i18n } from "@/main";

const currentItem = ref<INode>();
const treeStore = useTreeNodes();
const route = useRoute();
const $q = useQuasar();
const tree = computed(() => treeStore.getTree);

const columns = [
  {
    label: "Icon",
    align: "left",
  },
  {
    label: "Name",
    align: "left",
  },
  {
    label: "Quantity",
    align: "left",
  },
  {
    label: "Required quantity",
    align: "left",
  },
  {
    label: "Remove",
    align: "left",
  },
];
function onRowClick(to) {
  router.push(to);
}
function removeNode(node): void {
  $q.dialog({
    title: i18n.global.t("notifications.confirm"),
    message: `${i18n.global.t("notifications.removeConfirm")} ${node.label} ?`,
    cancel: true,
  }).onOk(() => {
    Reflect.deleteProperty(node, "requiredQuantity");
    treeStore.editNode({
      ...node,
    });
  });

  $q.notify(`${node.label} removed from shopping list`);
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
</script>

<template>
  <div class="q-pa-sm bg-white full-height">
    <h4>Shopping list</h4>
    <q-table
      :rows="treeStore.getShoppingList"
      :columns="columns"
      :hide-pagination="true"
      :pagination="{ page: 1, rowsPerPage: 0 }"
      :loading="!treeStore.getShoppingList.length"
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
          <q-td> {{ props.row.quantity }} </q-td>
          <q-td>{{ props.row.requiredQuantity }}</q-td>
          <q-td auto-width>
            <div
              @click.stop="() => removeNode(props.row)"
              class="row items-center justify-center"
            >
              <q-icon name="delete" size="1.5rem" />
            </div>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>
