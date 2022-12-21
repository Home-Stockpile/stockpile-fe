import type { MenuItem } from "primevue/menuitem";

export interface IItem extends MenuItem {
  defaultFolderIcon?: string;
  defaultItemIcon?: string;
  description?: string;
  favorites?: boolean;
  tags?: string[];
  quantity?: number;
}
