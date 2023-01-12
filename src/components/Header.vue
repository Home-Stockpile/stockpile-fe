<script setup lang="ts">
interface IEmits {
  (e: "toggle-navigation-drawer"): void;
  (e: "toggle-tree-drawer"): void;
}
const emit = defineEmits<IEmits>();

function toggleNavigationDrawer() {
  emit("toggle-navigation-drawer");
}
function toggleTreeDrawer() {
  emit("toggle-tree-drawer");
}
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
      </div>
    </q-toolbar>
  </q-header>
</template>

<style scoped>
:deep(.q-select) {
  width: 10rem;
}
</style>
