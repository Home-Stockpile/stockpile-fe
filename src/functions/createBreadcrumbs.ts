import { IItem } from "@/types/nodeTypes";

export function createBreadcrumbs(item: IItem, path: string[], breadcrumbs) {
  const arrIndex = Number(path.shift()) - 1;
  breadcrumbs = [...breadcrumbs, item[arrIndex]];
  if (path.length === 0) {
    return breadcrumbs;
  } else {
    return createBreadcrumbs(item[arrIndex].items, path, breadcrumbs);
  }
}
