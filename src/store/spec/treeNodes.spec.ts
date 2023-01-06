import { setActivePinia, createPinia } from "pinia";
import { useTreeNodes } from "../treeNodes";
import { describe, it, expect, beforeEach, test } from "vitest";
const expectedTree = {
  key: "0",
  to: "/",
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
  ],
};
const expectedItem = expectedTree.items[0].items[0].items[0];
const expectedFavorites = [
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
    key: "2_1_1",
    label: "Hummer",
    favorites: true,
    description: "this is a Hummer",
    tags: [{ name: "Tag3", favorite: false }],
    quantity: 1,
    to: "/item/2_1_1",
  },
  {
    key: "2_2_1",
    label: "Nuts",
    favorites: true,
    description: "this is Nuts",
    tags: [{ name: "Tag2", favorite: false }],
    quantity: 54,
    to: "/item/2_2_1",
  },
];
const expectedBreadcrumbs = [
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
  {
    key: "1_1_1",
    label: "Fork",
    description: "this is a fork",
    tags: [{ name: "Tag1", favorite: false }],
    quantity: 24,
    to: `/item/1_1_1`,
  },
];
describe("treeNodes", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  describe("get tree", () => {
    test("getTree", () => {
      const treeNode = useTreeNodes();
      expect(treeNode.getTree).toMatchObject(expectedTree);
      treeNode.getItem(treeNode.getTree, ["1"]);
    });
  });

  describe("getItem", () => {
    test("getItem 1_1_1", () => {
      const treeNode = useTreeNodes();
      expect(treeNode.getItem(treeNode.getTree, ["1", "1", "1"])).toMatchObject(
        expectedItem
      );
    });

    test("get root item", () => {
      const treeNode = useTreeNodes();
      expect(treeNode.getItem(treeNode.getTree, ["0"])).toMatchObject(
        expectedTree
      );
    });

    test("getItem no item", () => {
      const treeNode = useTreeNodes();
      expect(treeNode.getItem(treeNode.getTree, [""])).toBe(null);
    });
    test("getItem no tree", () => {
      const treeNode = useTreeNodes();
      expect(treeNode.getItem(null, ["1"])).toBe(null);
    });
  });

  describe("getFavorites", () => {
    test("getItem 1_1_1", () => {
      const treeNode = useTreeNodes();
      expect(treeNode.getFavorites).toMatchObject(expectedFavorites);
    });
  });
  describe("getBreadcrumbs", () => {
    test("getBreadcrumbs 1_1_1", () => {
      const treeNode = useTreeNodes();
      expect(
        treeNode.getBreadcrumbs(treeNode.getTree.items, ["1", "1", "1"], [])
      ).toMatchObject(expectedBreadcrumbs);
    });
  });
});
