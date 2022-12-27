import type { MenuItem } from "primevue/menuitem";
import { ITag } from "@/types/tags";

export interface IItem extends MenuItem {
  defaultFolderIcon?: string;
  defaultItemIcon?: string;
  description?: string;
  favorites?: boolean;
  tags?: ITag[];
  quantity?: number;
}
