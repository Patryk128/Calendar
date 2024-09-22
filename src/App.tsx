import React, { useState, useEffect } from "react";
import { auth } from "./firebase.tsx";
import { onAuthStateChanged, User } from "firebase/auth";
import MyCalendar from "./MyCalendar.tsx";
import Login from "./Login.tsx";

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const authState = onAuthStateChanged(auth, (user: User | null) => {
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    });

    return () => authState();
  }, []);

  return (
    <>
      {isLoggedIn ? (
        <MyCalendar setIsLoggedIn={setIsLoggedIn} />
      ) : (
        <Login setIsLoggedIn={setIsLoggedIn} />
      )}
    </>
  );
};

export default App;
