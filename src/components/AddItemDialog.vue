<script setup lang="ts">
import { useTreeNodes } from "@/store/treeNodes";
import { onMounted, ref } from "vue";

const props = defineProps({
  dialogVisibility: Boolean,
});
const emit = defineEmits(["show-dialog"]);
const sectionName = ref("");
const errorText = ref("");

function showDialog() {
  errorText.value = "";
  sectionName.value = "";
  emit("show-dialog");
}

function checkName(name: string): string {
  if (name.length > 30) {
    return "Field can't be longer than 30 chars";
  } else if (!name.trim()) {
    return "Field can't be empty";
  } else if (
    useTreeNodes().$state.items.find(
      (item) => String(item.label).toLowerCase() === name.toLowerCase()
    )
  ) {
    return "Field with that name already exist";
  }
  return "";
}

function addSection() {
  errorText.value = checkName(sectionName.value);
  if (!errorText.value) {
    useTreeNodes().addItem({ label: sectionName.value }, ["0"]);
    showDialog();
  }
  sectionName.value = "";
}
</script>

<template>
  <Dialog
    class="w-30rem"
    :visible="props.dialogVisibility"
    :modal="true"
    :closable="false"
  >
    <h3>Enter name of new section:</h3>
    <InputText
      placeholder="Name"
      v-model.trim="sectionName"
      class="w-full mt-2"
      :class="errorText && 'p-invalid'"
      type="text"
    />
    <small class="ml-2 text-xs text-red-600">{{ errorText }}</small>
    <div v-show="">
      <h3 class="my-2">Quantity:</h3>
      <div class="grid p-fluid">
        <div class="field col-12 mb-0">
          <InputNumber
            class="w-full"
            showButtons
            buttonLayout="horizontal"
            decrementButtonClass="p-button-danger"
            incrementButtonClass="p-button-success"
            incrementButtonIcon="pi pi-plus"
            decrementButtonIcon="pi pi-minus"
          />
        </div>
      </div>

      <h3>Tags:</h3>
      <div class="p-inputgroup mt-2">
        <InputText placeholder="Tag" /><Button label="Add tag" />
      </div>
      <div class="flex align-items-center mt-1 mb-1">
        <div>
          <Chip label="tag" class="relative" removable />
        </div>
      </div>

      <h3 class="my-2">Description:</h3>
      <Textarea
        placeholder="Add your description"
        class="w-full"
        :autoResize="true"
        rows="5"
        cols="30"
      />
    </div>

    <template #footer>
      <Button
        label="Reject"
        icon="pi pi-times"
        @click="showDialog"
        class="p-button-text"
      />
      <Button label="Save" icon="pi pi-check" @click="addSection" autofocus />
    </template>
  </Dialog>
</template>
