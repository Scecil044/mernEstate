// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "cecilestate-9951f.firebaseapp.com",
  projectId: "cecilestate-9951f",
  storageBucket: "cecilestate-9951f.appspot.com",
  messagingSenderId: "487322711103",
  appId: "1:487322711103:web:9eb207b25f3c4ddd6eb48a"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
