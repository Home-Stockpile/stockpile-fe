import type { MenuItem } from "primevue/menuitem";

export interface IItem extends MenuItem {
  description?: string;
  tags?: string[];
  quantity?: number;
}
