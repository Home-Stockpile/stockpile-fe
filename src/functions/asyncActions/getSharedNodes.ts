import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import { createDataTree } from "@/functions/createDataTree";
import { useTreeNodes } from "@/store/treeNodes";
import { ISharedNodes } from "@/types/sharedNodes";

const db = getFirestore();

export async function getSharedNodes() {
  const listOfShared = await getListOfShared();
  listOfShared.forEach((item) => {
    getSharedNode(item.uid, item.shared, item.email);
  });
}
async function getListOfShared(): Promise<ISharedNodes[]> {
  const colRef = query(
    collection(db, "users", sessionStorage.getItem("uid"), "sharedNodes")
  );
  const sharedNodes = await getDocs(colRef);
  const list = [];
  sharedNodes.docs.forEach((item) =>
    list.push({ ...item.data(), uid: item.id })
  );
  return list;
}
async function getSharedNode(
  uid: string,
  listOfNodes: string[],
  email: string
) {
  const treeStore = useTreeNodes();

  const colRef = query(
    collection(db, "storages", uid, "tree"),
    where("key", "in", listOfNodes)
  );
  try {
    const list = [];
    const sharedItem = await getDocs(colRef);
    sharedItem.docs.forEach((d) => {
      list.push(d.data());
    });
    treeStore.setSharedTrees({
      items: createDataTree(list),
      key: uid,
      label: email,
    });
  } catch (e) {
    console.log(e);
  }
}
