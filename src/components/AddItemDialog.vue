<script setup lang="ts">
import { useTreeNodes } from "@/store/treeNodes";
import { reactive, ref } from "vue";
import { useRoute } from "vue-router";
import { DialogTypes } from "@/types/dialog";
import { IItem } from "@/types/treeNodes";
import type Dialog from "primevue/dialog";
import { FileUploadSelectEvent } from "primevue/fileupload";
import { useAllTags } from "@/store/tag";

interface IAddItemDialog {
  dialogVisibility: boolean;
  dialogType?: DialogTypes.section | DialogTypes.item | DialogTypes.root;
}
const props = defineProps<IAddItemDialog>();
const emit = defineEmits(["hide-dialog"]);

const treeStore = useTreeNodes();
const tree = treeStore.getTree;
const allTagsStore = useAllTags();
const allTags = allTagsStore.getTags;

const route = useRoute();
const newTag = ref("");

const formErrors = reactive({
  errorLabel: "",
  errorTag: "",
  errorQuantity: "",
  errorDescription: "",
});

const addForm = reactive<IItem>({
  label: "",
  description: "",
  quantity: 0,
  icon: "",
  tags: [],
});

function hideDialog() {
  formErrors.errorLabel = "";
  formErrors.errorTag = "";
  formErrors.errorQuantity = "";
  formErrors.errorDescription = "";

  addForm.label = "";
  addForm.description = "";
  addForm.tags = [];
  emit("hide-dialog");
}

function checkDialogType(): boolean {
  return props.dialogType === DialogTypes.item;
}

function checkName(name: string, length: number): string {
  if (name.length > length) {
    return `Field can't be longer than ${length} chars`;
  }
  if (!name.trim() && length < 200) {
    return "Field can't be empty";
  }
  return "";
}

function checkLabel(label: string, path): string {
  const rootObj = treeStore.getItem(tree, path.split("_"));
  if (
    rootObj.items.find(
      (item) => String(item.label).toLowerCase() === label.toLowerCase()
    )
  ) {
    return "Field with that name already exist";
  }
  return checkName(label, 25);
}

function checkTag(tag: string): string {
  if (
    addForm.tags.find((tag) => tag.toLowerCase() === newTag.value.toLowerCase())
  ) {
    return "Tag with that name already exists";
  }
  return checkName(tag, 15);
}

function checkQuantity(quantity): string {
  if (quantity > 100) {
    return "Quantity can't be more then 100";
  }
  return "";
}

function getRootItemPath(): string {
  if (props.dialogType === DialogTypes.root) {
    return "0";
  }
  return String(route.params.key);
}
function addItem(newItem: IItem, routerPath: string) {
  treeStore.addItem(newItem, getRootItemPath().split("_"), routerPath);
  hideDialog();
}

function checkForm() {
  formErrors.errorLabel = checkLabel(String(addForm.label), getRootItemPath());
  let newItem: IItem = {
    label: addForm.label,
    icon: addForm.icon,
    favorites: false,
  };

  if (checkDialogType()) {
    formErrors.errorQuantity = checkQuantity(addForm.quantity);
    formErrors.errorDescription = checkName(addForm.description, 264);
    newItem = {
      ...newItem,
      quantity: addForm.quantity,
      tags: addForm.tags,
      description: addForm.description,
    };
    if (
      !formErrors.errorLabel &&
      !formErrors.errorQuantity &&
      !formErrors.errorDescription
    ) {
      addItem(newItem, "/item/");
      addForm.quantity = 0;
      addForm.tags = [];
      addForm.description = "";
    }
  } else {
    newItem = { ...newItem, items: [] };
    if (!formErrors.errorLabel) {
      addItem(newItem, "/section/");
    }
  }
}

function addTag() {
  allTagsStore.addTag(newTag.value);
  formErrors.errorTag = checkTag(newTag.value);

  if (!formErrors.errorTag) {
    addForm.tags.push(newTag.value);
    newTag.value = "";
  }
}

function removeTag(tagForRemove: string) {
  allTagsStore.removeTag(tagForRemove);
  addForm.tags = addForm.tags.filter((tag) => tag !== tagForRemove);
  formErrors.errorTag = "";
}

function addIcon(e: FileUploadSelectEvent) {
  addForm.icon = e.files[0].objectURL;
}
function removeIcon() {
  addForm.icon = "";
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
      v-model.trim="addForm.label"
      class="w-full mt-2"
      :class="formErrors.errorLabel && 'p-invalid'"
      type="text"
    />

    <small class="ml-2 text-xs text-red-600">{{ formErrors.errorLabel }}</small>
    <div v-show="checkDialogType()">
      <h3 class="my-2">Quantity:</h3>
      <div class="grid p-fluid">
        <div class="field col-12 mb-0">
          <InputNumber
            v-model="addForm.quantity"
            class="w-full"
            :class="formErrors.errorQuantity && 'p-invalid'"
            showButtons
            buttonLayout="horizontal"
            decrementButtonClass="p-button-danger"
            incrementButtonClass="p-button-success"
            incrementButtonIcon="pi pi-plus"
            decrementButtonIcon="pi pi-minus"
          />
          <small class="ml-2 text-xs text-red-600">{{
            formErrors.errorQuantity
          }}</small>
        </div>
      </div>

      <h3>Tags:</h3>
      <div class="p-inputgroup mt-2">
        <InputText
          v-model="newTag"
          placeholder="Tag"
          :class="formErrors.errorTag && 'p-invalid'"
        />
        <Button @click="addTag" label="Add tag" />
      </div>
      <small class="ml-2 text-xs text-red-600">{{ formErrors.errorTag }}</small>
      <div class="flex align-items-center mt-1 mb-1">
        <div>
          <Chip
            v-for="tag in addForm.tags"
            :label="tag"
            :key="tag"
            :value="tag"
            @remove="() => removeTag(tag)"
            class="relative"
            removable
          />
        </div>
      </div>

      <h3 class="my-2">Description:</h3>
      <Textarea
        placeholder="Add your description"
        class="w-full"
        :class="formErrors.errorDescription && 'p-invalid'"
        v-model="addForm.description"
        :autoResize="true"
        rows="5"
        cols="30"
      />
      <small class="ml-2 text-xs text-red-600">{{
        formErrors.errorDescription
      }}</small>
    </div>
    <h3 class="my-2">Download your icon:</h3>

    <FileUpload
      class="p-2"
      @select="addIcon"
      @remove="removeIcon"
      @clear="removeIcon"
      :multiple="false"
      accept="image/*"
      :maxFileSize="1000000"
    >
      <template #empty>
        <p>Drag and drop files to here to upload.</p>
      </template>
    </FileUpload>
    <template #footer>
      <Button
        label="Reject"
        icon="pi pi-times"
        @click="hideDialog"
        class="p-button-text"
      />
      <Button label="Save" icon="pi pi-check" @click="checkForm" autofocus />
    </template>
  </Dialog>
</template>

<style scoped>
:deep(.p-fileupload-file-name) {
  width: 10rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
