import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyAcJAPSzsWICovbC5TzNkwqwrytqmptkzI",
  authDomain: "mtbpro-e0d5f.firebaseapp.com",
  projectId: "mtbpro-e0d5f",
  storageBucket: "mtbpro-e0d5f.firebasestorage.app",
  messagingSenderId: "678165784697",
  appId: "1:678165784697:web:30407b8218973d09f40ca8",
  measurementId: "G-LEVHXFQQ7B",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };