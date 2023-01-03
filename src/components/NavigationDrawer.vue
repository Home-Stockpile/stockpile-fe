<script setup lang="ts">
const props = defineProps({ navigationDrawerOpen: Boolean });
</script>

<template>
  <q-drawer :model-value="props.navigationDrawerOpen" side="right" bordered>
    Menu
  </q-drawer>
</template>
