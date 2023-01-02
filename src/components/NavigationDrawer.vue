<script setup lang="ts">
const props = defineProps({ navigationDrawerOpen: Boolean });
</script>

<template>
  <q-drawer :model-value="props.navigationDrawerOpen" side="right" bordered>
    Menu
  </q-drawer>
</template>

<style scoped>
:deep(.p-selectbutton > .p-button.p-component) {
  border-radius: 50%;
  padding: 0.5rem;
}

.heart {
  right: 1rem;
}
</style>
