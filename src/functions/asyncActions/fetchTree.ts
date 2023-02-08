import { getDatabase, onValue } from "firebase/database";
import { ref as fbRef } from "@firebase/database";
import { useTreeNodes } from "@/store/treeNodes";
import { i18n } from "@/main";
import { Notify } from "quasar";

export async function fetchTree() {
  const db = getDatabase();
  const treeStore = useTreeNodes();

  treeStore.setTreeLoading(true);
  onValue(fbRef(db, sessionStorage.getItem("uid")), (snapshot) => {
    if (!snapshot.val()) {
      Notify.create(i18n.global.t("notifications.noTree"));
    } else {
      treeStore.setTree(snapshot.val());
    }
    treeStore.setTreeLoading(false);
  });
}
