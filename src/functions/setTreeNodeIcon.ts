import { useTreeNodes } from "@/store/treeNodes";
import { INode } from "@/types/treeNodes";

export function setTreeNodeIcon(item: INode): string {
  if (!Object.keys(item).length) {
    return;
  }
  const defaultIcons = useTreeNodes().getDefaultIcons;
  if (item.icon) {
    return item.icon;
  }
  if (item.to && item.to.includes("section")) {
    return defaultIcons.folderIcon;
  }

  return defaultIcons.itemIcon;
}
