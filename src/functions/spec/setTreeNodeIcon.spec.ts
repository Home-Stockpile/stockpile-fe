import { expect, test } from "vitest";
import { setTreeNodeIcon } from "@/functions/setTreeNodeIcon";
import { useTreeNodes } from "@/store/treeNodes";

const node = {
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
      icon: "some icon",
      description: "this is a Wrench",
      tags: [{ name: "Tag4", favorite: false }],
      quantity: 1,
      to: `/item/2_1_2`,
    },
  ],
};
const defaultIcons = useTreeNodes().getDefaultIcons;

test("capitalizeFirstLetter", () => {
  expect(setTreeNodeIcon(node)).toBe(defaultIcons.folderIcon);
  expect(setTreeNodeIcon(node.items[0])).toBe(defaultIcons.itemIcon);
  expect(setTreeNodeIcon(node.items[1])).toBe("some icon");
});
