import { defineStore } from "pinia";
import { ITag } from "@/types/tags";

export const useAllTags = defineStore("tags", {
  state: () => {
    return {
      tags: [
        { name: "Tag1", quantity: 5, favorite: false },
        { name: "Tag2", quantity: 1, favorite: false },
        { name: "Tag3", quantity: 6, favorite: false },
      ] as ITag[],
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
    switchFavorites(name) {
      const tag = this.$state.tags.find((item) => item.name === name);
      tag.favorite = !tag.favorite;
    },
  },
  getters: {
    getTags: (state): ITag[] => state.tags,
  },
});
