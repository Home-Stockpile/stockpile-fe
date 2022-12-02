<script setup lang="ts">
import { useTreeNodes } from "@/store/treeNodes";
import { ref } from "vue";
const state = useTreeNodes().$state;

const showPopup = ref(false);
const sectionName = ref("");
const errorText = ref("");

function checkName(name) {
  if (name.length > 30) {
    errorText.value = "Field can't be longer than 30 chars";
    return false;
  } else if (!name.trim()) {
    errorText.value = "Field can't be empty";
    return false;
  } else if (
    state.items.find(
      (item) => String(item.label).toLowerCase() === name.toLowerCase()
    )
  ) {
    errorText.value = "Field with that name already exist";
    return false;
  }
  return true;
}

function addSection() {
  if (checkName(sectionName.value)) {
    useTreeNodes().addSection(sectionName.value);
    toggleShowPopup();
  }
  sectionName.value = "";
}

function toggleShowPopup() {
  errorText.value = "";
  sectionName.value = "";
  showPopup.value = !showPopup.value;
}
</script>

<template>
  <nav
    class="left-menu w-25rem p-1 border-round-xl h-full"
    :class="state.items.length > 14 ? 'overflow-y-scroll' : 'overflow-hidden'"
  >
    <Button
      @click="toggleShowPopup"
      class="p-button-outlined w-full h-4rem"
      icon="pi pi-plus"
    />

    <PanelMenu class="border-0 mt-2" :model="state.items" />
    <Dialog
      class="w-20rem"
      v-model:visible="showPopup"
      :modal="true"
      :closable="false"
    >
      <h3>Enter name of new section:</h3>
      <InputText
        v-model.trim="sectionName"
        class="w-full mt-2"
        :class="errorText && 'p-invalid'"
        type="text"
      />
      <small class="ml-2 text-xs text-red-600">{{ errorText }}</small>
      <template #footer>
        <Button
          label="Reject"
          icon="pi pi-times"
          @click="toggleShowPopup"
          class="p-button-text"
        /><Button
          label="Save"
          icon="pi pi-check"
          @click="addSection"
          autofocus
        />
      </template>
    </Dialog>
  </nav>
</template>

<style scoped>
.p-button-outlined {
  box-shadow: none !important;
}
.left-menu {
  background-color: var(--surface-a);
}
</style>
