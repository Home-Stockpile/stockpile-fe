import { getDatabase } from "firebase/database";
import { ref as fbRef, set } from "@firebase/database";
import { i18n } from "@/main";
import { Notify } from "quasar";

export async function updateTree(tree) {
  if (sessionStorage.getItem("uid")) {
    const db = getDatabase();
    try {
      await set(fbRef(db, sessionStorage.getItem("uid")), tree);
    } catch (e) {
      Notify.create(i18n.global.t("notifications.treeNotUpdated"));
    }
  }
}
