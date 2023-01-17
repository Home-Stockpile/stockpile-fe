import { expect, test } from "vitest";
import { sortByType } from "@/functions/sortByType";
import { INode } from "@/types/treeNodes";
const unsortedNode: INode = {
  key: "2",
  label: "Garage",
  favorites: false,
  to: "/section/2",
  items: [
    {
      key: "2_2",
      label: "Nuts",
      favorites: true,
      description: "this is Nuts",
      tags: [{ name: "Tag2", favorite: false }],
      quantity: 54,
      to: "/item/2_2_1",
    },
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
      ],
    },
    {
      key: "2_3",
      label: "Bolts",
      favorites: false,
      description: "this is Bolts",
      tags: [{ name: "Tag3", favorite: false }],
      quantity: 31,
      to: `/item/2_2_2`,
    },
  ],
};
const sortedArr: INode[] = [
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
    ],
  },
  {
    key: "2_2",
    label: "Nuts",
    favorites: true,
    description: "this is Nuts",
    tags: [{ name: "Tag2", favorite: false }],
    quantity: 54,
    to: "/item/2_2_1",
  },
  {
    key: "2_3",
    label: "Bolts",
    favorites: false,
    description: "this is Bolts",
    tags: [{ name: "Tag3", favorite: false }],
    quantity: 31,
    to: `/item/2_2_2`,
  },
];
test("sortByType", () => {
  expect(sortByType(unsortedNode)).toMatchObject(sortedArr);
});
