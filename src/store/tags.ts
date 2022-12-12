import { defineStore } from "pinia";
import { ITags } from "@/types/tags";

export const useAllTags = defineStore("tags", {
  state: (): ITags => {
    return {
      tags: [
        { name: "Tag1", quantity: 7 },
        { name: "Tag2", quantity: 7 },
        { name: "Tag3", quantity: 7 },
      ],
    };
  },
  actions: {
    addTag(newTag: string) {
      if (!this.$state.tags.find((tag) => tag.name === newTag)) {
        this.$state.tags.push({ name: newTag, quantity: 1 });
      } else {
        this.$state.tags.find((tag) => tag.name === newTag).quantity++;
      }
    },
    removeTag(tagForRemove: string) {
      const index = this.$state.tags.findIndex(
        (tag) => tag.name === tagForRemove
      );
      if (this.$state.tags[index].quantity > 1) {
        this.$state.tags[index].quantity--;
      } else {
        this.$state.tags.splice(index, 1);
      }
    },
  },
  getters: {
    getTags: (state) => state.tags,
  },
});
