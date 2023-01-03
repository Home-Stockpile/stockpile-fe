<script setup lang="ts">
import { useTreeNodes } from "@/store/treeNodes";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { AddDialog, DialogTypes } from "@/types/dialog";
import { IItem } from "@/types/treeNodes";
import { ITag } from "@/types/tags";
import { validateQuantity } from "@/functions/validateQuantity";

interface IAddNodeDialog {
  currentItem?: IItem;
  dialogType?: AddDialog;
  isEdit?: boolean;
}
const props = defineProps<IAddNodeDialog>();
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

  formErrors.value.errorQuantity = validateQuantity(addForm.value.quantity);
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
      addTreeNode(newItem, "/item/");
    }
  }
}

function modifySection(newItem: IItem) {
  newItem = {
    ...newItem,
    items: [],
  };

  if (!formErrors.value.errorLabel) {
    if (props.isEdit) {
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

function addIcon(e): void {
  addForm.value.icon = URL.createObjectURL(e[0]);
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
  <q-dialog @hide="hideDialog" :model-value="true">
    <q-card class="q-pa-md">
      <q-card-section>
        <h6 v-if="isItem()">Enter name of new item :</h6>
        <h6 v-else>Enter name of new place:</h6>
        <q-input
          v-model.trim="addForm.label"
          :error="!!formErrors.errorLabel"
          placeholder="Name"
          type="text"
        >
          <template v-slot:error> {{ formErrors.errorLabel }} </template>
        </q-input>
      </q-card-section>
      <div v-show="isItem()">
        <q-card-section>
          <h6>Quantity:</h6>
          <q-input
            v-model="addForm.quantity"
            :error="!!formErrors.errorQuantity"
            type="number"
          >
            <template v-slot:error>
              {{ formErrors.errorQuantity }}
            </template>
          </q-input>
        </q-card-section>

        <q-card-section>
          <h6>Tags:</h6>
          <div class="column">
            <q-input
              v-model="newTagName"
              :error="!!formErrors.errorTag"
              bottom-slots
              placeholder="Add your tags"
              maxlength="12"
            >
              <template v-slot:after>
                <q-btn @click="addTag" round dense flat icon="add" size="lg" />
              </template>
              <template v-slot:error>
                {{ formErrors.errorTag }}
              </template>
            </q-input>
          </div>
          <q-chip
            v-for="tag in addForm.tags"
            :key="tag.name"
            removable
            @remove="() => removeTag(tag)"
            color="primary"
            text-color="white"
          >
            {{ tag.name }}
          </q-chip>
        </q-card-section>

        <q-card-section>
          <h6>Description:</h6>

          <q-input
            v-model="addForm.description"
            :error="!!formErrors.errorDescription"
            bottom-slots
            placeholder="Add your description"
            filled
            clearable
            type="textarea"
          >
            <template v-slot:error>
              {{ formErrors.errorDescription }}
            </template>
          </q-input>
        </q-card-section>
      </div>
      <q-card-section>
        <h6>Download your icon:</h6>
        <q-uploader
          @added="addIcon"
          @removed="removeIcon"
          accept=".jpg, image/*"
          :max-file-size="1000000"
        />
      </q-card-section>
      <q-card-actions class="justify-end q-mt-lg">
        <q-btn label="Cancel" icon="close" @click="hideDialog" />
        <q-btn label="Save" icon="check" @click="validateForm" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style scoped>
:deep(.q-card__section) {
  padding: 0;
}
:deep(.q-field__native) {
  padding: 0;
}
</style>
