// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBoTan4Xuz8wkkwW_VWXFUymti39qdWrec",
  authDomain: "fitconnect-6a518.firebaseapp.com",
  projectId: "fitconnect-6a518",
  storageBucket: "fitconnect-6a518.appspot.com",
  messagingSenderId: "475534569142",
  appId: "1:475534569142:web:513adedc1894f661e18017",
  measurementId: "G-06SWR2JR8G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);