<script setup lang="ts">
import Main from "@/components/Main.vue";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDatabase, onValue } from "firebase/database";
import { ref as fbRef } from "@firebase/database";
import { useTreeNodes } from "@/store/treeNodes";
import { firebaseApp } from "@/firebase";
import { onBeforeMount, onMounted } from "vue";

const db = getDatabase(firebaseApp);
const auth = getAuth(firebaseApp);
const treeStore = useTreeNodes();
onAuthStateChanged(auth, (user) => {
  if (user) {
    treeStore.setSigned(user.uid);
    if (localStorage.getItem("uid")) {
      treeStore.fetchTree();
    }
    console.log("User is signed in");
  } else {
    console.log("User is signed out");
  }
});
onBeforeMount(() => {
  if (localStorage.getItem("uid")) {
    useTreeNodes().fetchTree();
  }
});
</script>

<template>
  <Main />
</template>
