import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { i18n } from "@/main";
import { Notify } from "quasar";

export async function passwordReset(email) {
  const auth = getAuth();

  try {
    await sendPasswordResetEmail(auth, email);
    Notify.create(i18n.global.t("notifications.reset"));
  } catch (error) {
    Notify.create(error.message);
  }
}
