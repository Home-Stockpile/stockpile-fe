import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { Notify } from "quasar";
import { firebaseApp } from "@/firebase";
import { i18n } from "@/main";

export async function signWithGoogle() {
  const auth = getAuth(firebaseApp);
  const provider = new GoogleAuthProvider();

  try {
    const resp = await signInWithPopup(auth, provider);
    GoogleAuthProvider.credentialFromResult(resp);
  } catch (error) {
    Notify.create(i18n.global.t("notifications.error"));
  }
}
