import type { MenuItem } from "primevue/menuitem";

export interface IItem extends MenuItem {
  defaultIcon?: string;
  description?: string;
  tags?: string[];
  quantity?: number;
}
