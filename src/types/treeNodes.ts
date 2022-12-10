import type { MenuItem } from "primevue/menuitem";

export interface IItem extends MenuItem {
  defaultIcon?: string;
  description?: string;
  favorites?: boolean;
  tags?: string[];
  quantity?: number;
}
