import { ITag } from "@/types/tags";
import WebSocket_2 from "vite";
import Data = WebSocket_2.Data;

export interface INode {
  label: string;
  key: string;
  to: string;
  icon?: Data | string;

  items?: INode[];
  description?: string;
  favorites?: boolean;
  tags?: ITag[];
  quantity?: number;
  requiredQuantity?: number;
}

export interface IDraftNode extends Omit<INode, "key" | "to"> {}
