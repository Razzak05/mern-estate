// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-15ecf.firebaseapp.com",
  projectId: "mern-estate-15ecf",
  storageBucket: "mern-estate-15ecf.firebasestorage.app",
  messagingSenderId: "251205120274",
  appId: "1:251205120274:web:ce7386217d31236ca683cb",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
