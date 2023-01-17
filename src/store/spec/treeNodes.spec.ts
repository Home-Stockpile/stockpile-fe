import { setActivePinia, createPinia } from "pinia";
import { useTreeNodes } from "../treeNodes";
import { describe, expect, beforeEach, test } from "vitest";

import {
  treeAfterEditing,
  treeAfterAddItem,
  treeAfterRemoving,
  treeAfterAddItemInEmptyNode,
  treeAfterAddInRootNode,
  treeAfterToggleFavorites,
  treeAfterToggleTagFavorites,
} from "@/store/spec/utils/actions";
import {
  expectedBreadcrumbs,
  expectedFavorites,
  expectedTags,
  expectedTree,
} from "@/store/spec/utils/getters";

describe("treeNodes", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });
  describe("getters", () => {
    describe("getTree", () => {
      test("get tree must return client's tree of nodes", () => {
        const treeNode = useTreeNodes();
        expect(treeNode.getTree).toMatchObject(expectedTree);
        treeNode.getItem(treeNode.getTree, ["1"]);
      });
    });

    describe("getItem must return item that required by 'path' ", () => {
      test("getItem returns item by 'path' 1_1_1", () => {
        const treeNode = useTreeNodes();
        const expectedItem = expectedTree.items[0].items[0].items[0];
        expect(treeNode.getItem(expectedTree, ["1", "1", "1"])).toMatchObject(
          expectedItem
        );
      });

      test("getItem returns item by 'path' 0", () => {
        const treeNode = useTreeNodes();
        expect(treeNode.getItem(expectedTree, ["0"])).toMatchObject(
          expectedTree
        );
      });

      test("getItem returns null when 'path' is empty", () => {
        const treeNode = useTreeNodes();
        expect(treeNode.getItem(expectedTree, [""])).toBe(null);
      });
      test("getItem returns null when tree isn't transferred by params", () => {
        const treeNode = useTreeNodes();
        expect(treeNode.getItem(null, ["1"])).toBe(null);
      });
    });

    describe("getFavorites", () => {
      test("getFavorites returns array of favorite items", () => {
        const treeNode = useTreeNodes();

        expect(treeNode.getFavorites).toMatchObject(expectedFavorites);
      });
    });

    describe("getBreadcrumbs", () => {
      test("getBreadcrumbs returns array of items ordered by 'path' to current item", () => {
        const treeNode = useTreeNodes();

        expect(
          treeNode.getBreadcrumbs(expectedTree.items, ["1", "1", "1"], [])
        ).toMatchObject(expectedBreadcrumbs);
      });
    });

    describe("getTags", () => {
      test("getTags returns array of all tags that exists in tree", () => {
        const treeNode = useTreeNodes();

        expect(treeNode.getTags).toMatchObject(expectedTags);
      });
    });

    describe("getFavTags", () => {
      test("getFavTags returns array of favorite tags that exists in tree", () => {
        const treeNode = useTreeNodes();
        expect(treeNode.getFavoriteTags.value).toMatchObject([]);
      });
    });
  });

  describe("actions", () => {
    describe("addTreeNode", () => {
      test("addTreeNode adds new node in the tree node if in node already exists node", () => {
        const treeNode = useTreeNodes();
        const draftItem = {
          label: "Item",
          description: "string",
          tags: [{ name: "Tag1", favorite: false }],
          quantity: 3,
        };
        expect(treeNode.tree).toMatchObject(expectedTree);
        treeNode.addTreeNode(draftItem, ["1", "1"], "/item/");
        expect(treeNode.tree).toMatchObject(treeAfterAddItem);
      });

      test("addTreeNode adds new node in the tree node if it's first item in node", () => {
        const treeNode = useTreeNodes();
        const draftItem = {
          label: "Item",
          description: "string",
          tags: [{ name: "Tag1", favorite: false }],
          quantity: 3,
        };

        expect(treeNode.tree).toMatchObject(expectedTree);
        treeNode.addTreeNode(draftItem, ["3"], "/item/");
        expect(treeNode.tree).toMatchObject(treeAfterAddItemInEmptyNode);
      });

      test("addTreeNode in the root node", () => {
        const treeNode = useTreeNodes();
        const draftItem = {
          label: "Section",
          items: [],
        };
        const emptyTree = {
          key: "0",
          label: "root",
          to: "/",
          icon: "pi pi-home",
          items: [],
        };
        treeNode.removeNode(["0"], "1");
        treeNode.removeNode(["0"], "2");
        treeNode.removeNode(["0"], "3");
        expect(treeNode.tree).toMatchObject(emptyTree);
        treeNode.addTreeNode(draftItem, ["0"], "/section/");
        expect(treeNode.tree).toMatchObject(treeAfterAddInRootNode);
      });
    });

    describe("toggleFavorites", () => {
      test("toggleFavorites toggles 'favorites' property of node", () => {
        const treeNode = useTreeNodes();
        expect(treeNode.tree).toMatchObject(expectedTree);
        useTreeNodes().toggleFavorites(["1", "1", "1"]);
        expect(treeNode.tree).toMatchObject(treeAfterToggleFavorites);
      });
    });
    describe("toggleTagFavorites", () => {
      test("toggleTagFavorites toggles 'favorite' property of Tag", () => {
        const treeNode = useTreeNodes();
        expect(treeNode.tree).toMatchObject(expectedTree);

        useTreeNodes().toggleTagFavorites(treeNode.getTree, {
          name: "Tag1",
          favorite: false,
        });
        expect(treeNode.tree).toMatchObject(treeAfterToggleTagFavorites);
      });
    });
    describe("editNode", () => {
      test("editNode edits node", () => {
        const treeNode = useTreeNodes();
        const newItem = {
          key: "2_2_1",
          label: "Edited item",
          favorites: true,
          description: "Edited item",
          tags: [{ name: "Tag1", favorite: false }],
          quantity: 11,
          to: "/item/2_2_1",
        };
        expect(treeNode.tree).toMatchObject(expectedTree);
        useTreeNodes().editNode(newItem);
        expect(treeNode.tree).toMatchObject(treeAfterEditing);
      });
    });
    describe("remove", () => {
      test("removeNode removes node", () => {
        const treeNode = useTreeNodes();
        expect(treeNode.tree).toMatchObject(expectedTree);
        useTreeNodes().removeNode(["2", "2"], "2_2_1");
        expect(treeNode.tree).toMatchObject(treeAfterRemoving);
      });
    });
  });
});
