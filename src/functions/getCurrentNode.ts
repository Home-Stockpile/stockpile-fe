import { useTreeNodes } from "@/store/treeNodes";
import { INode } from "@/types/treeNodes";

export function getCurrentNode(owner, tree, key): INode {
  const treeStore = useTreeNodes();
  if (!Object.keys(tree.value).length) {
    return;
  }

  if (owner === sessionStorage.getItem("uid")) {
    return treeStore.getItem(tree.value, String(key).split("_"));
  }

  return treeStore.getItem(
    treeStore.getSharedTrees.find((item) => item.key === owner),
    String(key).split("_")
  );
}
