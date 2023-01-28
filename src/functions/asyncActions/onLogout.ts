import { Notify } from "quasar";
import { getAuth, signOut } from "firebase/auth";
import { useTreeNodes } from "@/store/treeNodes";
import router from "@/router";
import { INode } from "@/types/treeNodes";
import { i18n } from "@/main";

export async function onLogout(hideDialog: () => void) {
  try {
    const auth = getAuth();
    await signOut(auth);
    sessionStorage.setItem("uid", "");
    useTreeNodes().tree = {} as INode;
    Notify.create(i18n.global.t("notifications.logout"));
  } catch (error) {
    Notify.create(i18n.global.t("notifications.error"));
  }
  hideDialog();
  router.push("/");
}
