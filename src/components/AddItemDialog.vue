<script setup lang="ts">
import { useTreeNodes } from "@/store/treeNodes";
import { computed, onMounted, onUpdated, ref, shallowRef } from "vue";
import type Dialog from "primevue/dialog";
import { DialogTypes } from "@/types/dialog";
import { IItem } from "@/types/nodeTypes";
import { MenuItemLabelType } from "primevue/menuitem";

interface IAddItemDialog {
  dialogVisibility: boolean;
  dialogType?: DialogTypes.section | DialogTypes.item;
}
const props = defineProps<IAddItemDialog>();
const emit = defineEmits(["hide-dialog"]);

const sectionName = ref("");
const errorLabel = ref("");
const errorTag = ref("");

const addForm = shallowRef<IItem>({
  label: "adsad",
  quantity: 2,
  description: "adaw",
  tags: [],
});
const newTag = ref("");
const checkDialogType = () => {
  return props.dialogType === DialogTypes.item;
};
function hideDialog() {
  errorLabel.value = "";
  addForm.value.label = "";
  emit("hide-dialog");
}
function checkName(name) {
  if (name.length > 30) {
    return "Field can't be longer than 30 chars";
  } else if (!name.trim()) {
    return "Field can't be empty";
  }
  return "";
}

function checkLabel(label: string): string {
  if (
    useTreeNodes().$state.items.find(
      (item) => String(item.label).toLowerCase() === label.toLowerCase()
    )
  ) {
    return "Field with that name already exist";
  }
  return checkName(label);
}

function checkTag(tag: string): string {
  if (
    addForm.value.tags.find(
      (tag) => tag.toLowerCase() === newTag.value.toLowerCase()
    )
  ) {
    return "Tag with that name already exists";
  }
  return checkName(tag);
}
function addSection() {
  errorLabel.value = checkLabel(addForm.value.label);
  if (!errorLabel.value) {
    useTreeNodes().addItem({ label: addForm.value.label }, ["0"]);
    hideDialog();
  }
  addForm.value.label = "";
}
function addTag() {
  errorTag.value = checkTag(newTag.value);

  if (!errorTag.value) {
    addForm.value = {
      ...addForm.value,
      tags: [...addForm.value.tags, newTag.value],
    };
  }
}

onUpdated(() => {
  console.log("Updated", addForm.value);
});
onMounted(() => {
  console.log("Mounted", checkDialogType());
});
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
      v-model.trim="addForm.label"
      class="w-full mt-2"
      :class="errorLabel && 'p-invalid'"
      type="text"
    />
    <small class="ml-2 text-xs text-red-600">{{ errorLabel }}</small>
    <div v-show="checkDialogType()">
      <h3 class="my-2">Quantity:</h3>
      <div class="grid p-fluid">
        <div class="field col-12 mb-0">
          <InputNumber
            v-model="addForm.quantity"
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
        <InputText v-model="newTag" placeholder="Tag" />
        <Button @click="addTag" label="Add tag" />
      </div>
      <small class="ml-2 text-xs text-red-600">{{ errorTag }}</small>
      <div class="flex align-items-center mt-1 mb-1">
        <div>
          <Chip
            v-for="tag in addForm.tags"
            :label="tag"
            :key="tag"
            class="relative"
            removable
          />
        </div>
      </div>

      <h3 class="my-2">Description:</h3>
      <Textarea
        placeholder="Add your description"
        class="w-full"
        v-model="addForm.description"
        :autoResize="true"
        rows="5"
        cols="30"
      />
    </div>

    <template #footer>
      <Button
        label="Reject"
        icon="pi pi-times"
        @click="hideDialog"
        class="p-button-text"
      />
      <Button label="Save" icon="pi pi-check" @click="addSection" autofocus />
    </template>
  </Dialog>
</template>
