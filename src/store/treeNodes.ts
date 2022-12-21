import { defineStore } from "pinia";
import type { IItem } from "../types/treeNodes";
import { nextNodeKey } from "@/functions/nextNodeKey";

export const useTreeNodes = defineStore("treeNodes", {
  state: (): IItem => {
    return {
      key: "0",
      to: "/",
      icon: "pi pi-home",
      defaultIcon:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/SCP_Foundation_%28emblem%29.svg/1200px-SCP_Foundation_%28emblem%29.svg.png",
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
                  tags: ["Tag1", "Tag3"],
                  quantity: 24,
                  to: `/item/1_1_1`,
                },
                {
                  key: "1_1_2",
                  label: "Spoon",
                  description: "this is a spoon",
                  tags: ["Tag1"],
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
                  tags: ["Tag3"],
                  quantity: 1,
                  to: "/item/2_1_1",
                },
                {
                  key: "2_1_2",
                  label: "Wrench 1",
                  favorites: false,
                  description: "this is a Wrench",
                  tags: ["Tag1", "Tag3"],
                  quantity: 1,
                  to: `/item/2_1_2`,
                },
                {
                  key: "2_1_3",
                  label: "Flat screwdriwer",
                  favorites: false,
                  description: "this is a screwdriwer",
                  tags: ["Tag1", "Tag3"],
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
                  tags: ["Tag3"],
                  quantity: 54,
                  to: "/item/2_2_1",
                },
                {
                  key: "2_2_2",
                  label: "Bolts",
                  favorites: false,
                  description: "this is Bolts",
                  tags: ["Tag1", "Tag3"],
                  quantity: 31,
                  to: `/item/2_2_2`,
                },
              ],
            },
          ],
        },
      ],
    };
  },
  actions: {
    addItem(item: IItem, rootItemPath: string[], routerPath) {
      const path = rootItemPath.slice(0).join("_");
      const rootItem = this.getItem(this.$state, rootItemPath);

      let lastKey = "";
      if (!rootItem.items.length) {
        lastKey = path + "_0";
      } else {
        lastKey = rootItem.items[rootItem.items.length - 1].key;
      }
      rootItem.items.push({
        ...item,
        key: nextNodeKey(lastKey),
        to: routerPath + nextNodeKey(lastKey),
      });
    },
    addToFavorites(rootItemPath: string[]) {
      const rootItem = this.getItem(this.$state, rootItemPath);
      rootItem.favorites = !rootItem.favorites;
    },
  },
  getters: {
    getTree: (state) => state,

    getItem: () =>
      function getItem(item: IItem, path: string[]): IItem {
        const arrIndex = Number(path.shift()) - 1;
        if (arrIndex === -1) {
          return item;
        }
        if (!path.length) {
          return item.items[arrIndex];
        }
        return getItem(item.items[arrIndex], path);
      },
    getFavorites: () =>
      function getFavorites(element: IItem, searchResult: IItem[]): IItem[] {
        if (element.favorites) {
          searchResult.push(element);
        }

        if (element.items) {
          let item = null;
          element.items.forEach(
            (i) => (item = getFavorites(i, searchResult) || searchResult)
          );
          return item;
        }
        return searchResult;
      },
    getBreadcrumbs: () =>
      function getBreadcrumbs(
        item: IItem,
        path: string[],
        breadcrumbs: IItem[]
      ): IItem[] {
        const arrIndex = Number(path.shift()) - 1;
        breadcrumbs = [...breadcrumbs, item[arrIndex]];
        if (!path.length) {
          return breadcrumbs;
        }
        return getBreadcrumbs(item[arrIndex].items, path, breadcrumbs);
      },
  },
});
