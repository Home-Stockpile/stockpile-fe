import { defineStore } from "pinia";
import type { INode } from "@/types/treeNodes";
import { nextNodeKey } from "@/functions/nextNodeKey";
import { sortByType } from "@/functions/sortByType";
import { ITag } from "@/types/tags";
import { computed } from "vue";
import { IDraftNode } from "@/types/treeNodes";
import { updateTree } from "@/functions/asyncActions/updateTree";
import { uploadImg } from "@/functions/asyncActions/uploadImg";
import { removeImg } from "@/functions/asyncActions/removeImg";

export const useTreeNodes = defineStore("treeNodes", {
  state: () => {
    return {
      defaultTreeIcons: {
        folderIcon:
          "https://www.iconpacks.net/icons/2/free-folder-icon-1449-thumb.png",
        itemIcon:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/SCP_Foundation_%28emblem%29.svg/1200px-SCP_Foundation_%28emblem%29.svg.png",
      },
      treeLoading: true,
      tree: {} as INode,
    };
  },

  actions: {
    setTree(tree) {
      this.treeLoading = false;
      this.tree = tree;
    },
    setTreeLoading(state) {
      this.treeLoading = state;
    },
    async addTreeNode(item: IDraftNode, rootItemPath: string[], routerPath) {
      const path = rootItemPath.slice(0).join("_");
      const rootItem: INode = this.getItem(this.getTree, rootItemPath);
      let lastKey = "";
      if (!rootItem.items) {
        rootItem.items = [];
      }

      if (!rootItem.items.length) {
        lastKey = path + "_0";
      } else {
        lastKey = rootItem.items[rootItem.items.length - 1].key;
      }
      if (rootItem.key === "0" && !rootItem.items.length) {
        lastKey = "0";
      }
      const newNode = {
        ...item,
        key: nextNodeKey(lastKey),
        to: routerPath + nextNodeKey(lastKey),
      };

      if (item.icon) {
        const resp = await uploadImg(item.icon, nextNodeKey(lastKey));
        newNode.icon = resp;
      }
      rootItem.items.push(newNode);
      rootItem.items = sortByType(rootItem);
      updateTree(this.tree);
    },

    toggleFavorites(itemPath: string[]) {
      const item = this.getItem(this.getTree, itemPath);
      item.favorites = !item.favorites;
      updateTree(this.tree);
    },

    toggleTagFavorites(element: INode, tag: ITag) {
      function toggleTagFavorites(element, tag) {
        if (!element.items && element.tags) {
          element.tags.forEach((eTag, index) => {
            if (eTag.name === tag.name) {
              element.tags[index].favorite = !element.tags[index].favorite;
            }
          });
        } else if (element.items) {
          let treeNode = null;
          element.items.forEach(
            (item) => (treeNode = toggleTagFavorites(item, tag) || null)
          );

          return treeNode;
        }
        return null;
      }
      toggleTagFavorites(element, tag);
      updateTree(this.tree);
    },

    async editNode(newItem: INode) {
      const currentItem = this.getItem(this.getTree, newItem.key.split("_"));

      if (newItem.icon && typeof newItem.icon !== "string") {
        const resp = await uploadImg(newItem.icon, newItem.key);
        newItem.icon = resp;
      }

      Object.assign(currentItem, newItem);
      updateTree(this.tree);
    },
    async removeNode(rootItemPath: string[], itemPath: string) {
      const rootItem: INode = this.getItem(this.tree, rootItemPath);
      let isIcon = false;
      rootItem.items = rootItem.items.filter((item) => {
        if (item.key === itemPath) {
          isIcon = !!item.icon;
        }
        return item.key !== itemPath;
      });
      if (isIcon) {
        await removeImg(itemPath);
      }
      updateTree(this.tree);
    },
  },

  getters: {
    getTree: (state) => state.tree,
    getDefaultIcons: (state) => state.defaultTreeIcons,
    getItem: () =>
      function getItem(item: INode, path: string[]): INode | null {
        if (!item) {
          return null;
        }
        if (path[0] === "0") {
          return item;
        }
        if (!item || !Object.keys(item).length) {
          return null;
        }
        const keyFirstPart = path.slice(0, 2).join("_");
        const itemKey = path.shift();
        if (!item.items) {
          return null;
        }
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
        if (!item) {
          return breadcrumbs;
        }
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
        if (!element.items && element.tags) {
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
