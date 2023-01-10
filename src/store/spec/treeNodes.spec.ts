import { setActivePinia, createPinia } from "pinia";
import { useTreeNodes } from "../treeNodes";
import { describe, it, expect, beforeEach, test } from "vitest";
import { ITag } from "@/types/tags";
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
    {
      key: "3",
      label: "Empty Node",
      to: "/section/3",
      items: [],
    },
  ],
};

describe("treeNodes", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });
  describe("getters", () => {
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
        const expectedItem = expectedTree.items[0].items[0].items[0];
        expect(
          treeNode.getItem(treeNode.getTree, ["1", "1", "1"])
        ).toMatchObject(expectedItem);
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
      test("getFavorites", () => {
        const treeNode = useTreeNodes();
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

        expect(treeNode.getFavorites).toMatchObject(expectedFavorites);
      });
    });

    describe("getBreadcrumbs", () => {
      test("getBreadcrumbs 1_1_1", () => {
        const treeNode = useTreeNodes();
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

        expect(
          treeNode.getBreadcrumbs(treeNode.getTree.items, ["1", "1", "1"], [])
        ).toMatchObject(expectedBreadcrumbs);
      });
    });

    describe("getTags", () => {
      test("getTags", () => {
        const treeNode = useTreeNodes();
        const expectedTags: ITag[] = [
          { name: "Tag1", favorite: false },
          { name: "Tag2", favorite: false },
          { name: "Tag3", favorite: false },
          { name: "Tag4", favorite: false },
        ];
        expect(treeNode.getTags).toMatchObject(expectedTags);
      });
    });

    describe("getFavTags", () => {
      test("getTags", () => {
        const treeNode = useTreeNodes();
        expect(treeNode.getFavoriteTags.value).toMatchObject([]);
      });
    });
  });

  describe("actions", () => {
    describe("add tree node", () => {
      test("add item", () => {
        const treeNode = useTreeNodes();
        const draftItem = {
          label: "Item",
          description: "string",
          tags: [{ name: "Tag1", favorite: false }],
          quantity: 3,
        };
        const treeAfterAddItem = {
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
                    {
                      label: "Item",
                      key: "1_1_3",
                      to: "/item/1_1_3",
                      description: "string",
                      tags: [{ name: "Tag1", favorite: false }],
                      quantity: 3,
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
        };
        expect(treeNode.tree).toMatchObject(expectedTree);
        treeNode.addTreeNode(draftItem, ["1", "1"], "/item/");
        expect(treeNode.tree).toMatchObject(treeAfterAddItem);
      });
      test("add item case first item in node", () => {
        const treeNode = useTreeNodes();
        const draftItem = {
          label: "Item",
          description: "string",
          tags: [{ name: "Tag1", favorite: false }],
          quantity: 3,
        };
        const treeAfterAddItemInEmptyNode = {
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
            {
              key: "3",
              label: "Empty Node",
              to: "/section/3",
              items: [
                {
                  label: "Item",
                  key: "3_1",
                  to: "/item/3_1",
                  description: "string",
                  tags: [{ name: "Tag1", favorite: false }],
                  quantity: 3,
                },
              ],
            },
          ],
        };

        expect(treeNode.tree).toMatchObject(expectedTree);
        treeNode.addTreeNode(draftItem, ["3"], "/item/");
        expect(treeNode.tree).toMatchObject(treeAfterAddItemInEmptyNode);
      });
    });

    describe("toggleFavorites", () => {
      test("toggleFavorites", () => {
        const treeNode = useTreeNodes();
        const treeAfterToggleFavorites = {
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
                      favorites: true,
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
        };
        expect(treeNode.tree).toMatchObject(expectedTree);
        expect(useTreeNodes().toggleFavorites(["1", "1", "1"]));
        expect(treeNode.tree).toMatchObject(treeAfterToggleFavorites);
      });
    });
    describe("toggleTagFavorites", () => {
      test("toggleTagFavorites", () => {
        const treeNode = useTreeNodes();
        const treeAfterToggleTagFavorites = {
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
                      tags: [{ name: "Tag1", favorite: true }],
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
                      tags: [{ name: "Tag1", favorite: true }],
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
        };
        expect(treeNode.tree).toMatchObject(expectedTree);
        expect(
          useTreeNodes().toggleTagFavorites(treeNode.getTree, {
            name: "Tag1",
            favorite: false,
          })
        );
        expect(treeNode.tree).toMatchObject(treeAfterToggleTagFavorites);
      });
    });
  });
});
