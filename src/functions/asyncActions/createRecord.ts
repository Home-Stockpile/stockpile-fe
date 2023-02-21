import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";

export async function createRecord() {
  const db = getFirestore();

  const rootRef = doc(
    db,
    "storages",
    sessionStorage.getItem("uid"),
    "tree",
    "0"
  );

  try {
    const resp = await getDoc(rootRef);
    if (!resp.data()) {
      await setDoc(rootRef, { key: "0", to: "/" });
    }
  } catch (e) {
    console.log(e);
  }
}
