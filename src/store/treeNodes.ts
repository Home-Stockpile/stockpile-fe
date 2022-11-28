import { defineStore } from "pinia";
import type { IItem } from "../types/nodeTypes";

export const useTreeNodes = defineStore("treeNodes", {
  state: (): IItem => {
    return {
      key: "0",
      to: "/",
      icon: "pi pi-home",
      items: [
        {
          key: "1",
          label: "Kitchen",
          items: [
            {
              key: "1_1",
              label: "Store",
              items: [
                {
                  key: "1_1_1",
                  label: "Fork",
                  description: "this is a fork",
                  tags: ["Tag", "Tag", "Tag"],
                  quantity: 24,
                  to: `/item/1_1_1`,
                },
                {
                  key: "1_1_2",
                  label: "Spoon",
                  description: "this is a spoon",
                  tags: ["Tag", "Tag", "Tag"],
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
          items: [
            {
              key: "2_1",
              label: "Toolbox",
              items: [
                {
                  key: "2_1_1",
                  label: "Hummer",
                  description: "this is a Hummer",
                  tags: ["Tag", "Tag", "Tag"],
                  quantity: 1,
                  to: "/item/2_1_1",
                },
                {
                  key: "2_1_2",
                  label: "Wrench 1",
                  description: "this is a Wrench",
                  tags: ["Tag", "Tag", "Tag"],
                  quantity: 1,
                  to: `/item/2_1_2`,
                },
                {
                  key: "2_1_3",
                  label: "Flat screwdriwer",
                  description: "this is a screwdriwer",
                  tags: ["Tag", "Tag", "Tag"],
                  quantity: 4,
                  to: "/item/2_1_3",
                },
              ],
            },
            {
              key: "2_2",
              label: "Case",
              items: [
                {
                  key: "2_2_1",
                  label: "Nuts",
                  description: "this is Nuts",
                  tags: ["Tag", "Tag", "Tag"],
                  quantity: 54,
                  to: "/item/2_2_1",
                },
                {
                  key: "2_2_2",
                  label: "Bolts",
                  description: "this is Bolts",
                  tags: ["Tag", "Tag", "Tag"],
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
  getters: { items: (state) => state },
});
