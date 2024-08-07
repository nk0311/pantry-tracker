// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCJ7Tv1NVi8fX1fGR4sp46T1A3HIZaiApA",
  authDomain: "hspantryapp-e3625.firebaseapp.com",
  projectId: "hspantryapp-e3625",
  storageBucket: "hspantryapp-e3625.appspot.com",
  messagingSenderId: "1004011234700",
  appId: "1:1004011234700:web:99fcf65839a852cd3c22a9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app)
export {app, firestore}