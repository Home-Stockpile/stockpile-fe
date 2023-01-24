import { getDatabase, onValue } from "firebase/database";
import { ref as fbRef } from "@firebase/database";
import { useTreeNodes } from "@/store/treeNodes";
import { useQuasar } from "quasar";

export async function fetchTree() {
  const db = getDatabase();
  const treeStore = useTreeNodes();
  const $q = useQuasar();
  treeStore.setTreeLoading(true);
  onValue(fbRef(db, sessionStorage.getItem("uid")), (snapshot) => {
    if (!snapshot.val()) {
      $q.notify("No tree loaded");
    } else {
      treeStore.setTree(snapshot.val());
    }
    treeStore.setTreeLoading(false);
  });
}
