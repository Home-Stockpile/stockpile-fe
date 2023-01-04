import { INode } from "@/types/treeNodes";

export function sortByType(node: INode): INode[] {
  const foldersArr = [];
  const itemsArr = [];
  node.items.forEach((item) => {
    if (item.items) {
      foldersArr.push(item);
    } else {
      itemsArr.push(item);
    }
  });
  return foldersArr.concat(itemsArr);
}
