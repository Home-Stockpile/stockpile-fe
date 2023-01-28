<script setup lang="ts">
import { onLogout } from "@/functions/asyncActions/onLogout";

interface IProps {
  hideDialog: () => void;
  currentEmail: string;
}
const props = defineProps<IProps>();
</script>
<template>
  <q-card v-if="props.currentEmail" class="q-pa-md">
    <div>{{ $t("authorization.yourEmail") }}</div>
    <div>{{ props.currentEmail }}</div>
    <q-btn
      class="q-mt-sm"
      flat
      icon="logout"
      :label="$t('authorization.logout')"
      @click="() => onLogout(props.hideDialog)"
    />
  </q-card>
</template>
