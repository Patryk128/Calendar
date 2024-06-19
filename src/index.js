import React from "react";
import ReactDOM from "react-dom";
import MyCalendar from "./MyCalendar";
import "./index.css";

const App = () => (
  <div>
    <MyCalendar />
  </div>
);

ReactDOM.render(<App />, document.getElementById("root"));
