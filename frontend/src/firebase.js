// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: import.meta.env.VITE_API_KEY,
    authDomain: "food-delivery-6d2b6.firebaseapp.com",
    projectId: "food-delivery-6d2b6",
    storageBucket: "food-delivery-6d2b6.appspot.com",
    messagingSenderId: "750332209000",
    appId: "1:750332209000:web:21af80d9e24b91d3a898dd",
    measurementId: "G-YPF65MSYSH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };