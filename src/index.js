import React from "react";
import ReactDOM from "react-dom";
import App from "./App.tsx";
import { initializeApp } from "firebase/app";
import firebaseConfig from "./firebase.tsx";
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
