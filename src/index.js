import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import MyCalendar from "./MyCalendar";

const App = () => (
  <div>
    <MyCalendar />
  </div>
);

ReactDOM.render(<App />, document.getElementById("root"));
