import { IItem } from "@/types/nodeTypes";

export function getItem(item: IItem, path: string[]): IItem {
  const arrIndex = Number(path.shift()) - 1;
  if (arrIndex === -1) {
    console.log(item);
    return item;
  } else if (path.length === 0) {
    return item.items[arrIndex];
  } else {
    return getItem(item.items[arrIndex], path);
  }
}
