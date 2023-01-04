<script setup lang="ts">
interface IProps {
  navigationDrawerOpen: boolean;
}

const props = defineProps<IProps>();
</script>

<template>
  <q-drawer :model-value="props.navigationDrawerOpen" side="right" bordered>
    Menu
  </q-drawer>
</template>
