<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useTreeNodes } from "@/store/treeNodes";
import type { INode } from "@/types/treeNodes";
import { DialogTypes } from "@/types/dialog";
import AddNodeDialog from "@/components/AddNodeDialog.vue";
import router from "@/router";
import NodeBreadcrumbs from "@/components/NodeBreadcrumbs.vue";
import { maxValue, minValue } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import { setTreeNodeIcon } from "@/functions/setTreeNodeIcon";
import { useQuasar } from "quasar";
import GearsLoader from "@/components/GearsLoader.vue";
import { capitalizeFirstLetter } from "@/functions/capitalizeFirstLetter";
import { i18n } from "@/main";
import { getCurrentNode } from "@/functions/getCurrentNode";

const $q = useQuasar();
const route = useRoute();
const treeStore = useTreeNodes();
const tree = computed(() => treeStore.getTree);
const sharedTrees = computed(() => treeStore.getSharedTrees);
const currentItem = ref<INode>();
const dialogVisibility = ref(false);
const newQuantity = ref(0);
const requiredQuantity = ref(0);
const requiredQuantityDialogVisibility = ref(false);

const rules = {
  newQuantity: { maxValue: maxValue(100), minValue: minValue(0) },
  requiredQuantity: { maxValue: maxValue(100), minValue: minValue(0) },
};

const $v = useVuelidate(rules, { newQuantity, requiredQuantity });

function showDialog(): void {
  dialogVisibility.value = true;
}

function hideDialog(): void {
  dialogVisibility.value = false;
}

function changeQuantity(): void {
  $v.value.newQuantity.$touch();
  if (!$v.value.newQuantity.$errors.length) {
    treeStore.editNode({ ...currentItem.value, quantity: newQuantity.value });
  }
}

function changeRequiredQuantity(): void {
  $v.value.requiredQuantity.$touch();
  if (!$v.value.requiredQuantity.$errors.length) {
    treeStore.editNode({
      ...currentItem.value,
      requiredQuantity: requiredQuantity.value,
    });
  }
  requiredQuantityDialogVisibility.value = false;
  $q.notify(
    `${currentItem.value.label + i18n.global.t("itemPage.addedToShoppingList")}`
  );
}

function resetRequiredQuantity() {
  requiredQuantity.value = 0;
  requiredQuantityDialogVisibility.value = false;
}

function removeNode(removedNodeName): void {
  router.go(-1);
  const rootItemPath = currentItem.value.key
    .slice(0, currentItem.value.key.lastIndexOf("_"))
    .split("_");
  treeStore.removeNode(rootItemPath, String(route.params.key));
  $q.notify(`${removedNodeName + i18n.global.t("notifications.removed")} `);
}

onMounted(() => {
  if (route.query.owner === sessionStorage.getItem("uid")) {
    currentItem.value = getCurrentNode(
      route.query.owner,
      tree,
      route.params.key
    );
    newQuantity.value = currentItem.value.quantity;
  } else {
    currentItem.value = getCurrentNode(
      route.query.owner,
      sharedTrees,
      route.params.key
    );
  }
});

watch(
  () => tree.value,
  () => {
    if (route.query.owner === sessionStorage.getItem("uid")) {
      currentItem.value = getCurrentNode(
        route.query.owner,
        tree,
        route.params.key
      );
    }
    newQuantity.value = currentItem.value.quantity;
  }
);
watch(
  () => sharedTrees.value,
  () => {
    if (route.query.owner !== sessionStorage.getItem("uid")) {
      currentItem.value = getCurrentNode(
        route.query.owner,
        sharedTrees,
        route.params.key
      );
    }
    newQuantity.value = currentItem.value.quantity;
  }
);
watch(
  () => route.params.key,
  () => {
    if (route.query.owner === sessionStorage.getItem("uid")) {
      currentItem.value = getCurrentNode(
        route.query.owner,
        tree,
        route.params.key
      );
      newQuantity.value = currentItem.value.quantity;
    } else {
      currentItem.value = getCurrentNode(
        route.query.owner,
        sharedTrees,
        route.params.key
      );
    }
  }
);

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
    removeNode(capitalizeFirstLetter(removedNodeName));
  });
}
</script>

<template>
  <AddNodeDialog
    v-if="dialogVisibility"
    @hide-dialog="hideDialog"
    :current-item="currentItem"
    :dialog-type="DialogTypes.item"
    :is-edit="true"
  />
  <q-dialog
    @hide="() => (requiredQuantityDialogVisibility = false)"
    :model-value="requiredQuantityDialogVisibility"
  >
    <q-card>
      <q-card-section>
        <h6>{{ $t("addDialog.requiredQuantity") }}</h6>
        <q-input
          v-model.trim="requiredQuantity"
          :error="$v.requiredQuantity.$error"
          @blur="$v.requiredQuantity.$touch"
          type="number"
        >
          <template v-slot:error>
            {{ $v.requiredQuantity.$errors[0].$message }}
          </template>
        </q-input>

        <q-card-actions class="justify-end q-mt-lg">
          <q-btn
            :label="$t('general.cancelButton')"
            icon="close"
            @click="resetRequiredQuantity"
          />
          <q-btn
            :label="$t('general.saveButton')"
            icon="check"
            @click="changeRequiredQuantity"
          />
        </q-card-actions>
      </q-card-section>
    </q-card>
  </q-dialog>
  <div class="q-pa-sm bg-white full-height">
    <div v-if="currentItem">
      <NodeBreadcrumbs />
      <div>
        {{ $t("general.tags") }}
        <span v-if="currentItem.tags">
          <q-chip
            v-for="tag in currentItem.tags"
            :key="tag.name"
            color="primary"
            text-color="white"
          >
            {{ tag.name }}
          </q-chip>
        </span>
        <span v-else>{{ $t("itemPage.noTags") }}</span>
      </div>

      <div class="row items-center justify-between">
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
          <q-input
            v-model="newQuantity"
            :error="$v.newQuantity.$error"
            @update:model-value="changeQuantity"
            type="number"
          >
            <template v-slot:error>
              {{ $v.newQuantity.$errors[0].$message }}
            </template>
          </q-input>
        </div>
      </div>

      <div class="q-mt-sm">
        <h6>{{ $t("general.description") }}</h6>
        <div v-if="currentItem.description" class="q-mt-sm">
          {{ currentItem.description }}
        </div>
        <div v-else>{{ $t("itemPage.noDescription") }}</div>
      </div>

      <div class="row justify-end">
        <q-btn
          @click="() => (requiredQuantityDialogVisibility = true)"
          :label="$t('itemPage.addToShoppingList')"
          color="primary"
          class="q-mr-sm"
        />
        <q-btn
          @click="showDialog"
          :label="$t('general.edit')"
          color="primary"
          class="q-mr-sm"
        />
        <q-btn @click="onRemove" :label="$t('general.delete')" color="red" />
      </div>
    </div>
    <div class="row justify-center" v-else><GearsLoader /></div>
  </div>
</template>
