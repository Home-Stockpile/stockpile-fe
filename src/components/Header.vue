<script setup lang="ts">
import { onMounted, ref } from "vue";
import RegistrationForm from "@/components/RegistrationForm.vue";
import { getAuth, signOut } from "firebase/auth";
import { useTreeNodes } from "@/store/treeNodes";
import { INode } from "@/types/treeNodes";

interface IEmits {
  (e: "toggle-navigation-drawer"): void;
  (e: "toggle-tree-drawer"): void;
}
const emit = defineEmits<IEmits>();

const formVisibility = ref(false);
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

function toggleNavigationDrawer() {
  emit("toggle-navigation-drawer");
}
function toggleTreeDrawer() {
  emit("toggle-tree-drawer");
}

function createAcc() {}
function hideForm(): void {
  formVisibility.value = false;
}
function showForm(): void {
  formVisibility.value = true;
}

onMounted(() => {});
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
