import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCT4hZWBuKWcYUPKxwCfNY-gcSDstNsAdk",
  authDomain: "gdghack-c6067.firebaseapp.com",
  projectId: "gdghack-c6067",
  storageBucket: "gdghack-c6067.firebasestorage.app",
  messagingSenderId: "810899886891",
  appId: "1:810899886891:web:334ab63675a9a8c1232b6e",
  measurementId: "G-XP8TBHBFBZ"
};

// Initialize Firebase (SSR safe)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);

export default app;
