import { ITag } from "@/types/tags";

export interface IItem {
  label: string;
  key?: string;
  to?: string;
  icon?: string;
  items?: IItem[];
  description?: string;
  favorites?: boolean;
  tags?: ITag[];
  quantity?: number;
}
