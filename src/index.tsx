import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Routes } from "react-router-dom";
import { WelcomePage } from "./components/Welcome/WelcomePage";
import { UserContextProvider } from "./context/UserContext";
import SignIn from "./components/Authentication/SignIn/SignIn";
import SignUp from "./components/Authentication/SignUp/SignUp";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<WelcomePage />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
    </Routes>
  );
};

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <UserContextProvider>
    <Router>
      <App />
    </Router>
  </UserContextProvider>
);
