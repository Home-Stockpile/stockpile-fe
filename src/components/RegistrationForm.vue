<script setup lang="ts">
import { ref } from "vue";
import { useTreeNodes } from "@/store/treeNodes";
import {
  getAuth,
  signInWithPopup,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { getDatabase } from "firebase/database";

import { GoogleAuthProvider } from "firebase/auth";
import { INode } from "@/types/treeNodes";
import useVuelidate from "@vuelidate/core";
import { email as emailValidator, required } from "@vuelidate/validators";

const currentEmail = ref();
const email = ref("");
const password = ref("");
const emailError = ref("");
const passwordError = ref("");
const isSignIn = ref(false);
const provider = new GoogleAuthProvider();

const auth = getAuth();
interface IEmits {
  (e: "hide-form"): void;
}

const emit = defineEmits<IEmits>();
const rules = {
  email: { required, emailValidator },
  password: { required },
};

const $v = useVuelidate(rules, { email, password });

function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
function onAsyncError(error) {
  passwordError.value = "";
  emailError.value = "";
  const newMessage = capitalizeFirstLetter(
    error.message
      .split("")
      .splice(error.message.indexOf("auth") + 5)
      .join("")
      .replaceAll("-", " ")
      .slice(0, -2)
  );
  if (error.message.includes("password")) {
    passwordError.value = newMessage;
  } else {
    emailError.value = newMessage;
  }
}
async function onLogin() {
  $v.value.$validate();
  if ($v.value.$error) {
    return;
  }
  try {
    const resp = await signInWithEmailAndPassword(
      auth,
      email.value,
      password.value
    );

    localStorage.setItem("uid", resp.user.uid);
  } catch (error) {
    onAsyncError(error);
  }
  if (localStorage.getItem("uid")) {
    await useTreeNodes().fetchTree();
  }
}
async function onSignIn() {
  $v.value.$validate();
  if ($v.value.$error) {
    return;
  }
  try {
    const resp = await createUserWithEmailAndPassword(
      auth,
      email.value,
      password.value
    );
    localStorage.setItem("uid", resp.user.uid);
  } catch (error) {
    onAsyncError(error);
  }
  if (localStorage.getItem("uid")) {
    await useTreeNodes().fetchTree();
  }
}

onAuthStateChanged(auth, (user) => {
  if (user) {
    currentEmail.value = user.email;
    console.log(user.email);
  } else {
    console.log("User is signed out");
  }
});
async function signWithGoogle() {
  try {
    const resp = await signInWithPopup(auth, provider);
    GoogleAuthProvider.credentialFromResult(resp);
  } catch (error) {
    console.log(error.message);
  }
}

async function onPasswordReset() {
  $v.value.$validate();
  if ($v.value.$error) {
    return;
  }
  try {
    await sendPasswordResetEmail(auth, email.value);
    alert("Email for reset password successfully send");
  } catch (error) {
    alert(error.message);
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
  passwordError.value = "";
  emailError.value = "";
  $v.value.$reset();
}

async function logout() {
  const auth = getAuth();
  try {
    await signOut(auth);
    localStorage.setItem("uid", "");
    useTreeNodes().tree = {} as INode;
    console.log("Sign-out successful");
  } catch (error) {
    console.log("An error happened");
  }
  hideDialog();
}
</script>
<template>
  <q-dialog @hide="hideDialog" :model-value="true">
    <q-card v-if="!currentEmail" class="q-pa-md login-card">
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
          @blur="$v.email.$touch()"
          v-model="email"
          :error="!!($v.email.$error || emailError)"
          filled
          type="email"
          autocomplete="username"
          label="Your email *"
          lazy-rules
        >
          <template v-slot:error>
            {{
              $v.email.$errors[0] ? $v.email.$errors[0].$message : emailError
            }}
          </template>
        </q-input>

        <q-input
          @blur="$v.password.$touch()"
          filled
          :error="!!($v.password.$error || passwordError)"
          type="password"
          autocomplete="current-password"
          v-model="password"
          label="Your password *"
          lazy-rules
        >
          <template v-slot:error>
            {{
              $v.password.$errors[0]
                ? $v.password.$errors[0].$message
                : passwordError
            }}
          </template>
        </q-input>
        <div
          v-if="passwordError"
          class="underline cursor-pointer"
          @click="onPasswordReset"
        >
          Reset password
        </div>
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
        <div>
          <div>{{ (isSignIn ? "Sign " : "Log") + "in with:" }}</div>
          <q-img
            class="cursor-pointer"
            @click="signWithGoogle"
            src="../assets/icons/icons8-google.svg"
            width="32px"
            height="32px"
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
        @click="logout"
      />
    </q-card>
  </q-dialog>
</template>
<style scoped>
.underline {
  text-decoration: underline;
}
.login-card {
  min-width: 20rem;
}
</style>
