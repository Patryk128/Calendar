import React, { useState } from "react";
import { auth } from "./firebase.tsx";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import "./Login.css";

// Type definition for props
interface LoginProps {
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

const Login: React.FC<LoginProps> = ({ setIsLoggedIn }) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLogin, setIsLogin] = useState<boolean>(true);

  // Handle login functionality
  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        setIsLoggedIn(true);
      })
      .catch((error) => {
        console.error("Login error:", error);
        setError("Failed to log in. Check your credentials and try again.");
      });
  };

  // Handle registration functionality
  const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        setIsLoggedIn(true);
      })
      .catch((error) => {
        console.error("Registration error:", error);
        setError(`Failed to register. ${error.message}`);
      });
  };

  return (
    <div className="login-container">
      <form
        className="login-form"
        onSubmit={isLogin ? handleLogin : handleRegister}
      >
        <h2>{isLogin ? "Login" : "Register"}</h2>
        {error && <p className="error-message">{error}</p>}
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="login-button">
          {isLogin ? "Login" : "Register"}
        </button>
        <p>
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            type="button"
            className="toggle-button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
            }}
          >
            {isLogin ? "Register" : "Login"}
          </button>
        </p>
      </form>
    </div>
  );
};

export default Login;
