import { IItem } from "@/types/treeNodes";

export function getItem(item: IItem, path: string[]): IItem {
  const arrIndex = Number(path.shift()) - 1;
  if (arrIndex === -1) {
    return item;
  } else if (!path.length) {
    return item.items[arrIndex];
  } else {
    return getItem(item.items[arrIndex], path);
  }
}
