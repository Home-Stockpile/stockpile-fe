<script setup lang="ts">
import Main from "@/components/Main.vue";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { onMounted } from "vue";
import { setLoggedIn } from "@/functions/asyncActions/setLoggedIn";
import { fetchTree } from "@/functions/asyncActions/fetchTree";
import { get, ref as fbRef, set } from "@firebase/database";
import { getDatabase } from "firebase/database";

const auth = getAuth();
const db = getDatabase();

onAuthStateChanged(auth, (user) => {
  if (user) {
    setLoggedIn(user.uid);
    if (sessionStorage.getItem("uid")) {
      fetchTree();
    }

    get(fbRef(db, sessionStorage.getItem("uid"))).then((snapshot) => {
      if (!snapshot.exists()) {
        set(fbRef(db, sessionStorage.getItem("uid")), {
          key: "0",
          to: "/",
        });
      }
    });
  }
});
onMounted(() => {
  if (sessionStorage.getItem("uid")) {
    fetchTree();
  }
});
</script>

<template>
  <Main />
</template>
