import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { fetchTree } from "@/functions/asyncActions/fetchTree";
export async function onLogin($v, email, password, onAsyncError) {
  const auth = getAuth();
  $v.$validate();
  if ($v.$error) {
    return;
  }
  try {
    const resp = await signInWithEmailAndPassword(auth, email, password);
    sessionStorage.setItem("uid", resp.user.uid);
  } catch (error) {
    onAsyncError(error);
  }
  if (sessionStorage.getItem("uid")) {
    await fetchTree();
  }
}
