<script setup lang="ts">
import { useTreeNodes } from "@/store/treeNodes";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { AddDialog, DialogTypes } from "@/types/dialog";
import { IItem } from "@/types/treeNodes";
import type Dialog from "primevue/dialog";
import { FileUploadSelectEvent } from "primevue/fileupload";
import { ITag } from "@/types/tags";

interface IAddItemDialog {
  currentItem?: IItem;
  dialogType?: AddDialog;
  isEdit?: boolean;
}
const props = defineProps<IAddItemDialog>();
const emit = defineEmits(["hide-dialog"]);

const treeStore = useTreeNodes();
const tree = treeStore.getTree;

const route = useRoute();
const newTagName = ref("");

const formErrors = ref({
  errorLabel: "",
  errorTag: "",
  errorQuantity: "",
  errorDescription: "",
});

const addForm = ref<IItem>({
  label: "",
  description: "",
  quantity: 0,
  icon: "",
  tags: [],
});

function hideDialog(): void {
  formErrors.value.errorLabel = "";
  formErrors.value.errorTag = "";
  formErrors.value.errorQuantity = "";
  formErrors.value.errorDescription = "";

  newTagName.value = "";
  addForm.value.label = "";
  addForm.value.description = "";
  addForm.value.icon = "";
  addForm.value.quantity = 0;
  addForm.value.tags = [];
  emit("hide-dialog");
}

function isItem(): boolean {
  return props.dialogType === DialogTypes.item;
}

function validateName(name: string, length: number): string {
  if (name.length > length) {
    return `Field can't be longer than ${length} chars`;
  }
  if (!name.trim() && length < 200) {
    return "Field can't be empty";
  }
  return "";
}

function validateLabel(label: string, path): string {
  const rootObj = treeStore.getItem(tree, path.split("_"));
  if (
    !props.currentItem &&
    rootObj.items.find(
      (item) => String(item.label).toLowerCase() === label.toLowerCase()
    )
  ) {
    return "Field with that name already exist";
  }
  return validateName(label, 25);
}

function validateTag(tag: string): string {
  if (
    addForm.value.tags.find(
      (tag) => tag.name.toLowerCase() === newTagName.value.toLowerCase()
    )
  ) {
    return "Tag with that name already exists";
  }
  return validateName(tag, 15);
}

function validateQuantity(quantity: number): string {
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
function addTreeNode(newItem: IItem, routerPath: string) {
  treeStore.addTreeNode(newItem, getRootItemPath().split("_"), routerPath);
  hideDialog();
}

function editItem(newItem: IItem): void {
  treeStore.editItem({
    ...newItem,
    key: props.currentItem.key,
    to: props.currentItem.to,
  });
  hideDialog();
}

function modifyItem(newItem) {
  newItem = {
    ...newItem,
    quantity: addForm.value.quantity,
    tags: addForm.value.tags,
    description: addForm.value.description,
  };

  if (!formErrors.value.errorLabel) {
    if (props.isEdit) {
      editItem(newItem);
    } else {
      addTreeNode(newItem, "/item/");
    }
  }
}

function modifySection(newItem: IItem) {
  newItem = {
    ...newItem,
    items: [],
  };
  formErrors.value.errorQuantity = validateQuantity(addForm.value.quantity); //quantity -> count
  formErrors.value.errorDescription = validateName(
    addForm.value.description,
    264
  );
  if (
    !formErrors.value.errorLabel &&
    !formErrors.value.errorQuantity &&
    !formErrors.value.errorDescription
  ) {
    if (props.isEdit) {
      newItem.items = props.currentItem.items;
      editItem(newItem);
    } else {
      addTreeNode(newItem, "/section/");
    }
  }
}

function validateForm(): void {
  formErrors.value.errorLabel = validateLabel(
    String(addForm.value.label),
    getRootItemPath()
  );
  let newItem: IItem = {
    label: addForm.value.label,
    icon: addForm.value.icon,
    favorites: false,
  };
  if (isItem()) {
    modifyItem(newItem);
  } else {
    modifySection(newItem);
  }
}

function addTag(): void {
  formErrors.value.errorTag = validateTag(newTagName.value);

  if (!formErrors.value.errorTag) {
    addForm.value.tags.push({ name: newTagName.value, favorite: false });
    newTagName.value = "";
  }
}

function removeTag(tagForRemove: ITag): void {
  addForm.value.tags = addForm.value.tags.filter(
    (tag) => tag.name !== tagForRemove.name
  );
  formErrors.value.errorTag = "";
}

function addIcon(e: FileUploadSelectEvent): void {
  addForm.value.icon = e.files[0].objectURL;
}
function removeIcon(): void {
  addForm.value.icon = "";
}

onMounted(() => {
  if (props.isEdit) {
    addForm.value.label = props.currentItem.label;
    addForm.value.description = props.currentItem.description || "";
    addForm.value.quantity = props.currentItem.quantity || 0;
    addForm.value.icon = props.currentItem.icon || "";
    addForm.value.tags = props.currentItem.tags || [];
  }
});
</script>

<template>
  <Dialog class="w-30rem" :visible="true" :modal="true" :closable="false">
    <h3 v-if="isItem()">Enter name of new item :</h3>
    <h3 v-else>Enter name of new place:</h3>
    <InputText
      placeholder="Name"
      v-model.trim="addForm.label"
      class="w-full mt-2"
      :class="formErrors.errorLabel && 'p-invalid'"
      type="text"
    />

    <small class="ml-2 text-xs text-red-600">{{ formErrors.errorLabel }}</small>
    <div v-show="isItem()">
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
          v-model="newTagName"
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
            :label="tag.name"
            :key="tag.name"
            :value="tag.name"
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
        label="Cancel"
        icon="pi pi-times"
        @click="hideDialog"
        class="p-button-text"
      />
      <Button label="Save" icon="pi pi-check" @click="validateForm" autofocus />
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
