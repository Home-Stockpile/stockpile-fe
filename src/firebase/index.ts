import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCiWPDgDWlomMuHiYCqUYpQfFO3h8zXtxM",
  authDomain: "home-stockpile-be.firebaseapp.com",
  databaseURL: "https://home-stockpile-be-default-rtdb.firebaseio.com",
  projectId: "home-stockpile-be",
  storageBucket: "home-stockpile-be.appspot.com",
  messagingSenderId: "969814200088",
  appId: "1:969814200088:web:29a4afa318c0d32f7e586d",
  measurementId: "G-4P81FYCM8W",
};

export const firebaseApp = initializeApp(firebaseConfig);
const storage = getStorage(firebaseApp);
