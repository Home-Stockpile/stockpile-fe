import { deleteObject, getStorage, ref } from "firebase/storage";
import { useQuasar } from "quasar";

export async function removeImg(key) {
  const storage = getStorage();
  const $q = useQuasar();
  const storageRef = ref(storage, sessionStorage.getItem("uid") + "/" + key);
  try {
    await deleteObject(storageRef);
  } catch (e) {
    $q.notify("Img not deleted");
  }
}
