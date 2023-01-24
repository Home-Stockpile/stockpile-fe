<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import { useTreeNodes } from "@/store/treeNodes";
import AddNodeDialog from "@/components/AddNodeDialog.vue";
import { AddDialog, DialogTypes } from "@/types/dialog";
import router from "@/router";
import NodeBreadcrumbs from "@/components/NodeBreadcrumbs.vue";
import { setTreeNodeIcon } from "@/functions/setTreeNodeIcon";
import { useQuasar } from "quasar";
import GearsLoader from "@/components/GearsLoader.vue";

const route = useRoute();
const treeStore = useTreeNodes();
const $q = useQuasar();

const tree = computed(() => treeStore.getTree);
const dialogType = ref<AddDialog>(DialogTypes.root);

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

function showDialog(type: AddDialog, isEditDialog: boolean): void {
  dialogVisibility.value = true;
}

function hideDialog(): void {
  dialogVisibility.value = false;
}

function toggleFavorites(key: string): void {
  treeStore.toggleFavorites(key.split("_"));
}
function onRowClick(to) {
  router.push(to);
}
function isAuth() {
  if (sessionStorage.getItem("uid")) {
    return true;
  }
  return false;
}
</script>
<template>
  <AddNodeDialog
    v-if="dialogVisibility"
    @hide-dialog="hideDialog"
    :dialog-type="dialogType"
    :is-edit="false"
  />

  <div class="q-pa-sm bg-white">
    <div v-if="tree.key">
      <NodeBreadcrumbs />
      <div class="row justify-between bg-white">
        <div class="row items-center">
          <q-icon size="md" name="home" />
          <div class="q-ml-sm">{{ "Home" }}</div>
        </div>

        <div>
          <q-btn
            v-show="nestingLevel"
            @click="() => showDialog(DialogTypes.section, false)"
            :label="$t('sectionPage.addPlace')"
            color="primary"
            class="q-mr-sm"
          />
        </div>
      </div>

      <q-table
        :rows="tree.items"
        :columns="columns"
        :hide-pagination="true"
        :pagination="{ page: 1, rowsPerPage: 0 }"
        v-if="tree.items"
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
    <div class="row justify-center" v-else-if="!isAuth()">Please log in</div>
    <div class="row justify-center" v-else><GearsLoader /></div>
  </div>
</template>
