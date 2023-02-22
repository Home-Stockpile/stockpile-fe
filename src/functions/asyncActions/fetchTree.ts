import { collection, getDocs, getFirestore } from "firebase/firestore";

import { useTreeNodes } from "@/store/treeNodes";
import { createRecord } from "@/functions/asyncActions/createRecord";
import { createDataTree } from "@/functions/createDataTree";

export async function fetchTree() {
  const db = getFirestore();
  const treeStore = useTreeNodes();
  const colRef = collection(
    db,
    "storages",
    sessionStorage.getItem("uid"),
    "tree"
  );
  await createRecord();
  const list = [];
  let rootObj = {};
  try {
    const querySnapshot = await getDocs(colRef);
    querySnapshot.docs.forEach((item) => {
      if (item.data().key !== "0") {
        list.push(item.data());
      } else {
        rootObj = item.data();
      }
    });
  } catch (e) {
    console.log(e);
  }

  treeStore.setTreeLoading(true);
  treeStore.setTree({
    ...rootObj,
    items: createDataTree(list),
  });
  treeStore.setTreeLoading(false);
}
