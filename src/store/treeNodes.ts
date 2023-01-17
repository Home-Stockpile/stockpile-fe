import { defineStore } from "pinia";
import type { INode } from "@/types/treeNodes";
import { nextNodeKey } from "@/functions/nextNodeKey";
import { sortByType } from "@/functions/sortByType";
import { ITag } from "@/types/tags";
import { computed } from "vue";
import { IDraftNode } from "@/types/treeNodes";

export const useTreeNodes = defineStore("treeNodes", {
  state: () => {
    return {
      defaultTreeIcons: {
        folderIcon:
          "https://www.iconpacks.net/icons/2/free-folder-icon-1449-thumb.png",
        itemIcon:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/SCP_Foundation_%28emblem%29.svg/1200px-SCP_Foundation_%28emblem%29.svg.png",
      },
      tree: {
        key: "0",
        to: "/",
        label: "root",
        icon: "pi pi-home",
        items: [
          {
            key: "1",
            label: "Kitchen",
            favorites: true,
            icon: "https://media.istockphoto.com/photos/blue-sky-and-white-clouds-background-picture-id825778252?b=1&k=20&m=825778252&s=612x612&w=0&h=C2j1HeXd5swrFsvrBqN9GIUmewXPSERRg9quVii3prM=",
            to: "/section/1",
            items: [
              {
                key: "1_1",
                label: "Store",
                to: "/section/1_1",
                items: [
                  {
                    key: "1_1_1",
                    label: "Fork",
                    description: "this is a fork",
                    tags: [{ name: "Tag1", favorite: false }],
                    quantity: 24,
                    to: `/item/1_1_1`,
                  },
                  {
                    key: "1_1_2",
                    label: "Spoon",
                    description: "this is a spoon",
                    tags: [{ name: "Tag2", favorite: false }],
                    quantity: 14,
                    to: "/item/1_1_2",
                  },
                ],
              },
            ],
          },
          {
            key: "2",
            label: "Garage",
            favorites: false,
            to: "/section/2",
            items: [
              {
                key: "2_1",
                label: "Toolbox",
                favorites: false,
                to: "/section/2_1",
                items: [
                  {
                    key: "2_1_1",
                    label: "Hummer",
                    favorites: true,
                    description: "this is a Hummer",
                    tags: [{ name: "Tag3", favorite: false }],
                    quantity: 1,
                    to: "/item/2_1_1",
                  },
                  {
                    key: "2_1_2",
                    label: "Wrench 1",
                    favorites: false,
                    description: "this is a Wrench",
                    tags: [{ name: "Tag4", favorite: false }],
                    quantity: 1,
                    to: `/item/2_1_2`,
                  },
                  {
                    key: "2_1_3",
                    label: "Flat screwdriwer",
                    favorites: false,
                    description: "this is a screwdriwer",
                    tags: [{ name: "Tag1", favorite: false }],
                    quantity: 4,
                    to: "/item/2_1_3",
                  },
                ],
              },
              {
                key: "2_2",
                label: "Case",
                favorites: false,
                to: "/section/2_2",
                items: [
                  {
                    key: "2_2_1",
                    label: "Nuts",
                    favorites: true,
                    description: "this is Nuts",
                    tags: [{ name: "Tag2", favorite: false }],
                    quantity: 54,
                    to: "/item/2_2_1",
                  },
                  {
                    key: "2_2_2",
                    label: "Bolts",
                    favorites: false,
                    description: "this is Bolts",
                    tags: [{ name: "Tag3", favorite: false }],
                    quantity: 31,
                    to: `/item/2_2_2`,
                  },
                ],
              },
            ],
          },
          {
            key: "3",
            label: "Empty Node",
            to: "/section/3",
            items: [],
          },
        ],
      } as INode,
    };
  },
  actions: {
    addTreeNode(item: IDraftNode, rootItemPath: string[], routerPath) {
      const path = rootItemPath.slice(0).join("_");
      const rootItem: INode = this.getItem(this.getTree, rootItemPath);
      let lastKey = "";
      if (!rootItem.items.length) {
        lastKey = path + "_0";
      } else {
        lastKey = rootItem.items[rootItem.items.length - 1].key;
      }
      if (rootItem.key === "0" && !rootItem.items.length) {
        lastKey = "0";
      }
      rootItem.items.push({
        ...item,
        key: nextNodeKey(lastKey),
        to: routerPath + nextNodeKey(lastKey),
      });
      rootItem.items = sortByType(rootItem);
    },

    toggleFavorites(itemPath: string[]) {
      const item = this.getItem(this.getTree, itemPath);
      item.favorites = !item.favorites;
    },

    toggleTagFavorites(element: INode, tag: ITag): null {
      if (!element.items) {
        element.tags.forEach((eTag, index) => {
          if (eTag.name === tag.name) {
            element.tags[index].favorite = !element.tags[index].favorite;
          }
        });
      } else {
        let treeNode = null;
        element.items.forEach(
          (item) => (treeNode = this.toggleTagFavorites(item, tag) || null)
        );
        return treeNode;
      }
      return null;
    },

    editNode(newItem: INode) {
      const currentItem = this.getItem(this.getTree, newItem.key.split("_"));
      Object.assign(currentItem, newItem);
    },
    removeNode(rootItemPath: string[], itemPath: string) {
      const rootItem: INode = this.getItem(this.getTree, rootItemPath);
      rootItem.items = rootItem.items.filter((i) => i.key !== itemPath);
    },
  },
  getters: {
    getTree: (state): INode => state.tree,
    getDefaultIcons: (state) => state.defaultTreeIcons,
    getItem: () =>
      function getItem(item: INode, path: string[]): INode | null {
        if (path[0] === "0") {
          return item;
        }
        if (!item) {
          return null;
        }
        const keyFirstPart = path.slice(0, 2).join("_");
        const itemKey = path.shift();
        const findItem = item.items.find((i) => i.key === itemKey) || null;
        if (!path.length) {
          return findItem;
        }
        path.splice(0, 1, keyFirstPart);

        return getItem(findItem, path);
      },
    getFavorites: (state) => {
      function getFavorites(element: INode, searchResult: INode[]): INode[] {
        if (element.favorites) {
          searchResult.push(element);
        }
        if (element.items && element.items.length) {
          let treeNode = [];
          element.items.forEach(
            (item) =>
              (treeNode = getFavorites(item, searchResult) || searchResult)
          );
          return treeNode;
        }
        return searchResult;
      }
      return getFavorites(state.tree, []);
    },
    getBreadcrumbs: () =>
      function getBreadcrumbs(
        item: INode[],
        path: string[],
        breadcrumbs: INode[]
      ): INode[] | null {
        const keyFirstPart = path.slice(0, 2).join("_");
        const itemKey = path.shift();
        const findItem = item.find((i) => i.key === itemKey);
        if (!path.length) {
          return [...breadcrumbs, findItem];
        }
        path.splice(0, 1, keyFirstPart);

        breadcrumbs = [...breadcrumbs, findItem];

        return getBreadcrumbs(findItem.items, path, breadcrumbs);
      },
    getTags: (state) => {
      function getTags(element: INode, searchResult: ITag[]): ITag[] {
        if (!element.items) {
          element.tags.forEach((eTag) => {
            if (!searchResult.find((sTag) => sTag.name === eTag.name)) {
              searchResult.push(eTag);
            }
          });
        }

        if (element.items && element.items.length) {
          let treeNode = [];
          element.items.forEach(
            (item) => (treeNode = getTags(item, searchResult) || searchResult)
          );
          return treeNode;
        }
        return searchResult;
      }

      return getTags(state.tree, []);
    },
    getFavoriteTags: (state) =>
      computed(() => state.getTags.filter((tag) => tag.favorite)),
  },
});
