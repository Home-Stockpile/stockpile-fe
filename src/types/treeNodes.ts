import { ITag } from "@/types/tags";

export interface INode {
  label: string;
  key: string;
  to: string;
  icon?: string;
  items?: INode[];
  description?: string;
  favorites?: boolean;
  tags?: ITag[];
  quantity?: number;
}

export interface IDraftNode extends Omit<INode, "key" | "to"> {}
