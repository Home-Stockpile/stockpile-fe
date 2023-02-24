import { INode } from "@/types/treeNodes";

export function createDataTree(dataset: INode[]): INode[] {
  const hashTable = Object.create(null);
  dataset.forEach((aData) => (hashTable[aData.key] = { ...aData }));
  const dataTree = [];
  dataset.forEach((aData) => {
    if (parentKey(aData.key))
      hashTable[parentKey(aData.key)].items.push(hashTable[aData.key]);
    else dataTree.push(hashTable[aData.key]);
  });
  return dataTree;
}
function parentKey(currentNodeKey: string): string {
  if (!currentNodeKey) {
    return;
  }
  const array = currentNodeKey.split("_");
  return String(array.slice(0, array.length - 1).join("_"));
}
