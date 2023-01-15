import { getDatabase } from "firebase/database";
import { ref as fbRef, set } from "@firebase/database";

export function updateTree(tree) {
  if (localStorage.getItem("uid")) {
    const db = getDatabase();
    set(fbRef(db, localStorage.getItem("uid")), tree);
  }
}
