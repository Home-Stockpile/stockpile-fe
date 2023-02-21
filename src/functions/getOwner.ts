import { INode } from "@/types/treeNodes";

export function getOwner(obj: INode): string {
  const indexOfOwner = Object.values(obj).indexOf("owner");
  return Object.keys(obj)[indexOfOwner];
}
