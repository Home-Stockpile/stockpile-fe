import { IItem } from "@/types/treeNodes";

export function getItem(item: IItem, path: string[]): IItem {
  const arrIndex = Number(path.shift()) - 1;
  if (!path.length) {
    return item[arrIndex];
  }
  return getItem(item[arrIndex].items, path);
}
