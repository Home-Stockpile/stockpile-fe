import { IItem } from "@/types/nodeTypes";

export function getItem(item: IItem, path: string[]): IItem {
  const arrIndex = Number(path.shift()) - 1;
  if (path.length === 0) {
    return item[arrIndex];
  } else {
    return getItem(item[arrIndex].items, path);
  }
}
