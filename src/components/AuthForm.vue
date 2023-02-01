<script setup lang="ts">
import { ref } from "vue";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import useVuelidate from "@vuelidate/core";
import { email as emailValidator, required } from "@vuelidate/validators";
import UserProfile from "@/components/UserProfile.vue";
import { capitalizeFirstLetter } from "@/functions/capitalizeFirstLetter";
import { signWithGoogle } from "@/functions/asyncActions/signWithGoogle";
import { passwordReset } from "@/functions/asyncActions/passwordReset";
import { onLogin } from "@/functions/asyncActions/onLogin";
import { onSignIn } from "@/functions/asyncActions/onSignIn";

const currentEmail = ref();
const email = ref("");
const password = ref("");
const emailError = ref("");
const passwordError = ref("");
const isSignIn = ref(false);

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

onAuthStateChanged(auth, (user) => {
  if (user) {
    currentEmail.value = user.email;
  }
});

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
          {{ $t("authorization.login") }}
        </data>
        <div>|</div>
        <data
          @click="toggleFormType"
          :class="isSignIn && 'underline'"
          value="signIn"
          class="q-pl-xs cursor-pointer"
          >{{ $t("authorization.signIn") }}
        </data>
      </div>
      <q-form @reset="onReset" class="q-gutter-md q-mt-sm bg-white">
        <q-input
          @blur="$v.email.$touch()"
          v-model="email"
          :error="!!($v.email.$error || emailError)"
          filled
          type="email"
          autocomplete="username"
          :label="$t('authorization.yourEmail') + '*'"
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
          v-model="password"
          :error="!!($v.password.$error || passwordError)"
          :label="$t('authorization.yourPassword') + '*'"
          type="password"
          autocomplete="current-password"
          class="q-mt-xs"
          filled
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
          @click="() => passwordReset(email)"
        >
          {{ $t("authorization.resetPassword") }}
        </div>
        <div class="row justify-center q-mt-none">
          <q-btn
            v-if="isSignIn"
            @click="() => onSignIn($v, email, password, onAsyncError)"
            :label="$t('authorization.signIn')"
            color="primary"
            size="md"
            rounded
            class="full-width"
          />
          <q-btn
            v-else
            @click="() => onLogin($v, email, password, onAsyncError)"
            :label="$t('authorization.login')"
            color="primary"
            size="md"
            rounded
            class="full-width"
          />
        </div>
        <hr />
        <div class="row justify-center">
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
    <UserProfile v-else :hideDialog="hideDialog" :currentEmail="currentEmail" />
  </q-dialog>
</template>
<style scoped>
.underline {
  text-decoration: underline;
}
.login-card {
  min-width: 20rem;
}

hr {
  margin-top: 2rem;
  border: none;
  border-top: 3px solid #333;
  color: #333;
  overflow: visible;
  text-align: center;
  height: 5px;
}
hr:after {
  background: #fff;
  content: "OR";
  padding: 0 4px;
  position: relative;
  top: -13px;
}
</style>
