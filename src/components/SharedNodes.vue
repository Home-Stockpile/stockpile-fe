<script setup lang="ts">
import { getFirestore } from "firebase/firestore";
import { useTreeNodes } from "@/store/treeNodes";
import { useRoute } from "vue-router";

const db = getFirestore();
const treeStore = useTreeNodes();
const route = useRoute();

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
</script>

<template>
  <div class="q-pa-sm bg-white full-height">
    <h4>Shared nodes</h4>
    <p>Here you can see emails of users that shared their nodes with you</p>
    <q-list bordered separator>
      <q-item
        v-for="item in treeStore.getSharedTrees"
        :key="item.key"
        clickable
        v-ripple
      >
        <q-item-section>
          <RouterLink
            :to="{
              path: '/section/0',
              query: { owner: item.key },
            }"
          >
            <q-item-label> {{ item.label }}</q-item-label>
            <q-item-label caption>{{ item.key }}</q-item-label>
          </RouterLink>
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>
