// my-portfolio/src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCLCDF6pZ7-1YEo1EejyofXT0si3Ek79-o",
  authDomain: "portfolio-project-d6d94.firebaseapp.com",
  projectId: "portfolio-project-d6d94",
  storageBucket: "portfolio-project-d6d94.firebasestorage.app",
  messagingSenderId: "84199492187",
  appId: "1:84199492187:web:ae3155d75517b78eba8d7e",
  measurementId: "G-1ZXC3K7JEZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize and export Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
