import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
console.log("gjjghjgh");
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "home-stockpile-be.firebaseapp.com",
  databaseURL: "https://home-stockpile-be-default-rtdb.firebaseio.com",
  projectId: "home-stockpile-be",
  storageBucket: "home-stockpile-be.appspot.com",
  messagingSenderId: "969814200088",
  appId: "1:969814200088:web:29a4afa318c0d32f7e586d",
  measurementId: "G-4P81FYCM8W",
};

export const firebaseApp = initializeApp(firebaseConfig);
const storage = getFirestore(firebaseApp);
