import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { initializeApp } from "firebase/app";
import "./ReactBigCalendar.css";
import "./App.css";

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

initializeApp(firebaseConfig);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
