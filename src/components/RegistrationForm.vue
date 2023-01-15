<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useTreeNodes } from "@/store/treeNodes";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { getDatabase, onValue, ref as fbRef } from "firebase/database";
import { firebaseApp } from "@/firebase";
import { INode } from "@/types/treeNodes";

const currentEmail = ref();
const email = ref(null);
const password = ref(null);
const emailError = ref("");
const isSignIn = ref(false);

const db = getDatabase();
const auth = getAuth();
interface IEmits {
  (e: "hide-form"): void;
}

const emit = defineEmits<IEmits>();
async function onLogin() {
  hideDialog();
  try {
    const resp = await signInWithEmailAndPassword(
      auth,
      email.value,
      password.value
    );

    localStorage.setItem("uid", resp.user.uid);
  } catch (error) {
    console.log(error.message);
  }
  console.log(localStorage.getItem("uid"));
  if (localStorage.getItem("uid")) {
    await useTreeNodes().fetchTree();
  }
}
async function onSignIn() {
  hideDialog();
  try {
    const resp = await createUserWithEmailAndPassword(
      auth,
      email.value,
      password.value
    );
    localStorage.setItem("uid", resp.user.uid);
  } catch (error) {
    console.log(error.message);
  }
  console.log(localStorage.getItem("uid"));
  if (localStorage.getItem("uid")) {
    await useTreeNodes().fetchTree();
  }
}
function toggleFormType(e) {
  onReset();
  if (e.target.value === "login") {
    isSignIn.value = false;
    return;
  }

  isSignIn.value = true;
}
function hideDialog(): void {
  emit("hide-form");
}
function onReset() {
  email.value = "";
  password.value = "";
}
onAuthStateChanged(auth, (user) => {
  if (user) {
    currentEmail.value = user.email;
    console.log(user.email);
  } else {
    console.log("User is signed out");
  }
});
function logOut() {
  const auth = getAuth();

  signOut(auth)
    .then(() => {
      localStorage.setItem("uid", "");
      useTreeNodes().tree = {} as INode;
      console.log("Sign-out successful");
    })
    .catch((error) => {
      console.log("An error happened");
    });
  hideDialog();
}
</script>
<template>
  <q-dialog @hide="hideDialog" :model-value="true">
    <q-card v-if="!currentEmail" class="q-pa-md">
      <div class="row text-subtitle1">
        <data
          @click="toggleFormType"
          :class="!isSignIn && 'underline'"
          value="login"
          class="q-pr-xs cursor-pointer"
        >
          Login
        </data>
        <div>|</div>
        <data
          @click="toggleFormType"
          :class="isSignIn && 'underline'"
          value="signIn"
          class="q-pl-xs cursor-pointer"
        >
          Sign in
        </data>
      </div>
      <q-form
        @submit="onLogin"
        @reset="onReset"
        class="q-gutter-md q-mt-sm bg-white"
      >
        <q-input
          filled
          type="email"
          autocomplete="username"
          v-model="email"
          label="Your email *"
          :error="!!emailError"
          :error-message="emailError"
          lazy-rules
        />

        <q-input
          filled
          type="password"
          autocomplete="current-password"
          v-model="password"
          label="Your password *"
          lazy-rules
        />

        <div>
          <q-btn
            v-if="isSignIn"
            @click="onSignIn"
            label="Sign in"
            color="primary"
          />
          <q-btn
            v-if="!isSignIn"
            @click="onLogin"
            label="Login"
            color="primary"
          />
          <q-btn
            @click="onReset"
            label="Reset"
            color="primary"
            flat
            class="q-ml-sm"
          />
        </div>
      </q-form>
    </q-card>
    <q-card v-if="currentEmail" class="q-pa-md">
      <div>Your email:</div>
      <div>{{ currentEmail }}</div>
      <q-btn
        class="q-mt-sm"
        flat
        icon="logout"
        label="Logout"
        @click="logOut"
      />
    </q-card>
  </q-dialog>
</template>
<style scoped>
.underline {
  text-decoration: underline;
}
</style>
