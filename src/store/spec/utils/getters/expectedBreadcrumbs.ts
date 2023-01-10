export const expectedBreadcrumbs = [
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
