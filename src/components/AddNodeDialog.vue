<script setup lang="ts">
import { useTreeNodes } from "@/store/treeNodes";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { AddDialog, DialogTypes } from "@/types/dialog";
import { IDraftNode, INode } from "@/types/treeNodes";
import { ITag } from "@/types/tags";
import useVuelidate from "@vuelidate/core";
import {
  helpers,
  maxLength,
  maxValue,
  minValue,
  required,
} from "@vuelidate/validators";

interface IProps {
  currentItem?: INode;
  dialogType?: AddDialog;
  isEdit?: boolean;
}
interface IEmits {
  (e: "hide-dialog"): void;
}
const props = defineProps<IProps>();
const emit = defineEmits<IEmits>();

const treeStore = useTreeNodes();
const tree = treeStore.getTree;

const route = useRoute();
const newTagName = ref("");

const addForm = ref<IDraftNode>({
  label: "",
  description: "",
  quantity: 0,
  icon: "",
  tags: [],
  items: [],
});

const rules = {
  addForm: {
    label: {
      required,
      maxLength: maxLength(25),
      duplicateLabel: helpers.withMessage(
        "Field with that name is already exists",
        duplicateLabel
      ),
    },
    quantity: { maxValue: maxValue(100), minValue: minValue(0) },
    description: {
      maxLength: maxLength(255),
    },
  },
  newTagName: {
    required,
    maxLength: maxLength(15),
    duplicateTag: helpers.withMessage(
      "Tag with that name already exists",
      duplicateTag
    ),
  },
};
const $v = useVuelidate(rules, { addForm, newTagName });

function duplicateLabel(value: string) {
  let rootObj = treeStore.getItem(tree, getRootItemPath().split("_"));
  if (!Object.keys(rootObj).length) {
    return true;
  }
  if (!props.currentItem) {
    let path = String(getRootItemPath()).split("_");
    if (getRootItemPath().split("_").length === 1) {
      path = ["0"];
    }
    rootObj = treeStore.getItem(tree, path);
  }
  if (
    rootObj.items &&
    rootObj.items.find(
      (item) => String(item.label).toLowerCase() === value.toLowerCase()
    )
  ) {
    return false;
  }
  return true;
}

function duplicateTag(value: string) {
  if (
    addForm.value.tags.find(
      (tag) => tag.name.toLowerCase() === value.toLowerCase()
    )
  ) {
    return false;
  }
  return true;
}

function createNewTreeNode(): void {
  $v.value.addForm.$touch();
  let newNode: IDraftNode = {
    label: addForm.value.label,
    icon: addForm.value.icon,
  };
  if (props.currentItem) {
    newNode.favorites = props.currentItem.favorites;
  } else {
    newNode.favorites = false;
  }

  if (isItem()) {
    modifyItem(newNode);
  } else {
    modifySection(newNode);
  }
}

function hideDialog(): void {
  emit("hide-dialog");
}

function isItem(): boolean {
  return props.dialogType === DialogTypes.item;
}

function getRootItemPath(): string {
  if (props.dialogType === DialogTypes.root) {
    return "0";
  }
  return String(route.params.key);
}

function addTreeNode(newNode: IDraftNode, routerPath: string) {
  treeStore.addTreeNode(newNode, getRootItemPath().split("_"), routerPath);
  hideDialog();
}

function editNode(newNode: IDraftNode): void {
  treeStore.editNode({
    ...newNode,
    key: props.currentItem.key,
    to: props.currentItem.to,
  });
  hideDialog();
}

function modifyItem(newNode: IDraftNode) {
  newNode = {
    ...newNode,
    quantity: addForm.value.quantity,
    tags: addForm.value.tags,
    description: addForm.value.description,
  };

  if ($v.value.addForm.$errors.length) {
    return;
  }

  if (props.isEdit) {
    editNode(newNode);
  } else {
    addTreeNode(newNode, "/item/");
  }
}

function modifySection(newNode: IDraftNode) {
  newNode = {
    ...newNode,
  };
  if ($v.value.addForm.$errors.length) {
    return;
  }

  if (props.isEdit) {
    if (props.currentItem.items) {
      newNode.items = props.currentItem.items;
    }

    editNode(newNode);
  } else {
    addTreeNode(newNode, "/section/");
  }
}

function addTag(): void {
  $v.value.newTagName.$touch();
  if (!$v.value.newTagName.$errors.length) {
    addForm.value.tags.push({ name: newTagName.value, favorite: false });
    newTagName.value = "";
    $v.value.newTagName.$reset();
  }
}

function removeTag(tagForRemove: ITag): void {
  addForm.value.tags = addForm.value.tags.filter(
    (tag) => tag.name !== tagForRemove.name
  );
}

function addIcon(e): void {
  addForm.value.icon = e[0];
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
        <h6 v-if="isItem()">{{ $t("addDialog.itemLabel") }}</h6>
        <h6 v-else>{{ $t("addDialog.itemLabel") }}</h6>
        <q-input
          v-model.trim="addForm.label"
          @blur="$v.addForm.label.$touch"
          :error="$v.addForm.label.$error"
          placeholder="Name"
          type="text"
        >
          <template v-slot:error>
            {{ $v.addForm.label.$errors[0].$message }}
          </template>
        </q-input>
      </q-card-section>
      <div v-show="isItem()">
        <q-card-section>
          <h6>{{ $t("general.quantity") }}</h6>
          <q-input
            v-model.trim="addForm.quantity"
            :error="$v.addForm.quantity.$error"
            @blur="$v.addForm.quantity.$touch"
            type="number"
          >
            <template v-slot:error>
              {{ $v.addForm.quantity.$errors[0].$message }}
            </template>
          </q-input>
        </q-card-section>

        <q-card-section>
          <h6>{{ $t("general.tags") }}</h6>
          <div class="column">
            <q-input
              v-model.trim="newTagName"
              :error="!!$v.newTagName.$error"
              bottom-slots
              placeholder="Add your tags"
              maxlength="12"
            >
              <template v-slot:after>
                <q-btn @click="addTag" round dense flat icon="add" size="lg" />
              </template>
              <template v-slot:error>
                {{ $v.newTagName.$errors[0].$message }}
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
          <h6>{{ $t("general.description") }}</h6>

          <q-input
            v-model.trim="addForm.description"
            :error="!!$v.addForm.description.$error"
            @blur="$v.addForm.description.$touch"
            bottom-slots
            placeholder="Add your description"
            filled
            clearable
            type="textarea"
          >
            <template v-slot:error>
              {{ $v.addForm.description.$errors[0].$message }}
            </template>
          </q-input>
        </q-card-section>
      </div>
      <q-card-section>
        <h6>{{ $t("addDialog.icon") }}</h6>
        <q-uploader
          @added="addIcon"
          @removed="removeIcon"
          accept=".jpg, image/*"
          :max-file-size="1000000"
          class="uploader"
        />
      </q-card-section>
      <q-card-actions class="justify-end q-mt-lg">
        <q-btn
          :label="$t('general.cancelButton')"
          icon="close"
          @click="hideDialog"
        />
        <q-btn
          :label="$t('general.saveButton')"
          icon="check"
          @click="createNewTreeNode"
        />
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
.uploader {
  width: auto;
}
</style>
