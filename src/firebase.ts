import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "time-tracking-ead8b.firebaseapp.com",
  projectId: "time-tracking-ead8b",
  storageBucket: "time-tracking-ead8b.firebasestorage.app",
  messagingSenderId: "206841372384",
  appId: "1:206841372384:web:f0624d0d0aaa34c71afa85"
};


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
