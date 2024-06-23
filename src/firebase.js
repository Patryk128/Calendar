import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCKYKhwSDwyL356mju8g9OHlFy3k5qIyAc",
  authDomain: "calendar-5ca33.firebaseapp.com",
  databaseURL: "https://calendar-5ca33-default-rtdb.firebaseio.com",
  projectId: "calendar-5ca33",
  storageBucket: "calendar-5ca33.appspot.com",
  messagingSenderId: "572647972220",
  appId: "1:572647972220:web:30ca953ac5553e50ddd8f9",
  measurementId: "G-MH6S5ZWF7X",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
