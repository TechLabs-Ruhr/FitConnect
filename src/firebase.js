import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAsom-aw4RRyYwfEWlf6szhFaw4Q20XBbw",
  authDomain: "fitconnect-2aa8b.firebaseapp.com",
  projectId: "fitconnect-2aa8b",
  storageBucket: "fitconnect-2aa8b.appspot.com",
  messagingSenderId: "555428380764",
  appId: "1:555428380764:web:05026ee4e5b4b28670e699",
  measurementId: "G-VHP781VYSM"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();