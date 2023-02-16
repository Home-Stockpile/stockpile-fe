import { collection, getDocs, getFirestore } from "firebase/firestore";

import { useTreeNodes } from "@/store/treeNodes";

export async function fetchTree() {
  const db = getFirestore();
  const treeStore = useTreeNodes();
  const colRef = collection(
    db,
    "storages",
    "MWyu4k77AJa7ZWxgNWfloq6ezp13",
    "tree"
  );
  const list = [];

  try {
    const querySnapshot = await getDocs(colRef);
    querySnapshot.docs.forEach((item) => list.push(item.data()));
  } catch (e) {
    console.log(e);
  }

  treeStore.setTreeLoading(true);
  treeStore.setTree({
    key: "0",
    to: "/",
    items: createDataTree(list),
  });
  treeStore.setTreeLoading(false);
  console.log(treeStore.tree);
}
function parentKey(currentNodeKey: string): string {
  if (!currentNodeKey) {
    return;
  }
  const array = currentNodeKey.split("_");
  return String(array.slice(0, array.length - 1).join("_"));
}

function createDataTree(dataset) {
  const hashTable = Object.create(null);
  dataset.forEach((aData) => (hashTable[aData.key] = { ...aData, items: [] }));
  const dataTree = [];
  dataset.forEach((aData) => {
    if (parentKey(aData.key))
      hashTable[parentKey(aData.key)].items.push(hashTable[aData.key]);
    else dataTree.push(hashTable[aData.key]);
  });
  return dataTree;
}
