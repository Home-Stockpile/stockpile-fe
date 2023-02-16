import { setDoc, getFirestore, doc } from "firebase/firestore";
import { i18n } from "@/main";
import { Notify } from "quasar";

export async function updateTree(tree) {
  if (sessionStorage.getItem("uid")) {
    const db = getFirestore();
    const messageRef = doc(db, "users", sessionStorage.getItem("uid"));

    try {
      await setDoc(messageRef, tree);
    } catch (e) {
      Notify.create(i18n.global.t("notifications.treeNotUpdated"));
    }
  }
}
