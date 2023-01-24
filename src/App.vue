<script setup lang="ts">
import Main from "@/components/Main.vue";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { firebaseApp } from "@/firebase";
import { onMounted } from "vue";
import { setLoggedIn } from "@/functions/asyncActions/setLoggedIn";
import { fetchTree } from "@/functions/asyncActions/fetchTree";
import { useQuasar } from "quasar";

const auth = getAuth(firebaseApp);
const $q = useQuasar();
onAuthStateChanged(auth, (user) => {
  if (user) {
    setLoggedIn(user.uid);
    if (sessionStorage.getItem("uid")) {
      fetchTree();
    }
  } else {
    $q.notify("You log out");
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
