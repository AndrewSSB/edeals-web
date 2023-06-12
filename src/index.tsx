import React, { useContext, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Routes } from "react-router-dom";
import { WelcomePage } from "./components/Welcome/WelcomePage";
import { UserContext, UserContextProvider } from "./context/UserContext";
import SignIn from "./components/Authentication/SignIn/SignIn";
import SignUp from "./components/Authentication/SignUp/SignUp";
import { NotFoundPage } from "./components/NotFound/NotFound";
import { getUser } from "./API/user";
import { ProductContextProvider } from "./context/ProductsContext";
import Payment from "./components/Payments/Payment";
import { Basket } from "./components/Basket/Basket";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<WelcomePage />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/basket" element={<Basket />} />
      <Route path="/payment" element={<Payment />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <UserContextProvider>
    <ProductContextProvider>
      <Router>
        <App />
      </Router>
    </ProductContextProvider>
  </UserContextProvider>
);
