import { IItem } from "@/types/treeNodes";

export function sortByType(node: IItem): IItem[] {
  console.log(2, node);
  const foldersArr = [];
  const itemsArr = [];
  node.items.forEach((item) => {
    if (item.items) {
      foldersArr.push(item);
    } else {
      itemsArr.push(item);
    }
  });
  console.log(1, foldersArr.concat(itemsArr));
  return foldersArr.concat(itemsArr);
}
