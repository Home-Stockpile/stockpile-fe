<script setup lang="ts">
import { computed, ref } from "vue";
import RegistrationForm from "@/components/RegistrationForm.vue";
import { useQuasar } from "quasar";
import { useTreeNodes } from "@/store/treeNodes";

interface IEmits {
  (e: "toggle-navigation-drawer"): void;
  (e: "toggle-tree-drawer"): void;
}
const emit = defineEmits<IEmits>();

const $q = useQuasar();
const formVisibility = ref(false);
const treeStore = useTreeNodes();
const tree = computed(() => treeStore.getTree);
const langs = [
  {
    label: "Ukrainian",
    value: "ua",
  },
  {
    label: "English",
    value: "en",
  },
];

function toggleTreeDrawer() {
  if (!isAuth()) {
    $q.notify("Please log in");
    return;
  }
  if (!Object.keys(tree.value).length) {
    $q.notify("Please wait for tree loading");
    return;
  }

  emit("toggle-tree-drawer");
}

function hideForm(): void {
  formVisibility.value = false;
}
function showForm(): void {
  formVisibility.value = true;
}
function isAuth() {
  if (sessionStorage.getItem("uid")) {
    return true;
  }
  return false;
}
</script>

<template>
  <q-header bordered class="bg-primary text-white">
    <q-toolbar>
      <q-btn dense flat round icon="menu" @click="toggleTreeDrawer" />

      <q-toolbar-title> Home stockpile </q-toolbar-title>
      <div class="row">
        <q-select
          label="Select Language"
          v-model="$i18n.locale"
          map-options
          emit-value
          borderless
          label-color="white"
          option-value="value"
          option-label="label"
          :options="langs"
          class="q-mr-sm"
        />
        <q-btn dense flat icon="login" @click="showForm" />
      </div>
    </q-toolbar>
    <RegistrationForm v-if="formVisibility" @hide-form="hideForm" />
  </q-header>
</template>

<style scoped>
:deep(.q-select) {
  width: 10rem;
}
</style>
