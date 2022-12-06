import { IItem } from "@/types/treeNodes";

export function createBreadcrumbs(item: IItem, path: string[], breadcrumbs) {
  const arrIndex = Number(path.shift()) - 1;
  breadcrumbs = [...breadcrumbs, item[arrIndex]];
  if (!path.length) {
    return breadcrumbs;
  }
  return createBreadcrumbs(item[arrIndex].items, path, breadcrumbs);
}
