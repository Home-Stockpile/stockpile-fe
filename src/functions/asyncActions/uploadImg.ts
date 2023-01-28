import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { Notify } from "quasar";
import { i18n } from "@/main";

export async function uploadImg(icon, key) {
  const storage = getStorage();

  const storageRef = ref(storage, sessionStorage.getItem("uid") + "/" + key);
  try {
    await uploadBytes(storageRef, icon);
  } catch (e) {
    Notify.create(i18n.global.t("notifications.imgNotUploaded"));
  }

  const url = await getDownloadURL(
    ref(storage, "7JxWctE8RHewDNmpkQypBx8rO3E3/" + key)
  );

  return url;
}
