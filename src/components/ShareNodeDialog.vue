<script setup lang="ts">
import { ref } from "vue";
import { getAuth } from "firebase/auth";
import useVuelidate from "@vuelidate/core";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  getFirestore,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { INode } from "@/types/treeNodes";
import { helpers, required } from "@vuelidate/validators";

const sharedUid = ref("");
const roleOfUser = ref("");
const db = getFirestore();

const auth = getAuth();
interface IEmits {
  (e: "hide-form"): void;
}

const emit = defineEmits<IEmits>();
interface IProps {
  currentItem: INode;
}

const props = defineProps<IProps>();

const rules = {
  sharedUid: {
    required,
    isUser: helpers.withAsync(
      helpers.withMessage("No user with that id", isUser)
    ),
  },
};
async function isUser(value: string) {
  const colRef = doc(db, "users", value);

  const sharedNodes = await getDoc(colRef);

  if (!sharedNodes.exists()) {
    return false;
  }
  console.log(1);
  return true;
}
const $v = useVuelidate(rules, { sharedUid });
const options = ["reader", "owner"];
function hideDialog(): void {
  emit("hide-form");
}

async function shareNode() {
  $v.value.sharedUid.$touch();
  console.log($v.value.sharedUid.$error);
  if ($v.value.sharedUid.$error) {
    const docRef = doc(
      db,
      "users",
      sharedUid.value,
      "sharedNodes",
      sessionStorage.getItem("uid")
    );
    try {
      getChildren(props.currentItem, []).forEach((key) => {
        setRole(key);
      });
      await setDoc(docRef, {
        email: "?",
        shared: getChildren(props.currentItem, []),
      });
    } catch (e) {
      console.log(e);
    }
  }
}

async function setRole(key) {
  const nodeRef = doc(
    db,
    "storages",
    sessionStorage.getItem("uid"),
    "tree",
    key
  );
  await setDoc(
    nodeRef,
    { roles: { [sharedUid.value]: roleOfUser.value } },
    { merge: true }
  );
}
function getChildren(element: INode, searchResult: string[]): string[] {
  if (element.key) {
    searchResult.push(element.key);
  }
  if (element.items && element.items.length) {
    let treeNode = [];
    element.items.forEach(
      (item) => (treeNode = getChildren(item, searchResult) || searchResult)
    );
    return treeNode;
  }
  return searchResult;
}
</script>

<template>
  <q-dialog @hide="emit('hide-form')" :model-value="true">
    <q-card class="q-pa-md login-card">
      <q-input
        v-model="sharedUid"
        :error="!!$v.sharedUid.$error"
        filled
        type="search"
        label="ID of user*"
        lazy-rules
      >
        <template v-slot:error>
          {{ $v.sharedUid.$errors[0] && $v.sharedUid.$errors[0].$message }}
        </template>
      </q-input>
      <q-select v-model="roleOfUser" :options="options" label="Choose role" />

      <div class="row justify-center q-mt-md">
        <q-btn
          @blur="$v.$touch()"
          @click="shareNode"
          label="Share"
          color="primary"
          size="md"
          rounded
          class="full-width"
        />
      </div>
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
