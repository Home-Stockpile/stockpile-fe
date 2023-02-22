<script setup lang="ts">
import Main from "@/components/Main.vue";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { setLoggedIn } from "@/functions/asyncActions/setLoggedIn";
import { fetchTree } from "@/functions/asyncActions/fetchTree";
import { getSharedNodes } from "@/functions/asyncActions/getSharedNodes";
import { INode } from "@/types/treeNodes";
import { useTreeNodes } from "@/store/treeNodes";

const auth = getAuth();

onAuthStateChanged(auth, (user) => {
  if (user) {
    setLoggedIn(user.uid);
    if (sessionStorage.getItem("uid")) {
      fetchTree();
      getSharedNodes();
    }
  }
});
</script>

<template>
  <Main />
</template>
<!--export function getCurrentNode(owner, tree, key): INode {-->
<!--const treeStore = useTreeNodes();-->
<!--if (!Object.keys(tree.value).length) {-->
<!--return;-->
<!--}-->

<!--if (owner === sessionStorage.getItem("uid") && tree.value.key) {-->
<!--return treeStore.getItem(tree.value, String(key).split("_"));-->
<!--}-->
<!--console.log();-->

<!--return treeStore.getItem(-->
<!--treeStore.getSharedTrees.find((item) => item.key === owner),-->
<!--String(key).split("_")-->
<!--);-->
<!--}-->
