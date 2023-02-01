import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { fetchTree } from "@/functions/asyncActions/fetchTree";

export async function onSignIn($v, email, password, onAsyncError) {
  const auth = getAuth();

  if ($v.$error) {
    return;
  }
  try {
    const resp = await createUserWithEmailAndPassword(auth, email, password);
    sessionStorage.setItem("uid", resp.user.uid);
  } catch (error) {
    onAsyncError(error);
  }
  if (sessionStorage.getItem("uid")) {
    await fetchTree();
  }
}
