import { getDatabase } from "firebase/database";
import { ref as fbRef, set } from "@firebase/database";
import { useQuasar } from "quasar";

export async function updateTree(tree) {
  const $q = useQuasar();

  if (sessionStorage.getItem("uid")) {
    const db = getDatabase();
    try {
      await set(fbRef(db, sessionStorage.getItem("uid")), tree);
    } catch (e) {
      $q.notify("Tree not updated");
    }
  }
}
