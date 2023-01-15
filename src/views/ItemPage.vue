<script setup lang="ts">
import { computed, onBeforeMount, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useTreeNodes } from "@/store/treeNodes";
import type { INode } from "@/types/treeNodes";
import { DialogTypes } from "@/types/dialog";
import AddNodeDialog from "@/components/AddNodeDialog.vue";
import router from "@/router";
import NodeBreadcrumbs from "@/components/NodeBreadcrumbs.vue";
import { maxValue } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
const route = useRoute();
const treeStore = useTreeNodes();
const tree = computed(() => treeStore.getTree);
const currentItem = ref<INode>();
const dialogVisibility = ref(false);
const defaultIcons = treeStore.getDefaultIcons;
const newQuantity = ref(0);
const rules = {
  newQuantity: { maxValue: maxValue(100) },
};

const $v = useVuelidate(rules, { newQuantity });

function showDialog(): void {
  dialogVisibility.value = true;
}

function hideDialog(): void {
  dialogVisibility.value = false;
}

function changeQuantity(): void {
  $v.value.newQuantity.$touch();
  if (!$v.value.newQuantity.$errors.length) {
    treeStore.editItem({ ...currentItem.value, quantity: newQuantity.value });
  }
}

function removeItem(): void {
  router.go(-1);
  const rootItemPath = currentItem.value.key
    .slice(0, currentItem.value.key.lastIndexOf("_"))
    .split("_");
  treeStore.removeItem(rootItemPath, String(route.params.key));
}
onMounted(() => {
  currentItem.value = treeStore.getItem(
    tree.value,
    String(route.params.key).split("_")
  );
  if (currentItem.value) {
    newQuantity.value = currentItem.value.quantity;
  }
});
watch(
  () => tree.value,
  () => {
    currentItem.value = treeStore.getItem(
      tree.value,
      String(route.params.key).split("_")
    );
    newQuantity.value = currentItem.value.quantity;
  }
);

watch(
  () => route.params.key,
  () => {
    currentItem.value = treeStore.getItem(
      tree.value,
      String(route.params.key).split("_")
    );
    newQuantity.value = currentItem.value.quantity;
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

  <div v-if="currentItem" class="q-pa-sm bg-white">
    <NodeBreadcrumbs />
    <div>
      {{ $t("general.tags") }}
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
      <div class="q-mt-sm">{{ currentItem.description }}</div>
    </div>

    <div class="row justify-end">
      <q-btn
        @click="showDialog"
        :label="$t('general.edit')"
        color="primary"
        class="q-mr-sm"
      />
      <q-btn @click="removeItem" :label="$t('general.delete')" color="red" />
    </div>
  </div>
</template>
