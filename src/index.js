import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { initializeApp } from "firebase/app";
import firebaseConfig from "./firebase.js";
import "./ReactBigCalendar.css";
import "./App.css";
import "./Buttons.css";
import "./Popup.css";

initializeApp(firebaseConfig);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
