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
