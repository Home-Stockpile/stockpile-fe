import type { MenuItem } from "primevue/menuitem";

export interface IItem extends MenuItem {
  label: string;
  description?: string;
  tags?: string[];
  quantity?: number;
}
