// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const db = getFirestore(app);

export { db };
// export default firebaseConfig;
