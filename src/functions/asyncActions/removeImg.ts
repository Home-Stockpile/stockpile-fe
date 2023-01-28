import { deleteObject, getStorage, ref } from "firebase/storage";
import { i18n } from "@/main";
import { Notify } from "quasar";

export async function removeImg(key) {
  const storage = getStorage();
  const storageRef = ref(storage, sessionStorage.getItem("uid") + "/" + key);
  try {
    await deleteObject(storageRef);
  } catch (e) {
    Notify.create(i18n.global.t("notifications.imgNotDeleted"));
  }
}
