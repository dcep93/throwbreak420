import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";

var initialized = false;

export default function firebase() {
  if (initialized) return;
  initialized = true;

  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyDx7Qtx7zauj0C8krvgblcTPx146PyFwBE",
    authDomain: "throwbreak420.firebaseapp.com",
    projectId: "throwbreak420",
    storageBucket: "throwbreak420.appspot.com",
    messagingSenderId: "492004029179",
    appId: "1:492004029179:web:4f4c57b1a798fe7aaef65e",
    measurementId: "G-H5GT8086VG",
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  console.log("firebase", analytics);
}
