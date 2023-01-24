import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { useQuasar } from "quasar";

export async function uploadImg(icon, key) {
  const storage = getStorage();
  const $q = useQuasar();

  const storageRef = ref(storage, sessionStorage.getItem("uid") + "/" + key);
  try {
    await uploadBytes(storageRef, icon);
  } catch (e) {
    $q.notify("Img not uploaded");
  }

  const url = await getDownloadURL(
    ref(storage, "7JxWctE8RHewDNmpkQypBx8rO3E3/" + key)
  );

  return url;
}
